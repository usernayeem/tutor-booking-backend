import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";

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
