import express from "express"
import { prisma } from "db/prisma";

const app = express();
app.use(express.json());

// password logic 
app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    console.log("Received webhook", req.params, req.body);
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;

    try {
        // First verify the zap exists
        const zap = await prisma.zap.findFirst({
            where: {
                id: zapId,
                userId: parseInt(userId)
            }
        });

        if (!zap) {
            console.log(`Zap ${zapId} not found for user ${userId}`);
            return res.status(404).json({
                error: "Zap not found"
            });
        }

        // store in db a new trigger
        await prisma.$transaction(async tx => {
            const run = await tx.zapRun.create({
                data: {
                    zapId: zapId,
                    metadata: body
                }
            });

            await tx.zapRunOutbox.create({
                data: {
                    zapRunId: run.id
                }
            })
        })

        res.json({
            message: "Webhook received"
        })
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
})

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`hooks listening on port ${PORT}!`)
});