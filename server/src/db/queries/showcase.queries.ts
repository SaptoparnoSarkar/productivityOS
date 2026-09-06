import { pool } from "../../config/db.js";

export async function dbPromoteSubject(userId: number, subjectId: number) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const subject = await client.query(
      `SELECT id, title, status FROM subjects WHERE id = $1 AND user_id = $2 FOR UPDATE `,
      [subjectId, userId],
    );
    if (!subject.rows[0]) {
      await client.query("ROLLBACK");
      return { ok: false, reason: "not_found" };
    }
    if (subject.rows[0].status !== "completed") {
      await client.query("ROLLBACK");
      return { ok: false, reason: "subject_not_completed" };
    }
    const subjectTitle = subject.rows[0].title;

    const xp = await client.query(
      `SELECT COALESCE(SUM(amount),0)::int AS total FROM xp_events where subject_id=$1 and user_id=$2
            `,
      [subjectId, userId],
    );
    const totalXp = xp.rows[0].total;

    const milestones = await client.query(
      `SELECT COUNT(*)::int AS milestone_count FROM milestones where subject_id=$1
            `,
      [subjectId],
    );
    const milestoneCount = milestones.rows[0].milestone_count;
    if (milestoneCount === 0) {
      await client.query("ROLLBACK");
      return { ok: false, reason: "no_milestone" };
    }

    const total_seconds = await client.query(
      `SELECT COALESCE(SUM(actual_seconds),0)::int as total_seconds FROM pomodoro_sessions WHERE subject_id = $1 and user_id = $2 and status = 'completed'`,
      [subjectId, userId],
    );
    const totalSeconds = total_seconds.rows[0].total_seconds;

    const update = await client.query(
      `INSERT into showcase (user_id, subject_id, subject_title,total_xp,total_seconds,milestone_count) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [userId, subjectId, subjectTitle, totalXp, totalSeconds, milestoneCount],
    );
    await client.query("COMMIT");
    return { ok: true, entry: update.rows[0] };
  } catch (error: any) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      return { ok: false, reason: "already_promoted" };
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function dbListShowcase(userId: number) {
  const result = await pool.query(
    `SELECT * FROM showcase WHERE user_id = $1 ORDER BY created_at DESC
    `,
    [userId],
  );
  return result.rows;
}

export async function dbGetShowcaseById(showcaseId: number, userId: number) {
  const result = await pool.query(
    `SELECT * FROM showcase WHERE id = $1 and user_id = $2 `,
    [showcaseId, userId],
  );
  return result.rows[0] || null;
}
