import { Subject } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSubject = async (payload: Subject): Promise<Subject> => {
    const subject = await prisma.subject.create({
        data: payload
    });
    return subject;
};

const getAllSubjects = async (): Promise<Subject[]> => {
    const subjects = await prisma.subject.findMany();
    return subjects;
};

const deleteSubject = async (id: string): Promise<Subject> => {
    return await prisma.$transaction(async (tx) => {
        // Delete dependent records first to avoid foreign key constraints
        await tx.tutorSubject.deleteMany({
            where: { subjectId: id }
        });
        
        const subject = await tx.subject.delete({
            where: { id }
        });
        
        return subject;
    });
};

export const SubjectService = {
    createSubject,
    getAllSubjects,
    deleteSubject
};
