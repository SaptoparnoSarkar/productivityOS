import {
  dbCreateMilestone,
  dbDeleteMilestone,
  dbGetAllMilestones,
  dbGetMilestoneById,
  dbGetMilestonesBySubjectId,
  dbRecentMilestones,
  dbSetMilestoneActive,
  dbUpdateMilestone,
} from "../db/queries/milestones.queries.js";
import type {
  CreateMilestoneInput,
  UpdateMilestoneInput,
} from "../schemas/milestone.schema.js";
import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "../utils/errors.js";

//Create a Milestone
export async function createMilestone(
  subjectId: number,
  userId: number,
  input: CreateMilestoneInput,
) {
  const milestone = await dbCreateMilestone(subjectId, userId, input);
  if (!milestone) {
    throw new NotFoundError("Subject Not Found");
  }
  return milestone;
}

//List Milestones from SubjectId
export async function listMilestones(subjectId: number, userId: number) {
  return await dbGetMilestonesBySubjectId(subjectId, userId);
}

//Get Milestone by Id
export async function getMilestone(milestoneId: number, userId: number) {
  const milestone = await dbGetMilestoneById(milestoneId, userId);
  if (!milestone) {
    throw new NotFoundError("Milestone Not Found");
  }
  return milestone;
}

//Update Milestone
export async function updateMilestone(
  milestoneId: number,
  subjectId: number,
  userId: number,
  input: UpdateMilestoneInput,
) {
  //Defensive Check
  if (Object.keys(input).length === 0) {
    throw new ValidationError("At least one field must be provided");
  }

  const updated = await dbUpdateMilestone(
    milestoneId,
    subjectId,
    userId,
    input,
  );

  if (!updated) {
    throw new NotFoundError("Milestone Not Found");
  }

  return updated;
}

//Delete Milestone
export async function deleteMilestone(
  milestoneId: number,
  subjectId: number,
  userId: number,
) {
  const deleted = await dbDeleteMilestone(milestoneId, subjectId, userId);
  if (!deleted) {
    throw new NotFoundError("Milestone Not Found");
  }
  return { message: "Milestone Deleted Successfully" };
}

//Recent Milestones
export async function recentMilestones(userId: number, limit = 5) {
  const milestones = await dbRecentMilestones(userId, limit);
  if (!milestones) {
    throw new NotFoundError("No Recent Milestones");
  }
  return milestones;
}

// isActive Milestones
export async function setMilestoneActive(
  milestoneId: number,
  userId: number,
  isActive: boolean,
) {
  const updated = await dbSetMilestoneActive(milestoneId, userId, isActive);
  // Happy Path
  if (updated) {
    return updated;
  }
  // Null Path. no row updated.
  else {
    // Check Ownership first
    const milestone = await getMilestone(milestoneId, userId);
    if (!milestone) {
      throw new NotFoundError("Milestone not found");
    }
    //Now tell the user why
    if (isActive) {
      throw new ConflictError("Max 5 active milestones");
    } else {
      throw new ConflictError("At least 1 milestone must stay active");
    }
  }
}

//Get All Milestones
export async function getAllMilestones(userId: number) {
  const milestones = await dbGetAllMilestones(userId);
  if (!milestones) {
    throw new NotFoundError("No milestones founds.");
  }
  return milestones;
}
