import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ReviewService } from "./review.service";
import { IRequestUser } from "../../interfaces/requestUser.interface";

const createReview = catchAsync(async (req: Request & { user?: IRequestUser }, res: Response) => {
    const result = await ReviewService.createReview(req.user!, req.body);

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Review submitted successfully",
        data: result,
    });
});

const getTutorReviews = catchAsync(async (req: Request, res: Response) => {
    const { tutorId } = req.params;
    const result = await ReviewService.getTutorReviews(tutorId);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Tutor reviews retrieved successfully",
        data: result,
    });
});

export const ReviewController = {
    createReview,
    getTutorReviews,
};
