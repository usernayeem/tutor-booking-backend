import PrismaPkg from '@prisma/client';
import { Router } from "express";
const { Role } = PrismaPkg;
import { multerUpload } from "../../config/multer.config.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { SubjectController } from "./subject.controller.js";
import { SubjectValidation } from "./subject.validation.js";

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
