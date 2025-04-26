import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { BadRequestError } from "../utils/badRequestError";

const queryParamsSchema = z.object({
    query: z.string().min(1, "Query must be a non-empty string"),
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
    exact: z
        .string()
        .refine((val) => val === "1" || val === "0", "Exact must be '1' or '0'")
        .optional(),
    type: z
        .string()
        .refine((val) => val === "boardgame" || val === "boardgameexpansion" || val === "rpg" || val === "rpgitem" || val === "videogame", "Wrong type")
        .optional(),
});

export const validateSearchParams = (req: Request, res: Response, next: NextFunction): void => {
    try {
        queryParamsSchema.parse({
            query: req.query.query,
            fromdate: req.query.fromdate,
            todate: req.query.todate,
            exact: req.query.exact,
            type: req.query.type,
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