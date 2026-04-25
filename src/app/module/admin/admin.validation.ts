import PrismaPkg from '@prisma/client';
import { z } from "zod"; const { UserStatus } = PrismaPkg;

const updateUserStatusZodSchema = z.object({
    status: z.nativeEnum(UserStatus),
});

export const AdminValidation = {
    updateUserStatusZodSchema,
};
