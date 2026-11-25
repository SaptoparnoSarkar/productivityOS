import path from "path";
import fs from "fs";
import { pool } from "../config/db.js";

// Only run migrations numbered 001 -> 015
const FIRST = 1;
const LAST = 15;

async function runMigrations() {
  const migrationsDir = path.join(import.meta.dirname, "migrations");

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => /^\d{3}_.+\.sql$/.test(f))
    .filter((f) => {
      const n = parseInt(f.slice(0, 3), 10);
      return n >= FIRST && n <= LAST;
    })
    .sort();

  const client = await pool.connect();
  try {
    // Remember which files already ran, so re-running the script is safe
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename   TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    const { rows } = await client.query<{ filename: string }>(
      "SELECT filename FROM schema_migrations"
    );
    const applied = new Set(rows.map((r) => r.filename));

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`Skipping (already applied): ${file}`);
        continue;
      }

      console.log(`Running migration: ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");

      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query(
          "INSERT INTO schema_migrations (filename) VALUES ($1)",
          [file]
        );
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(`Migration failed in ${file}:`, err);
        process.exitCode = 1;
        return; // stop at the first failure; finally{} still cleans up
      }
    }

    console.log("All migrations executed successfully!");
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((err) => {
  console.error("Could not run migrations:", err);
  process.exit(1);
});
