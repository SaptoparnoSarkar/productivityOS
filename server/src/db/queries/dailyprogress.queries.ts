import { pool } from "../../config/db.js";

// Daily's Progress Tracker to track per day movement.
export async function upsertDailyProgress(
  userId: number,
  milestoneId: number,
  delta: number,
) {
  const result = await pool.query(
    `INSERT INTO daily_progress (user_id, milestone_id, progress_date, progress)
        SELECT $1,$2, (CURRENT_TIMESTAMP AT TIME ZONE u.timezone)::date, $3
        FROM users u
        WHERE u.id = $1
        ON CONFLICT (user_id, milestone_id, progress_date)
        DO UPDATE
        SET progress = daily_progress.progress + EXCLUDED.progress
        RETURNING *;`,
    [userId, milestoneId, delta],
  );
  return result.rows[0];
}

// this marks the daily progress of a milestone as done.
export async function dbMarkDailyDone(userId: number, milestoneId: number) {
  const result = await pool.query(
    `UPDATE daily_progress dp
    SET is_daily_done = TRUE
    FROM users u
    WHERE dp.user_id = u.id
      AND dp.user_id = $1
      AND dp.milestone_id = $2
      AND dp.progress_date = (CURRENT_TIMESTAMP AT TIME ZONE u.timezone)::date
      AND dp.is_daily_done = FALSE 
      RETURNING dp.*;
    `,
    [userId, milestoneId],
  );
  return result.rows[0] ?? null;
}

// TODO: Fix the dbMarkDailyDone add date.
