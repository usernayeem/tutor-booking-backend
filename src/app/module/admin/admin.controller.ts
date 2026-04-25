import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { AdminService } from "./admin.service.js";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getDashboardStats();

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Dashboard stats retrieved successfully",
        data: result,
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getAllUsers(req.query as unknown as any);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Users retrieved successfully",
        data: result,
    });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.updateUserStatus(id as string, req.body);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User status updated successfully",
        data: result,
    });
});

export const AdminController = {
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
};
