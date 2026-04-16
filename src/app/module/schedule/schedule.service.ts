import status from "http-status";
import { Prisma, Schedule } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { ICreateSchedulePayload, scheduleSearchableFields } from "./schedule.interface";

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

    // Insert only if they don't exactly exist. We can't do upsert bulk easily, so let's check one by one or createMany.
    // For simplicity of bulk:
    const validSchedules = [];
    for (const schedule of schedulesToCreate) {
        const isExist = await prisma.schedule.findFirst({
            where: {
                startTime: schedule.startTime,
                endTime: schedule.endTime,
            }
        });
        if (!isExist) validSchedules.push(schedule);
    }

    let createdSchedules = [];
    if (validSchedules.length > 0) {
       createdSchedules = await prisma.schedule.createManyAndReturn({
           data: validSchedules
       });
    }

    return createdSchedules;
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

    // Delete schedule slot
    await prisma.schedule.delete({
        where: { id }
    });

    return { message: "Schedule deleted successfully" };
};

export const ScheduleService = {
    createSchedules,
    getAllSchedules,
    deleteSchedule,
};
