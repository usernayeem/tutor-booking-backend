import { NextFunction, Request, Response } from "express";
import z from "zod";

// Validates incoming request body against a Zod schema
export const validateRequest = (zodSchema: z.ZodObject<any> | z.ZodEffects<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Handle form-data where JSON happens to be stringified inside a 'data' field
        if (req.body.data) {
            try {
                req.body = JSON.parse(req.body.data);
            } catch (e) {
                // If parsing fails, just leave it as is; zod will catch the type error
            }
        }

        const parsedResult = zodSchema.safeParse(req.body);

        if (!parsedResult.success) {
            next(parsedResult.error);
            return;
        }

        // Sanitizing the data into the request body
        req.body = parsedResult.data;

        next();
    };
};
