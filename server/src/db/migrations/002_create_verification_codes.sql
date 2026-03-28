CREATE TABLE verification_codes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    verification_code TEXT NOT NULL,
    expired_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    is_used BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT fk_user FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);