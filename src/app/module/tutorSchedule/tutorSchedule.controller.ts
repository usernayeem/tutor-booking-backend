import { Request, Response } from "express";
import status from "http-status";
import { IRequestUser } from "../../interfaces/requestUser.interface.js";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { TutorScheduleService } from "./tutorSchedule.service.js";

const createTutorSchedules = catchAsync(async (req: Request & { user?: IRequestUser }, res: Response) => {
    const userId = req.user?.userId as string;
    const result = await TutorScheduleService.createTutorSchedules(userId, req.body);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Tutor schedules created successfully",
        data: result,
    });
});

const getMySchedules = catchAsync(async (req: Request & { user?: IRequestUser }, res: Response) => {
    const userId = req.user?.userId as string;
    const result = await TutorScheduleService.getMySchedules(userId, req.query as any);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Tutor schedules retrieved successfully",
        data: result,
    });
});

const deleteTutorSchedule = catchAsync(async (req: Request & { user?: IRequestUser }, res: Response) => {
    const userId = req.user?.userId as string;
    const { id: scheduleId } = req.params;
    const result = await TutorScheduleService.deleteTutorSchedule(userId, scheduleId as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Tutor schedule deleted successfully",
        data: result,
    });
});

export const TutorScheduleController = {
    createTutorSchedules,
    getMySchedules,
    deleteTutorSchedule,
};
