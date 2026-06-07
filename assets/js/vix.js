// corsproxy.io is blocked by Yahoo Finance (returns 403).
// allorigins.win relays the request from their server and includes CORS headers.
const URLS = [
  'https://api.allorigins.win/raw?url=https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX',
  'https://api.allorigins.win/raw?url=https://query2.finance.yahoo.com/v8/finance/chart/%5EVIX',
];
const CACHE_KEY = 'vix_cache';
const CACHE_TTL = 60 * 1000;

function parseResponse(data) {
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta || meta.regularMarketPrice == null) {
    throw new Error('Unexpected VIX response shape');
  }
  return {
    value: meta.regularMarketPrice,
    timestamp: new Date(meta.regularMarketTime * 1000),
  };
}

async function fetchFromURL(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return parseResponse(await res.json());
}

export async function fetchVIX() {
  // Return cached value if still fresh
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) {
      const cached = JSON.parse(raw);
      if (Date.now() - cached.fetchedAt < CACHE_TTL) {
        return {
          value: cached.value,
          timestamp: new Date(cached.timestamp),
          fromCache: true,
        };
      }
    }
  } catch (_) {}

  // Try each URL in order until one succeeds
  let result;
  let lastError;
  for (const url of URLS) {
    try {
      result = await fetchFromURL(url);
      break;
    } catch (err) {
      lastError = err;
    }
  }
  if (!result) {
    return { value: null, timestamp: null, error: true };
  }

  // Persist to cache
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        value: result.value,
        timestamp: result.timestamp.toISOString(),
        fetchedAt: Date.now(),
      })
    );
  } catch (_) {}

  return { ...result, fromCache: false };
}
