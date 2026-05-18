CREATE TYPE subject_type_enum AS ENUM ('completable', 'ongoing');

CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    type subject_type_enum NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    has_pomodoro BOOLEAN NOT NULL DEFAULT true,
    daily_minimum INT,
    daily_minimum_unit VARCHAR(50), -- 'problems'/ 'pages'/ 'topics
    weekly_minimum INT, -- always days
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_subjects_user_id ON subjects(user_id)

--The daily's system does not exist yet so keeping the daily_minimum and weekly_minimum as NULLable
