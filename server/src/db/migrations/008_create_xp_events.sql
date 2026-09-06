CREATE TYPE xp_events_type_enum AS ENUM (
     'daily_completion', 'subject_completion', 'streak_multiplier', 'decay', 'pomodoro_session' ,'weekly_completion', 'per_tick');

CREATE TABLE xp_events (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    subject_id INT,
    milestone_id INT,
    type xp_events_type_enum NOT NULL,
    amount INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    awarded_date DATE,
    multiplier_applied BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_subject FOREIGN KEY (subject_id)
        REFERENCES subjects(id) 
        ON DELETE SET NULL,
    
    CONSTRAINT fk_milestone FOREIGN KEY (milestone_id)
        REFERENCES milestones(id)
        ON DELETE SET NULL,
    
    CONSTRAINT unique_daily_completion_per_day
        UNIQUE (user_id, milestone_id, type, awarded_date) 
);


