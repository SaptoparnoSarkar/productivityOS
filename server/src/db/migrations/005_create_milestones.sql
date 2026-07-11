CREATE TYPE milestone_type_enum AS ENUM ('counter', 'checklist');
CREATE TYPE milestone_frequency_enum AS ENUM ('daily', 'weekly');

CREATE TABLE milestones (
    id SERIAL PRIMARY KEY,
    subject_id INT NOT NULL,
    type milestone_type_enum NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    frequency milestone_frequency_enum NOT NULL DEFAULT 'daily',
    daily_minimum INT,
    daily_minimum_unit VARCHAR(50), -- 'problems'/ 'pages'/ 'topics
    weekly_minimum INT, -- always days
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_subject FOREIGN KEY (subject_id)
        REFERENCES subjects(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_milestones_subject_id ON milestones(subject_id);


-- Add life calender
