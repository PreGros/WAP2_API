import { Request, Response, NextFunction } from "express";
import { z } from "zod";


// Zod schema for validating query and path parameters for the boardgames route.
const playsParamsSchema = z.object({
    id: z
        .string()
        .refine((val) => !isNaN(Number(val)), "ID must be a number"),
});

// validate query and path parameters for the boardgames route.
export const validateBoardgameParams = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const params = {
            id: req.params.id
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