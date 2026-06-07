// corsproxy.io is blocked by Yahoo Finance (returns 403).
// allorigins.win relays the request from their server and includes CORS headers.
const URLS = [
  'https://api.allorigins.win/raw?url=https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX',
  'https://api.allorigins.win/raw?url=https://query2.finance.yahoo.com/v8/finance/chart/%5EVIX',
];

// localStorage key — persists across tabs, pages, and browser sessions.
// sessionStorage was replaced because it died on tab close and couldn't
// be shared between index.html and strategy.html.
const CACHE_KEY = 'vix_last_known';
const REFRESH_TTL = 60 * 1000; // re-fetch after 60 seconds

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

// Synchronous read of whatever is in localStorage right now.
// Returns null if nothing is stored yet.
export function getCachedVIX() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    const age = Date.now() - cached.fetchedAt;
    return {
      value: cached.value,
      timestamp: new Date(cached.timestamp),
      fetchedAt: cached.fetchedAt,
      fromCache: true,
      stale: age > REFRESH_TTL,
    };
  } catch (_) {
    return null;
  }
}

function saveToCache(value, timestamp) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        value,
        timestamp: timestamp.toISOString(),
        fetchedAt: Date.now(),
      })
    );
  } catch (_) {}
}

// Async fetch. Always returns an object with shape:
//   { value, timestamp, fromCache, stale }   — on success (live or cached)
//   { value: null, timestamp: null, error: true } — total failure, no cache
export async function fetchVIX() {
  // Return fresh cache without hitting the network
  const cached = getCachedVIX();
  if (cached && !cached.stale) {
    return cached;
  }

  // Try each proxy URL until one succeeds
  let result = null;
  for (const url of URLS) {
    try {
      result = await fetchFromURL(url);
      break;
    } catch (_) {}
  }

  if (result) {
    saveToCache(result.value, result.timestamp);
    return { ...result, fromCache: false, stale: false };
  }

  // All fetches failed — return stale cache rather than showing an error
  if (cached) {
    return { ...cached, stale: true };
  }

  return { value: null, timestamp: null, error: true };
}
