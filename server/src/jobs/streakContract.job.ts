import { dbGetUsersMissingStreakContract } from "../db/queries/streak.queries.js";
import { streakContractQueue } from "../queues/streakContract.queue.js";



//Find eligible users and enqueue their creation jobs
export async function runStreakContractJob() {
    const users = await dbGetUsersMissingStreakContract();
    for (const user of users) {
        await streakContractQueue.add("create-contract", { userId: user.id })

    }
}

