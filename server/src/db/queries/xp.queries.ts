import { pool } from "../../config/db.js";

// Append-only never update/delete xp_events.
export async function dbInsertXpEvent(
  userId: number,
  type: string,
  amount: number,
  subjectId: number,
  milestoneId: number,
  multiplierApplied: boolean,
) {
  const today = new Date().toISOString().split("T")[0]!;
  // Why ON CONFLICT? This is to prevent double counting.
  if (type === "daily_completion") {
    await pool.query(
      `INSERT INTO xp_events (user_id, subject_id, milestone_id, type, amount, multiplier_applied, awarded_date)
            VALUES($1,$2,$3,$4,$5,$6,$7)
            ON CONFLICT (user_id, milestone_id, type, awarded_date) DO NOTHING`,
      [userId, subjectId, milestoneId, type, amount, multiplierApplied, today],
    );
    return;
  } else {
    // This here is for single events like first complete of milestone and etc.
    await pool.query(
      `INSERT INTO xp_events (user_id, subject_id, milestone_id, type, amount, multiplier_applied, awarded_date)
            VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [userId, subjectId, milestoneId, type, amount, multiplierApplied, null],
    );
  }
}

// Get calculation Total XP.
export async function dbGetTotalXp(userId: number) {
  const result = await pool.query(
    "SELECT COALESCE(SUM(amount),0) AS total FROM xp_events WHERE user_id = $1",
    [userId],
  );
  return Number(result.rows[0].total);
}

// Get all xp events for a user (for the History page)
export async function dbGetXpEvents(
  userId: number,
  limit: number,
  offset: number,
) {
  const result = await pool.query(
    `
        SELECT e.id, e.amount, e.multiplier_applied, e.type, m.title AS milestone_title, e.created_at FROM xp_events e
        LEFT JOIN milestones m ON m.id = e.milestone_id
        WHERE e.user_id = $1
        ORDER BY e.created_at DESC, e.id DESC
        LIMIT $2 OFFSET $3;
        `,
    [userId, limit, offset],
  );
  return result.rows;
}

//  Get the count all xp events for a user (for pagination)
export async function dbCountXpEvents(userId: number) {
  const result = await pool.query(
    `SELECT COUNT(*) FROM xp_events WHERE user_id = $1`,
    [userId],
  );
  return Number(result.rows[0].count);
}
