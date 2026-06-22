import { pool } from "../../config/db.js";
import type {
  CreateMilestoneInput,
  UpdateMilestoneInput,
} from "../../schemas/milestone.schema.js";

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

//Fetch Milestones by subjectID
export async function dbGetMilestonesBySubjectId(
  subjectId: number,
  userId: number,
) {
  const result = await pool.query(
    `SELECT m.* FROM milestones m
         JOIN subjects s ON m.subject_id = s.id
         WHERE m.subject_id = $1 AND s.user_id = $2
         ORDER BY m.created_at DESC`,
    [subjectId, userId],
  );
  return result.rows;
}

//Fetch a single Milestone by milestoneId
export async function dbGetMilestoneById(
  milestoneId: number,
  subjectId: number,
  userId: number,
) {
  const result = await pool.query(
    `SELECT m.* FROM milestones m
         JOIN subjects s ON m.subject_id = s.id
         WHERE m.id= $1 AND m.subject_id = $2 AND s.user_id = $3`,
    [milestoneId, subjectId, userId],
  );
  return result.rows[0] || null;
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
export async function dbRecentMilestones(userId: number, subjectId: number, limit: number) {
  const results = await pool.query(
    `SELECT m.* FROM milestones m
      JOIN subjects s ON m.subject_id = s.id
      WHERE m.subject_id = $1 AND s.user_id = $2
      ORDER BY m.updated_at DESC
      LIMIT $3`,
    [subjectId, userId, limit]
  )
  return results.rows;
}