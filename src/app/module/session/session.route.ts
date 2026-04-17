import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { SessionController } from "./session.controller";
import { SessionValidation } from "./session.validation";

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
