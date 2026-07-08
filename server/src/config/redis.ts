import { Redis } from "ioredis"
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('../.env') })

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT || 6379),

})

// Connection Log
redis.on("connect", () => console.log("Redis Connected"))
redis.on("error", (err: any) => console.log("Redis Error", err))

export default redis;
