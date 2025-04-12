import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const playsParamsSchema = z.object({
    id: z
        .string()
        .refine((val) => !isNaN(Number(val)), "ID must be a number"),
});

const querySchema = z.object({
    currency: z
        .string()
        .regex(/^[A-Z]{1,3}$/, "Currency must be up to 3 capital letters")
        .optional(),

    sort: z
        .string()
        .refine((val) => val === "ascending" || val === "descending", "Sort must be 'ascending' or 'descending'")
        .optional(),

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
            "todate must be in YYYY-MM-DD format and a valid date"
        ),
});

export const validateBoardgameParams = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const params = {
            id: req.params.id,
        };
        playsParamsSchema.parse(params);

        const query = {
            currency: req.query.currency,
            sort: req.query.sort,
            fromdate: req.query.fromdate,
            todate: req.query.todate,
        };
        querySchema.parse(query);

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