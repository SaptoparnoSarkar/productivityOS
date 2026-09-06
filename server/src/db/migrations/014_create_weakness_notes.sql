

CREATE TABLE weakness_notes(
    id SERIAL PRIMARY KEY,
    weakness_item_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_weakness_item FOREIGN KEY(weakness_item_id)
        REFERENCES weakness_items(id)
        ON DELETE CASCADE
    

);

CREATE INDEX idx_weakness_notes_item_created
ON weakness_notes(weakness_item_id, created_at ASC);