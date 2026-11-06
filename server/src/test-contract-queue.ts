import "dotenv/config";
import { streakContractQueue } from "./queues/streakContract.queue.js";


async function main() {
    try {
        await streakContractQueue.add("create-contract", { userId: 1 })
    } finally {
        await streakContractQueue.close();
    }
}

main().catch(console.error);