import { pool } from "../../config/db.js";

// Upsert Checklist Target (Handles first set and edit later in one query)
export async function dbSetChecklistTarget(
    milestoneId: number,
    userId: number,
    targetCount: number,
) {
    const result = await pool.query(
        `INSERT INTO milestone_checklists (milestone_id, target_count)
      SELECT $1, $2
      FROM milestones m
      JOIN subjects s ON m.subject_id = s.id
      WHERE m.id = $1 AND s.user_id = $3 AND m.type = 'checklist'
      ON CONFLICT (milestone_id) DO UPDATE SET target_count = EXCLUDED.target_count
      RETURNING *`,
        [milestoneId, targetCount, userId]
    )

    return result.rows[0] || null;
}

// Get Checklist Target
export async function dbGetChecklistTarget(
    milestoneId: number,
    userId: number,
) {
    const result = await pool.query(
        `SELECT mc.*
    FROM milestone_checklists AS mc
    JOIN milestones m ON mc.milestone_id = m.id
    JOIN subjects s ON m.subject_id = s.id
    WHERE m.id = $1 AND s.user_id = $2;
    `,
        [milestoneId, userId]
    )
    return result.rows[0] || null;
}