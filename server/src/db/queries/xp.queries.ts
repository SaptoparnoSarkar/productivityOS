import { pool } from "../../config/db.js";

// Append-only never update/delete xp_events.
export async function dbInsertXpEvent(
    userId: number,
    type: string,
    amount: number,
    subjectId: number | null,
    milestoneId: number | null,
) {
    const result = await pool.query(
        'INSERT INTO xp_events (user_id, type, amount, subject_id, milestone_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [userId, type, amount, subjectId, milestoneId]
    )
    return result.rows[0]
}

export async function dbSelectTotalXp(userId: number) {
    const result = await pool.query(
        'SELECT COALESCE(SUM(amount),0) AS total FROM xp_events WHERE user_id = $1', [userId]
    )
    return Number(result.rows[0].total);
}

// // Daily xp
// export async function dbDailyXp(userId: number) {
//     const result = await pool.query(
//         'SELECT COALESCE(SUM(amount),0) AS daily_xp FROM xp_events WHERE user_id = $1 AND created_at >= date_trunc($2,now())',
//         [userId, 'day']
//     )
//     return Number(result.rows[0].daily_xp);
// }

// Daily's Progress Tracker (Insert + Update if already exists)
export async function upsertDailyProgress(userID: number, milestoneId: number, date: string, delta: number) {
    const result = await pool.query(
        `INSERT INTO daily_progress (user_id, milestone_id, progress_date, progress)
        VALUES ($1,$2,$3,$4)
        ON CONFLICT (user_id, milestone_id, progress_date)
        DO UPDATE
        SET PROGRESS = daily_progress.progress + EXCLUDED.progress
        RETURNING *;`, [userID, milestoneId, date, delta]
    )
    return result.rows[0];
}