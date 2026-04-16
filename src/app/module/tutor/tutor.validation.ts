import { z } from "zod";

const updateTutorValidationSchema = z.object({
    body: z.object({
        contactNumber: z.string().optional(),
        hourlyRate: z.number().optional(),
        experience: z.number().optional(),
        qualification: z.string().optional(),
        bio: z.string().optional(),
        profilePhoto: z.string().optional(),
        isAvailable: z.boolean().optional(),
    }),
});

export const TutorValidation = {
    updateTutorValidationSchema,
};
