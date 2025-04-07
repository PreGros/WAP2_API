import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // console.error(err.stack); // Log the error stack trace for debugging

  const statusCode = err.statusCode || 500; // Default to 500 if no statusCode is set
  const message = err.message || "Internal Server Error";

  // Send a JSON response with the error details
  res.status(statusCode).json({
    message,
    ...(err.details && { details: err.details }), // Include additional error details if available
  });
};