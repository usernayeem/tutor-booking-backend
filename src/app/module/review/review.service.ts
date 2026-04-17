import status from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { SessionStatus } from "../../../generated/prisma/client";

const createReview = async (user: IRequestUser, payload: { sessionId: string; rating: number; comment?: string }) => {
    // 1. Get student profile
    const student = await prisma.student.findUnique({
        where: { userId: user.id }
    });

    if (!student) {
        throw new AppError(status.NOT_FOUND, "Student profile not found");
    }

    // 2. Validate session
    const session = await prisma.session.findUnique({
        where: { id: payload.sessionId }
    });

    if (!session) {
        throw new AppError(status.NOT_FOUND, "Session not found");
    }

    if (session.studentId !== student.id) {
        throw new AppError(status.FORBIDDEN, "You can only review your own sessions");
    }

    if (session.status !== SessionStatus.COMPLETED) {
        throw new AppError(status.BAD_REQUEST, "You can only review a completed session");
    }

    // 3. Check if review already exists
    const existingReview = await prisma.review.findUnique({
        where: { sessionId: payload.sessionId }
    });

    if (existingReview) {
        throw new AppError(status.CONFLICT, "You have already reviewed this session");
    }

    // 4. Create review
    const review = await prisma.review.create({
        data: {
            sessionId: payload.sessionId,
            studentId: student.id,
            tutorId: session.tutorId,
            rating: payload.rating,
            comment: payload.comment,
        }
    });

    return review;
};

const getTutorReviews = async (tutorId: string) => {
    // Check if tutor exists
    const tutor = await prisma.tutor.findUnique({
        where: { id: tutorId }
    });

    if (!tutor) {
        throw new AppError(status.NOT_FOUND, "Tutor not found");
    }

    const reviews = await prisma.review.findMany({
        where: { tutorId },
        include: {
            student: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            profilePhoto: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return reviews;
};

export const ReviewService = {
    createReview,
    getTutorReviews,
};
