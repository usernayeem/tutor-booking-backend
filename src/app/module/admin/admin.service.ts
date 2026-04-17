import status from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Prisma, User } from "../../../generated/prisma/client";
import { IQueryParams } from "../../interfaces/query.interface";
import { PaymentStatus, UserStatus } from "../../../generated/prisma/client";

const getDashboardStats = async () => {
    const totalStudents = await prisma.student.count();
    const totalTutors = await prisma.tutor.count();
    const totalSessions = await prisma.session.count();
    
    const revenue = await prisma.payment.aggregate({
        where: { paymentStatus: PaymentStatus.PAID },
        _sum: { amount: true }
    });

    return {
        totalStudents,
        totalTutors,
        totalSessions,
        totalRevenue: revenue._sum.amount || 0,
    };
};

const getAllUsers = async (query: IQueryParams) => {
    // Basic search/filter on users
    const queryBuilder = new QueryBuilder<User, Prisma.UserWhereInput, Prisma.UserInclude>(
        prisma.user,
        query,
        {
            searchableFields: ['name', 'email'],
            filterableFields: ['role', 'status', 'isDeleted'],
        }
    );

    const result = await queryBuilder
        .search()
        .filter()
        .paginate()
        .sort()
        .fields()
        .execute();

    return result;
};

const updateUserStatus = async (id: string, payload: { status: UserStatus }) => {
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    if (user.isDeleted) {
        throw new AppError(status.BAD_REQUEST, "Cannot update status of a deleted user");
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: { status: payload.status }
    });

    return updatedUser;
};

export const AdminService = {
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
};
