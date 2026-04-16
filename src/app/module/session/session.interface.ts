export interface ICreateSessionPayload {
    tutorId: string;
    scheduleId: string;
}

export interface IUpdateSessionStatusPayload {
    status: "SCHEDULED" | "COMPLETED" | "CANCELED";
}

export const sessionSearchableFields = ["id", "status", "paymentStatus"];
export const sessionFilterableFields = ["status", "paymentStatus", "tutorId", "studentId"];
