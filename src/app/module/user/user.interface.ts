export interface ICreateTutorPayload {
    password?: string;
    tutor: {
        name: string;
        email: string;
        contactNumber?: string;
        hourlyRate?: number;
        experience?: number;
        qualification?: string;
    };
    subjectIds: string[];
}

export interface ICreateAdminPayload {
    password?: string;
    admin: {
        name: string;
        email: string;
    };
}
