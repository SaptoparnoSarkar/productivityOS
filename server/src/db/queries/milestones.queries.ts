import { pool } from "../../config/db.js";
import type {
  CreateMilestoneInput,
  UpdateMilestoneInput,
} from "../../schemas/milestone.schema.js";

// FIXME: drop subjectId from everywhere except dbCreateMilestone. As milestone lookup already traces owner ship
// without it.

//Create Milestone
export async function dbCreateMilestone(
  subjectId: number,
  userId: number,
  input: CreateMilestoneInput,
) {
  const result = await pool.query(
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
export async function dbGetMilestoneById(milestoneId: number, userId: number) {
  const result = await pool.query(
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
  input: UpdateMilestoneInput,
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

  if (input.daily_minimum !== undefined) {
    fields.push(`daily_minimum = $${i++}`);
    values.push(input.daily_minimum);
  }

  if (input.daily_minimum_unit !== undefined) {
    fields.push(`daily_minimum_unit = $${i++}`);
    values.push(input.daily_minimum_unit);
  }

  if (input.weekly_minimum !== undefined) {
    fields.push(`weekly_minimum = $${i++}`);
    values.push(input.weekly_minimum);
  }

  //If user sends an empty object, return null
  if (fields.length === 0) {
    return null;
  }

  values.push(milestoneId, subjectId, userId);

  const result = await pool.query(
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
