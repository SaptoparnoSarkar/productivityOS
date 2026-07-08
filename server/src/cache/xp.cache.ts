import redis from "../config/redis.js";

const xpSummaryKey = (userId: number) => `xp:summary:${userId}`;

// Shape of what we're caching
type XpSummary = {
    totalXp: number;
    rank: {
        name: string;
        minXp: number;
    }
    progress: {
        percent: number;
        text: string;
    };
}

// READ from cache
export async function getCachedXpSummary(userId: number): Promise<XpSummary | null> {
    const data = await redis.get(xpSummaryKey(userId));
    if (!data) {
        return null;
    }
    return JSON.parse(data);
}

// WRITE to cache
export async function setCachedXpSummary(userId: number, summary: XpSummary): Promise<void> {
    await redis.set(xpSummaryKey(userId), JSON.stringify(summary), 'EX', 300);

}

// INVALIDATE 
export async function invalidateXpSummary(userId: number): Promise<void> {
    await redis.del(xpSummaryKey(userId))
}