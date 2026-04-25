import type { Role } from '@prisma/client';

// Shape of the authenticated user object attached to req.user by checkAuth middleware
export interface IRequestUser {
    id: string;
    userId: string;
    role: Role;
    email: string;
}
