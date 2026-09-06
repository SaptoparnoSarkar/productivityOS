-- Append only
-- Single source of truth for "hours per subject"

CREATE TYPE pomodoro_status_enum AS ENUM ('active','paused','completed','abandoned');

CREATE TABLE pomodoro_sessions(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    subject_id INT NOT NULL,
    milestone_id INT, -- if the user is doing a pomodoro session for a milestone, 
    planned_seconds INT NOT NULL,
    CONSTRAINT chk_planned_seconds CHECK (planned_seconds IN (600,1200,1800,2700,3600,5400,7200)),
    actual_seconds INT,
    status pomodoro_status_enum NOT NULL DEFAULT 'active',
    paused_at TIMESTAMPTZ,
    total_paused_seconds INT NOT NULL DEFAULT 0,
    pause_count INT NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_at TIMESTAMPTZ NOT NULL, --Computed in services (started_at + planned_seconds),
    completed_at TIMESTAMPTZ NULL, --read it as Finalised_at

    CONSTRAINT fk_user FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_subject FOREIGN KEY(subject_id)
        REFERENCES subjects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_milestone FOREIGN KEY(milestone_id)
        REFERENCES milestones(id)
        ON DELETE SET NULL,
    
    CONSTRAINT chk_pause_count CHECK (pause_count >= 0 AND pause_count <= 2)
);

CREATE UNIQUE INDEX idx_active_pomodoro ON pomodoro_sessions(user_id) WHERE status IN ('active','paused');
CREATE INDEX idx_pomodoro_aggregate ON pomodoro_sessions(user_id, subject_id) WHERE status = 'completed';
CREATE INDEX idx_pomodoro_milestone ON pomodoro_sessions(milestone_id) WHERE status = 'completed';
