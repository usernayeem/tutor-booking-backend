import express from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import { StudentRoutes } from "../module/student/student.route";
import { UserRoutes } from "../module/user/user.route";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/users",
        route: UserRoutes,
    },
    {
        path: "/students",
        route: StudentRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export const IndexRoutes = router;
