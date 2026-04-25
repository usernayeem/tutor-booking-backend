import { Request, Response } from "express";
import status from "http-status";
import { IQueryParams } from "../../interfaces/query.interface";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { StudentService } from "./student.service";

const getAllStudents = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await StudentService.getAllStudents(query as IQueryParams);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Students fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getStudentById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const student = await StudentService.getStudentById(id as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Student fetched successfully",
        data: student,
    });
});

const updateStudent = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = {
        ...req.body,
        ...(req.file?.path ? { profilePhoto: req.file.path } : {}),
    };
    const updatedStudent = await StudentService.updateStudent(id as string, payload);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Student updated successfully",
        data: updatedStudent,
    });
});

const deleteStudent = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await StudentService.deleteStudent(id as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Student deleted successfully",
        data: result,
    });
});

export const StudentController = {
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
};
