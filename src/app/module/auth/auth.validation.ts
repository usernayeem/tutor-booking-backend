import z from "zod";

const registerStudentSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
  password: z.string({ required_error: "Password is required" }).min(6, "Password must be at least 6 characters"),
});

const loginUserSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  password: z.string({ required_error: "Password is required" }),
});

const changePasswordSchema = z.object({
  currentPassword: z.string({ required_error: "Current password is required" }),
  newPassword: z.string({ required_error: "New password is required" }).min(6, "Password must be at least 6 characters"),
});

const verifyEmailSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  otp: z.string({ required_error: "OTP is required" }),
});

const resetPasswordSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  otp: z.string({ required_error: "OTP is required" }),
  newPassword: z.string({ required_error: "New password is required" }).min(6, "Password must be at least 6 characters"),
});

export const AuthValidation = {
  registerStudentSchema,
  loginUserSchema,
  changePasswordSchema,
  verifyEmailSchema,
  resetPasswordSchema,
};
