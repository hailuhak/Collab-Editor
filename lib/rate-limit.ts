type Bucket = {
  hits: number[];
  blockedUntil: number;
};

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

export function checkRateLimit(
  key: string,
  options: { windowMs: number }
): { blocked: boolean; retryAfterMs: number } {
  if (buckets.size > MAX_BUCKETS) {
    const now = Date.now();
    for (const [k, b] of buckets) {
      if (now >= b.blockedUntil && b.hits.every((t) => now - t >= options.windowMs)) {
        buckets.delete(k);
      }
    }
  }

  const now = Date.now();
  const bucket = buckets.get(key);

  if (bucket && now < bucket.blockedUntil) {
    return { blocked: true, retryAfterMs: bucket.blockedUntil - now };
  }

  if (bucket) {
    bucket.hits = bucket.hits.filter((t) => now - t < options.windowMs);
    if (bucket.hits.length >= options.limit) {
      bucket.blockedUntil = now + (options.blockMs ?? options.windowMs);
      return { blocked: true, retryAfterMs: bucket.blockedUntil - now };
    }
  }

  return { blocked: false, retryAfterMs: 0 };
}

export function rateLimit(
  key: string,
  options: { limit: number; windowMs: number; blockMs?: number }
): { blocked: boolean; retryAfterMs: number } {
  if (buckets.size > MAX_BUCKETS) {
    const now = Date.now();
    for (const [k, b] of buckets) {
      if (now >= b.blockedUntil && b.hits.every((t) => now - t >= options.windowMs)) {
        buckets.delete(k);
      }
    }
  }

  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { hits: [], blockedUntil: 0 };
    buckets.set(key, bucket);
  }

  if (now < bucket.blockedUntil) {
    return { blocked: true, retryAfterMs: bucket.blockedUntil - now };
  }

  bucket.hits = bucket.hits.filter((t) => now - t < options.windowMs);

  if (bucket.hits.length >= options.limit) {
    bucket.blockedUntil = now + (options.blockMs ?? options.windowMs);
    return { blocked: true, retryAfterMs: bucket.blockedUntil - now };
  }

  bucket.hits.push(now);
  return { blocked: false, retryAfterMs: 0 };
}
