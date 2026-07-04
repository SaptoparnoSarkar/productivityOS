import { pool } from "../../config/db.js";
import type {
  CreateSubjectInput,
  UpdateSubjectInput,
} from "../../schemas/subject.schema.js";
import { NotFoundError } from "../../utils/errors.js";

//Create Subject
export async function dbCreateSubject(
  userId: number,
  input: CreateSubjectInput,
) {
  const result = await pool.query(
    "INSERT into subjects (user_id, type, title, description, has_pomodoro, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title",
    [
      userId,
      input.type,
      input.title,
      input.description,
      input.has_pomodoro,
      input.due_date,
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

  if (input.due_date !== undefined) {
    fields.push(`due_date = $${paramIndex++}`);
    values.push(input.due_date);
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
    "DELETE FROM subjects WHERE id = $1 AND user_id = $2 RETURNING *",
    [subjectId, userId],
  );
  return result.rows[0] || null;
}

//get due subjects
export async function dbDueSubjects(userId: number, limit: number) {
  const result = await pool.query(
    `SELECT * FROM subjects s
        WHERE s.user_id = $1 AND s.due_date >= CURRENT_DATE
        AND s.status = 'pending'
        ORDER BY s.due_date ASC
        LIMIT $2`,
    [userId, limit],
  );
  return result.rows.length > 0 ? result.rows : null;
}


//COMPLETE SUBJECT WITH XP
export async function dbCompleteSubjectWithXp(
  userId: number,
  subjectId: number,
  amount: number,
) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const updateSubject = await client.query(
      `UPDATE subjects SET status='completed', updated_at = NOW() WHERE id=$1 AND user_id=$2 RETURNING *`,
      [subjectId, userId]
    )

    if (!updateSubject.rows[0]) throw new NotFoundError('Subject not found')

    await client.query(
      `INSERT INTO xp_events (user_id, subject_id, type, amount) VALUES ($1, $2, 'subject_completion', $3)`, [userId, subjectId, amount]
    )

    await client.query('COMMIT');
    return updateSubject.rows[0];

  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  // TODO: guard subject-complete on all milestones complete
} 