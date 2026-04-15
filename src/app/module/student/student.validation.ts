import z from "zod";

export const updateStudentZodSchema = z.object({
    bio: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
});
