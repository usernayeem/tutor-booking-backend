export interface IUpdateStudentPayload {
    bio?: string;
    contactNumber?: string;
    address?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
}
