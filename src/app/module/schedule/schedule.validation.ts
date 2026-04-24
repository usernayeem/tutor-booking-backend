import { z } from "zod";

const createScheduleValidationSchema = z.object({
    startDate: z.string().describe("Format YYYY-MM-DD"),
    endDate: z.string().describe("Format YYYY-MM-DD"),
    startTime: z.string().describe("Format HH:MM in 24hr format"),
    endTime: z.string().describe("Format HH:MM in 24hr format"),
});

export const ScheduleValidation = {
    createScheduleValidationSchema,
};
