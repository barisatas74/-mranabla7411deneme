import "server-only";

import { headers } from "next/headers";

type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

const buckets = new Map<string, Bucket>();

function pruneExpired(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function checkRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  pruneExpired(now);

  const existing = buckets.get(key);
  const bucket =
    existing && existing.resetAt > now
      ? existing
      : { count: 0, resetAt: now + windowMs };

  bucket.count += 1;
  buckets.set(key, bucket);

  const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  return {
    allowed: bucket.count <= limit,
    retryAfterSec,
  };
}

function normalizeIp(value: string | null) {
  return value?.split(",")[0]?.trim() || "unknown";
}

export function getRequestRateLimitKey(scope: string, request: Request) {
  return `${scope}:${normalizeIp(
    request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip")
  )}`;
}

export async function getActionRateLimitKey(scope: string) {
  const headerStore = await headers();
  return `${scope}:${normalizeIp(
    headerStore.get("x-forwarded-for") ?? headerStore.get("x-real-ip")
  )}`;
}
