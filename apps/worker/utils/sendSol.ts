import "dotenv/config";
import { Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

const secretKey = bs58.decode(process.env.PARENT_PRIVATE_KEY!);
const payer = Keypair.fromSecretKey(secretKey);

const NETWORK = process.env.SANCTUM_NETWORK || "devnet"; // "mainnet" | "devnet"
const GATEWAY_API_KEY = process.env.NEXT_PUBLIC_GATEWAY_API_KEY;

function toBase64(buf: Uint8Array): string {
    return Buffer.from(buf).toString("base64");
}

function fromBase64(b64: string): Buffer {
    return Buffer.from(b64, "base64");
}

export async function sendSol(to: string, amount: string) {
    if (!GATEWAY_API_KEY) {
        throw new Error("NEXT_PUBLIC_GATEWAY_API_KEY not configured");
    }

    const endpoint = `https://tpg.sanctum.so/v1/${NETWORK}?apiKey=${GATEWAY_API_KEY}`;

    const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);

    const unsignedTx = new Transaction();
    unsignedTx.add(
        SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: new PublicKey(to),
            lamports,
        })
    );
    unsignedTx.feePayer = payer.publicKey;
    // Placeholder; Gateway will set a recent blockhash during build
    unsignedTx.recentBlockhash = "11111111111111111111111111111111";

    const unsignedWireB64 = toBase64(unsignedTx.serialize({ requireAllSignatures: false, verifySignatures: false }));

    const buildRes = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: "worker-build",
            jsonrpc: "2.0",
            method: "buildGatewayTransaction",
            params: [
                unsignedWireB64,
                {
                    // Use project defaults; customize as needed
                },
            ],
        }),
    });

    if (!buildRes.ok) {
        throw new Error(`Failed to build gateway transaction: ${buildRes.status}`);
    }

    const buildJson = (await buildRes.json()) as { result?: { transaction?: string } };
    const encodedBuiltTx: string | undefined = buildJson.result?.transaction;
    if (!encodedBuiltTx) {
        throw new Error("Gateway did not return a transaction to sign");
    }

    const txToSign = Transaction.from(fromBase64(encodedBuiltTx));
    txToSign.sign(payer);

    const signedWireB64 = toBase64(txToSign.serialize());

    const sendRes = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: "worker-send",
            jsonrpc: "2.0",
            method: "sendTransaction",
            params: [signedWireB64],
        }),
    });

    if (!sendRes.ok) {
        throw new Error(`Failed to send transaction via Gateway: ${sendRes.status}`);
    }

    const sendJson = (await sendRes.json()) as { result?: string };
    const signature: string | undefined = sendJson.result;
    if (!signature) {
        throw new Error("Gateway did not return a signature");
    }

    console.log("sol Sent!");
    return signature;
}