import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY;

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey === API_KEY) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized: Invalid API key" });
  }
};