CREATE TABLE milestone_checklist_items (
    id SERIAL PRIMARY KEY,
    milestone_id INT NOT NULL,
    label TEXT NOT NULL,
    is_done BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT fk_milestone FOREIGN KEY (milestone_id)
        REFERENCES milestones(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_checklist_items_milestone_id ON milestone_checklist_items(milestone_id);