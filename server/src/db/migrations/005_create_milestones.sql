CREATE TYPE milestone_type_enum AS ENUM ('counter', 'checklist');

CREATE TABLE milestones (
    id SERIAL PRIMARY KEY,
    subject_id INT NOT NULL,
    type milestone_type_enum NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    daily_minimum INT,
    daily_minimum_unit VARCHAR(50), -- 'problems'/ 'pages'/ 'topics
    weekly_minimum INT, -- always days
    is_active BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_subject FOREIGN KEY (subject_id)
        REFERENCES subjects(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_milestones_subject_id ON milestones(subject_id);


-- TODO: Add life calender


CREATE TABLE milestone_goal_versions (
    id SERIAL PRIMARY KEY,
    milestone_id INT NOT NULL,
    effective_from DATE NOT NULL,
    daily_minimum INT,
    daily_minimum_unit VARCHAR(50),
    weekly_minimum INT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (milestone_id, effective_from),
    CONSTRAINT chk_daily_minimum
        CHECK (daily_minimum IS NULL OR daily_minimum > 0),
    
    CONSTRAINT chk_weekly_minimum
        CHECK (weekly_minimum IS NULL OR weekly_minimum BETWEEN 1 AND 7),

    CONSTRAINT chk_weekly_requires_daily
        CHECK (weekly_minimum IS NULL OR daily_minimum IS NOT NULL),
    
    CONSTRAINT fk_milestone FOREIGN KEY (milestone_id)
        REFERENCES milestones(id)
        ON DELETE CASCADE
);