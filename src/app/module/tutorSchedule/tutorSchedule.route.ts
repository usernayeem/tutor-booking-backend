import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { TutorScheduleController } from "./tutorSchedule.controller";
import { TutorScheduleValidation } from "./tutorSchedule.validation";

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
