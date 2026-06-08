import {
  dbCreateSubject,
  dbDeleteSubject,
  dbGetRecentSubjects,
  dbUpdateSubject,
  getSubjectById,
  getSubjectsByUserId,
} from "../db/queries/subjects.queries.js";
import type {
  UpdateSubjectInput,
  CreateSubjectInput,
} from "../schemas/subject.schema.js";
import { NotFoundError } from "../utils/errors.js";

//Create Subject
export async function createSubject(userId: number, input: CreateSubjectInput) {
  const subject = await dbCreateSubject(userId, input);
  return subject;
}

//Get Subjects
export async function getSubjects(userId: number) {
  const subjects = await getSubjectsByUserId(userId);
  if (!subjects) {
    throw new NotFoundError("No Subjects Created Yet!");
  }
  return subjects;
}

//Get Subject
export async function getSubject(subjectId: number, userId: number) {
  const subject = await getSubjectById(subjectId, userId);
  if (!subject) {
    throw new NotFoundError("Subject Not Found");
  }
  return subject;
}

//Update Subject
export async function updateSubject(
  subjectId: number,
  userId: number,
  input: UpdateSubjectInput,
) {
  const updated = await dbUpdateSubject(subjectId, userId, input);
  if (!updated) {
    throw new NotFoundError("Subject Not Found");
  }
  return updated;
}

//Delete Subject
export async function deleteSubject(subjectId: number, userId: number) {
  const deleted = await dbDeleteSubject(subjectId, userId);
  if (!deleted) {
    throw new NotFoundError("Subject Not Found");
  }
  return { message: "Subject Deleted Successfully" };
}

//Recent Subjects
export async function getRecentSubjects(userId: number, limit = 5) {
  const subjects = await dbGetRecentSubjects(userId, limit);
  if (!subjects) {
    throw new NotFoundError("No Subjects Created Yet!");
  }
  return subjects;
}