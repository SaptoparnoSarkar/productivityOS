import { dbCreateSubject, dbDeleteSubject, dbUpdateSubject, getSubjectById, getSubjectsByUserId } from "../db/queries/subjects.queries.js"
import type { UpdateSubjectInput, CreateSubjectInput } from "../schemas/subject.schema.js";

//Create Subject
export async function createSubject(userId: number, input: CreateSubjectInput) {
    const subject = await dbCreateSubject(userId, input.type, input.title, input.description, input.has_pomodoro, input.daily_minimum, input.daily_minimum_unit, input.weekly_minimum)
    return subject;
}

//Get Subjects
export async function getSubjects(user_id: number) {
    const subjects = await getSubjectsByUserId(user_id)
    return subjects;
}


//Get Subject
export async function getSubject(subjectId: number, user_id: number) {
    const subject = await getSubjectById(subjectId, user_id);
    if (!subject) {
        throw new Error('Subject Not Found')
    }
    return subject;
}


//Update Subject
export async function updateSubject(subjectId: number, user_id: number, input: UpdateSubjectInput) {
    const subject = await getSubjectById(subjectId, user_id)
    if (!subject) {
        throw new Error('Subject Not Found')
    }
    await dbUpdateSubject(subjectId, user_id, input)
    return subject;
}


//Delete Subject
export async function deleteSubject(subjectId: number, user_id: number) {
    const subject = await getSubjectById(subjectId, user_id);
    if (!subject) {
        throw new Error('Subject Not Found')
    }
    await dbDeleteSubject(subjectId, user_id)
    return { message: 'Subject Deleted Successfully' }
}