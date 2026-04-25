import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { StudentController } from "./student.controller";
import { updateStudentZodSchema } from "./student.validation";

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

