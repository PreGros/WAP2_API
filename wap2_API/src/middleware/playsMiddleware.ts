import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { BadRequestError } from "../utils/badRequestError";

const pathParamsSchema = z.object({
    id: z
        .string()
        .refine((val) => !isNaN(Number(val)), "ID must be a number"),
});

const queryParamsSchema = z.object({
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

export const validatePlaysParams = (req: Request, res: Response, next: NextFunction): void => {
    try {
        pathParamsSchema.parse({ id: req.params.id });

        queryParamsSchema.parse({
            fromdate: req.query.fromdate,
            todate: req.query.todate,
        });

        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const err = new BadRequestError(400, "Validation failed", error.issues[0].message);
            next(err);
        } else {
            next(error);
        }
    }
};