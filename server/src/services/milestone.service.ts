import { pool } from "../config/db.js";
import { dbSetChecklistTarget } from "../db/queries/checklist.queries.js";
import { dbCreateChecklistItem } from "../db/queries/checklistItems.queries.js";
import { dbCreateCounter } from "../db/queries/counters.queries.js";
import {
  dbCreateInitialGoalVersion,
  dbCreateMilestone,
  dbDeleteMilestone,
  dbGetAllMilestones,
  dbGetLatestGoalVersion,
  dbGetMilestoneById,
  dbGetMilestonesWithProgress,
  dbGetPendingGoalVersion,
  dbRecentMilestones,
  dbSetMilestoneActive,
  dbUpdateMilestone,
  dbUpsertPendingGoalVersion,
} from "../db/queries/milestones.queries.js";
import type {
  CreateMilestoneInput,
  UpdateMilestoneInput,
} from "../schemas/milestone.schema.js";
import type { MilestoneCreationInput } from "../schemas/milestoneCreation.schema.js";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../utils/errors.js";

// //Create a Milestone
// export async function createMilestone(
//   subjectId: number,
//   userId: number,
//   input: CreateMilestoneInput,
// ) {
//   const milestone = await dbCreateMilestone(subjectId, userId, input);
//   if (!milestone) {
//     throw new NotFoundError("Subject Not Found");
//   }
//   return milestone;
// }

// Updated it to createMilestoneWithSetup below

//List Milestones from SubjectId
export async function listMilestones(subjectId: number, userId: number) {
  return await dbGetMilestonesWithProgress(subjectId, userId);
}

//Get Milestone by Id
export async function getMilestone(milestoneId: number, userId: number) {
  const milestone = await dbGetMilestoneById(milestoneId, userId);
  if (!milestone) {
    throw new NotFoundError("Milestone Not Found");
  }
  const pendingGoals = await dbGetPendingGoalVersion(milestoneId, userId);
  return { milestone, pendingGoals };
}

//Update Milestone
export async function updateMilestone(
  milestoneId: number,
  subjectId: number,
  userId: number,
  input: UpdateMilestoneInput,
) {

  const {daily_minimum, daily_minimum_unit, weekly_minimum, ...otherFields} = input;
  
  //Shape of complete goal set
  type Goals = { daily_minimum: number | null, daily_minimum_unit: string | null, weekly_minimum: number | null };
  // Same Shape with every key optional. Cuz the user might update one without the others.
  const goalFields : Partial<Goals> = {} //The {} starts goalFields as an empty object, the ifs fill it in.

  if(daily_minimum !== undefined) goalFields.daily_minimum = daily_minimum;
  if(daily_minimum_unit !== undefined) goalFields.daily_minimum_unit = daily_minimum_unit;
  if(weekly_minimum !== undefined) goalFields.weekly_minimum = weekly_minimum;

  //object.keys(obj) returns an array of key names.
  const hasGoals = Object.keys(goalFields).length > 0; //weekly,daily
  const hasOther = Object.keys(otherFields).length > 0; //title,description
  if(!hasGoals && !hasOther) throw new ValidationError("At least one field must be provided")

  const client = await pool.connect();
  try {
    await client.query('BEGIN')
    let milestone = null;

    if(hasOther) {
      milestone = await dbUpdateMilestone(milestoneId, subjectId, userId, otherFields, client);
       if(!milestone) throw new NotFoundError("Milestone not found")
    }
  let pendingGoals = null;
  if (hasGoals) {

    const base = await dbGetLatestGoalVersion(milestoneId, userId, client);
    if(!base) throw new NotFoundError("Milestone Not Found");
    //We need this cuz upsert writes all 3 columns, Without the merge: if the user only changes the weekly_minimum, the others would be set to NULL
    const merged: Goals = {
      daily_minimum: base.daily_minimum,
      daily_minimum_unit: base.daily_minimum_unit,
      weekly_minimum: base.weekly_minimum,
      ...goalFields //This does the overwriting(overwrite only what the user changed from the base)
    }  

    if ((merged.daily_minimum == null) !== (merged.daily_minimum_unit == null)) {
      throw new ValidationError("Daily minimum and unit must be provided together");
    }
    if (merged.weekly_minimum != null && merged.daily_minimum == null){ 
      throw new ValidationError("Weekly Minimum requires a daily minimum")
    }
    pendingGoals = await dbUpsertPendingGoalVersion(milestoneId,userId,merged,client)
    if(!pendingGoals) throw new NotFoundError("Milestone Not Found")
  }

  if (!milestone) milestone = await dbGetMilestoneById(milestoneId,userId,client)

   await client.query('COMMIT');
   return {milestone, pendingGoals}

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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
  if (updated) return updated;
  // Null Path. no row updated.
  else {
    // Check Ownership first
    const milestone = await getMilestone(milestoneId, userId);
    if (!milestone) {
      throw new NotFoundError("Milestone not found");
    }
    //Now tell the user why
    if (isActive) {
      if (milestone.milestone.subject_status !== "pending") {
        throw new ConflictError(
          "Cannot activate a milestone in a completed subject",
        );
      }
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

// Its job is to coordinate the existing query functions using one shared transaction client
export async function createMilestoneWithSetup(subjectId: number, userId: number, input: MilestoneCreationInput) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const milestone = await dbCreateMilestone(subjectId, userId, input.milestone, client);
    if (!milestone) {
      throw new NotFoundError("Subject not found or inaccessible");
    }
    const milestoneId = milestone.id;
    const goalVersion = await dbCreateInitialGoalVersion(milestoneId,userId,input.milestone,client)
    if(!goalVersion) {
      throw new Error('Failed to create initial goal version.')
    }

    const setup = input.setup;

    if ("target_count" in setup) {
      // Only checklist shape has target_count property
      const checklistTarget = await dbSetChecklistTarget(milestoneId, userId, setup.target_count, client)
      const checklistItem = await dbCreateChecklistItem(milestoneId, userId, setup.label, client)
      if (!checklistTarget || !checklistItem) {
        throw new NotFoundError("Failed to create checklist setup");
      }
    } else {
      const counter = await dbCreateCounter(milestoneId, userId, setup, client)
      if (!counter) {
        throw new NotFoundError("Failed to create counter setup");
      }
    }
    await client.query("COMMIT");
    return milestone;

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}