import express from "express";
import { prisma } from "db/prisma";
import cors from "cors"


const app = express()
app.use(express.json());
app.use(cors());


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
})