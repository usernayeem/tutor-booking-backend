import { Request, Response } from "express";
import status from "http-status";

// Catches all unmatched routes and returns a 404 response
export const notFound = (req: Request, res: Response) => {
    res.status(status.NOT_FOUND).json({
        success: false,
        message: `Route ${req.originalUrl} Not Found`,
    });
};
