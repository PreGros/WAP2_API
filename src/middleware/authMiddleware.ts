import { Request, Response, NextFunction } from "express";
import { config } from "../config";

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey === config.apiKey) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized: Invalid API key" });
  }
};