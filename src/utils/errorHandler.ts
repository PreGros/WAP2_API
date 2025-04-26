import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const title = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: statusCode,
    title,
    detail: err.description || "No additional details provided.",
  });
};