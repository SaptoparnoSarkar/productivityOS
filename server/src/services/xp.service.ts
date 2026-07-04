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
    return dbInsertXpEvent(userId, type, amount, subjectId, milestoneId);
}


export async function getXpSummary(userId: number) {
    const totalXp = await dbGetTotalXp(userId);
    const rank = getRankForXp(totalXp);
    const progress = getRankProgress(totalXp);

    return { totalXp, rank, progress }
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
