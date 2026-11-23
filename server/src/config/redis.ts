import { Redis } from "ioredis";

const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
}) : new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT || 6379)
})

// Connection Log
redis.on("connect", () => console.log("Redis Connected"));
redis.on("error", (err: any) => console.log("Redis Error", err));

export default redis;
