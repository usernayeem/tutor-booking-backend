import status from "http-status";
import { Prisma, Tutor } from "../../../generated/prisma/client";
import { UserStatus } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { tutorFilterableFields, tutorIncludeConfig, tutorSearchableFields } from "./tutor.constant";
import { IUpdateTutorPayload } from "./tutor.interface";

const getAllTutors = async (query: IQueryParams) => {
    // If the client passes "subject" in the query to drill down by subject name/id
    const customConditions: Prisma.TutorWhereInput[] = [];
    if (query.subjectId) {
        customConditions.push({
            tutorSubjects: {
                some: { subjectId: query.subjectId as string }
            }
        });
    }

    const queryBuilder = new QueryBuilder<Tutor, Prisma.TutorWhereInput, Prisma.TutorInclude>(
        prisma.tutor,
        query,
        {
            searchableFields: tutorSearchableFields,
            filterableFields: tutorFilterableFields,
        }
    );

    const result = await queryBuilder
        .search()
        .filter()
        .where({
            isDeleted: false,
            AND: customConditions.length > 0 ? customConditions : undefined,
        })
        .include({
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                }
            },
            tutorSubjects: {
                include: { subject: true }
            }
        })
        .dynamicInclude(tutorIncludeConfig)
        .paginate()
        .sort()
        .fields()
        .execute();

    return result;
};

const getTutorById = async (id: string) => {
    const tutor = await prisma.tutor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                }
            },
            tutorSubjects: { include: { subject: true } },
            tutorSchedules: {
                include: { schedule: true }
            },
            reviews: {
                include: {
                    student: {
                        include: { user: true }
                    }
                }
            },
        }
    });

    if (!tutor) {
        throw new AppError(status.NOT_FOUND, "Tutor not found");
    }

    return tutor;
};

const updateTutor = async (id: string, payload: any) => {
    const isTutorExist = await prisma.tutor.findUnique({
        where: { id },
        include: { user: true }
    });

    if (!isTutorExist) {
        throw new AppError(status.NOT_FOUND, "Tutor not found");
    }

    const { name, ...tutorData } = payload;

    await prisma.$transaction(async (tx) => {
        // Update tutor fields
        if (Object.keys(tutorData).length > 0) {
            await tx.tutor.update({
                where: { id },
                data: tutorData,
            });
        }

        // Update user fields (like name)
        if (name) {
            await tx.user.update({
                where: { id: isTutorExist.userId },
                data: { name },
            });
        }
    });

    return await getTutorById(id);
};

const deleteTutor = async (id: string) => {
    const isTutorExist = await prisma.tutor.findUnique({
        where: { id },
        include: { user: true }
    });

    if (!isTutorExist) {
        throw new AppError(status.NOT_FOUND, "Tutor not found");
    }

    await prisma.$transaction(async (tx) => {
        await tx.tutor.update({
            where: { id },
            data: { isDeleted: true },
        });

        await tx.user.update({
            where: { id: isTutorExist.userId },
            data: {
                isDeleted: true,
                status: UserStatus.DELETED,
            },
        });

        await tx.sessionAuth.deleteMany({
            where: { userId: isTutorExist.userId }
        });
    });

    return { message: "Tutor deleted successfully" };
};

export const TutorService = {
    getAllTutors,
    getTutorById,
    updateTutor,
    deleteTutor,
};
