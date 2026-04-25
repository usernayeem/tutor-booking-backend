import { z } from "zod";

const updateTutorValidationSchema = z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
    hourlyRate: z.coerce.number().optional(),
    experience: z.coerce.number().optional(),
    qualification: z.string().optional(),
    bio: z.string().optional(),
    profilePhoto: z.string().optional(),
    isAvailable: z.coerce.boolean().optional(),
});

export const TutorValidation = {
    updateTutorValidationSchema,
};
