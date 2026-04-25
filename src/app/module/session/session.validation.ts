import { z } from "zod";

const createSessionValidationSchema = z.object({
    tutorId: z.string().min(1, "tutorId is required"),
    scheduleId: z.string().min(1, "scheduleId is required"),
});

const updateSessionStatusValidationSchema = z.object({
    status: z.enum(["SCHEDULED", "COMPLETED", "CANCELED"]),
});

export const SessionValidation = {
    createSessionValidationSchema,
    updateSessionStatusValidationSchema,
};
