import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { SubjectService } from "./subject.service.js";

const createSubject = catchAsync(async (req: Request, res: Response) => {
    const payload = {
        ...req.body,
        iconUrl: req.file?.path
    };
    const result = await SubjectService.createSubject(payload);
    sendResponse(res, {
        httpStatusCode: 201,
        success: true,
        message: 'Subject created successfully',
        data: result
    });
});

const getAllSubjects = catchAsync(async (req: Request, res: Response) => {
    const result = await SubjectService.getAllSubjects();
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: 'Subjects fetched successfully',
        data: result
    });
});

const deleteSubject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SubjectService.deleteSubject(id as string);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: 'Subject deleted successfully',
        data: result
    });
});

export const SubjectController = {
    createSubject,
    getAllSubjects,
    deleteSubject
};
