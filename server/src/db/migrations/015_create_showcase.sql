
CREATE TABLE showcase(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    subject_id INT,
    subject_title VARCHAR(100) NOT NULL,
    total_xp INT NOT NULL,
    total_seconds INT NOT NULL CHECK (total_seconds >= 0),
    milestone_count INT NOT NULL CHECK (milestone_count > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_subject FOREIGN KEY(subject_id)
    REFERENCES subjects(id)
    ON DELETE SET NULL,

    CONSTRAINT uk_subject UNIQUE(subject_id)
);

CREATE INDEX idx_showcase_user ON showcase(user_id, created_at DESC);