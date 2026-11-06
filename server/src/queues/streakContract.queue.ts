import { Queue } from "bullmq";
import { bullmqConnection } from "../config/bullmq.js";



export const streakContractQueue = new Queue(
    "streak-contracts",
    {
        connection: bullmqConnection,
    }
)