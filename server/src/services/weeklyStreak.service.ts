import {
  dbGetTodayContractStatus,
  dbCreateWeeklyContract,
} from "../db/queries/weeklyStreak.queries.js";

export async function createWeeklyContract(userId: number) {
  return await dbCreateWeeklyContract(userId);
}

export async function getTodayContractStatus(userId: number) {
  return await dbGetTodayContractStatus(userId);
}
