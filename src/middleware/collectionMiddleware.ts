import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const pathParamsSchema = z.object({
    username: z.string().min(1, "Username must be a non-empty string"),
});

const queryParamsSchema = z.object({
    display: z.string()
        .optional()
        .refine(
            (value) => value === undefined || (!value.startsWith(",") && !value.endsWith(",")), 
            { message: "Display cannot start or end with a comma" }
        ),
});

export const validateCollectionParams = (req: Request, res: Response, next: NextFunction): void => {
    try {
        pathParamsSchema.parse({username: req.params.username});
        queryParamsSchema.parse(req.query);

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