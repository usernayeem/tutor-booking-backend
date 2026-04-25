import PrismaPkg from '@prisma/client';
import { Router } from "express";
const { Role } = PrismaPkg;
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { ScheduleController } from "./schedule.controller.js";
import { ScheduleValidation } from "./schedule.validation.js";

const router = Router();

// Only Super Admin and Admin can manage raw schedules
router.post(
    "/",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    validateRequest(ScheduleValidation.createScheduleValidationSchema),
    ScheduleController.createSchedules
);

router.get(
    "/",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TUTOR), // tutors might need to view available schedules
    ScheduleController.getAllSchedules
);

router.delete(
    "/:id",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    ScheduleController.deleteSchedule
);

export const ScheduleRoutes = router;
