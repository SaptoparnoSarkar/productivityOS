import { pool } from "../../config/db.js";
import type { UpdateChecklistInputType } from "../../schemas/checklistItem.schema.js";

//Create Checklist Items
export async function dbCreateChecklistItem(
  milestoneId: number,
  label: string,
  userId: number,
) {
  const result = await pool.query(
    `INSERT INTO milestone_checklist_items (milestone_id, label, is_done) 
      SELECT $1, $2, false 
      FROM milestones m 
      JOIN subjects s ON m.subject_id = s.id 
      WHERE m.id = $1 AND s.user_id = $3 AND m.type = 'checklist'
      RETURNING *`,
    [milestoneId, label, userId],
  );
  return result.rows[0] || null;
}

//Get Checklist Items
export async function dbGetChecklistItemsByMilestoneId(
  milestoneId: number,
  userId: number,
) {
  const result = await pool.query(
    `SELECT mc.*
      FROM milestone_checklist_items mc
      JOIN milestones m ON mc.milestone_id = m.id
      JOIN subjects s ON m.subject_id = s.id
      WHERE m.id = $1 AND s.user_id = $2`,
    [milestoneId, userId],
  );
  return result.rows;
}

//Get Checklist Item (Singular) by Item id
export async function dbGetChecklistItemById(
  itemId: number,
  userId: number,
) {
  const result = await pool.query(
    `SELECT mc.*, m.daily_minimum, m.subject_id
      FROM milestone_checklist_items mc
      JOIN milestones m ON mc.milestone_id = m.id
      JOIN subjects s ON m.subject_id = s.id
      WHERE mc.id = $1 AND s.user_id = $2`,
    [itemId, userId],
  );
  return result.rows[0] || null;
}

//Update Checklist Items
export async function dbUpdateChecklistItem(
  itemId: number,
  userId: number,
  milestoneId: number,
  input: UpdateChecklistInputType,
) {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (input.label !== undefined) {
    fields.push(`label = $${paramIndex++}`);
    values.push(input.label);
  }

  if (input.is_done !== undefined) {
    fields.push(`is_done = $${paramIndex++}`);
    values.push(input.is_done);
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(itemId, milestoneId, userId);

  const result = await pool.query(
    `UPDATE milestone_checklist_items AS mc
      SET ${fields.join(", ")}
      FROM milestones AS m
      JOIN subjects AS s ON m.subject_id = s.id
      WHERE mc.milestone_id = m.id
      AND mc.id = $${paramIndex++}
      AND mc.milestone_id = $${paramIndex++}
      AND s.user_id = $${paramIndex++}
      RETURNING mc.*`,
    values,
  );

  return result.rows[0] || null;
}

//Delete Checklist items
export async function dbDeleteChecklistItem(itemId: number, userId: number, milestoneId: number) {
  const result = await pool.query(
    `DELETE FROM milestone_checklist_items AS mc
      USING milestones AS m, subjects AS s
      WHERE mc.milestone_id = m.id 
      AND m.subject_id = s.id
      AND mc.id = $1 
      AND mc.milestone_id = $2
      AND s.user_id = $3
    RETURNING mc.*`,
    [itemId, milestoneId, userId]
  );
  return result.rows[0] || null;
}
