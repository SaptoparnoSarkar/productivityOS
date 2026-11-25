import { Pool } from "pg";
import "dotenv/config";


//Configured for supabase or local postgres(docker image)
export const pool = new Pool(
  process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_URL?.includes("localhost") ? false : {
      rejectUnauthorized: false
    }
  } : {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });

