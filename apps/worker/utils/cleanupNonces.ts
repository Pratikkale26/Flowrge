import { prisma } from "db/prisma";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

const DEVNET_RPC = process.env.SOLANA_DEVNET_RPC || "https://api.devnet.solana.com";
const COMPANY_SECRET_KEY = process.env.COMPANY_SECRET_KEY || ""; // JSON array

function loadCompanyKeypair(): Keypair {
  const raw = COMPANY_SECRET_KEY.trim();
  if (!raw.startsWith("[")) {
    throw new Error("COMPANY_SECRET_KEY must be a JSON array secret key");
  }
  const arr = JSON.parse(raw) as number[];
  return Keypair.fromSecretKey(new Uint8Array(arr));
}

export async function cleanupUsedNonceAccounts(limit: number = 5) {
  const connection = new Connection(DEVNET_RPC, "confirmed");
  const company = loadCompanyKeypair();

  // Find nonce accounts marked used and with no pending durable txs
  const accounts = await prisma.nonceAccount.findMany({
    where: {
      status: "used",
      durableTxs: { none: { status: "pending" } },
    },
    take: limit,
  });

  for (const acc of accounts) {
    try {
      const noncePubkey = new PublicKey(acc.noncePubkey);
      const balance = await connection.getBalance(noncePubkey);
      if (balance === 0) {
        await prisma.nonceAccount.update({ where: { id: acc.id }, data: { status: "closed" } });
        continue;
      }

      const tx = new Transaction();
      tx.add(SystemProgram.nonceWithdraw({
        noncePubkey,
        authorizedPubkey: company.publicKey,
        toPubkey: company.publicKey,
        lamports: balance,
      }));
      tx.feePayer = company.publicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.sign(company);
      await connection.sendRawTransaction(tx.serialize());

      await prisma.nonceAccount.update({ where: { id: acc.id }, data: { status: "closed" } });
    } catch (e) {
      // Log and continue; will retry on next sweep
      console.error("Failed to close nonce account", acc.id, e);
    }
  }
}


