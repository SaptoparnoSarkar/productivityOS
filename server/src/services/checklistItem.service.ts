import {
  dbCreateChecklistItem,
  dbDeleteChecklistItem,
  dbGetChecklistItemsByMilestoneId,
  dbUpdateChecklistItem,
} from "../db/queries/checklistItems.queries.js";
import { upsertDailyProgress } from "../db/queries/xp.queries.js";
import type { UpdateChecklistInputType } from "../schemas/checklistItem.schema.js";
import { NotFoundError } from "../utils/errors.js";

//Create CheckList
export async function createChecklist(
  milestoneId: number,
  label: string,
  userId: number,
) {
  const checklist = await dbCreateChecklistItem(milestoneId, label, userId);
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
export async function updateChecklist(
  itemId: number,
  userId: number,
  input: UpdateChecklistInputType,
) {
  const updated = await dbUpdateChecklistItem(itemId, userId, input);
  if (!updated) {
    throw new NotFoundError("Checklist Not Found");
  }
  const today = new Date().toISOString().split("T")[0]!;
  if (updated.done === true) {
    upsertDailyProgress(userId, updated.milestoneId, today, +1);
  }
  else {
    upsertDailyProgress(userId, updated.milestoneId, today, -1)
  }

  return updated;
}

//Delete Checklist
export async function deleteChecklist(itemId: number, userId: number) {
  const deleted = await dbDeleteChecklistItem(itemId, userId);
  if (!deleted) {
    throw new NotFoundError("Checklist Not Found");
  }
  return { message: "Checklist Deleted Successfully" };
}
