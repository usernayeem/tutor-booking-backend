import { z } from "zod";

const createTutorScheduleValidationSchema = z.object({
    body: z.object({
        scheduleIds: z.array(z.string()).min(1, "At least one scheduleId must be provided"),
    }),
});

export const TutorScheduleValidation = {
    createTutorScheduleValidationSchema,
};
