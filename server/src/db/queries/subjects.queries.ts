import { pool } from "../../config/db.js";
import type {
  CreateSubjectInput,
  UpdateSubjectInput,
} from "../../schemas/subject.schema.js";

//Create Subject
export async function dbCreateSubject(
  userId: number,
  input: CreateSubjectInput,
) {
  const result = await pool.query(
    "INSERT into subjects (user_id, type, title, description, has_pomodoro, daily_minimum, daily_minimum_unit, weekly_minimum) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, title",
    [
      userId,
      input.type,
      input.title,
      input.description,
      input.has_pomodoro,
      input.daily_minimum,
      input.daily_minimum_unit,
      input.weekly_minimum,
    ],
  );
  return result.rows[0];
}

//getSubjectsByUserId
export async function getSubjectsByUserId(userId: number) {
  const result = await pool.query(
    "SELECT * FROM subjects WHERE user_id = $1 ORDER BY created_at DESC",
    [userId],
  );
  return result.rows.length > 0 ? result.rows : null;
}

//getSubjectById
export async function getSubjectById(subjectId: number, userId: number) {
  const result = await pool.query(
    "SELECT * FROM subjects WHERE id = $1 AND user_id = $2",
    [subjectId, userId],
  );
  return result.rows[0] || null;
}

//updateSubject

export async function dbUpdateSubject(
  subjectId: number,
  userId: number,
  input: UpdateSubjectInput,
) {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (input.title !== undefined) {
    fields.push(`title = $${paramIndex++}`);
    values.push(input.title);
  }

  if (input.description !== undefined) {
    fields.push(`description = $${paramIndex++}`);
    values.push(input.description);
  }

  if (input.daily_minimum !== undefined) {
    fields.push(`daily_minimum = $${paramIndex++}`);
    values.push(input.daily_minimum);
  }

  if (input.daily_minimum_unit !== undefined) {
    fields.push(`daily_minimum_unit = $${paramIndex++}`);
    values.push(input.daily_minimum_unit);
  }

  if (input.weekly_minimum !== undefined) {
    fields.push(`weekly_minimum = $${paramIndex++}`);
    values.push(input.weekly_minimum);
  }

  //If user sends an empty object, return null
  if (fields.length === 0) return null;

  fields.push(`updated_at = NOW()`);

  values.push(subjectId);
  values.push(userId);

  const result = await pool.query(
    `UPDATE subjects SET ${fields.join(", ")} WHERE id = $${paramIndex++} AND user_id = $${paramIndex++} RETURNING *`,
    values,
  );
  return result.rows[0] || null;
}

//deleteSubject
export async function dbDeleteSubject(subjectId: number, userId: number) {
  const result = await pool.query(
    "DELETE FROM subjects WHERE id = $1 AND user_id = $2",
    [subjectId, userId],
  );
  return result.rows[0] || null;
}
