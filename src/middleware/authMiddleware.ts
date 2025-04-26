import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers["x-api-key"];
  const validApiKey = process.env.API_KEY || "debug-api-key";

  if (apiKey === validApiKey) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized: Invalid API key" });
  }
};