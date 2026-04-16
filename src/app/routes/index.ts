import express from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import { StudentRoutes } from "../module/student/student.route";
import { SubjectRoutes } from "../module/subject/subject.route";
import { UserRoutes } from "../module/user/user.route";

import { ScheduleRoutes } from "../module/schedule/schedule.route";
import { TutorRoutes } from "../module/tutor/tutor.route";

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
    {
        path: "/subjects",
        route: SubjectRoutes,
    },
    {
        path: "/tutors",
        route: TutorRoutes,
    },
    {
        path: "/schedules",
        route: ScheduleRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export const IndexRoutes = router;
