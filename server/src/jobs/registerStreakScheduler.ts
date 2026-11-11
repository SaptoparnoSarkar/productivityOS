import { streakContractQueue } from "../queues/streakContract.queue.js";

// Repeating scan (every minute)
export async function registerStreakScheduler() {
    await streakContractQueue.upsertJobScheduler(
        "streak-contract-scan",
        { every: 60_000 },
        {
            name: "scan-contracts",
            opts: {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 2000,
                },
                removeOnComplete: 100,
                removeOnFail: 500,
            }
        }
    )
}