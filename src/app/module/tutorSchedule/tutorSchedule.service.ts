import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { ICreateTutorSchedulePayload } from "./tutorSchedule.interface";

const createTutorSchedules = async (userId: string, payload: ICreateTutorSchedulePayload) => {
    // Check if the tutor exists
    const tutor = await prisma.tutor.findUnique({
        where: { userId },
    });

    if (!tutor) {
        throw new AppError(status.NOT_FOUND, "Tutor profile not found");
    }

    const { scheduleIds } = payload;
    const validSchedules = [];

    // Filter out schedules that don't exist in master schedule table
    // or already assigned to the tutor
    for (const scheduleId of scheduleIds) {
        const scheduleData = await prisma.schedule.findUnique({
            where: { id: scheduleId }
        });

        if (!scheduleData) continue; // Skip non-existent schedules

        const isAlreadyAssigned = await prisma.tutorSchedule.findUnique({
            where: {
                tutorId_scheduleId: {
                    tutorId: tutor.id,
                    scheduleId,
                }
            }
        });

        if (!isAlreadyAssigned) {
            validSchedules.push({
                tutorId: tutor.id,
                scheduleId: scheduleData.id,
            });
        }
    }

    if (validSchedules.length > 0) {
        await prisma.tutorSchedule.createMany({
            data: validSchedules,
        });
    }

    return await prisma.tutorSchedule.findMany({
        where: { tutorId: tutor.id },
        include: { schedule: true },
    });
};

const getMySchedules = async (userId: string, query: IQueryParams) => {
    const tutor = await prisma.tutor.findUnique({
        where: { userId },
    });

    if (!tutor) {
        throw new AppError(status.NOT_FOUND, "Tutor profile not found");
    }

    // Usually we might want filtering by isBooked status
    const whereCondition: any = { tutorId: tutor.id };
    if (query.isBooked !== undefined) {
        whereCondition.isBooked = query.isBooked === "true";
    }

    const tutorSchedules = await prisma.tutorSchedule.findMany({
        where: whereCondition,
        include: {
            schedule: true,
        },
    });

    return tutorSchedules;
};

const deleteTutorSchedule = async (userId: string, scheduleId: string) => {
    const tutor = await prisma.tutor.findUnique({
        where: { userId },
    });

    if (!tutor) {
        throw new AppError(status.NOT_FOUND, "Tutor profile not found");
    }

    const isAssigned = await prisma.tutorSchedule.findUnique({
        where: {
            tutorId_scheduleId: {
                tutorId: tutor.id,
                scheduleId,
            }
        }
    });

    if (!isAssigned) {
        throw new AppError(status.NOT_FOUND, "Schedule not assigned to this tutor");
    }

    if (isAssigned.isBooked) {
        throw new AppError(status.BAD_REQUEST, "Cannot delete a schedule that is already booked");
    }

    await prisma.tutorSchedule.delete({
        where: {
            tutorId_scheduleId: {
                tutorId: tutor.id,
                scheduleId,
            }
        }
    });

    return { message: "Tutor schedule deleted successfully" };
};

export const TutorScheduleService = {
    createTutorSchedules,
    getMySchedules,
    deleteTutorSchedule,
};
