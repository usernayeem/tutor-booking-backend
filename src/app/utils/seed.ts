import PrismaPkg from '@prisma/client';
const { Role } = PrismaPkg;
import { envVars } from "../config/env.js";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";

export const seedSuperAdmin = async () => {
    try {
        const superAdminExists = await prisma.user.findFirst({
            where: {
                role: Role.SUPER_ADMIN,
            },
        });

        if (!superAdminExists) {
            console.log("No SUPER_ADMIN found. Seeding SUPER_ADMIN...");

            // Check if the user was partially created but crashed during email send
            const existingUserByEmail = await prisma.user.findUnique({
                where: { email: envVars.SUPER_ADMIN_EMAIL }
            });

            let userIdToUpdate = null;

            if (existingUserByEmail) {
                userIdToUpdate = existingUserByEmail.id;
            } else {
                const data = await auth.api.signUpEmail({
                    body: {
                        name: "Super Admin",
                        email: envVars.SUPER_ADMIN_EMAIL,
                        password: envVars.SUPER_ADMIN_PASSWORD,
                    },
                });
                if (data.user) userIdToUpdate = data.user.id;
            }

            if (userIdToUpdate) {
                // Update the user's role to SUPER_ADMIN
                await prisma.user.update({
                    where: { id: userIdToUpdate },
                    data: {
                        role: Role.SUPER_ADMIN,
                        emailVerified: true,
                    },
                });

                console.log("SUPER_ADMIN seeded successfully.");
            } else {
                console.error("Failed to seed SUPER_ADMIN.");
            }
        } else {
            console.log("SUPER_ADMIN already exists. Skipping seed.");
        }
    } catch (error) {
        console.error("Error seeding SUPER_ADMIN:", error);
    }
};
