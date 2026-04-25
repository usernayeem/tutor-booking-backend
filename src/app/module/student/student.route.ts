import PrismaPkg from '@prisma/client';
import { Router } from "express";
const { Role } = PrismaPkg;
import { multerUpload } from "../../config/multer.config.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { StudentController } from "./student.controller.js";
import { updateStudentZodSchema } from "./student.validation.js";

const router = Router();

router.get("/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.TUTOR),
    StudentController.getAllStudents
);

router.get("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.TUTOR, Role.STUDENT),
    StudentController.getStudentById
);

// Supports optional profile photo upload via multipart/form-data
router.patch("/:id",
    checkAuth(Role.STUDENT, Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"),
    validateRequest(updateStudentZodSchema),
    StudentController.updateStudent
);

router.delete("/:id",
    checkAuth(Role.STUDENT, Role.ADMIN, Role.SUPER_ADMIN),
    StudentController.deleteStudent
);

export const StudentRoutes = router;

