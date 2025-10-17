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
    const HOOKS_BASE_URL = process.env.HOOKS_BASE_URL || "https://artistic-marcelene-parodiable.ngrok-free.dev";

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
        [key: string]: any;
    };
    const metadata = zapExists.trigger?.metadata;
    let address: string | undefined = undefined;

    if (metadata) {
        const typedMetadata = metadata as AddressMetadata;

        address = typedMetadata.address;
        if (typeof address === 'string' && address.length > 0) {
            console.log(`Solana Address: ${address}`);
        }
    }
    
    if (!address) {
        return res.status(400).json({ error: "Trigger address not configured." });
    }

    try {
        const assets = await helius.webhooks.create({
            webhookURL: `${HOOKS_BASE_URL}/hooks/catch/1/${zapId}`,
            accountAddresses: [address],
            transactionTypes: ["Any"],
            webhookType: "rawDevnet",
        })

        return res.json({ assets });
    } catch (e) {
        console.error("Error activating Zap:", e);
        return res.status(500).json({ error: "Internal server error." });
    }
});


export const zapRouter = router;