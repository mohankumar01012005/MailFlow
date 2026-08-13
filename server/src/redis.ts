import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

export const redis = redisUrl
  ? new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      tls: redisUrl.startsWith("rediss://") ? { rejectUnauthorized: false } : undefined,
    })
  : new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT || 6379),
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null,
    });