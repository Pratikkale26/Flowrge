import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("Unauthorized");
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: "Malformed authorization header." });
  }

  const token = parts[1] as string;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!payload.id) {
        return res.status(403).json({ message: "Invalid token payload." });
    }
    
    // Assign the user ID to the request object for use in subsequent handlers
    req.id = payload.id; 
    next();

  } catch (e) {
    return res.status(403).json({
      message: "Authentication failed. Please log in again.",
    });
  }
}