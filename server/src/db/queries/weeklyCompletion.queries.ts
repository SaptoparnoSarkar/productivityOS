import { pool } from "../../config/db.js";


export async function dbGetWeeklyQualifiers(userId: number) {
    const weekBounds = await pool.query(
        `WITH week_bounds AS (
            SELECT date_trunc('week', CURRENT_TIMESTAMP AT TIME ZONE u.timezone)::date AS current_monday,
            (date_trunc('week', CURRENT_TIMESTAMP AT TIME ZONE u.timezone)- INTERVAL '1 week')::date AS previous_monday
            FROM users u
            WHERE u.id = $1
        )

        SELECT dp.milestone_id,
        COUNT(DISTINCT dp.progress_date) AS completed_days
        FROM daily_progress dp

        JOIN milestones m ON m.id = dp.milestone_id
        CROSS JOIN week_bounds wb

        WHERE dp.user_id = $1 
        AND dp.progress_date >= wb.previous_monday
        AND dp.progress_date < wb.current_monday
        AND is_daily_done = true
        
        GROUP BY dp.milestone_id, m.weekly_minimum
        HAVING COUNT(DISTINCT dp.progress_date) >= m.weekly_minimum;


        `, [userId]
    )

    return weekBounds.rows;
}