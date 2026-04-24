import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { UserService } from "./user.service";

const createTutor = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await UserService.createTutor(payload);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Tutor registered successfully",
        data: result,
    });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await UserService.createAdmin(payload);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Admin created successfully",
        data: result,
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await UserService.updateUser(id, payload);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User updated successfully",
        data: result,
    });
});

export const UserController = {
    createTutor,
    createAdmin,
    updateUser,
};
