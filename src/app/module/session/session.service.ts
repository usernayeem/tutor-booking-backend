import status from "http-status";
import { Prisma, Session } from "../../../generated/prisma/client";
import { PaymentStatus, Role, SessionStatus } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { IQueryParams } from "../../interfaces/query.interface";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { ICreateSessionPayload, IUpdateSessionStatusPayload, sessionFilterableFields, sessionSearchableFields } from "./session.interface";
import crypto from "crypto";

const createSession = async (user: IRequestUser, payload: ICreateSessionPayload) => {
    const student = await prisma.student.findUnique({
        where: { userId: user.id }
    });

    if (!student) {
        throw new AppError(status.NOT_FOUND, "Student profile not found");
    }

    const { tutorId, scheduleId } = payload;

    // Check if TutorSchedule is available
    const tutorSchedule = await prisma.tutorSchedule.findUnique({
        where: {
            tutorId_scheduleId: { tutorId, scheduleId }
        },
        include: { tutor: true }
    });

    if (!tutorSchedule) {
        throw new AppError(status.NOT_FOUND, "The requested schedule slot does not exist for this tutor");
    }

    if (tutorSchedule.isBooked) {
        throw new AppError(status.CONFLICT, "This time slot is already booked");
    }

    // Book the session and create payment in a single transaction
    const result = await prisma.$transaction(async (tx) => {
        // 1. Mark TutorSchedule as booked
        await tx.tutorSchedule.update({
            where: {
                tutorId_scheduleId: { tutorId, scheduleId }
            },
            data: { isBooked: true }
        });

        // 2. Create Session
        const session = await tx.session.create({
            data: {
                studentId: student.id,
                tutorId,
                scheduleId,
                status: SessionStatus.SCHEDULED,
                paymentStatus: PaymentStatus.UNPAID,
            }
        });

        // 3. Setup Initial Payment record
        const transactionId = `TXN-${crypto.randomUUID()}`;
        const payment = await tx.payment.create({
            data: {
                sessionId: session.id,
                amount: tutorSchedule.tutor.hourlyRate || 0,
                transactionId,
            }
        });

        return { session, payment };
    });

    return result;
};

const getAllSessions = async (user: IRequestUser, query: IQueryParams) => {
    // Determine Role-Based filtering
    const conditions: Prisma.SessionWhereInput[] = [];

    if (user.role === Role.STUDENT) {
        const student = await prisma.student.findUnique({ where: { userId: user.id } });
        if (student) conditions.push({ studentId: student.id });
    } else if (user.role === Role.TUTOR) {
        const tutor = await prisma.tutor.findUnique({ where: { userId: user.id } });
        if (tutor) conditions.push({ tutorId: tutor.id });
    }

    const queryBuilder = new QueryBuilder<Session, Prisma.SessionWhereInput, Prisma.SessionInclude>(
        prisma.session,
        query,
        {
            searchableFields: sessionSearchableFields,
            filterableFields: sessionFilterableFields,
        }
    );

    const result = await queryBuilder
        .search()
        .filter()
        .where(conditions.length > 0 ? { AND: conditions } : {})
        .include({
            student: { include: { user: true } },
            tutor: { include: { user: true } },
            schedule: true,
            payment: true,
        })
        .paginate()
        .sort()
        .fields()
        .execute();

    return result;
};

const getSessionById = async (id: string, user: IRequestUser) => {
    const session = await prisma.session.findUnique({
        where: { id },
        include: {
            student: { include: { user: true } },
            tutor: { include: { user: true } },
            schedule: true,
            payment: true,
            review: true,
        }
    });

    if (!session) {
        throw new AppError(status.NOT_FOUND, "Session not found");
    }

    // Role verification logic
    if (user.role === Role.STUDENT && session.student.userId !== user.id) {
        throw new AppError(status.FORBIDDEN, "Access Denied: You do not own this session.");
    }
    if (user.role === Role.TUTOR && session.tutor.userId !== user.id) {
        throw new AppError(status.FORBIDDEN, "Access Denied: You are not the tutor for this session.");
    }

    return session;
};

const updateSessionStatus = async (id: string, payload: IUpdateSessionStatusPayload, user: IRequestUser) => {
    const session = await prisma.session.findUnique({
        where: { id },
        include: { tutor: true }
    });

    if (!session) {
        throw new AppError(status.NOT_FOUND, "Session not found");
    }

    if (user.role === Role.TUTOR && session.tutor.userId !== user.id) {
        throw new AppError(status.FORBIDDEN, "You can only update your own sessions.");
    }

    return await prisma.$transaction(async (tx) => {
        const updatedSession = await tx.session.update({
            where: { id },
            data: { status: payload.status }
        });

        // If canceled, free up the tutor slot so it can be re-booked
        if (payload.status === SessionStatus.CANCELED) {
            await tx.tutorSchedule.update({
                where: {
                    tutorId_scheduleId: {
                        tutorId: session.tutorId,
                        scheduleId: session.scheduleId,
                    }
                },
                data: { isBooked: false }
            });
        }

        return updatedSession;
    });
};

export const SessionService = {
    createSession,
    getAllSessions,
    getSessionById,
    updateSessionStatus,
};
