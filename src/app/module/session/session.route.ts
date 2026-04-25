import PrismaPkg from '@prisma/client';
import { Router } from "express";
const { Role } = PrismaPkg;
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { SessionController } from "./session.controller.js";
import { SessionValidation } from "./session.validation.js";

const router = Router();

// Student books a new session
router.post(
    "/",
    checkAuth(Role.STUDENT),
    validateRequest(SessionValidation.createSessionValidationSchema),
    SessionController.createSession
);

// All roles can view sessions (service filters what they can see)
router.get(
    "/",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.STUDENT, Role.TUTOR),
    SessionController.getAllSessions
);

router.get(
    "/:id",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.STUDENT, Role.TUTOR),
    SessionController.getSessionById
);

// Admins and Tutors can update session status
router.patch(
    "/:id/status",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TUTOR),
    validateRequest(SessionValidation.updateSessionStatusValidationSchema),
    SessionController.updateSessionStatus
);

export const SessionRoutes = router;
