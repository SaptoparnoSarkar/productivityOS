import { getCachedXpSummary, invalidateXpSummary, setCachedXpSummary } from "../cache/xp.cache.js";
import { dbInsertXpEvent, dbGetTotalXp, getXpEvents, countXpEvents } from "../db/queries/xp.queries.js";
import { getRankForXp, getRankProgress } from "./rank.service.js";

type xpEventType =
    | 'daily_completion'
    | 'weekly_completion'
    | 'subject_completion'
    | 'pomodoro_session'
    | 'per_tick'
    | 'decay'
    | 'streak_multiplier';



// This awards the xp. 
export async function awardXp(userId: number, type: xpEventType, amount: number, subjectId: number, milestoneId: number) {
    const data = await dbInsertXpEvent(userId, type, amount, subjectId, milestoneId);
    await invalidateXpSummary(userId);
    return data;
}


export async function getXpSummary(userId: number) {

    const cached = await getCachedXpSummary(userId)
    if (cached) return cached;

    const totalXp = await dbGetTotalXp(userId);
    const rank = getRankForXp(totalXp);
    const progress = getRankProgress(totalXp);
    const summary = { totalXp, rank, progress };

    await setCachedXpSummary(userId, summary)
    return summary;
}

export async function getXpLog(userId: number, page: number, limit: number) {
    const offset = (page - 1) * limit;
    const events = await getXpEvents(userId, limit, offset);
    const totalCount = await countXpEvents(userId);
    const totalPages = Math.ceil(totalCount / limit);

    return {
        events, page, limit, totalCount, totalPages
    }
}
