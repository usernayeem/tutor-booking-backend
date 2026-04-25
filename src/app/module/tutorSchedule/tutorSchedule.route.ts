import PrismaPkg from '@prisma/client';
import { Router } from "express";
const { Role } = PrismaPkg;
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { TutorScheduleController } from "./tutorSchedule.controller.js";
import { TutorScheduleValidation } from "./tutorSchedule.validation.js";

const router = Router();

router.post(
    "/",
    checkAuth(Role.TUTOR),
    validateRequest(TutorScheduleValidation.createTutorScheduleValidationSchema),
    TutorScheduleController.createTutorSchedules
);

router.get(
    "/",
    checkAuth(Role.TUTOR),
    TutorScheduleController.getMySchedules
);

router.delete(
    "/:id",
    checkAuth(Role.TUTOR),
    TutorScheduleController.deleteTutorSchedule
);

export const TutorScheduleRoutes = router;
