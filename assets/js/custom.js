// Custom Strategy Builder — lets a user substitute their own ticker for
// each of the four fixed risk categories, keeping the same VIX-tier
// percentage weights as the core strategy (see strategy.js NORMALIZED).
//
// No live verification yet (deferred to a later milestone — see
// docs/ROADMAP.md v1.2.0). Input is free-text, sanitized to a plausible
// ticker shape (uppercase, letters/digits/dot/dash, max 10 chars) as basic
// hygiene — this is NOT validation that the ticker actually exists.

// `slot` maps to the existing BIL/SPY/QQQ/TQQQ keys strategy.js's
// getAllocation() already returns percentages for — only the display
// layer changes, tier math is untouched.
const CATEGORIES = [
  {
    slot: 'BIL',
    key: 'RISK_OFF',
    label: 'Risk Off',
    color: '#3b82f6',
    description: 'Capital preservation. Minimizes drawdown risk during calm markets.',
  },
  {
    slot: 'SPY',
    key: 'DIVERSIFY',
    label: 'Diversify',
    color: '#00ff88',
    description: 'Broad, diversified exposure. The steady core position across all tiers.',
  },
  {
    slot: 'QQQ',
    key: 'RISK_ON',
    label: 'Risk On',
    color: '#f59e0b',
    description: 'Growth-oriented exposure. Increases meaningfully as fear rises.',
  },
  {
    slot: 'TQQQ',
    key: 'FULL_RISK',
    label: 'Full Risk',
    color: '#ef4444',
    description: 'Maximum recovery capture at peak fear. Highest risk, highest reward potential.',
  },
];

const CONFIG_KEY = 'vix_custom_tickers';
const TICKER_PATTERN = /^[A-Z0-9.\-]{1,10}$/;

function defaultConfig() {
  const config = {};
  CATEGORIES.forEach((c) => { config[c.key] = c.slot; });
  return config;
}

// Uppercases, trims, and strips anything that isn't a plausible ticker
// character. Not verification — just keeps garbage input from reaching
// the DOM or localStorage in a malformed shape.
function sanitizeTicker(raw, fallback) {
  const cleaned = String(raw ?? '').trim().toUpperCase().replace(/[^A-Z0-9.\-]/g, '').slice(0, 10);
  return TICKER_PATTERN.test(cleaned) ? cleaned : fallback;
}

function getCustomConfig() {
  const fallback = defaultConfig();
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    const config = {};
    CATEGORIES.forEach((c) => {
      config[c.key] = sanitizeTicker(parsed[c.key], c.slot);
    });
    return config;
  } catch (_) {
    return fallback;
  }
}

function saveCustomConfig(config) {
  const sanitized = {};
  CATEGORIES.forEach((c) => {
    sanitized[c.key] = sanitizeTicker(config[c.key], c.slot);
  });
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(sanitized));
  } catch (_) {}
  return sanitized;
}

function resetCustomConfig() {
  try {
    localStorage.removeItem(CONFIG_KEY);
  } catch (_) {}
  return defaultConfig();
}

window.VixCustom = { CATEGORIES, getCustomConfig, saveCustomConfig, resetCustomConfig };
