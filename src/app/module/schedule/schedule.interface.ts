export interface ICreateSchedulePayload {
    startDate: string;
    endDate: string;
    startTime: string; // e.g. "08:00"
    endTime: string;   // e.g. "12:00"
}

export const scheduleSearchableFields = ["dayOfWeek"];
export const scheduleFilterableFields = ["startDate", "endDate"]; // custom filters
