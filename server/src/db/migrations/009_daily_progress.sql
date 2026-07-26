CREATE TABLE daily_progress (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    milestone_id INT NOT NULL,
    progress_date DATE NOT NULL,
    progress INT NOT NULL DEFAULT 0,
    is_daily_done BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES users(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_milestone FOREIGN KEY (milestone_id)
        REFERENCES milestones(id) 
        ON DELETE CASCADE,

    CONSTRAINT unique_daily UNIQUE (user_id, milestone_id, progress_date)
);
