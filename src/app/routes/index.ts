import express from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import { StudentRoutes } from "../module/student/student.route";
import { SubjectRoutes } from "../module/subject/subject.route";
import { UserRoutes } from "../module/user/user.route";
import { PaymentRoutes } from "../module/payment/payment.route";
import { ScheduleRoutes } from "../module/schedule/schedule.route";
import { SessionRoutes } from "../module/session/session.route";
import { TutorRoutes } from "../module/tutor/tutor.route";
import { TutorScheduleRoutes } from "../module/tutorSchedule/tutorSchedule.route";
import { ReviewRoutes } from "../module/review/review.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export const IndexRoutes = router;
