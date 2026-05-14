import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Redis bağlantısı (Upstash)
// Eğer ortam değişkenleri yoksa in-memory fallback kullanılacak
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

const upstashRatelimit = redis
    ? new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(5, "15 m"),
        analytics: true,
        prefix: "@upstash/ratelimit/portfolio",
    })
    : null;

// In-memory fallback store
const memoryStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,

    check: async function (ip: string) {
        // Redis/Upstash varsa kullan
        if (upstashRatelimit) {
            const { success, limit, reset, remaining } = await upstashRatelimit.limit(ip);
            return { success, remaining, resetTime: reset };
        }

        // Yoksa in-memory fallback (Serverless ortamlarda her istekte sıfırlanabilir!)
        const now = Date.now();
        const record = memoryStore.get(ip);

        if (!record || now > record.resetTime) {
            memoryStore.set(ip, { count: 1, resetTime: now + this.windowMs });
            return { success: true, remaining: this.maxRequests - 1 };
        }

        if (record.count >= this.maxRequests) {
            return { success: false, remaining: 0, resetTime: record.resetTime };
        }

        record.count += 1;
        return { success: true, remaining: this.maxRequests - record.count };
    },

    fail: async function (ip: string) {
        return await this.check(ip);
    },

    reset: async function (ip: string) {
        if (redis) {
            const key = `@upstash/ratelimit/portfolio:${ip}`;
            await redis.del(key);
        } else {
            memoryStore.delete(ip);
        }
    }
};
