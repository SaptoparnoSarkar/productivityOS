import { Queue } from "bullmq";
import { bullmqConnection } from "../config/bullmq.js";



export const streakContractQueue = new Queue(
    "streak-contracts",
    {
        connection: bullmqConnection,
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 2000
            },
            removeOnComplete: 100,
            removeOnFail: 500,
        }
    }
)