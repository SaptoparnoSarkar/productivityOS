import {
  getCachedXpSummary,
  invalidateXpSummary,
  setCachedXpSummary,
} from "../cache/xp.cache.js";
import {
  dbInsertXpEvent,
  dbGetTotalXp,
  dbGetXpEvents,
  dbCountXpEvents,
} from "../db/queries/xp.queries.js";
import { getRankForXp, getRankProgress } from "./rank.service.js";
import { getStreakCount } from "./streak.service.js";

type xpEventType =
  | "daily_completion"
  | "weekly_completion"
  | "subject_completion"
  | "pomodoro_session"
  | "per_tick"
  | "decay";

const MULTIPLIER_ELIGIBLE: readonly xpEventType[] = [
  "per_tick",
  "daily_completion",
  "subject_completion",
];

// This awards the xp.
export async function awardXp(
  userId: number,
  type: xpEventType,
  amount: number,
  subjectId: number,
  milestoneId: number,
) {
  let finalAmount = amount;
  let multiplierApplied = false;
  if (MULTIPLIER_ELIGIBLE.includes(type)) {
    const streak = await getStreakCount(userId);
    if (streak >= 3) {
      finalAmount = amount * 2;
      multiplierApplied = true;
    }
  }
  const data = await dbInsertXpEvent(
    userId,
    type,
    finalAmount,
    subjectId,
    milestoneId,
    multiplierApplied,
  );
  await invalidateXpSummary(userId);
  return data;
}

export async function getXpSummary(userId: number) {
  const cached = await getCachedXpSummary(userId);
  if (cached) return cached;

  const totalXp = await dbGetTotalXp(userId);
  const rank = getRankForXp(totalXp);
  const progress = getRankProgress(totalXp);
  const summary = { totalXp, rank, progress };

  await setCachedXpSummary(userId, summary);
  return summary;
}
// This log is used for showing history of all xp gained on what.
export async function getXpLog(userId: number, page: number, limit: number) {
  const offset = (page - 1) * limit;
  const events = await dbGetXpEvents(userId, limit, offset);
  const totalCount = await dbCountXpEvents(userId);
  const totalPages = Math.ceil(totalCount / limit);

  return {
    events,
    page,
    limit,
    totalCount,
    totalPages,
  };
}
