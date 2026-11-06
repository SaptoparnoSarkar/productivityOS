import { streakContractQueue } from "../queues/streakContract.queue.js";

// Repeating scan (every minute)
export async function registerStreakScheduler() {
    await streakContractQueue.upsertJobScheduler(
        "streak-contract-scan",
        { every: 60_000 },
        {
            name: "scan-contracts"
        }
    )
}