import { Worker } from "bullmq";
import { createStreakContract } from "../services/streak.service.js";
import { bullmqWorkerConnection } from "../config/bullmq.js";
import { runStreakContractJob } from "../jobs/streakContract.job.js";
import { registerStreakScheduler } from "../jobs/registerStreakScheduler.js";

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

streakContractWorker.on("completed", (job) => console.log("Completed:", job.name, job.id, job.data));
streakContractWorker.on("failed", (job, error) => console.error("Failed:", job?.id, error));
streakContractWorker.on("error", (error) => console.error("Worker error:", error));

await registerStreakScheduler();
console.log("Streak scan schedule registered");

