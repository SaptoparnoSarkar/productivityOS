import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('../.env') });

export const pool = new Pool({
    host: 'localhost',
    port: +(process.env.DB_PORT ?? 5432),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: String(process.env.POSTGRES_PASSWORD)
});


