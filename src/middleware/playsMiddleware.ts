import { Request, Response, NextFunction } from "express";
import { z } from "zod";


// Zod schema for validating query and path parameters for the plays routes.
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

// validate query and path parameters for the plays routes.
export const validatePlaysParams = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const params = {
            id: req.params.id,
            fromdate: req.query.fromdate,
            toDate: req.query.toDate,
        };
        playsParamsSchema.parse(params);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const err = new Error("Validation failed");
            (err as any).statusCode = 400;
            (err as any).details = error.errors;
            next(err);
        } else {
            next(error);
        }
    }
};