import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export function authMiddleware (req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization as string;
    
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.id = payload.id 
        next();
    } catch(e) {
        return res.status(403).json({
            message: "You are not logged in"
        })
    }
}