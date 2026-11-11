import "dotenv/config";
import { pool } from "./config/db.js";
import { runStreakContractJob } from "./jobs/streakContract.job.js";
import redis from "./config/redis.js";

async function main() {
    try {
        console.log("Job starting");
        await runStreakContractJob();
        console.log("Job finished");
    } finally {
        await Promise.all([pool.end(), redis.quit()]);
    }
}
main().catch(console.error);