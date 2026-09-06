import { pool } from "../../config/db.js";
import type { PomodoroSessionRow } from "../../utils/pomodoro.utils.js";

// Gets the active pomodoro session
export async function dbGetActiveSession(userId: number) {
  const result = await pool.query<PomodoroSessionRow>(
    `
        SELECT *
        FROM pomodoro_sessions
        WHERE user_id = $1 AND status IN ('active', 'paused')
        LIMIT 1
        `,
    [userId],
  );
  return result.rows[0];
}

// Insert a new 'active' session. Timer starts when this is triggered.
export async function dbCreateSession(
  userId: number,
  subjectId: number,
  milestoneId: number | null,
  plannedSeconds: number,
) {
  const result = await pool.query<PomodoroSessionRow>(
    `INSERT INTO pomodoro_sessions(user_id, subject_id, milestone_id, planned_seconds,ends_at)
     VALUES($1, $2, $3, $4, NOW() + ($4::int * INTERVAL '1 second'))
     RETURNING *;
        `,
    [userId, subjectId, milestoneId, plannedSeconds],
  );
  return result.rows[0];
}

// Terminate session. This is for abandanment.
export async function dbFinishSession(
  userId: number,
  sessionId: number,
  status: "completed" | "abandoned",
  actualSeconds: number,
) {
  const result = await pool.query<PomodoroSessionRow>(
    `UPDATE pomodoro_sessions p
      SET status = $3,
        actual_seconds = $4,
        completed_at = NOW()
      WHERE id = $2 AND status IN ('active','paused') AND user_id = $1
    RETURNING p.*
    `,
    [userId, sessionId, status, actualSeconds],
  );
  return result.rows[0];
}

// A transaction that finishes the session and awards the xp, if any one of them fails none happens.
export async function dbFinishSessionWithXp(
  userId: number,
  sessionId: number,
  status: "completed" | "abandoned",
  actual_seconds: number,
  subjectId: number,
  amount: number,
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const finished = await client.query<PomodoroSessionRow>(
      `UPDATE pomodoro_sessions p
      SET status = $3,
        actual_seconds = $4,
        completed_at = NOW()
      WHERE id = $2 AND status IN ('active','paused') AND user_id = $1
      RETURNING p.*
      `,
      [userId, sessionId, status, actual_seconds],
    );
    if (!finished.rows[0]) {
      await client.query("ROLLBACK");
      return undefined;
    }
    await client.query(
      `INSERT INTO xp_events (user_id, subject_id, type, amount) VALUES ($1,$2,'pomodoro_session',$3)`,
      [userId, subjectId, amount],
    );

    await client.query("COMMIT");
    return finished.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Pauses the session.
export async function dbPauseSession(userId: number, sessionId: number) {
  const result = await pool.query<PomodoroSessionRow>(
    `UPDATE pomodoro_sessions p
      SET status = 'paused', paused_at = NOW(), pause_count = p.pause_count + 1
      WHERE id = $2 AND user_id = $1 AND status = 'active'
      RETURNING p.*
    `,
    [userId, sessionId],
  );
  return result.rows[0];
}

// Resumes the session
export async function dbResumeSession(
  userId: number,
  sessionId: number,
  newEndsAt: Date,
  newTotalPaused: number,
) {
  const result = await pool.query<PomodoroSessionRow>(
    `UPDATE pomodoro_sessions p
      SET status = 'active', paused_at = NULL, ends_at = $3, total_paused_seconds = $4
      WHERE id = $2 AND user_id = $1 AND status = 'paused'
      RETURNING p.*
    `,
    [userId, sessionId, newEndsAt, newTotalPaused],
  );
  return result.rows[0];
}

//Total tracked time per subject.
export async function dbGetSubjectHours(userId: number) {
  const result = await pool.query(
    `SELECT s.id AS subject_id, s.title,
          COALESCE(SUM(p.actual_seconds),0)::int AS total_seconds
      FROM subjects s
      LEFT JOIN pomodoro_sessions p ON p.subject_id = s.id AND p.status = 'completed'
      WHERE s.user_id = $1
      GROUP BY s.id, s.title
      ORDER BY total_seconds DESC
    `,
    [userId],
  );
  return result.rows;
}

// //Progress for ONE pomodoro-type milestone: how many seconds
// export async function dbGetMilestonePomodoroProgress(
//   milestoneId: number,
//   userId: number,
// ) {
//   const result = await pool.query(
//     `SELECT mp.milestone_id, mp.target_seconds,
//          COALESCE(SUM(p.actual_seconds),0)::int AS earned_seconds
//      FROM milestone_pomodoro mp
//       JOIN milestones m ON m.id = mp.milestone_id
//       JOIN subjects s ON s.id = m.subject_id AND s.user_id = $2
//       LEFT JOIN pomodoro_sessions p ON p.milestone_id = mp.milestone_id AND p.status = 'completed'
//       WHERE mp.milestone_id = $1
//       GROUP BY mp.milestone_id, mp.target_seconds
//     `,
//     [milestoneId, userId],
//   );
//   return result.rows[0];
// }
