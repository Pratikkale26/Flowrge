import { SigninSchema, SignupSchema } from "common/common";
import { prisma } from "db/prisma";
import { Router } from "express";
import jwt from "jsonwebtoken"
import { authMiddleware } from "../middlewares/middleware";

const router = Router();

router.post("/signup", async (req, res) => {
    const body = req.body;
    const parsedData = SignupSchema.safeParse(body);

    if (!parsedData.success) {
        console.log(parsedData.error);
        res.status(411).json({
            message: "Incorrect inputs"
        })
        return;
    }

    const userExists = await prisma.user.findFirst({
        where: {
            email: parsedData.data.username
        }
    });

    if (userExists) {
        res.status(403).json({
            message: "User already exists"
        })
        return;
    }

    await prisma.user.create({
        data: {
            email: parsedData.data.username,
            // TODO: hash password
            password: parsedData.data.password,
            name: parsedData.data.name
        }
    })

    // await sendEmail();
    // TODO: change the signin via email magic link (no password required)

    return res.json({
        message: "Please verify your account by checking your email"
    });

})

router.post("/signin", async (req, res) => {
    const body = req.body;
    const parsedData = SigninSchema.safeParse(body);

    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await prisma.user.findFirst({
        where: {
            email: parsedData.data.username,
            password: parsedData.data.password
        }
    });
    
    if (!user) {
        return res.status(403).json({
            message: "Sorry credentials are incorrect"
        })
    }

    // sign the jwt
    const token = jwt.sign({
        id: user.id
    }, process.env.JWT_SECRET!);

    res.json({
        token: token,
    });
})

router.get("/", authMiddleware, async (req, res) => {
    const id = Number(req.id);
    const user = await prisma.user.findFirst({
        where: {
            id
        },
        select: {
            name: true,
            email: true
        }
    });

    return res.json({
        user
    });
})

export const userRouter = router;