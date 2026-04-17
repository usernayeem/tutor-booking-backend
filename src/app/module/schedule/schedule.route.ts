import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ScheduleController } from "./schedule.controller";
import { ScheduleValidation } from "./schedule.validation";

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
