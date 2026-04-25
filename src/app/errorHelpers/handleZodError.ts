import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface.js";

// Transforms a ZodError into a consistent TErrorResponse shape.
// Each Zod issue becomes one entry in errorSources with its field path and message.
export const handleZodError = (err: z.ZodError): TErrorResponse => {
    const statusCode = status.BAD_REQUEST;
    const message = "Zod Validation Error";
    const errorSources: TErrorSources[] = [];

    err.issues.forEach((issue) => {
        errorSources.push({
            path: issue.path.join(" => "),
            message: issue.message,
        });
    });

    return {
        success: false,
        message,
        errorSources,
        statusCode,
    };
};
