
import { prisma } from "db/prisma";
import { Router } from "express";
import jwt from "jsonwebtoken"
import { authMiddleware } from "../middlewares/middleware";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

const router = Router();

router.post("/signin", async (req, res) => {
    try {
    const { publicKey, signature } = req.body;

    if (!publicKey || !signature) {
      res.status(400).json({ message: "Missing publicKey or signature" });
      return;
    }

    const message = new TextEncoder().encode("Sign in into Flowrge");

    const isVerified = nacl.sign.detached.verify(
      message,
      new Uint8Array(signature.data),
      new PublicKey(publicKey).toBytes()
    );

    if (!isVerified) {
      res.status(401).json({ message: "Signature verification failed" });
      return;
    }

    const user = await prisma.user.upsert({
      where: {
        publicKey: publicKey,
      },
      update: {},
      create: {
        publicKey: publicKey,
      },
    });

    // sign the jwt
    const token = jwt.sign({
        id: user.id
    }, process.env.JWT_SECRET!);

    res.json({
        token: token,
    });

    res.status(200).json({ message: "Signed in successfully!" });
    return;

  } catch (err) {
    console.error("Link wallet error:", err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
})

router.get("/", authMiddleware, async (req, res) => {
    const id = Number(req.id);
    const user = await prisma.user.findFirst({
        where: {
            id
        },
        select: {
            name: true,
            email: true,
            publicKey: true
        }
    });

    return res.json({
        user
    });
})

router.post("/x/connect", authMiddleware, async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.body;
    const id = Number(req.id);

    await prisma.user.update({
        where: { id },
        data: { xAccessToken: accessToken, xRefreshToken: refreshToken },
    });

    res.json({ message: "X account connected successfully" });
    return;
  } catch (e) {
    console.error("X connect error:", e);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

router.post("/x/disconnect", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.id);  

    await prisma.user.update({
        where: { id },
        data: { xAccessToken: null, xRefreshToken: null },
    });
    
    res.json({ message: "X account disconnected successfully" });
    return;
  } catch (e) {
    console.error("X disconnect error:", e);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

export const userRouter = router;