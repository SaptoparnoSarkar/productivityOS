import {
  dbCompleteSubjectWithXp,
  dbCreateSubject,
  dbDeleteSubject,
  dbDueSubjects,
  dbGetMilestoneStats,
  dbUpdateSubject,
  getSubjectById,
  getSubjectsByUserId,
} from "../db/queries/subjects.queries.js";
import type {
  UpdateSubjectInput,
  CreateSubjectInput,
} from "../schemas/subject.schema.js";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../utils/errors.js";

//Create Subject
export async function createSubject(userId: number, input: CreateSubjectInput) {
  if (input.due_date && new Date(input.due_date) < new Date()) {
    throw new ValidationError("Due date cannot be in the past");
  }
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
  const milestoneStats = await dbGetMilestoneStats(subjectId, userId);
  return {
    subject,
    stats: { total: milestoneStats.total, done: milestoneStats.done },
  };
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
  if (input.due_date && new Date(input.due_date) < new Date()) {
    throw new ValidationError("Due date cannot be in the past");
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

//Upcoming Subjects
export async function upcomingSubjects(userId: number, limit = 5) {
  const due = await dbDueSubjects(userId, limit);
  return due;
}

//Mark Subject Complete
export async function markSubjectComplete(userId: number, subjectId: number) {
  const subject = await getSubjectById(subjectId, userId);
  if (!subject) throw new NotFoundError("Subject Not Found");

  if (subject.status === "completed") {
    throw new ValidationError("Subject already completed");
  }

  const { total, done } = await dbGetMilestoneStats(subjectId, userId);

  if (total === 0) {
    throw new ConflictError("Create and complete at least 1 milestone.");
  }
  if (done < total) {
    throw new ConflictError(`${done}/${total} milestones complete.`);
  }
  return await dbCompleteSubjectWithXp(userId, subjectId, 500);
}
