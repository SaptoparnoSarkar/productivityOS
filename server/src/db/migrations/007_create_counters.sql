CREATE TABLE milestone_counters (
    milestone_id INT PRIMARY KEY,
    current_value INT NOT NULL DEFAULT 0,
    target_value INT NOT NULL,
    unit TEXT NOT NULL,

    CONSTRAINT fk_milestone FOREIGN KEY (milestone_id)
        REFERENCES milestones(id)
        ON DELETE CASCADE
);

