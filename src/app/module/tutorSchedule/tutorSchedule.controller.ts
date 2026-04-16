import { Request, Response } from "express";
import status from "http-status";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { TutorScheduleService } from "./tutorSchedule.service";

const createTutorSchedules = catchAsync(async (req: Request & { user?: IRequestUser }, res: Response) => {
    const userId = req.user?.id as string;
    const result = await TutorScheduleService.createTutorSchedules(userId, req.body);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Tutor schedules created successfully",
        data: result,
    });
});

const getMySchedules = catchAsync(async (req: Request & { user?: IRequestUser }, res: Response) => {
    const userId = req.user?.id as string;
    const result = await TutorScheduleService.getMySchedules(userId, req.query);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Tutor schedules retrieved successfully",
        data: result,
    });
});

const deleteTutorSchedule = catchAsync(async (req: Request & { user?: IRequestUser }, res: Response) => {
    const userId = req.user?.id as string;
    const { id: scheduleId } = req.params;
    const result = await TutorScheduleService.deleteTutorSchedule(userId, scheduleId);

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
