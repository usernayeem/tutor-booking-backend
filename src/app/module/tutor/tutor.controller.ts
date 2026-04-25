import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { TutorService } from "./tutor.service.js";

const getAllTutors = catchAsync(async (req: Request, res: Response) => {
    const result = await TutorService.getAllTutors(req.query as unknown as any);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Tutors retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getTutorById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TutorService.getTutorById(id as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Tutor retrieved successfully",
        data: result,
    });
});

const updateTutor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = {
        ...req.body,
        ...(req.file?.path ? { profilePhoto: req.file.path } : {}),
    };
    const result = await TutorService.updateTutor(id as string, payload);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Tutor updated successfully",
        data: result,
    });
});

const deleteTutor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TutorService.deleteTutor(id as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Tutor deleted successfully",
        data: result,
    });
});

export const TutorController = {
    getAllTutors,
    getTutorById,
    updateTutor,
    deleteTutor,
};
