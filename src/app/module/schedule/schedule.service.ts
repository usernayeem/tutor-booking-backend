import status from "http-status";
import { Prisma, Schedule } from '@prisma/client';
import AppError from "../../errorHelpers/AppError.js";
import { IQueryParams } from "../../interfaces/query.interface.js";
import { prisma } from "../../lib/prisma.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { ICreateSchedulePayload, scheduleSearchableFields } from "./schedule.interface.js";

const createSchedules = async (payload: ICreateSchedulePayload) => {
    // Basic slot creation logic for 30 minute buffers
    const { startDate, endDate, startTime, endTime } = payload;

    const schedulesToCreate: any[] = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    // Set loop limit to avoid infinite loop by accident, e.g. max 90 days
    const maxDays = 90;
    let daysCount = 0;

    while (currentDate <= lastDate) {
        if (daysCount >= maxDays) break;

        // Extract day of week 
        const dayOfWeek = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(currentDate);

        // Convert the string dates into Date objects to parse hours
        const startDateTime = new Date(`1970-01-01T${startTime}:00Z`);
        const endDateTime = new Date(`1970-01-01T${endTime}:00Z`);

        let currentSlotTime = startDateTime;

        while (currentSlotTime < endDateTime) {
            // Calculate next slot by adding 30 minutes
            const nextSlotTime = new Date(currentSlotTime.getTime() + 30 * 60000);

            if (nextSlotTime > endDateTime) break;

            // Combine the currentDate with the slot times
            const sTimeStr = currentSlotTime.toISOString().substring(11, 16); // gets "HH:MM"
            const eTimeStr = nextSlotTime.toISOString().substring(11, 16);

            const scheduleStart = new Date(`${currentDate.toISOString().substring(0, 10)}T${sTimeStr}:00Z`);
            const scheduleEnd = new Date(`${currentDate.toISOString().substring(0, 10)}T${eTimeStr}:00Z`);

            schedulesToCreate.push({
                startTime: scheduleStart,
                endTime: scheduleEnd,
                dayOfWeek,
            });

            currentSlotTime = nextSlotTime;
        }

        // Increment currentDate by 1 day
        currentDate.setDate(currentDate.getDate() + 1);
        daysCount++;
    }

    // Fetch existing schedules in bulk to avoid sequential queries
    let validSchedules = schedulesToCreate;
    if (schedulesToCreate.length > 0) {
        const startRange = schedulesToCreate[0].startTime;
        const endRange = schedulesToCreate[schedulesToCreate.length - 1].endTime;

        const existingSchedules = await prisma.schedule.findMany({
            where: {
                startTime: { gte: startRange },
                endTime: { lte: endRange },
            }
        });

        validSchedules = schedulesToCreate.filter(sc => 
            !existingSchedules.some(ex => 
                ex.startTime.getTime() === sc.startTime.getTime() && 
                ex.endTime.getTime() === sc.endTime.getTime()
            )
        );
    }

    if (validSchedules.length > 0) {
       await prisma.schedule.createMany({
           data: validSchedules
       });
       
       // Note: createMany doesn't return the created records, so we can fetch them or just return the validSchedules payload
       return validSchedules;
    }

    return [];
};

const getAllSchedules = async (query: IQueryParams) => {
    // Optional filtering handling if startDate and endDate are passed as filters
    const conditions: Prisma.ScheduleWhereInput[] = [];

    // E.g., ?startDate=2026-05-01&endDate=2026-05-31
    if (query.startDate && query.endDate) {
        const sDate = new Date(query.startDate as string);
        const eDate = new Date(query.endDate as string);
        // Include full day of endDate
        eDate.setHours(23, 59, 59, 999);
        conditions.push({
            startTime: {
                gte: sDate,
                lte: eDate
            }
        });
    }

    const queryBuilder = new QueryBuilder<Schedule, Prisma.ScheduleWhereInput, Prisma.ScheduleInclude>(
        prisma.schedule,
        query,
        {
            searchableFields: scheduleSearchableFields,
        }
    );

    const result = await queryBuilder
        .search()
        .filter()
        .where(conditions.length > 0 ? { AND: conditions } : {})
        .paginate()
        .sort()
        .fields()
        .execute();

    return result;
};

const deleteSchedule = async (id: string) => {
    const isScheduleExist = await prisma.schedule.findUnique({
        where: { id }
    });

    if (!isScheduleExist) {
        throw new AppError(status.NOT_FOUND, "Schedule not found");
    }

    // Delete schedule slot. Handle cases where it is linked to tutor schedules or sessions.
    try {
        await prisma.schedule.delete({
            where: { id }
        });
    } catch (error: any) {
        if (error.code === 'P2003') {
            throw new AppError(status.CONFLICT, "Cannot delete this schedule because it is currently selected by tutors or has active sessions.");
        }
        throw error;
    }

    return { message: "Schedule deleted successfully" };
};

export const ScheduleService = {
    createSchedules,
    getAllSchedules,
    deleteSchedule,
};
