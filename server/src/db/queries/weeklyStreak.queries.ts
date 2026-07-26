import { pool } from "../../config/db.js";
import { NotFoundError, ValidationError } from "../../utils/errors.js";

export async function dbCreateWeeklyContract(userId: number) {
  const client = await pool.connect(); //borrows one db connection

  try {
    //Open a transaction
    await client.query("BEGIN");

    const timezoneResult = await client.query<{ timezone: string }>(
      `SELECT timezone FROM users WHERE id = $1`,
      [userId],
    );

    const user = timezoneResult.rows[0];
    if (!user) throw new NotFoundError("User not found.");

    const weekResult = await client.query<{ week_start_date: string }>(
      `SELECT date_trunc(
          'week',
          CURRENT_TIMESTAMP AT TIME ZONE $1
        )::date AS week_start_date`, //YYYY-MM-DD Only
      [user.timezone],
    );
    const weekStartDate = weekResult.rows[0]!.week_start_date; //Read the calculated Monday

    // insert into weekly_streak_contracts plus added the if statement to deal with postgres unqiue violation
    const contractResult = await client.query<{
      id: number;
      week_start_date: string;
    }>(
      `INSERT INTO weekly_streak_contracts (user_id, week_start_date) 
      VALUES ($1, $2) 
      ON CONFLICT (user_id, week_start_date)
      DO NOTHING
      RETURNING id, week_start_date`, //Return the contract header.
      [userId, weekStartDate],
    );

    let contract = contractResult.rows[0]; //Save the new Contract for it's generated id.

    if (!contract) {
      // If contract is undefined, it means it already exists.
      // Fetch the existing contract
      const existingContractResult = await client.query<{
        id: number;
        week_start_date: string;
      }>(
        `SELECT id, week_start_date
        FROM weekly_streak_contracts
        WHERE user_id = $1 
          AND week_start_date = $2`,
        [userId, weekStartDate],
      );

      const existingContract = existingContractResult.rows[0];

      if (!existingContract)
        throw new Error("Failed to load weekly streak contract");

      await client.query("COMMIT");
      return existingContract;
    }

    // insert weekly_streak_items, add all the set_active milestones
    // All active milestones will get attached to this contract ID.
    const insertContractItems = await client.query(
      `INSERT INTO weekly_streak_contract_items (
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
    //ROLLBACK, then rethrow.
    await client.query("ROLLBACK");
    throw error;
  } finally {
    //Release the client
    client.release();
  }
}

//Gives back the current working milestones status of the current week.
export async function dbGetTodayContractStatus(userId: number) {
  const timezoneResult = await pool.query<{ timezone: string }>(
    `SELECT timezone FROM users WHERE id = $1`,
    [userId],
  );

  const user = timezoneResult.rows[0];
  if (!user) throw new NotFoundError("User not found");

  const todayResult = await pool.query<{ today_date: string }>(
    `SELECT date_trunc(
      'day', CURRENT_TIMESTAMP AT TIME ZONE $1
    )::date AS today_date`,
    [user.timezone],
  );

  const todayDate = todayResult.rows[0]?.today_date; //Format: YYYY-MM-DD

  const weekResult = await pool.query<{ week_start_date: string }>(
    `SELECT date_trunc(
      'week', CURRENT_TIMESTAMP AT TIME ZONE $1
    )::date AS week_start_date`,
    [user.timezone],
  );

  const weekStartDate = weekResult.rows[0]!.week_start_date;

  const statusResult = await pool.query(
    `SELECT
      COUNT(wci.milestone_id)::int AS total_items,

      COUNT(wci.milestone_id) FILTER (
        WHERE COALESCE(dp.progress, 0) >= m.daily_minimum
      )::int AS completed_items

      FROM weekly_streak_contract_items wci 
      JOIN weekly_streaK_contracts wc ON wc.id = wci.contract_id
      JOIN milestones m ON m.id = wci.milestone_id

      LEFT JOIN daily_progress dp
        ON dp.milestone_id = wci.milestone_id
        AND dp.user_id = $1
        AND dp.progress_date = $3

      WHERE wc.user_id = $1
        AND wc.week_start_date = $2
    `,
    [userId, weekStartDate, todayDate],
  );

  const status = statusResult.rows[0];
  return {
    totalItems: status.total_items,
    completedItems: status.completed_items,
    todayComplete:
      status.total_items > 0 && status.completed_items === status.total_items,
  };
}

// TODO: improvement: collapse the three DB round-trips into one query, and type the result.
