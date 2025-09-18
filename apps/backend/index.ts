import express from "express";
import cors from "cors"
import { userRouter } from "./router/user";
import { zapRouter } from "./router/zap";


const app = express()
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter);


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
})