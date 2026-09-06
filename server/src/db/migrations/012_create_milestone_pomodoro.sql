
-- CREATE TABLE milestone_pomodoro(
--     milestone_id INT PRIMARY KEY,
--     target_seconds INT NOT NULL,
--     CONSTRAINT chk_target_seconds CHECK(target_seconds > 7200),

--     CONSTRAINT fk_milestone FOREIGN KEY(milestone_id)
--         REFERENCES milestones(id)
--         ON DELETE CASCADE
-- );