import path from "path";
import fs from "fs";
import { pool } from "../config/db.js";


async function runMigrations() {
    const migrationsDir = path.join(import.meta.dirname, "migrations");
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    const client = await pool.connect();
    try {
        for (const file of files) {
            console.log(`Running migration: ${file}...`)
            const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
            await client.query("BEGIN")
            await client.query(sql);
            await client.query("COMMIT");
        }
        console.log("All migrations executed successfully!")
    } catch (error) {
        await client.query("ROLLBACK")
        console.error("Migration failed:", error)
        process.exit(1);
    } finally {
        client.release();
        await pool.end()
    }
}

runMigrations();