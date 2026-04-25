import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { TutorController } from "./tutor.controller";
import { TutorValidation } from "./tutor.validation";

const router = Router();

// Public route to get tutors (supports filtering and searching)
router.get("/", TutorController.getAllTutors);

// Public route to get a specific tutor by ID
router.get("/:id", TutorController.getTutorById);

// Admin or Tutor can update tutor profile (supports optional profile photo upload)
router.patch(
    "/:id",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TUTOR),
    multerUpload.single("file"),
    validateRequest(TutorValidation.updateTutorValidationSchema),
    TutorController.updateTutor
);

// Only Admin or Super Admin can soft-delete a tutor
router.delete(
    "/:id",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    TutorController.deleteTutor
);

export const TutorRoutes = router;
