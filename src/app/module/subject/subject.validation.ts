import { z } from "zod";

export const createSubjectZodSchema = z.object({
    name: z.string().min(1, "Subject name is required"),
    description: z.string().optional(),
    iconUrl: z.string().optional(),
});

export const SubjectValidation = {
    createSubjectZodSchema,
};
