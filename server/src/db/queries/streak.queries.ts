import { pool } from "../../config/db.js";
import { NotFoundError, ValidationError } from "../../utils/errors.js";

//Changed: changed from weekly_streak_contracts to streak_contracts
//Changed: changed from weekly_streak_contract_items to streak_contract_items

export async function dbCreateStreakContract(userId: number) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // insert into streak_contracts plus added the if statement to deal with postgres unqiue violation
    const contractResult = await client.query<{
      id: number;
      week_start_date: string;
    }>(
      `INSERT INTO streak_contracts (user_id, week_start_date) 
      SELECT $1, date_trunc('week', CURRENT_TIMESTAMP AT TIME ZONE u.timezone)::date
      FROM users u WHERE u.id = $1
      ON CONFLICT (user_id, week_start_date)
      DO UPDATE SET week_start_date = EXCLUDED.week_start_date
      RETURNING id, week_start_date`,
      [userId],
    );

    const contract = contractResult.rows[0]!;

    // All set_active = 'true' milestones will get attached to this contract ID.
    const insertContractItems = await client.query(
      `INSERT INTO streak_contract_items (
        contract_id,   
        milestone_id
      )
        SELECT $1, m.id
        FROM milestones m
        JOIN subjects s ON s.id = m.subject_id
        WHERE s.user_id = $2
          AND m.is_active = true
          AND m.daily_minimum IS NOT NULL
      `,
      [contract.id, userId],
    );

    if (!insertContractItems.rowCount) {
      throw new ValidationError(
        "Activate at least one daily milestone before creating a contract",
      );
    }

    await client.query("COMMIT");
    return contract;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

//Gives back the current working milestones status of the current week.
export async function dbGetTodayContractStatus(userId: number) {
  const statusResult = await pool.query(
    `WITH user_dates AS (
      SELECT timezone,
          (CURRENT_TIMESTAMP AT TIME ZONE timezone)::date AS today_date,
          date_trunc('week', CURRENT_TIMESTAMP AT TIME ZONE timezone)::date AS week_start_date
          FROM users u WHERE u.id = $1
          )
  
    SELECT
      COUNT(sci.milestone_id)::int AS total_items,
      COUNT(sci.milestone_id) FILTER (
        WHERE COALESCE(dp.progress, 0) >= m.daily_minimum
      )::int AS completed_items

      FROM streak_contract_items sci
      JOIN streak_contracts sc ON sc.id = sci.contract_id
      JOIN milestones m ON m.id = sci.milestone_id

      LEFT JOIN daily_progress dp
        ON dp.milestone_id = sci.milestone_id
        AND dp.user_id = $1
        AND dp.progress_date = $3

      WHERE sc.user_id = $1
        AND sc.week_start_date = $2
    `,
    [userId],
  );
  const status = statusResult.rows[0];
  if (!status) {
    throw new Error("No contract found for user");
  }
  return {
    totalItems: status.total_items,
    completedItems: status.completed_items,
    todayComplete:
      status.total_items > 0 && status.completed_items === status.total_items,
  };
}

// Get historical weekly progress, returns each elapsed day and derives the current consecutive streak.

type HistoricalStreakDayRow = {
  progress_date: string;
  qualified: boolean;
};
export async function dbGetWeeklyHistoricalProgress(userId: number) {
  const result = await pool.query<HistoricalStreakDayRow>(
    `
  WITH user_dates AS (
  SELECT
    (CURRENT_TIMESTAMP AT TIME ZONE u.timezone)::date AS today_date,
    date_trunc('week', CURRENT_TIMESTAMP AT TIME ZONE u.timezone)::date AS week_start_date
  FROM users u WHERE u.id = $1
),
current_contract AS (
  SELECT sc.id AS contract_id, ud.today_date, ud.week_start_date
  FROM user_dates ud
  JOIN streak_contracts sc
    ON sc.user_id = $1 AND sc.week_start_date = ud.week_start_date
),
elapsed_days AS (
  SELECT generated_day::date AS progress_date
  FROM current_contract cc
  CROSS JOIN generate_series(
    cc.week_start_date, cc.today_date, INTERVAL '1 day'
  ) AS generated_day
),
day_status AS (
  SELECT
    ed.progress_date,
    COUNT(sci.milestone_id) AS total_items,
    COUNT(sci.milestone_id) FILTER (
      WHERE COALESCE(dp.progress, 0) >= m.daily_minimum
    ) AS completed_items
  FROM elapsed_days ed
  CROSS JOIN current_contract cc
  JOIN streak_contract_items sci ON sci.contract_id = cc.contract_id
  JOIN milestones m ON m.id = sci.milestone_id
  LEFT JOIN daily_progress dp
    ON dp.milestone_id = sci.milestone_id
    AND dp.user_id = $1
    AND dp.progress_date = ed.progress_date
  GROUP BY ed.progress_date
)
SELECT
  progress_date,
  (total_items > 0 AND completed_items = total_items) AS qualified
FROM day_status
ORDER BY progress_date ASC
    `,
    [userId],
  );

  return result.rows;
}
