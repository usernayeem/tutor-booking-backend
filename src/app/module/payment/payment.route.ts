import PrismaPkg from '@prisma/client';
import { Router } from "express";
const { Role } = PrismaPkg;
import { checkAuth } from "../../middleware/checkAuth.js";
import { PaymentController } from "./payment.controller.js";

const router = Router();

// Endpoint for student to initiate payment for a given session
router.post(
    "/create-checkout-session",
    checkAuth(Role.STUDENT),
    PaymentController.createCheckoutSession
);

// Stripe webhook (must be public usually to receive Stripe callbacks)
router.post(
    "/webhook",
    PaymentController.handleWebhook
);

// Get payment info for a specific session
router.get(
    "/:id",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TUTOR, Role.STUDENT),
    PaymentController.getPaymentBySessionId
);

export const PaymentRoutes = router;
