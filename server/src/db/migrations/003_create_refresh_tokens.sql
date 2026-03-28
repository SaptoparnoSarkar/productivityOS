CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    refresh_token_hash TEXT NOT NULL,
    user_id       INT NOT NULL,
    expires_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked       BOOLEAN NOT NULL DEFAULT false,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
