import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { SubjectController } from "./subject.controller";
import { SubjectValidation } from "./subject.validation";

const router = Router();

router.post('/', 
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    multerUpload.single("file"), 
    validateRequest(SubjectValidation.createSubjectZodSchema),
    SubjectController.createSubject
);

router.get('/', SubjectController.getAllSubjects);

router.delete('/:id', 
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    SubjectController.deleteSubject
);

export const SubjectRoutes = router;
