import {
  getCachedStreakCount,
  setCachedStreakCount,
} from "../cache/streak.cache.js";
import {
  dbGetTodayContractStatus,
  dbCreateStreakContract,
  dbGetWeeklyHistoricalProgress,
} from "../db/queries/streak.queries.js";
import { deriveStreakCount } from "../utils/streak.utils.js";

export async function createStreakContract(userId: number) {
  return await dbCreateStreakContract(userId);
}

export async function getTodayContractStatus(userId: number) {
  return await dbGetTodayContractStatus(userId);
}

export async function getWeeklyHistoricalProgress(userId: number) {
  return await dbGetWeeklyHistoricalProgress(userId);
}

export async function getStreakCount(userId: number) {
  const cache = await getCachedStreakCount(userId);
  if (cache !== null) return cache;

  //miss
  const data = await dbGetWeeklyHistoricalProgress(userId);
  const streakCount = deriveStreakCount(data);
  await setCachedStreakCount(userId, streakCount);
  return streakCount;
}
