import {
  dbGetShowcaseById,
  dbListShowcase,
  dbPromoteSubject,
} from "../db/queries/showcase.queries.js";
import { ConflictError, NotFoundError } from "../utils/errors.js";

type PromoteResult =
  | { ok: true; entry: any }
  | {
      ok: false;
      reason:
        | "not_found"
        | "subject_not_found"
        | "no_milestone"
        | "aready_promoted";
    };

export async function promoteSubject(
  userId: number,
  subjectId: number,
): Promise<PromoteResult> {
  const result = await dbPromoteSubject(userId, subjectId);
  if (result.ok) return result.entry;

  if (result.reason === "not_found") {
    throw new NotFoundError("Subject Not Found");
  }

  if (result.reason === "subject_not_completed") {
    throw new ConflictError("Complete the subject first");
  }

  if (result.reason === "no_milestone") {
    throw new ConflictError("Subject must contain atleast one milestone");
  }

  if (result.reason === "already_promoted") {
    throw new ConflictError("Subject Already Promoted");
  }

  throw new Error("Unknown promote failure");
}

export async function listShowcase(userId: number) {
  return await dbListShowcase(userId);
}

export async function getShowcaseById(showcaseId: number, userId: number) {
  const showcase = await dbGetShowcaseById(showcaseId, userId);
  if (!showcase) {
    throw new NotFoundError("Showcase not found");
  }
  return showcase;
}
