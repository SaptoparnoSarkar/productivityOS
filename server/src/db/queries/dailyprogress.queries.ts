import { pool } from "../../config/db.js";

// Daily's Progress Tracker (Insert + Update if already exists)
export async function upsertDailyProgress(
  userID: number,
  milestoneId: number,
  date: string,
  delta: number,
) {
  const result = await pool.query(
    `INSERT INTO daily_progress (user_id, milestone_id, progress_date, progress)
        VALUES ($1,$2,$3,$4)
        ON CONFLICT (user_id, milestone_id, progress_date)
        DO UPDATE
        SET PROGRESS = daily_progress.progress + EXCLUDED.progress
        RETURNING *;`,
    [userID, milestoneId, date, delta],
  );
  return result.rows[0];
}
