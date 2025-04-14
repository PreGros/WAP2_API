import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const title = err.message || "Internal Server Error";

  // Send a JSON response with the error details
  res.status(statusCode).json({
    status: statusCode,
    title,
    ...(err.description && { detail: err.description }),
  });
};