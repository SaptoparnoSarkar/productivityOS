import type { ConnectionOptions } from "bullmq";
import "dotenv/config";

export const bullmqConnection: ConnectionOptions = process.env.REDIS_URL ? {
    url: process.env.REDIS_URL
} : {
    host: process.env.REDIS_HOST || "localhost",
    port : Number(process.env.REDIS_PORT || 6379),
}

export const bullmqWorkerConnection: 
    ConnectionOptions = {
    ...bullmqConnection,
    maxRetriesPerRequest: null,
}
    


