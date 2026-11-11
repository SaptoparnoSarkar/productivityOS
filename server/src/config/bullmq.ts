import "dotenv/config";

export const bullmqConnection = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT || 6379),
}

export const bullmqWorkerConnection = {
    ...bullmqConnection,
    maxRetriesPerRequest: null,
}