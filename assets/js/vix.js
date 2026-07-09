// Primary source: window.__VIX_DATA__, set synchronously by data/vix.js
// (<script src="data/vix.js"> loaded before this file), refreshed on a
// schedule by .github/workflows/update-vix.yml. This is a plain global
// read, not a fetch — works identically under file://, a local server,
// or GitHub Pages, since it doesn't touch the network or CORS at all.

// Fallback only, used if window.__VIX_DATA__ is unavailable.
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
const REFRESH_TTL = 30 * 60 * 1000; // re-fetch after 30 minutes

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

function getDataFileVIX() {
  const data = window.__VIX_DATA__;
  if (!data || typeof data.value !== 'number' || !data.timestamp) return null;
  return { value: data.value, timestamp: new Date(data.timestamp) };
}

// Synchronous read of whatever is in localStorage right now.
// Returns null if nothing is stored yet.
function getCachedVIX() {
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
async function fetchVIX() {
  // Return fresh cache without hitting the network
  const cached = getCachedVIX();
  if (cached && !cached.stale) {
    return cached;
  }

  // Try the committed data file first (synchronous global, no network).
  let result = getDataFileVIX();

  // Fall back to the live proxy fetch if the data file is unavailable.
  if (!result) {
    for (const url of URLS) {
      try {
        result = await fetchFromURL(url);
        break;
      } catch (_) {}
    }
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

window.VixData = { getCachedVIX, fetchVIX };
