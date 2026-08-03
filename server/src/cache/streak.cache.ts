// Cache derived streak count so awardXp does not re-run the history query per tick.

import redis from "../config/redis.js";

const streakCacheKey = (userId: number) => `streak:count:${userId}`;

export async function getCachedStreakCount(
  userId: number,
): Promise<number | null> {
  const data = await redis.get(streakCacheKey(userId));
  if (data === null) return null;
  return Number(data);
}

export async function setCachedStreakCount(
  userId: number,
  count: number,
): Promise<void> {
  await redis.set(streakCacheKey(userId), String(count), "EX", 300);
}

export async function invalidateStreakCount(userId: number): Promise<void> {
  await redis.del(streakCacheKey(userId));
}
