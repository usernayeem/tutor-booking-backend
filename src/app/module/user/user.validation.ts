import { z } from "zod";

export const createTutorValidationSchema = z.object({
    password: z.string().optional(),
    tutor: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().min(1, "Email is required").email(),
        contactNumber: z.string().optional(),
        hourlyRate: z.number().optional(),
        experience: z.number().optional(),
        qualification: z.string().optional(),
    }),
    subjectIds: z.array(z.string()).default([]),
});

export const createAdminValidationSchema = z.object({
    password: z.string().optional(),
    admin: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().min(1, "Email is required").email(),
    }),
});

export const updateUserValidationSchema = z.object({
    status: z.enum(['ACTIVE', 'BLOCKED', 'DELETED']).optional(),
    createdAt: z.string().optional().transform((str) => str ? new Date(str) : undefined),
});
