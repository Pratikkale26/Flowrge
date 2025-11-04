import { ZapCreateSchema } from "common/common";
import { prisma } from "db/prisma";
import { Router } from "express";
import { authMiddleware } from "../middlewares/middleware";
import { helius } from "..";
import { durableRouter } from "./durable";
import { Connection, Keypair, NONCE_ACCOUNT_LENGTH, NonceAccount, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { prisma as db } from "db/prisma";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
    const body = req.body;
    const id = String(req.id)
    const parsedData = ZapCreateSchema.safeParse(body);

    if (!parsedData.success) {
        res.status(411).json({
            message: "Incorrect inputs"
        })
        return;
    }

    const zapId = await prisma.$transaction(async tx => {
        // creating zap first with no trigger
        const zap = await prisma.zap.create({
            data: {
                name: parsedData.data.zapName,
                userId: parseInt(id),
                triggerId: "",
                actions: {
                    create: parsedData.data.actions.map((x, index) => ({
                        actionId: x.availableActionId,
                        sortingOrder: index,
                        metadata: x.actionMetadata
                    }))
                }
            }
        })

        // creating trigger
        const trigger = await tx.trigger.create({
            data: {
                triggerId: parsedData.data.availableTriggerId,
                zapId: zap.id,
                metadata: parsedData.data.triggerMetadata || {}
            }
        });

        // updating zap with trigger
        await tx.zap.update({
            where: {
                id: zap.id
            },
            data: {
                triggerId: trigger.id
            }
        })

        return zap.id;

    })
    return res.json({
        zapId
    })
})
// Atomic: create zap and build durable transaction. If durable fails, zap is deleted.
router.post("/create-with-durable", authMiddleware, async (req, res) => {
    const id = String(req.id);
    const body = req.body as any;
    try {
        // Expected body: { zapName, availableTriggerId, triggerMetadata, actions, feePayerPubkey, transfers, platformFeeLamports }
        const {
            zapName,
            availableTriggerId,
            triggerMetadata,
            actions,
            feePayerPubkey,
            transfers,
            platformFeeLamports = 0,
        } = body;

        // 1) Create the zap first
        const zapId = await prisma.$transaction(async tx => {
            const zap = await tx.zap.create({
                data: {
                    name: zapName,
                    userId: parseInt(id),
                    triggerId: "",
                    actions: {
                        create: (actions || []).map((x: any, index: number) => ({
                            actionId: x.availableActionId,
                            sortingOrder: index,
                            metadata: x.actionMetadata || {},
                        }))
                    }
                }
            });
            const trigger = await tx.trigger.create({
                data: {
                    triggerId: availableTriggerId,
                    zapId: zap.id,
                    metadata: triggerMetadata || {}
                }
            });
            await tx.zap.update({ where: { id: zap.id }, data: { triggerId: trigger.id } });
            return zap.id;
        });

        // 2) If there are no transfers, return early (no durable needed)
        if (!Array.isArray(transfers) || transfers.length === 0) {
            return res.json({ zapId, durable: null });
        }

        // 3) Build durable via existing build endpoint logic by calling prisma/service directly
        // Reuse the helper by importing functions would require refactor; replicate minimal logic here
        const DEVNET_RPC = process.env.SOLANA_DEVNET_RPC || "https://api.devnet.solana.com";
        const COMPANY_SECRET_KEY = process.env.COMPANY_SECRET_KEY || "";
        const PLATFORM_FEE_ADDRESS = process.env.PLATFORM_FEE_ADDRESS || "";
        const connection = new Connection(DEVNET_RPC, "confirmed");
        const arr = JSON.parse(COMPANY_SECRET_KEY) as number[];
        const company = Keypair.fromSecretKey(new Uint8Array(arr));

        // ensure nonce account
        const { recordId: nonceAccountId, noncePubkey } = await (async () => {
            const existing = await prisma.nonceAccount.findFirst({
                where: { zapId, flowKey: "zap", status: "active" },
            });
            if (existing) {
                return { recordId: existing.id, noncePubkey: new PublicKey(existing.noncePubkey) };
            }
            const nonceKeypair = Keypair.generate();
            const tx = new Transaction();
            const rentLamports = await connection.getMinimumBalanceForRentExemption(NONCE_ACCOUNT_LENGTH);
            tx.add(
                SystemProgram.createAccount({
                    fromPubkey: company.publicKey,
                    newAccountPubkey: nonceKeypair.publicKey,
                    lamports: rentLamports,
                    space: NONCE_ACCOUNT_LENGTH,
                    programId: SystemProgram.programId,
                }),
                SystemProgram.nonceInitialize({
                    noncePubkey: nonceKeypair.publicKey,
                    authorizedPubkey: company.publicKey,
                })
            );
            tx.feePayer = company.publicKey;
            tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            tx.sign(nonceKeypair, company);
            await connection.sendRawTransaction(tx.serialize());

            const rec = await prisma.nonceAccount.create({
                data: {
                    zapId,
                    flowKey: "zap",
                    noncePubkey: nonceKeypair.publicKey.toBase58(),
                    authorityPubkey: company.publicKey.toBase58(),
                    network: "devnet",
                    status: "active",
                }
            });
            return { recordId: rec.id, noncePubkey: nonceKeypair.publicKey };
        })();

        let accountInfo = await connection.getAccountInfo(noncePubkey);
        for (let i = 0; i < 5 && !accountInfo; i++) {
            await new Promise(r => setTimeout(r, 200));
            accountInfo = await connection.getAccountInfo(noncePubkey);
        }
        if (!accountInfo) throw new Error("Nonce account missing on-chain");
        const nonceAccount = NonceAccount.fromAccountData(accountInfo.data);

        const feePayer = new PublicKey(feePayerPubkey);
        const tx = new Transaction();
        tx.add(SystemProgram.nonceAdvance({ authorizedPubkey: company.publicKey, noncePubkey }));
        for (const t of transfers) {
            tx.add(SystemProgram.transfer({
                fromPubkey: feePayer,
                toPubkey: new PublicKey(t.toAddress),
                lamports: Math.floor(Number(t.lamports)),
            }));
        }
        const feeLamports = Math.floor(Number(platformFeeLamports || 0));
        if (feeLamports > 0) {
            if (!PLATFORM_FEE_ADDRESS) throw new Error("Platform fee address not configured");
            tx.add(SystemProgram.transfer({
                fromPubkey: feePayer,
                toPubkey: new PublicKey(PLATFORM_FEE_ADDRESS),
                lamports: feeLamports,
            }));
        }
        tx.feePayer = feePayer;
        tx.recentBlockhash = nonceAccount.nonce;
        tx.sign(company);
        const unsignedWireB64 = Buffer.from(tx.serialize({ requireAllSignatures: false })).toString('base64');

        return res.json({ zapId, durable: { nonceAccountId, noncePubkey: noncePubkey.toBase58(), transactionB64: unsignedWireB64 } });
    } catch (e: any) {
        // If we created a zap but failed later, best effort delete
        const zapId = (e?.zapId as string) || undefined;
        if (zapId) {
            try { await prisma.zap.delete({ where: { id: zapId } }); } catch {}
        }
        console.error(e);
        return res.status(500).json({ error: e?.message || "Failed to create zap with durable" });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    const id = Number(req.id);
    const zaps = await prisma.zap.findMany({
        where: {
            userId: id
        },
        include: {
            actions: {
               include: {
                    type: true
               }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });

    return res.json({
        zaps
    })
})

router.get("/:zapId", authMiddleware, async (req, res) => {
    const id = Number(req.id);
    const zapId = req.params.zapId;

    const zap = await prisma.zap.findFirst({
        where: {
            id: zapId,
            userId: id
        },
        include: {
            actions: {
               include: {
                    type: true
               }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });

    return res.json({
        zap
    })

})

// get all the zaprun from the zapid
router.get("/:zapId/zaprun", authMiddleware, async (req, res) => {
    const zapId = req.params.zapId;
    const userId = Number(req.id);

    const zapExists = await prisma.zap.findFirst({
        where: { id: zapId, userId: userId },
    });

    if (!zapExists) {
        return res.status(404).json({ error: "Zap not found or access denied." });
    }

    try {
        const zapRuns = await prisma.zapRun.findMany({
            where: {
                zapId: zapId, 
            },
            orderBy: {
                createdAt: 'desc', // Show most recent runs first
            },
            take: 50, // Limit to 50 runs for dashboard view performance
        });

        return res.json({
            zapRuns: zapRuns,
            count: zapRuns.length
        });
    } catch (e) {
        console.error("Database error fetching Zap Runs:", e);
        return res.status(500).json({ error: "Internal server error." });
    }
});

router.post("/:zapId/activate", authMiddleware, async (req, res) => {
    const zapId = req.params.zapId;
    const userId = Number(req.id);
    const HOOKS_BASE_URL = process.env.WEBHOOKS_URL || "https://artistic-marcelene-parodiable.ngrok-free.dev";
    const callbackUrl = `${HOOKS_BASE_URL}/hooks/catch/${userId}/${zapId}`;

    const zapExists = await prisma.zap.findFirst({
        where: { id: zapId, userId: userId },
        include: {
            trigger: true
        }
    });

    if (!zapExists) {
        return res.status(404).json({ error: "Flow not found." });
    }

    type AddressMetadata = {
        address: string;
        network?: "devnet" | "mainnet";
        transactionType?: string;
        [key: string]: any;
    };
    const metadata = zapExists.trigger?.metadata;
    let address: string | undefined = undefined;
    let network: "devnet" | "mainnet" = "devnet";
    let transactionType: string = "Any";

    if (metadata) {
        const typedMetadata = metadata as AddressMetadata;

        address = typedMetadata.address;
        network = typedMetadata.network || "devnet";
        transactionType = typedMetadata.transactionType || "Any";
        
        if (typeof address === 'string' && address.length > 0) {
            console.log(`Solana Address: ${address}, Network: ${network}, Transaction Type: ${transactionType}`);
        }
    }
    
    if (!address) {
        return res.status(400).json({ error: "Trigger address not configured." });
    }

    try {
        // Determine webhook type based on network
        const webhookType = network === "devnet" ? "enhancedDevnet" : "enhanced";
        
        const webhook = await helius.webhooks.create({
            webhookURL: callbackUrl,
            accountAddresses: [address],
            transactionTypes: [transactionType],
            webhookType: webhookType,
        });
        console.log(webhook);

        // Store the webhook in the database
        const created = await prisma.zerionSubscription.create({
            data: {
                subscriptionId: webhook.webhookID,
                userId: userId,
                zapId: zapId,
                walletAddress: address,
                chainId: "solana",
                callbackUrl: callbackUrl,
                isActive: true
            }
        });
        

        return res.json({ 
            success: true,
            data: {
                id: created.id,
                subscriptionId: created.subscriptionId,
                zapId: created.zapId,
                walletAddress: created.walletAddress,
                chainId: created.chainId,
                callbackUrl: created.callbackUrl,
                isActive: created.isActive
            }
        });
    } catch (e) {
        console.error("Error activating Zap:", e);
        return res.status(500).json({ error: "Internal server error." });
    }
});

// Get webhook status for a zap
router.get("/:zapId/webhook", authMiddleware, async (req, res) => {
    const zapId = req.params.zapId;
    const userId = Number(req.id);

    try {
        const subscription = await prisma.zerionSubscription.findFirst({
            where: {
                zapId: zapId,
                userId: userId
            }
        });

        if (!subscription) {
            return res.json({
                success: true,
                data: null
            });
        }

        // Get the latest status from Helius
        try {
            const webhook = await helius.webhooks.get(subscription.subscriptionId);
            
            return res.json({
                success: true,
                data: {
                    ...subscription,
                    isActive: webhook.webhookURL ? true : false
                }
            });
        } catch (error: any) {
            // If we can't reach Helius (404 or other errors), just return the local data
            console.log("Helius webhook not found or error, using local data:", error.message);
            await prisma.zerionSubscription.update({
                where: { id: subscription.id },
                data: { isActive: false, updatedAt: new Date() }
            });
            return res.json({
                success: true,
                data: { ...subscription, isActive: false }
            });
        }
    } catch (error: any) {
        console.error("Error getting webhook status:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Delete webhook for a zap
router.delete("/:zapId/webhook", authMiddleware, async (req, res) => {
    const zapId = req.params.zapId;
    const userId = Number(req.id);

    try {
        const subscription = await prisma.zerionSubscription.findFirst({
            where: {
                zapId: zapId,
                userId: userId
            }
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                error: "Webhook not found or access denied"
            });
        }

        // Try to delete from Helius, but don't fail if it's already gone
        try {
            await helius.webhooks.delete(subscription.subscriptionId);
            console.log("Webhook deleted from Helius successfully");
        } catch (heliusError: any) {
            console.log("Helius webhook deletion failed (may already be deleted):", heliusError.message);
            // Continue with local deletion even if Helius fails
        }
        
        // Always delete from our database
        await prisma.zerionSubscription.delete({
            where: { id: subscription.id }
        });

        res.json({
            success: true,
            message: "Webhook deleted successfully"
        });
    } catch (error: any) {
        console.error("Error deleting webhook:", error);
        
        // If there's any error, still try to clean up local database
        try {
            await prisma.zerionSubscription.deleteMany({
                where: { zapId: zapId, userId: userId }
            });
            return res.json({
                success: true,
                message: "Webhook removed from local database"
            });
        } catch (dbError) {
            console.error("Error cleaning up webhook:", dbError);
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


export const zapRouter = router;