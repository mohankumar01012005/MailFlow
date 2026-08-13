import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const ipStore = new Map<string, RateLimitStore>();

export function createRateLimiter(options: { windowMs: number; max: number; message?: string }) {
  const { windowMs, max, message = "Too many requests, please try again later." } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "global";
    const now = Date.now();

    let record = ipStore.get(ip);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      ipStore.set(ip, record);
      return next();
    }

    record.count += 1;

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    next();
  };
}

export const globalApiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 120,
  message: "API rate limit exceeded. Please wait a moment before sending more requests.",
});

export const strictActionLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  message: "Action rate limit exceeded. Please slow down.",
});
