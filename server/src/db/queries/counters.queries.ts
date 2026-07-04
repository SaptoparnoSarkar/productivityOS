import { pool } from "../../config/db.js";
import type {
  CreateCounterInput,
  UpdateCounterInput,
} from "../../schemas/counter.schema.js";

// Create Counter
export async function dbCreateCounter(
  milestoneId: number,
  userId: number,
  input: CreateCounterInput,
) {
  const result = await pool.query(
    `
    INSERT INTO milestone_counters (milestone_id, target_value, unit)
    SELECT m.id, $2, $3
    FROM milestones m
    JOIN subjects s ON m.subject_id = s.id
    WHERE m.id = $1 AND s.user_id = $4 AND m.type = 'counter'
    RETURNING *
    `,
    [milestoneId, input.target_value, input.unit, userId],
  );
  return result.rows[0] ?? null;
}

// Get Counter by Milestone ID
export async function dbGetCounterByMilestoneId(
  milestoneId: number,
  userId: number,
) {
  const result = await pool.query(
    `
    SELECT mc.*, m.daily_minimum, m.subject_id
    FROM milestone_counters mc
    JOIN milestones m ON mc.milestone_id = m.id
    JOIN subjects s ON m.subject_id = s.id
    WHERE mc.milestone_id = $1 AND s.user_id = $2
    `,
    [milestoneId, userId],
  );
  return result.rows[0] ?? null;
}

// Update Counter (target_value and/or unit)
export async function dbUpdateCounter(
  milestoneId: number,
  userId: number,
  input: UpdateCounterInput,
) {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (input.target_value !== undefined) {
    fields.push(`target_value = $${idx++}`);
    values.push(input.target_value);
  }
  if (input.unit !== undefined) {
    fields.push(`unit = $${idx++}`);
    values.push(input.unit);
  }

  values.push(milestoneId, userId);

  const result = await pool.query(
    `
    UPDATE milestone_counters mc
    SET ${fields.join(", ")}
    FROM milestones m
    JOIN subjects s ON m.subject_id = s.id
    WHERE mc.milestone_id = m.id
      AND mc.milestone_id = $${idx++}
      AND s.user_id = $${idx}
    RETURNING mc.*
    `,
    values,
  );
  return result.rows[0] ?? null;
}

// Increment Counter (atomic)
export async function dbIncrementCounter(
  milestoneId: number,
  userId: number,
  delta: number,
) {
  const result = await pool.query(
    `
    UPDATE milestone_counters mc
    SET current_value = mc.current_value + $1
    FROM milestones m
    JOIN subjects s ON m.subject_id = s.id
    WHERE mc.milestone_id = m.id
      AND mc.milestone_id = $2
      AND s.user_id = $3
    RETURNING mc.*
    `,
    [delta, milestoneId, userId],
  );
  return result.rows[0] ?? null;
}

//Reset Counter
export async function dbResetCounter(milestoneId: number, userId: number) {
  const result = await pool.query(
    `UPDATE milestone_counters mc
     SET current_value = 0
     FROM milestones m
     JOIN subjects s ON m.subject_id = s.id
     WHERE mc.milestone_id = m.id
      AND mc.milestone_id = $1
      AND s.user_id = $2
     RETURNING mc.*`,
    [milestoneId, userId],
  );
  return result.rows[0] ?? null;
}
