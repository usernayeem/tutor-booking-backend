import { z } from "zod";

const registerStudentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

const loginUserSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
  password: z.string().min(1, "Password is required"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(1, "New password is required").min(6, "Password must be at least 6 characters"),
});

const verifyEmailSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
  otp: z.string().min(1, "OTP is required"),
});

const resetPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
  otp: z.string().min(1, "OTP is required"),
  newPassword: z.string().min(1, "New password is required").min(6, "Password must be at least 6 characters"),
});

export const AuthValidation = {
  registerStudentSchema,
  loginUserSchema,
  changePasswordSchema,
  verifyEmailSchema,
  resetPasswordSchema,
};
