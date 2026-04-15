import z from "zod";

export const createSubjectZodSchema = z.object({
    name: z.string({ required_error: "Subject name is required" }),
    description: z.string().optional(),
    iconUrl: z.string().optional(),
});

export const SubjectValidation = {
    createSubjectZodSchema,
};
