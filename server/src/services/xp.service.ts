import { dbInsertXpEvent, dbSelectTotalXp } from "../db/queries/xp.queries.js";

type xpEventType =
    | 'daily_completion'
    | 'weekly_completion'
    | 'subject_completion'
    | 'pomodoro_session'
    | 'decay';


export async function getTotalXp(userId: number) {
    return dbSelectTotalXp(userId);
}

// export async function getDailyXp(userId: number) {
//     return dbDailyXp(userId);
// }

