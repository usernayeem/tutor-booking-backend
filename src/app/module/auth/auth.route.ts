import PrismaPkg from '@prisma/client';
import { Router } from "express";
const { Role } = PrismaPkg;
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { AuthController } from "./auth.controller.js";
import { AuthValidation } from "./auth.validation.js";

const router = Router();

router.post(
    "/register",
    validateRequest(AuthValidation.registerStudentSchema),
    AuthController.registerStudent
);

router.post(
    "/login",
    validateRequest(AuthValidation.loginUserSchema),
    AuthController.loginUser
);

router.get(
    "/me",
    checkAuth(Role.ADMIN, Role.TUTOR, Role.STUDENT, Role.SUPER_ADMIN),
    AuthController.getMe
);

router.post(
    "/refresh-token",
    AuthController.getNewToken
);

router.post(
    "/change-password",
    checkAuth(Role.ADMIN, Role.TUTOR, Role.STUDENT, Role.SUPER_ADMIN),
    validateRequest(AuthValidation.changePasswordSchema),
    AuthController.changePassword
);

router.post(
    "/logout",
    checkAuth(Role.ADMIN, Role.TUTOR, Role.STUDENT, Role.SUPER_ADMIN),
    AuthController.logoutUser
);

router.post(
    "/verify-email",
    validateRequest(AuthValidation.verifyEmailSchema),
    AuthController.verifyEmail
);

router.post(
    "/forget-password",
    AuthController.forgetPassword
);

router.post(
    "/reset-password",
    validateRequest(AuthValidation.resetPasswordSchema),
    AuthController.resetPassword
);

// OAuth routes
router.get("/login/google", AuthController.googleLogin);
router.get("/google/success", AuthController.googleLoginSuccess);
router.get("/oauth/error", AuthController.handleOAuthError);

export const AuthRoutes = router;
