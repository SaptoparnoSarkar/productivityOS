import { pool } from "../../config/db.js";
import type {
  CreateWeaknessInput,
  CreateWeaknessNoteInput,
  UpdateWeaknessInput,
} from "../../schemas/weakness.schema.js";

// Intention: insert one weakness owned by the authenticated user.
export async function dbCreateWeakness(
  userId: number,
  input: CreateWeaknessInput,
) {
  const result = await pool.query(
    "INSERT INTO weakness_items (user_id, subject_id, title, description) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, input.subject_id, input.title, input.description],
  );
  return result.rows[0];
}

// Intention: list the user's weaknesses, optionally filtered by status.
export async function dbGetWeaknesses(
  userId: number,
  status?: "active" | "resolved",
  limit?: number,
) {
  const result = await pool.query(
    "SELECT * FROM weakness_items WHERE user_id = $1 AND status = COALESCE($2::weakness_items_enum, status) ORDER BY created_at DESC LIMIT $3",
    [userId, status ?? null, limit],
  );
  return result.rows;
}

// Intention: fetch one owned weakness.
export async function dbGetWeaknessById(weaknessId: number, userId: number) {
  const result = await pool.query(
    `SELECT * FROM weakness_items WHERE id = $1 AND user_id = $2`,
    [weaknessId, userId],
  );
  return result.rows[0] || null;
}

// Intention: partially update only an owned weakness.
export async function dbUpdateWeakness(
  weaknessId: number,
  userId: number,
  input: UpdateWeaknessInput,
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
  if (input.status !== undefined) {
    fields.push(`status = $${paramIndex++}`);
    fields.push(
      `resolved_at = ${input.status === "resolved" ? "NOW()" : "NULL"}`,
    );
    values.push(input.status);
  }

  if (fields.length === 0) return null;
  fields.push(`updated_at = NOW()`);
  values.push(weaknessId);
  values.push(userId);
  const result = await pool.query(
    `UPDATE weakness_items SET ${fields.join(",")} WHERE id = $${paramIndex++} AND user_id = $${paramIndex++} RETURNING *
        `,
    values,
  );
  return result.rows[0] || null;
}

// Intention: delete only an owned weakness.
export async function dbDeleteWeakness(weaknessId: number, userId: number) {
  const result = await pool.query(
    `DELETE FROM weakness_items WHERE id = $1 AND user_id = $2 RETURNING*`,
    [weaknessId, userId],
  );
  return result.rows[0] || null;
}

// Intention: add a note only when its weakness belongs to the user.
export async function dbCreateWeaknessNote(
  weaknessId: number,
  userId: number,
  input: CreateWeaknessNoteInput,
) {
  const result = await pool.query(
    `INSERT INTO weakness_notes (weakness_item_id,content)
    SELECT wi.id, $2
    FROM weakness_items wi
    WHERE wi.user_id = $3 AND wi.id = $1
    RETURNING *
    `,
    [weaknessId, input, userId],
  );
  return result.rows[0] || null;
}

// Intention: list notes only when their weakness belongs to the user.
export async function dbGetWeaknessNotes(weaknessId: number, userId: number) {
  const result = await pool.query(
    `SELECT wn.* FROM weakness_notes wn 
    JOIN weakness_items wi ON wi.id = wn.weakness_item_id
    WHERE wn.weakness_item_id = $1 AND wi.user_id = $2 ORDER BY wn.created_at ASC`,
    [weaknessId, userId],
  );
  return result.rows;
}

export async function dbDeleteWeaknessNotes(
  weaknessId: number,
  userId: number,
) {
  const result = await pool.query(
    `DELETE FROM weakness_notes wn 
        USING weakness_items wi 
        WHERE wi.id = wn.weakness_item_id
        AND wn.weakness_item_id = $1 
        AND wi.user_id = $2 
        RETURNING wn.*`,
    [weaknessId, userId],
  );
  return result.rows[0] || null;
}
