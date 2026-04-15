import status from "http-status";
import { Prisma, Student } from "../../../generated/prisma/client";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { studentFilterableFields, studentIncludeConfig, studentSearchableFields } from "./student.constant";
import { IUpdateStudentPayload } from "./student.interface";

const getAllStudents = async (query: IQueryParams) => {
    const queryBuilder = new QueryBuilder<Student, Prisma.StudentWhereInput, Prisma.StudentInclude>(
        prisma.student,
        query,
        {
            searchableFields: studentSearchableFields,
            filterableFields: studentFilterableFields,
        }
    );

    const result = await queryBuilder
        .search()
        .filter()
        .where({
            isDeleted: false,
        })
        .include({
            user: true,
        })
        .dynamicInclude(studentIncludeConfig)
        .paginate()
        .sort()
        .fields()
        .execute();

    return result;
};

const getStudentById = async (id: string) => {
    const student = await prisma.student.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            user: true,
            sessions: {
                include: {
                    tutorSchedule: {
                        include: { schedule: true }
                    }
                }
            },
            reviews: true,
        }
    });
    return student;
};

const updateStudent = async (id: string, payload: IUpdateStudentPayload) => {
    const isStudentExist = await prisma.student.findUnique({
        where: { id }
    });

    if (!isStudentExist) {
        throw new AppError(status.NOT_FOUND, "Student not found");
    }

    const updatedStudent = await prisma.student.update({
        where: { id },
        data: payload,
    });

    return await getStudentById(id);
};

const deleteStudent = async (id: string) => {
    const isStudentExist = await prisma.student.findUnique({
        where: { id },
        include: { user: true }
    });

    if (!isStudentExist) {
        throw new AppError(status.NOT_FOUND, "Student not found");
    }

    await prisma.$transaction(async (tx) => {
        await tx.student.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });

        await tx.user.update({
            where: { id: isStudentExist.userId },
            data: {
                isDeleted: true,
                status: UserStatus.DELETED,
            },
        });

        await tx.sessionAuth.deleteMany({
            where: { userId: isStudentExist.userId }
        });
    });

    return { message: "Student deleted successfully" };
};

export const StudentService = {
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
};
