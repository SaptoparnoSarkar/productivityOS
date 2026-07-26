
 
-- One locked streak contract per user per Monday-based week.
CREATE TABLE weekly_streak_contracts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    week_start_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    
    CONSTRAINT unique_contract UNIQUE (user_id, week_start_date)
);


-- Snapshot which milestones belong to a contract
CREATE TABLE weekly_streak_contract_items (
    contract_id INT NOT NULL,
    milestone_id INT NOT NULL,

    CONSTRAINT fk_contract FOREIGN KEY (contract_id)
        REFERENCES weekly_streak_contracts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_milestone FOREIGN KEY (milestone_id)
        REFERENCES milestones(id)
        ON DELETE CASCADE,

    CONSTRAINT pk_contract_item
        PRIMARY KEY (contract_id, milestone_id)
);