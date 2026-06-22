import {
  dbCreateCounter,
  dbGetCounterByMilestoneId,
  dbIncrementCounter,
  dbResetCounter,
  dbUpdateCounter,
} from "../db/queries/counters.queries.js";
import { upsertDailyProgress } from "../db/queries/xp.queries.js";
import type {
  CreateCounterInput,
  UpdateCounterInput,
} from "../schemas/counter.schema.js";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../utils/errors.js";

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
  const currentCounter = await dbGetCounterByMilestoneId(milestoneId, userId);
  if (!currentCounter) {
    throw new NotFoundError("Counter not found");
  }
  if (currentCounter.current_value + delta < 0) {
    throw new ValidationError("Counter cannot go below zero");
  }

  const increment = await dbIncrementCounter(milestoneId, userId, delta);

  const today = new Date().toISOString().split("T")[0]!; //! I know it returns undefined but it never will
  await upsertDailyProgress(userId, milestoneId, today, delta);

  return increment;
}

//reset counter
export async function resetCounter(milestoneId: number, userId: number) {
  const reset = await dbResetCounter(milestoneId, userId);
  if (!reset) {
    throw new NotFoundError("Counter not found");
  }
  return reset;
}
