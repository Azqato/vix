// Raw allocations from PRD. Dividing by sum normalizes each tier to 100%.
const RAW = {
  tier1: { BIL: 25, SPY: 50, QQQ: 20, TQQQ: 5 },
  tier2: { BIL: 20, SPY: 40, QQQ: 30, TQQQ: 10 },
  tier3: { BIL: 15, SPY: 35, QQQ: 35, TQQQ: 15 },
  tier4: { BIL: 10, SPY: 30, QQQ: 40, TQQQ: 20 },
  tier5: { BIL: 5,  SPY: 20, QQQ: 50, TQQQ: 25 },
};

function normalize(raw) {
  const total = Object.values(raw).reduce((a, b) => a + b, 0);
  const result = {};
  for (const [k, v] of Object.entries(raw)) {
    result[k] = parseFloat(((v / total) * 100).toFixed(4));
  }
  return result;
}

const NORMALIZED = {};
for (const [tier, raw] of Object.entries(RAW)) {
  NORMALIZED[tier] = normalize(raw);
}

const TIER_LABELS = {
  tier1: 'VIX < 15 — Low Fear (Complacency)',
  tier2: 'VIX 15–25 — Moderate Fear',
  tier3: 'VIX 25–35 — Elevated Fear',
  tier4: 'VIX 35–45 — High Fear',
  tier5: 'VIX > 45 — Extreme Fear (Crisis)',
};

function getTier(vix) {
  if (vix < 15) return 'tier1';
  if (vix < 25) return 'tier2';
  if (vix < 35) return 'tier3';
  if (vix < 45) return 'tier4';
  return 'tier5';
}

function getAllocation(tier) {
  return NORMALIZED[tier];
}

function getTierLabel(tier) {
  return TIER_LABELS[tier] ?? 'Unknown Tier';
}

const TICKERS = {
  BIL: {
    symbol: 'BIL',
    name: 'SPDR Bloomberg 1–3 Month T-Bill ETF',
    description: 'Near-cash stability. Minimizes drawdown risk during calm markets.',
    color: '#3b82f6',
  },
  SPY: {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    description: 'Broad U.S. market exposure. Core equity holding across all tiers.',
    color: '#00ff88',
  },
  QQQ: {
    symbol: 'QQQ',
    name: 'Invesco Nasdaq-100 ETF',
    description: 'Tech and growth sector concentration. Increases as fear rises.',
    color: '#f59e0b',
  },
  TQQQ: {
    symbol: 'TQQQ',
    name: 'ProShares UltraPro QQQ 3x Leveraged ETF',
    description: '3x leveraged Nasdaq-100. Maximum recovery capture at peak fear.',
    color: '#ef4444',
  },
};

const ALL_TIERS = Object.entries(RAW).map(([key, raw]) => ({
  key,
  label: TIER_LABELS[key],
  raw,
  normalized: normalize(raw),
}));

window.VixStrategy = { getTier, getAllocation, getTierLabel, TICKERS, ALL_TIERS };
