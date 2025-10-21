import { ZapCreateSchema } from "common/common";
import { prisma } from "db/prisma";
import { Router } from "express";
import { authMiddleware } from "../middlewares/middleware";
import { helius } from "..";

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