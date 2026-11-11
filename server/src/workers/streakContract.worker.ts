import { Worker } from "bullmq";
import { createStreakContract } from "../services/streak.service.js";
import { bullmqWorkerConnection } from "../config/bullmq.js";
import { runStreakContractJob } from "../jobs/streakContract.job.js";
import { registerStreakScheduler } from "../jobs/registerStreakScheduler.js";
import { streakContractQueue } from "../queues/streakContract.queue.js";
import { pool } from "../config/db.js";
import redis from "../config/redis.js";

//Run the correct function for each job type
export const streakContractWorker = new Worker(
    "streak-contracts",
    async (job) => {
        if (job.name === "scan-contracts") {
            await runStreakContractJob()
            return
        } else if (job.name === "create-contract") {
            await createStreakContract(job.data.userId)
            return
        } else {
            throw new Error(`Unknown Job:${job.name}`)
        }
    },
    { connection: bullmqWorkerConnection }
)

streakContractWorker.on("completed", (job) => console.log("Completed:", { jobId: job.id, name: job.name, userId: job.data.userId ?? null }));
streakContractWorker.on("failed", (job, error) => console.error("Failed:", { jobId: job?.id, name: job?.name, userId: job?.data?.userId, attemptsMade: job?.attemptsMade, error: error.message }));
streakContractWorker.on("error", (error) => console.error("Worker error:", error));

await registerStreakScheduler();
console.log("Streak scan schedule registered");

// Graceful Shutdown
let shuttingDown = false;

async function shutdown(signal: string) {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`Shutting down: ${signal}`);

    try {
        await streakContractWorker.close();
        await streakContractQueue.close();
        await Promise.all([pool.end(), redis.quit()]);
        console.log("Worker shutdown complete");
    } catch (error) {
        console.error("Shutdown failed", error);
        process.exitCode = 1;
    }
}

process.on("SIGINT", () => void shutdown("SIGINT"));

