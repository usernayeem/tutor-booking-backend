import PrismaPkg from '@prisma/client';
const { Role } = PrismaPkg;
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";

export const seedTutor = async () => {
    try {
        const tutorEmail = "tutor@example.com";
        const userExists = await prisma.user.findUnique({
            where: { email: tutorEmail },
        });

        if (!userExists) {
            console.log("Creating default tutor...");

            // 1. Create a default subject if it doesn't exist
            let subject = await prisma.subject.findFirst();
            if (!subject) {
                subject = await prisma.subject.create({
                    data: { name: "General Mathematics", description: "Basic math concepts" }
                });
            }

            // 2. Sign up user
            const data = await auth.api.signUpEmail({
                body: {
                    name: "Dr. Default Tutor",
                    email: tutorEmail,
                    password: "password123",
                },
            });

            if (data.user) {
                // 3. Update to TUTOR role
                await prisma.user.update({
                    where: { id: data.user.id },
                    data: {
                        role: Role.TUTOR,
                        emailVerified: true,
                    },
                });

                // 4. Create Tutor Profile
                const tutor = await prisma.tutor.create({
                    data: {
                        userId: data.user.id,
                        hourlyRate: 45,
                        experience: 5,
                        bio: "I am a seeded tutor for testing purposes.",
                        qualification: "Ph.D. in Testing",
                    }
                });

                // 5. Link to subject
                await prisma.tutorSubject.create({
                    data: {
                        tutorId: tutor.id,
                        subjectId: subject.id,
                    }
                });

                console.log(`Tutor seeded successfully! You can login with:\nEmail: ${tutorEmail}\nPassword: password123`);
            }
        } else {
            console.log("Tutor already exists. Use the email: tutor@example.com and password: password123 to log in.");
        }
    } catch (error) {
        console.error("Error seeding Tutor:", error);
    }
};
