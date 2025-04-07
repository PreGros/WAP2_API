import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Zod schema for validating parameters
const playsParamsSchema = z.object({
    id: z
        .string()
        .refine((val) => !isNaN(Number(val)), "ID must be a number"), // Validate ID as a number
    fromdate: z
        .string()
        .optional()
        .refine(
            (date) => !date || (/^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date))),
            "fromdate must be in YYYY-MM-DD format and a valid date"
        ),
    todate: z
        .string()
        .optional()
        .refine(
            (date) => !date || (/^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date))),
            "toDate must be in YYYY-MM-DD format and a valid date"
        ),
});

// Middleware for validating query parameters
export const validatePlaysParams = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const params = {
            id: req.params.id,
            fromdate: req.query.fromdate,
            toDate: req.query.toDate,
        };
        playsParamsSchema.parse(params);
        next(); // Call next() if validation succeeds
    } catch (error) {
        if (error instanceof z.ZodError) {
            // res.status(401).json({ errors: error.errors }); // Return validation errors
            const err = new Error("Validation failed");
            (err as any).statusCode = 400;
            (err as any).details = error.errors;
            next(err); // Pass to errorHandler
        } else {
            next(error); // Pass other errors to the error handler
        }
    }
};