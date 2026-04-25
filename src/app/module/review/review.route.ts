import PrismaPkg from '@prisma/client';
import { Router } from "express";
const { Role } = PrismaPkg;
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { ReviewController } from "./review.controller.js";
import { ReviewValidation } from "./review.validation.js";

const router = Router();

router.post(
    "/",
    checkAuth(Role.STUDENT),
    validateRequest(ReviewValidation.createReviewZodSchema),
    ReviewController.createReview
);

router.get(
    "/:tutorId",
    ReviewController.getTutorReviews
);

export const ReviewRoutes = router;
