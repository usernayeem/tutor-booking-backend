import PrismaPkg from '@prisma/client';
import { Router } from "express";
const { Role } = PrismaPkg;
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { AdminController } from "./admin.controller.js";
import { AdminValidation } from "./admin.validation.js";

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
