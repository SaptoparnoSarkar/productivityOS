    WITH user_dates AS (
        SELECT (CURRENT_TIMESTAMP AT TIME ZONE u.timezone)::date AS today_date
        FROM users u WHERE u.id = 1
    ),
    subject_count AS (
        SELECT COUNT(*)::int AS total_subjects FROM subjects s
        WHERE s.user_id = 1
    ),
    active_count AS (
        SELECT COUNT(*)::int AS active_milestones FROM milestones m
        JOIN subjects s ON m.subject_id = s.id
        WHERE s.user_id = 1 AND m.is_active = true
    ),
    dailies_done AS (
        SELECT COUNT(*) FILTER(
            WHERE COALESCE(dp.progress,0) >= m.daily_minimum)::int AS completed_dailies
            FROM daily_progress dp 
            JOIN milestones m ON dp.milestone_id = m.id
            WHERE dp.user_id = 1 AND dp.progress_date = (SELECT today_date FROM user_dates) AND m.is_active = true
    )

    SELECT
      sc.total_subjects,
      ac.active_milestones,
      dd.completed_dailies
    FROM subject_count sc 
    CROSS JOIN active_count ac
    CROSS JOIN dailies_done dd;