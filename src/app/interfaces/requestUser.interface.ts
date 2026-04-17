import { Role } from "../../generated/prisma/client";

// Shape of the authenticated user object attached to req.user by checkAuth middleware
export interface IRequestUser {
    userId: string;
    role: Role;
    email: string;
}
