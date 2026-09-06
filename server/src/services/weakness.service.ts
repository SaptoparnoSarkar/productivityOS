import { getSubjectById } from "../db/queries/subjects.queries.js";
import {
  dbCreateWeakness,
  dbCreateWeaknessNote,
  dbDeleteWeakness,
  dbDeleteWeaknessNotes,
  dbGetWeaknessById,
  dbGetWeaknesses,
  dbGetWeaknessNotes,
  dbUpdateWeakness,
} from "../db/queries/weakness.queries.js";
import type {
  CreateWeaknessInput,
  CreateWeaknessNoteInput,
  UpdateWeaknessInput,
} from "../schemas/weakness.schema.js";
import { NotFoundError } from "../utils/errors.js";

export async function createWeakness(
  userId: number,
  input: CreateWeaknessInput,
) {
  if (input.subject_id) {
    const subject = await getSubjectById(input.subject_id, userId);
    if (!subject) {
      throw new NotFoundError("Subject Not Found");
    }
  }
  return await dbCreateWeakness(userId, input);
}

export async function getWeaknesses(
  userId: number,
  status?: "active" | "resolved",
  limit?: number,
) {
  return await dbGetWeaknesses(userId, status, limit);
}

export async function getWeaknessById(weaknessId: number, userId: number) {
  const weakness = await dbGetWeaknessById(weaknessId, userId);
  if (!weakness) {
    throw new NotFoundError("Weakness Not Found");
  }
  return weakness;
}

export async function updateWeakness(
  weaknessId: number,
  userId: number,
  input: UpdateWeaknessInput,
) {
  const updated = await dbUpdateWeakness(weaknessId, userId, input);
  if (!updated) {
    throw new NotFoundError("Weakness Not Found");
  }
  return updated;
}

export async function deleteWeakness(weaknessId: number, userId: number) {
  const deleted = await dbDeleteWeakness(weaknessId, userId);
  if (!deleted) {
    throw new NotFoundError("Weakness Not Found");
  }
  return { message: "Weakness Deleted Successfully" };
}

export async function addWeaknessNote(
  weaknessId: number,
  userId: number,
  input: CreateWeaknessNoteInput,
) {
  const weaknessNote = await dbCreateWeaknessNote(weaknessId, userId, input);
  if (!weaknessNote) {
    throw new NotFoundError("Weakness Not Found");
  }
  return weaknessNote;
}

export async function getWeaknessNotes(weaknessId: number, userId: number) {
  await getWeaknessById(weaknessId, userId);
  await dbGetWeaknessNotes(weaknessId, userId);
}

export async function deleteWeaknessNotes(weaknessId: number, userId: number) {
  await getWeaknessById(weaknessId, userId);
  await dbDeleteWeaknessNotes(weaknessId, userId);
  return { message: "Weakness Note Deleted Successfully" };
}
