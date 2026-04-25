import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { ReviewService } from "./review.service.js";
import { IRequestUser } from "../../interfaces/requestUser.interface.js";

const createReview = catchAsync(async (req: Request & { user?: IRequestUser }, res: Response) => {
    const result = await ReviewService.createReview(req.user!, req.body);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Review submitted successfully",
        data: result,
    });
});

const getTutorReviews = catchAsync(async (req: Request, res: Response) => {
    const { tutorId } = req.params;
    const result = await ReviewService.getTutorReviews(tutorId as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Tutor reviews retrieved successfully",
        data: result,
    });
});

export const ReviewController = {
    createReview,
    getTutorReviews,
};
