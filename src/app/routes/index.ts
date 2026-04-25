import express from "express";
import { AuthRoutes } from "../module/auth/auth.route.js";
import { StudentRoutes } from "../module/student/student.route.js";
import { SubjectRoutes } from "../module/subject/subject.route.js";
import { UserRoutes } from "../module/user/user.route.js";
import { PaymentRoutes } from "../module/payment/payment.route.js";
import { ScheduleRoutes } from "../module/schedule/schedule.route.js";
import { SessionRoutes } from "../module/session/session.route.js";
import { TutorRoutes } from "../module/tutor/tutor.route.js";
import { TutorScheduleRoutes } from "../module/tutorSchedule/tutorSchedule.route.js";
import { ReviewRoutes } from "../module/review/review.route.js";
import { AdminRoutes } from "../module/admin/admin.route.js";

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
    {
        path: "/tutor-schedules",
        route: TutorScheduleRoutes,
    },
    {
        path: "/sessions",
        route: SessionRoutes,
    },
    {
        path: "/payment",
        route: PaymentRoutes,
    },
    {
        path: "/reviews",
        route: ReviewRoutes,
    },
    {
        path: "/admin",
        route: AdminRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export const IndexRoutes = router;
