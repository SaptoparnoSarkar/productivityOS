import {
  dbCreateChecklistItem,
  dbDeleteChecklistItem,
  dbGetChecklistItemById,
  dbGetChecklistItemsByMilestoneId,
  dbUpdateChecklistItem,
} from "../db/queries/checklistItems.queries.js";
import { upsertDailyProgress } from "../db/queries/dailyprogress.queries.js";
import type {
  CreateChecklistItemsInput,
  UpdateChecklistItemsInput,
} from "../schemas/checklistItem.schema.js";
import { NotFoundError } from "../utils/errors.js";
import { awardXp } from "./xp.service.js";

//Create CheckList
export async function createChecklistItem(
  milestoneId: number,
  input: CreateChecklistItemsInput,
  userId: number,
) {
  const checklist = await dbCreateChecklistItem(
    milestoneId,
    input.label,
    userId,
  );
  if (!checklist) {
    throw new NotFoundError("Milestone Not Found");
  }

  return checklist;
}

//List Checklists by milestone id
export async function listChecklists(milestoneId: number, userId: number) {
  const checklists = await dbGetChecklistItemsByMilestoneId(
    milestoneId,
    userId,
  );
  return checklists;
}

//Update Checklist
export async function updateChecklistItem(
  itemId: number,
  userId: number,
  milestoneId: number,
  input: UpdateChecklistItemsInput,
) {
  // TODO: TRANSACTION NEEDED
  // Steps: fetch → dbUpdateChecklistItem → upsertDailyProgress → awardXp (per_tick) → awardXp (daily_completion)
  // are NOT atomic. A crash between any step leaves data partially written:
  //   - Checklist updated but no XP awarded
  //   - daily_progress upserted but XP write fails → justHitMinimum can re-fire on next call (double XP)
  // Wrap in a db transaction so all writes succeed together or all roll back.

  //Fetch
  const currentChecklist = await dbGetChecklistItemById(itemId, userId);
  if (!currentChecklist) throw new NotFoundError("Checklist Not Found");

  //Update
  const updatedChecklist = await dbUpdateChecklistItem(
    itemId,
    userId,
    milestoneId,
    input,
  );
  if (!updatedChecklist) throw new NotFoundError("Checklist Not Found");

  const today = new Date().toISOString().split("T")[0]!;

  let realDelta = 0;
  //To fix duplicate Postman calls.
  if (currentChecklist.is_done === false && updatedChecklist.is_done === true)
    realDelta = 1;
  if (currentChecklist.is_done === true && updatedChecklist.is_done === false)
    realDelta = -1;

  if (realDelta !== 0) {
    const row = await upsertDailyProgress(
      userId,
      updatedChecklist.milestone_id,
      today,
      realDelta,
    );

    //Per Tick XP reward
    const xp = realDelta * 5;
    await awardXp(
      userId,
      "per_tick",
      xp,
      currentChecklist.subject_id,
      milestoneId,
    );

    //This is for daily minimum xp reward fires once.
    const dailyMinumum = currentChecklist.daily_minimum;
    const after = row.progress;
    const before = after - realDelta;

    const wasBelowMinimum = before < dailyMinumum;
    const isNowAtOrAboveMinimum = after >= dailyMinumum;
    const justHitMinimum = wasBelowMinimum && isNowAtOrAboveMinimum;
    if (justHitMinimum)
      await awardXp(
        userId,
        "daily_completion",
        100,
        currentChecklist.subject_id,
        milestoneId,
      );
  }

  return updatedChecklist;
}

//Delete Checklist
export async function deleteChecklist(
  itemId: number,
  userId: number,
  milestoneId: number,
) {
  const deleted = await dbDeleteChecklistItem(itemId, userId, milestoneId);
  if (!deleted) {
    throw new NotFoundError("Checklist Not Found");
  }
  return { message: "Checklist Deleted Successfully" };
}
