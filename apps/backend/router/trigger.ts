import { prisma } from "db/prisma";
import { Router } from "express";

const router = Router();

router.get("/available", async (req, res) => {
    const availableTriggers = await prisma.availableTrigger.findMany({});
    res.json({ 
        availableTriggers
    })
})

export const triggerRouter = router;