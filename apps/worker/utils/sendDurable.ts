import { prisma } from "db/prisma";
import { Connection } from "@solana/web3.js";
import { Resend } from "resend";

const DEVNET_RPC = process.env.SOLANA_DEVNET_RPC || "https://api.devnet.solana.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : undefined;

export async function submitDurableForZapFlow(zapId: string, flowKey: string = "zap") {
  const connection = new Connection(DEVNET_RPC, "confirmed");

  const rec = await prisma.durableTransaction.findFirst({
    where: { zapId, flowKey, status: "pending" },
    orderBy: { createdAt: "asc" },
  });

  if (!rec) {
    console.log("No pending durable transaction found for", zapId, flowKey);
    return false;
  }

  try {
    const sig = await connection.sendRawTransaction(Buffer.from(rec.serializedTxB64, 'base64'), { skipPreflight: false });
    const conf = await connection.confirmTransaction({ signature: sig, ...(await connection.getLatestBlockhash()) }, "confirmed");
    const err = (conf as any)?.value?.err || (conf as any)?.err;
    if (err) {
      throw new Error(`Transaction not confirmed: ${JSON.stringify(err)}`);
    }

    await prisma.durableTransaction.update({
      where: { id: rec.id },
      data: { status: "confirmed", submittedAt: new Date(), confirmedAt: new Date() },
    });

    // Mark nonce account as used (optionally close in cleanup job)
    await prisma.nonceAccount.update({
      where: { id: rec.nonceAccountId },
      data: { status: "used" },
    });
    return true;
  } catch (e: any) {
    await prisma.durableTransaction.update({
      where: { id: rec.id },
      data: { status: "failed", lastError: e?.message || String(e) },
    });

    // notify user via email if available
    try {
      const zap = await prisma.zap.findUnique({
        where: { id: rec.zapId },
        include: { user: true },
      });
      const toEmail = zap?.user?.email || "pratikkale7661@gmail.com";
      if (resend && toEmail) {
        await resend.emails.send({
          from: "Flowrge <noreply@decentralwatch.kalehub.com>",
          to: toEmail,
          subject: "Your SOL transfer failed",
          text: `We couldn't submit your transaction for zap ${zap?.name || "Unknown Zap"}, id: ${rec.zapId}. Reason: ${e?.message || String(e)}. You can retry from the dashboard.`,
        });
      }
    } catch (err) {
      console.error("Failed to send failure email:", err);
    }
    return false;
  }
}


