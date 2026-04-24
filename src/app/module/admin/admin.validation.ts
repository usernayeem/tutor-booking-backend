import { z } from "zod";
import { UserStatus } from "../../../generated/prisma/client";

const updateUserStatusZodSchema = z.object({
    status: z.nativeEnum(UserStatus),
});

export const AdminValidation = {
    updateUserStatusZodSchema,
};
