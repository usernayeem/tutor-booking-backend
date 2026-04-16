import { Prisma } from "../../../generated/prisma/client";

export const tutorSearchableFields = [
    "qualification",
    "bio",
    "contactNumber",
];

export const tutorFilterableFields = [
    "isAvailable",
    "hourlyRate",
];

export const tutorIncludeConfig: Record<string, Prisma.TutorInclude> = {
    user: { user: true },
    tutorSubjects: {
        tutorSubjects: {
            include: { subject: true }
        }
    },
    reviews: { reviews: true },
    tutorSchedules: { tutorSchedules: true },
};
