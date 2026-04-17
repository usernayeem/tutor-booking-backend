import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AdminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";

const router = Router();

// Dashboard Stats
router.get(
    "/stats",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    AdminController.getDashboardStats
);

// Get all users
router.get(
    "/users",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    AdminController.getAllUsers
);

// Update user status
router.patch(
    "/users/:id/status",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    validateRequest(AdminValidation.updateUserStatusZodSchema),
    AdminController.updateUserStatus
);

export const AdminRoutes = router;
