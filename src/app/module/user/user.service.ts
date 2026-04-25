import status from "http-status";
import { Role } from '@prisma/client';
import AppError from "../../errorHelpers/AppError.js";
import { auth } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
import { ICreateAdminPayload, ICreateTutorPayload } from "./user.interface.js";

const createTutor = async (payload: ICreateTutorPayload) => {
    // 1. Verify subjects exist
    const subjects = [];
    for (const subjectId of payload.subjectIds) {
        const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
        if (!subject) throw new AppError(status.NOT_FOUND, `Subject with id ${subjectId} not found`);
        subjects.push(subject);
    }

    // 2. Check if user already exists
    const userExists = await prisma.user.findUnique({ where: { email: payload.tutor.email } });
    if (userExists) throw new AppError(status.CONFLICT, "User with this email already exists");

    // 3. Create User via better-auth
    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.tutor.email,
            password: payload.password || "password123", // default password if not provided
            name: payload.tutor.name,
        }
    });

    if (!userData || !userData.user) {
         throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to create user");
    }

    // Update role to TUTOR manually since better-auth defaults to STUDENT in our config
    await prisma.user.update({
        where: { id: userData.user.id },
        data: { role: Role.TUTOR, needPasswordChange: true }
    });

    // 4. Transaction to create Tutor and TutorSubject relations
    try {
        const result = await prisma.$transaction(async (tx) => {
            const tutorData = await tx.tutor.create({
                data: {
                    userId: userData.user.id,
                    contactNumber: payload.tutor.contactNumber,
                    hourlyRate: payload.tutor.hourlyRate || 0,
                    experience: payload.tutor.experience || 0,
                    qualification: payload.tutor.qualification,
                }
            });

            const tutorSubjectData = payload.subjectIds.map((subjectId) => ({
                tutorId: tutorData.id,
                subjectId: subjectId,
            }));

            if (tutorSubjectData.length > 0) {
                await tx.tutorSubject.createMany({ data: tutorSubjectData });
            }

            return await tx.tutor.findUnique({
                where: { id: tutorData.id },
                include: {
                    user: true,
                    tutorSubjects: { include: { subject: true } }
                }
            });
        });

        return result;
    } catch (error) {
        console.log("Transaction error : ", error);
        await prisma.user.delete({ where: { id: userData.user.id } });
        throw error;
    }
};

const createAdmin = async (payload: ICreateAdminPayload) => {
    const userExists = await prisma.user.findUnique({ where: { email: payload.admin.email } });
    if (userExists) throw new AppError(status.CONFLICT, "User with this email already exists");

    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.admin.email,
            password: payload.password || "admin123",
            name: payload.admin.name,
        }
    });

     if (!userData || !userData.user) {
         throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to create user");
    }

    const adminUser = await prisma.user.update({
        where: { id: userData.user.id },
        data: { role: Role.ADMIN, needPasswordChange: true }
    });

    return adminUser;
};

const updateUser = async (id: string, payload: any) => {
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) throw new AppError(status.NOT_FOUND, "User not found");

    const updatedUser = await prisma.user.update({
        where: { id },
        data: payload,
    });

    return updatedUser;
};

export const UserService = {
    createTutor,
    createAdmin,
    updateUser,
};
