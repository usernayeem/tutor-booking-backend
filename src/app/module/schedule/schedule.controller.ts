import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";

const createSchedules = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.createSchedules(req.body);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Schedules created successfully",
        data: result,
    });
});

const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.getAllSchedules(req.query);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Schedules retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ScheduleService.deleteSchedule(id);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Schedule deleted successfully",
        data: result,
    });
});

export const ScheduleController = {
    createSchedules,
    getAllSchedules,
    deleteSchedule,
};
