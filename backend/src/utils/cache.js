// Simple in-memory cache with TTL for idempotent GET endpoints
const store = new Map(); // key -> { expires: number, payload: any }

export function cacheGet(ttlSeconds = 30) {
  return (req, res, next) => {
    if (req.method !== 'GET') return next();
    const key = req.originalUrl;
    const now = Date.now();
    const hit = store.get(key);
    if (hit && hit.expires > now) {
      return res.json(hit.payload);
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      try {
        store.set(key, { expires: now + ttlSeconds * 1000, payload: body });
      } catch {}
      return originalJson(body);
    };
    next();
  };
}

export function cacheClear(prefix = '') {
  for (const key of store.keys()) {
    if (!prefix || key.startsWith(prefix)) store.delete(key);
  }
}
