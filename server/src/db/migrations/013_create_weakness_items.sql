CREATE TYPE weakness_items_enum AS ENUM ('active','resolved');

CREATE TABLE weakness_items(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    subject_id INT,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(300),
    status weakness_items_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_subject FOREIGN KEY(subject_id)
        REFERENCES subjects(id)
        ON DELETE SET NULL


);

CREATE INDEX idx_weakness_items_user_status
ON weakness_items(user_id, status, created_at DESC);

