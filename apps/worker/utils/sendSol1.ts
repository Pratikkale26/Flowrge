import "dotenv/config";
import { Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction, PublicKey, sendAndConfirmTransaction, Connection } from "@solana/web3.js";
import bs58 from "bs58";

const connection = new Connection(process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com", "confirmed");
const secretKey = bs58.decode(process.env.PARENT_PRIVATE_KEY!);
const payer = Keypair.fromSecretKey(secretKey);

export async function sendSol(to: string, amount: string) {
    const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: payer.publicKey,
          toPubkey: new PublicKey(to),
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        })
    );

    const signature =await sendAndConfirmTransaction(connection, transferTransaction, [payer], {
        commitment: "confirmed",
    });
    console.log("sol Sent!")
    return signature;
}