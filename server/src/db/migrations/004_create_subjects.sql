CREATE TYPE subject_type_enum AS ENUM ('completable', 'ongoing');
CREATE TYPE subject_status_enum AS ENUM ('pending', 'completed');

CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    type subject_type_enum NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATE,
    status subject_status_enum NOT NULL DEFAULT 'pending',
    has_pomodoro BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_subjects_user_id ON subjects(user_id)

--The daily's system does not exist yet so keeping the daily_minimum and weekly_minimum as NULLable

