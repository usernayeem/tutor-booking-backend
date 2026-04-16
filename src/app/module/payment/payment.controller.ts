import { Request, Response } from "express";
import status from "http-status";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";

const createCheckoutSession = catchAsync(async (req: Request & { user?: IRequestUser }, res: Response) => {
    const user = req.user as IRequestUser;
    const { sessionId } = req.body;
    
    // Validate request strictly
    if (!sessionId) {
        res.status(status.BAD_REQUEST).json({
            success: false,
            message: "sessionId is required",
        });
        return;
    }

    const result = await PaymentService.createCheckoutSession(sessionId, user);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Checkout session created successfully",
        data: result, // contains the checkout URL
    });
});

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
    // In production, you would construct event from raw body.
    const payload = req.body;
    await PaymentService.handleWebhook(payload);

    res.status(200).json({ received: true });
});

const getPaymentBySessionId = catchAsync(async (req: Request & { user?: IRequestUser }, res: Response) => {
    const user = req.user as IRequestUser;
    const { id: sessionId } = req.params;
    
    const result = await PaymentService.getPaymentBySessionId(sessionId, user);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Payment retrieved successfully",
        data: result,
    });
});

export const PaymentController = {
    createCheckoutSession,
    handleWebhook,
    getPaymentBySessionId,
};
