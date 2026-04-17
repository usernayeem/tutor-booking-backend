import { z } from "zod";
import { UserStatus } from "../../../generated/prisma/client";

const updateUserStatusZodSchema = z.object({
    body: z.object({
        status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED]),
    }),
});

export const AdminValidation = {
    updateUserStatusZodSchema,
};
