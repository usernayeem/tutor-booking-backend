import status from "http-status";
import { PaymentStatus, SessionStatus, Prisma, Payment } from '@prisma/client';
import { envVars } from "../../config/env.js";
import { stripe } from "../../config/stripe.config.js";
import AppError from "../../errorHelpers/AppError.js";
import { IRequestUser } from "../../interfaces/requestUser.interface.js";
import { prisma } from "../../lib/prisma.js";

const createCheckoutSession = async (sessionId: string, user: IRequestUser) => {
    // 1. Verify session belongs to the user
    const sessionDetail = await prisma.session.findUnique({
        where: { id: sessionId },
        include: {
            student: true,
            tutor: {
                include: { user: true }
            },
            payment: true,
        }
    });

    if (!sessionDetail) {
        throw new AppError(status.NOT_FOUND, "Session not found");
    }

    if (sessionDetail.student.userId !== user.userId) {
        throw new AppError(status.FORBIDDEN, "You can only pay for your own sessions");
    }

    if (sessionDetail.paymentStatus === PaymentStatus.PAID) {
        throw new AppError(status.BAD_REQUEST, "This session is already paid for");
    }

    if (!sessionDetail.payment) {
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Payment record missing for this session");
    }

    // 2. Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Tutoring Session with ${sessionDetail.tutor.user.name}`,
                    },
                    unit_amount: Math.round(sessionDetail.payment.amount * 100), // convert to cents
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        // Attach transaction id to metadata so we can identify it in the webhook
        metadata: {
            transactionId: sessionDetail.payment.transactionId,
            sessionId: sessionDetail.id,
        },
        success_url: `${envVars.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${envVars.FRONTEND_URL}/payment/cancel`,
    });

    return { url: stripeSession.url };
};

const handleWebhook = async (payload: any) => {
    // For simplicity without express raw parser, we process the event type manually
    // In production, you must use stripe.webhooks.constructEvent to verify signatures
    
    // Check if the event is checkout.session.completed
    if (payload.type === 'checkout.session.completed') {
        const session = payload.data.object;
        const transactionId = session.metadata?.transactionId;

        if (transactionId) {
            try {
                // Update payment status
                const payment = await prisma.payment.update({
                    where: { transactionId },
                    data: { paymentStatus: PaymentStatus.PAID }
                });

                // Update session payment status and promote to SCHEDULED
                await prisma.session.update({
                    where: { id: payment.sessionId },
                    data: { 
                        paymentStatus: PaymentStatus.PAID,
                        status: SessionStatus.SCHEDULED 
                    }
                });
            } catch (error) {
                throw error;
            }
        }
    }

    return { received: true };
};

const getPaymentBySessionId = async (sessionId: string, user: IRequestUser) => {
    const payment = await prisma.payment.findUnique({
        where: { sessionId },
        include: {
            session: {
                include: { student: true, tutor: true }
            }
        }
    });

    if (!payment) {
        throw new AppError(status.NOT_FOUND, "Payment record not found");
    }

    // Admins can see all. Rest restricted.
    if (user.role === 'STUDENT' && payment.session.student.userId !== user.userId) {
         throw new AppError(status.FORBIDDEN, "Access Denied");
    }
    if (user.role === 'TUTOR' && payment.session.tutor.userId !== user.userId) {
         throw new AppError(status.FORBIDDEN, "Access Denied");
    }

    return payment;
};

export const PaymentService = {
    createCheckoutSession,
    handleWebhook,
    getPaymentBySessionId,
};
