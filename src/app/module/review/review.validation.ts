import { z } from "zod";

const createReviewZodSchema = z.object({
    sessionId: z.string().min(1, "Session ID is required"),
    rating: z.number().min(1, "Rating is required").max(5),
    comment: z.string().optional(),
});

export const ReviewValidation = {
    createReviewZodSchema,
};
