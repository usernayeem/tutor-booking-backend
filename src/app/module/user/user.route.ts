import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import { createAdminValidationSchema, createTutorValidationSchema } from "./user.validation";

const router = Router();

// Only Super Admin and Admin can create tutors
router.post(
    "/create-tutor",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    validateRequest(createTutorValidationSchema),
    UserController.createTutor
);

// Only Super Admin can create other admins
router.post(
    "/create-admin",
    checkAuth(Role.SUPER_ADMIN),
    validateRequest(createAdminValidationSchema),
    UserController.createAdmin
);

export const UserRoutes = router;
