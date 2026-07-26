CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(300) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- TODO: add timezone selection to onboarding or account
-- settings so every user can choose their own IANA timezone.