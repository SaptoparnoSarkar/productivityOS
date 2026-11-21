import type { Pool, PoolClient } from "pg";
import { pool } from "../../config/db.js";
import type {
  CreateMilestoneInput,
  UpdateMilestoneInput,
} from "../../schemas/milestone.schema.js";
import { ValidationError } from "../../utils/errors.js";

// FIXME: drop subjectId from everywhere except dbCreateMilestone. As milestone lookup already traces owner ship
// without it.

//Create Milestone
export async function dbCreateMilestone(
  subjectId: number,
  userId: number,
  input: CreateMilestoneInput,
  db: PoolClient | typeof pool = pool,
) {
  const result = await db.query(
    `INSERT INTO milestones (subject_id, type, title, description, daily_minimum, daily_minimum_unit, weekly_minimum) 
        SELECT $1, $2, $3, $4, $5, $6, $7
        FROM subjects s WHERE s.id = $1 AND s.user_id = $8
        RETURNING *`,
    [
      subjectId,
      input.type,
      input.title,
      input.description,
      input.daily_minimum,
      input.daily_minimum_unit,
      input.weekly_minimum,
      userId,
    ],
  );
  return result.rows[0] || null;
}

// //Fetch Milestones by subjectID
// export async function dbGetMilestonesBySubjectId(
//   subjectId: number,
//   userId: number,
// ) {
//   const result = await pool.query(
//     `SELECT m.* FROM milestones m
//          JOIN subjects s ON m.subject_id = s.id
//          WHERE m.subject_id = $1 AND s.user_id = $2
//          ORDER BY m.created_at DESC`,
//     [subjectId, userId],
//   );
//   return result.rows;
// }

//Fetch a single Milestone by milestoneId
export async function dbGetMilestoneById(milestoneId: number, userId: number, db: PoolClient | typeof pool = pool) {
  const result = await db.query(
    `SELECT m.* FROM milestones m
         JOIN subjects s ON m.subject_id = s.id
         WHERE m.id = $1 AND s.user_id = $2`,
    [milestoneId, userId],
  );
  return result.rows[0] || null;
}

//Fetch A single Milestone's Status (Counter/Checklist Status)
export async function dbGetMilestonesWithProgress(
  subjectId: number,
  userId: number,
) {
  const result = await pool.query(
    `SELECT 
      m.id,
      m.subject_id,
      m.title,
      m.type,
      m.description,
      m.daily_minimum,
      m.daily_minimum_unit,
      m.weekly_minimum,
      m.created_at,
      m.updated_at,
      s.status as subject_status,
      m.is_active,
        COALESCE(mc.current_value, k.ticked)::int AS current_progress,
        COALESCE(mc.target_value, cl.target_count)::int AS target,
        ((m.type = 'counter' AND mc.current_value >= mc.target_value)
        OR (m.type = 'checklist' AND cl.target_count > 0 AND k.ticked >= cl.target_count)) AS is_done
      FROM milestones m
      JOIN subjects s ON m.subject_id = s.id
      LEFT JOIN milestone_counters mc ON mc.milestone_id = m.id
      LEFT JOIN (
        SELECT milestone_id,
          COUNT(*) FILTER (WHERE is_done) AS ticked
        FROM milestone_checklist_items
        GROUP BY milestone_id
      )AS k ON k.milestone_id = m.id
      LEFT JOIN milestone_checklists cl ON cl.milestone_id = m.id
      WHERE m.subject_id = $1 AND s.user_id = $2
      ORDER BY m.created_at DESC
    `,
    [subjectId, userId],
  );
  return result.rows;
}

//Update Milestones
export async function dbUpdateMilestone(
  milestoneId: number,
  subjectId: number,
  userId: number,
  input: Pick<UpdateMilestoneInput, 'title'| 'description'>,
  client: PoolClient,
) {
  const fields: string[] = [];
  const values: any[] = [];
  let i = 1;

  if (input.title !== undefined) {
    fields.push(`title = $${i++}`);
    values.push(input.title);
  }

  if (input.description !== undefined) {
    fields.push(`description = $${i++}`);
    values.push(input.description);
  }

  //If user sends an empty object, return null
  if (fields.length === 0) {
    return null;
  }
  fields.push(`updated_at = NOW()`);

  values.push(milestoneId, subjectId, userId);

  const result = await client.query(
    `UPDATE milestones m SET ${fields.join(", ")}
        FROM subjects s
        WHERE m.subject_id = s.id 
        AND m.id = $${i++} 
        AND m.subject_id = $${i++} 
        AND s.user_id = $${i++}
        RETURNING m.*`,
    values,
  );
  return result.rows[0] || null;
}

//Delete Milestones
export async function dbDeleteMilestone(
  milestoneId: number,
  subjectId: number,
  userId: number,
) {
  const results = await pool.query(
    `DELETE FROM milestones m
         USING subjects s
         WHERE m.subject_id = s.id
         AND m.id = $1 
         AND m.subject_id = $2 
         AND s.user_id = $3 RETURNING m.*`,
    [milestoneId, subjectId, userId],
  );
  return results.rows[0] || null;
}

//Recent Milestones
export async function dbRecentMilestones(userId: number, limit: number) {
  const results = await pool.query(
    `SELECT m.* FROM milestones m
      JOIN subjects s ON m.subject_id = s.id
      WHERE s.user_id = $1
      ORDER BY m.updated_at DESC
      LIMIT $2`,
    [userId, limit],
  );
  return results.rows;
}

//set milestone active
//The subquery only allows the flip if the user has less than 5 active.
export async function dbSetMilestoneActive(
  milestoneId: number,
  userId: number,
  isActive: boolean,
) {
  if (isActive) {
    const result = await pool.query(
      ` 
        UPDATE milestones m
        SET is_active = true
        FROM subjects s WHERE m.subject_id = s.id
        AND m.id = $1 AND s.user_id = $2
        AND (
          SELECT COUNT(*) FROM milestones m2
          JOIN subjects s2 ON m2.subject_id = s2.id
          WHERE s2.user_id = $2 AND m2.is_active = true
        ) < 5
        AND s.status = 'pending'
        RETURNING m.*
      `,
      [milestoneId, userId],
    );
    return result.rows[0] || null;
  } else {
    const result = await pool.query(
      `
        UPDATE milestones m
        SET is_active = false
        FROM subjects s WHERE m.subject_id = s.id
        AND m.id = $1 AND s.user_id = $2
        AND (
          SELECT COUNT(*) FROM milestones m2
          JOIN subjects s2 ON m2.subject_id = s2.id
          WHERE s2.user_id = $2 AND m2.is_active = true
        ) > 1
        RETURNING m.*
      `,
      [milestoneId, userId],
    );
    return result.rows[0] || null;
  }
}

// Get milestones across all subjects
export async function dbGetAllMilestones(userId: number) {
  const result = await pool.query(
    `SELECT m.*, s.title AS subject_name
    FROM milestones m
    JOIN subjects s ON m.subject_id = s.id
    WHERE s.user_id = $1
    ORDER BY m.created_at DESC, m.id DESC`,
    [userId],
  );

  return result.rows;
}

//Create Initial MilestoneVersion
export async function dbCreateInitialGoalVersion(
  milestoneId: number,
  userId: number,
  input: CreateMilestoneInput,
  db: PoolClient | typeof pool = pool,
) {
  const result = await db.query(
    `INSERT INTO milestone_goal_versions
    (milestone_id, effective_from, daily_minimum, daily_minimum_unit,weekly_minimum)
    SELECT $1, date_trunc('week', CURRENT_TIMESTAMP AT TIME ZONE u.timezone)::date, $2, $3, $4
    FROM milestones m
    JOIN subjects s ON s.id = m.subject_id
    JOIN users u ON u.id = s.user_id
    WHERE m.id = $1 AND u.id = $5
    RETURNING *
    `,
    [
      milestoneId,
      input.daily_minimum,
      input.daily_minimum_unit,
      input.weekly_minimum,
      userId,
    ],
  );
  return result.rows[0] || null;
}

// Gets the pending goal version (effective_from = next Monday) for a milestone, if any.
export async function dbGetPendingGoalVersion(
  milestoneId: number,
  userId: number,
  db: PoolClient | typeof pool = pool,
) {
  const result = await db.query(
    `SELECT mv.*
    FROM milestone_goal_versions mv
    JOIN milestones m ON mv.milestone_id = m.id
    JOIN subjects s ON m.subject_id = s.id
    JOIN users u ON u.id = s.user_id
    WHERE m.id = $1 AND u.id = $2
      AND mv.effective_from > date_trunc('week', CURRENT_TIMESTAMP AT TIME ZONE u.timezone)::date
    ORDER BY mv.effective_from DESC
    LIMIT 1`,
    [milestoneId, userId]
  );
  return result.rows[0] || null;
}

///gets the current goal a new edit should merge on top of.
export async function dbGetLatestGoalVersion(
  milestoneId:number,
  userId:number,
  client: PoolClient
) {
  const result = await client.query(
    `SELECT mv.daily_minimum, mv.daily_minimum_unit, mv.weekly_minimum, mv.effective_from
    FROM milestone_goal_versions mv 
    JOIN milestones m ON mv.milestone_id = m.id
    JOIN subjects s ON m.subject_id = s.id
    WHERE m.id = $1 AND s.user_id = $2
    ORDER BY mv.effective_from DESC 
    LIMIT 1`,
    [milestoneId,userId]
  )
  return result.rows[0] || null;
}

// schedule the goal change for next Monday (user TZ).
// A second edit in the same week overwrites the pending row (upsert).
export async function dbUpsertPendingGoalVersion(
  milestoneId:number,
  userId:number,
  goals: { daily_minimum: number | null; daily_minimum_unit: string | null; weekly_minimum: number | null },
  client: PoolClient,
) {
  const result = await client.query(
    `INSERT INTO milestone_goal_versions (milestone_id, effective_from, daily_minimum, daily_minimum_unit, weekly_minimum)
    SELECT $1, (date_trunc('week', CURRENT_TIMESTAMP AT TIME ZONE u.timezone)::date + 7), $2::int, $3::varchar, $4::int
    FROM milestones m 
    JOIN subjects s ON m.subject_id = s.id
    JOIN users u ON u.id = s.user_id
    WHERE m.id = $1 AND s.user_id = $5
    ON CONFLICT (milestone_id,effective_from)
    DO UPDATE SET daily_minimum = EXCLUDED.daily_minimum, daily_minimum_unit = EXCLUDED.daily_minimum_unit, weekly_minimum = EXCLUDED.weekly_minimum
    RETURNING *
    `,[milestoneId,goals.daily_minimum,goals.daily_minimum_unit,goals.weekly_minimum,userId]
  )
  return result.rows[0] || null;
}

//one SQL statement that syncs milestones with their latest due version
export async function dbApplyDueGoalVersions() {
  const result = await pool.query(
    `UPDATE milestones m
     SET daily_minimum = mv.daily_minimum,
     daily_minimum_unit = mv.daily_minimum_unit,
     weekly_minimum = mv.weekly_minimum
     FROM milestone_goal_versions mv, subjects s, users u
     WHERE mv.milestone_id = m.id
     AND s.id = m.subject_id
     AND u.id = s.user_id
     AND mv.effective_from = date_trunc('week', CURRENT_TIMESTAMP AT TIME ZONE u.timezone)::date
     AND (m.daily_minimum IS DISTINCT FROM mv.daily_minimum
          OR m.daily_minimum_unit IS DISTINCT FROM mv.daily_minimum_unit
          OR m.weekly_minimum IS DISTINCT FROM mv.weekly_minimum)
     RETURNING m.id
    `
  )
  return result.rowCount ?? 0;
}