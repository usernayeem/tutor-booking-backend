import { Request, Response } from "express";
import status from "http-status";
import { IRequestUser } from "../../interfaces/requestUser.interface.js";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { SessionService } from "./session.service.js";

import { PaymentService } from "../payment/payment.service.js";

const createSession = catchAsync(async (req: Request & { user?: IRequestUser }, res: Response) => {
    const user = req.user as IRequestUser;
    const result = await SessionService.createSession(user, req.body);

    // Automatically trigger payment link creation
    const paymentResult = await PaymentService.createCheckoutSession(result.session.id, user);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Session booked successfully. Redirecting to payment...",
        data: {
            ...result,
            paymentUrl: paymentResult.url
        },
    });
});

const getAllSessions = catchAsync(async (req: Request & { user?: IRequestUser }, res: Response) => {
    const user = req.user as IRequestUser;
    const result = await SessionService.getAllSessions(user, req.query as unknown as any);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Sessions retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getSessionById = catchAsync(async (req: Request & { user?: IRequestUser }, res: Response) => {
    const user = req.user as IRequestUser;
    const { id } = req.params;
    const result = await SessionService.getSessionById(id as string, user);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Session retrieved successfully",
        data: result,
    });
});

const updateSessionStatus = catchAsync(async (req: Request & { user?: IRequestUser }, res: Response) => {
    const user = req.user as IRequestUser;
    const { id } = req.params;
    const result = await SessionService.updateSessionStatus(id as string, req.body, user);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Session status updated successfully",
        data: result,
    });
});

export const SessionController = {
    createSession,
    getAllSessions,
    getSessionById,
    updateSessionStatus,
};
