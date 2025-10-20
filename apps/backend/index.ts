import express from "express";
import cors from "cors"
import { createHelius } from "helius-sdk";
import { userRouter } from "./router/user";
import { zapRouter } from "./router/zap";
import { triggerRouter } from "./router/trigger";
import { actionRouter } from "./router/action";
import { zerionRouter } from "./router/zerion";

const app = express()
app.use(express.json());
app.use(cors());

const apiKey = process.env.HELIUS_API_KEY || "";
const network = "devnet"
export const helius = createHelius({ apiKey: apiKey, network: network });

app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter);
app.use("/api/v1/trigger", triggerRouter);
app.use("/api/v1/action", actionRouter);
app.use("/api/v1/zerion", zerionRouter);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
})