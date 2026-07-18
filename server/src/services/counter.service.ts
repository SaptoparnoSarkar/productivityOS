import {
  dbCreateCounter,
  dbGetCounterByMilestoneId,
  dbIncrementCounter,
  dbResetCounter,
  dbUpdateCounter,
} from "../db/queries/counters.queries.js";
import { upsertDailyProgress } from "../db/queries/dailyprogress.queries.js";
import type {
  CreateCounterInput,
  UpdateCounterInput,
} from "../schemas/counter.schema.js";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../utils/errors.js";
import { awardXp } from "./xp.service.js";

//create counter
export async function createCounter(
  milestoneId: number,
  userId: number,
  input: CreateCounterInput,
) {
  try {
    const counter = await dbCreateCounter(milestoneId, userId, input);
    if (!counter) {
      throw new NotFoundError("Milestone Not Found");
    }
    return counter;
  } catch (error: any) {
    //Postgres unique_violation error code cleanup.
    console.log("full err:", error);
    if (error.code === "23505")
      throw new ConflictError("Counter already exsists for this milestone");
    throw error;
  }
}

//get counter
export async function getCounter(milestoneId: number, userId: number) {
  const counter = await dbGetCounterByMilestoneId(milestoneId, userId);
  if (!counter) {
    throw new NotFoundError("Counter Not Found");
  }
  return counter;
}

//update counter
export async function updateCounter(
  milestoneId: number,
  userId: number,
  input: UpdateCounterInput,
) {
  const updatedCounter = await dbUpdateCounter(milestoneId, userId, input);
  if (!updatedCounter) {
    throw new NotFoundError("Counter Not Found");
  }
  return updatedCounter;
}

//increment counter
export async function incrementCounter(
  milestoneId: number,
  userId: number,
  delta: number,
) {
  // fetch
  const currentCounter = await dbGetCounterByMilestoneId(milestoneId, userId);
  if (!currentCounter) {
    throw new NotFoundError("Counter not found");
  }
  // Guard to protect going below 0
  if (currentCounter.current_value + delta < 0) {
    throw new ValidationError("Counter cannot go below zero");
  }
  // update value
  const updatedCounter = await dbIncrementCounter(milestoneId, userId, delta);

  //Reward what really happended, not what was requested. (This is for when increment of zero)
  const realDelta = updatedCounter.current_value - currentCounter.current_value;

  if (realDelta !== 0) {
    const today = new Date().toISOString().split("T")[0]!; //! I know it returns undefined but it never will
    const row = await upsertDailyProgress(userId, milestoneId, today, delta);

    //per-tick/per-increment XP
    const xp = realDelta * 5;
    await awardXp(
      userId,
      "per_tick",
      xp,
      currentCounter.subject_id,
      milestoneId,
    );

    //Daily's XP fires once.
    const dailyMinimum = currentCounter.daily_minimum; //Fetch the daily min from milestones
    const after = row.progress;
    const before = after - delta;

    const wasBelowMinimum = before < dailyMinimum;
    const isNowAtOrAboveMinimum = after >= dailyMinimum;
    const justHitMinimum = wasBelowMinimum && isNowAtOrAboveMinimum;
    if (justHitMinimum)
      await awardXp(
        userId,
        "daily_completion",
        100,
        currentCounter.subject_id,
        milestoneId,
      );
    console.log({
      dailyMinimum: currentCounter.daily_minimum,
      before,
      after,
      justHitMinimum,
    });
  }

  return updatedCounter;
  // TODO: TRANSACTION NEEDED
  // Steps: fetch → dbUpdateChecklistItem → upsertDailyProgress → awardXp (per_tick) → awardXp (daily_completion)
  // are NOT atomic. A crash between any step leaves data partially written:
  //   - Checklist updated but no XP awarded
  //   - daily_progress upserted but XP write fails → justHitMinimum can re-fire on next call (double XP)
  // Wrap in a db transaction so all writes succeed together or all roll back.
}

//reset counter
export async function resetCounter(milestoneId: number, userId: number) {
  const reset = await dbResetCounter(milestoneId, userId);
  if (!reset) {
    throw new NotFoundError("Counter not found");
  }
  return reset;
}
