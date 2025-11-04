import { Router } from "express";
import { authMiddleware } from "../middlewares/middleware";
import { prisma } from "db/prisma";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  NONCE_ACCOUNT_LENGTH,
  NonceAccount,
  sendAndConfirmRawTransaction,
} from "@solana/web3.js";

const router = Router();

const DEVNET_RPC = process.env.SOLANA_DEVNET_RPC || "https://api.devnet.solana.com";
const COMPANY_SECRET_KEY = process.env.COMPANY_SECRET_KEY || ""; // JSON array of numbers
const PLATFORM_FEE_ADDRESS = process.env.PLATFORM_FEE_ADDRESS || ""; // company fee treasury

function loadCompanyKeypair(): Keypair {
  const raw = COMPANY_SECRET_KEY.trim();
  if (!raw.startsWith("[")) {
    throw new Error("COMPANY_SECRET_KEY must be a JSON array secret key");
  }
  const arr = JSON.parse(raw) as number[];
  return Keypair.fromSecretKey(new Uint8Array(arr));
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i] ?? 0);
  return Buffer.from(binary, "binary").toString("base64");
}

function fromBase64(b64: string): Buffer {
  return Buffer.from(b64, "base64");
}

async function ensureNonceAccount(params: {
  connection: Connection;
  zapId: string;
  flowKey: string;
  authority: Keypair;
}): Promise<{ recordId: string; noncePubkey: PublicKey }>
{
  const existing = await prisma.nonceAccount.findFirst({
    where: { zapId: params.zapId, flowKey: params.flowKey, status: "active" },
  });
  if (existing) {
    return { recordId: existing.id, noncePubkey: new PublicKey(existing.noncePubkey) };
  }

  const nonceKeypair = Keypair.generate();
  const tx = new Transaction();
  // Rent-exempt lamports for nonce account (company pays)
  const rentLamports = await params.connection.getMinimumBalanceForRentExemption(NONCE_ACCOUNT_LENGTH);
  tx.add(
    SystemProgram.createAccount({
      fromPubkey: params.authority.publicKey,
      newAccountPubkey: nonceKeypair.publicKey,
      lamports: rentLamports,
      space: NONCE_ACCOUNT_LENGTH,
      programId: SystemProgram.programId,
    }),
    SystemProgram.nonceInitialize({
      noncePubkey: nonceKeypair.publicKey,
      authorizedPubkey: params.authority.publicKey,
    })
  );
  tx.feePayer = params.authority.publicKey;
  tx.recentBlockhash = (await params.connection.getLatestBlockhash()).blockhash;
  tx.sign(nonceKeypair, params.authority);
  const sig = await sendAndConfirmRawTransaction(params.connection, tx.serialize());

  const rec = await prisma.nonceAccount.create({
    data: {
      zapId: params.zapId,
      flowKey: params.flowKey,
      noncePubkey: nonceKeypair.publicKey.toBase58(),
      authorityPubkey: params.authority.publicKey.toBase58(),
      network: "devnet",
      status: "active",
    }
  });

  return { recordId: rec.id, noncePubkey: nonceKeypair.publicKey };
}

// Build partially signed durable-nonce transaction containing multiple transfers
router.post("/build", authMiddleware, async (req, res) => {
  console.log("called durable build api");
  try {
    const userId = Number(req.id);
    const { zapId, flowKey, feePayerPubkey, transfers, platformFeeLamports } = req.body as {
      zapId: string;
      flowKey: string;
      feePayerPubkey: string; // user's wallet
      transfers: { toAddress: string; lamports: number }[];
      platformFeeLamports?: number;
    };

    if (!zapId || !flowKey || !feePayerPubkey || !Array.isArray(transfers) || transfers.length === 0) {
      return res.status(400).json({ error: "Invalid inputs" });
    }

    const connection = new Connection(DEVNET_RPC, "confirmed");
    const company = loadCompanyKeypair();

    // ensure nonce account
    const { recordId: nonceRecordId, noncePubkey } = await ensureNonceAccount({
      connection,
      zapId,
      flowKey,
      authority: company,
    });

    // fetch nonce account data
    // fetch nonce account with retries in case of propagation delay
    let accountInfo = await connection.getAccountInfo(noncePubkey);
    for (let i = 0; i < 5 && !accountInfo; i++) {
      await new Promise(r => setTimeout(r, 200));
      accountInfo = await connection.getAccountInfo(noncePubkey);
    }
    if (!accountInfo) return res.status(500).json({ error: "Nonce account missing on-chain" });
    const nonceAccount = NonceAccount.fromAccountData(accountInfo.data);

    const feePayer = new PublicKey(feePayerPubkey);
    const tx = new Transaction();
    // nonce advance (company authority)
    tx.add(SystemProgram.nonceAdvance({
      authorizedPubkey: company.publicKey,
      noncePubkey: noncePubkey,
    }));
    // add transfers
    for (const t of transfers) {
      tx.add(SystemProgram.transfer({
        fromPubkey: feePayer,
        toPubkey: new PublicKey(t.toAddress),
        lamports: Math.floor(Number(t.lamports)),
      }));
    }
    // optional platform fee transfer to company treasury
    const feeLamports = Math.floor(Number(platformFeeLamports || 0));
    if (feeLamports > 0) {
      if (!PLATFORM_FEE_ADDRESS) {
        return res.status(500).json({ error: "Platform fee address not configured" });
      }
      tx.add(SystemProgram.transfer({
        fromPubkey: feePayer,
        toPubkey: new PublicKey(PLATFORM_FEE_ADDRESS),
        lamports: feeLamports,
      }));
    }

    tx.feePayer = feePayer;
    tx.recentBlockhash = nonceAccount.nonce;

    // company signs as nonce authority
    tx.sign(company);

    const unsignedWireB64 = toBase64(tx.serialize({ requireAllSignatures: false }));
    console.log("unsignedWireB64", unsignedWireB64);
    return res.json({
      nonceAccountId: nonceRecordId,
      noncePubkey: noncePubkey.toBase58(),
      transactionB64: unsignedWireB64,
    });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Failed to build durable transaction" });
  }
});

// Save fully signed transaction
router.post("/save", authMiddleware, async (req, res) => {
  console.log("called durable save api");
  try {
    const userId = Number(req.id);
    const { zapId, flowKey, nonceAccountId, feePayerPubkey, transactionB64, transfers, platformFeeLamports } = req.body as {
      zapId: string;
      flowKey: string;
      nonceAccountId: string;
      feePayerPubkey: string;
      transactionB64: string; // fully signed by user + company
      transfers: { toAddress: string; lamports: number }[];
      platformFeeLamports?: number;
    };

    if (!zapId || !flowKey || !nonceAccountId || !feePayerPubkey || !transactionB64 || !Array.isArray(transfers)) {
      return res.status(400).json({ error: "Invalid inputs" });
    }
    console.log("calling prisma create");
    const rec = await prisma.durableTransaction.create({
      data: {
        zapId,
        flowKey,
        nonceAccountId,
        feePayerPubkey,
        serializedTxB64: transactionB64,
        transfers,
        platformFeeLamports: BigInt(platformFeeLamports || 0),
        status: "pending",
      }
    });
    console.log("prisma create success");
    return res.json({ id: rec.id });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Failed to save durable transaction" });
  }
});

export const durableRouter = router;


