# Technical Requirements Document

**Product:** VIX Strategy
**Version:** 1.0.11
**Last Updated:** 2026-06-08

---

## System Architecture

VIX Strategy is a **fully static, browser-only application** deployed on GitHub Pages. There is no server, no database, no build pipeline, and no Node.js runtime. All logic executes in the browser.

```
Browser
  └── index.html  /  strategy.html
        ├── assets/css/styles.css          (all styling)
        ├── assets/js/vix.js               (data fetch + localStorage cache)
        ├── assets/js/strategy.js          (tier logic + allocation)
        └── assets/js/chart.js             (Chart.js 4.4.0 wrapper)
              │
              ├── [CDN] Chart.js 4.4.0 — jsdelivr.net
              │
              └── [External] Yahoo Finance JSON API
                    └── via allorigins.win CORS proxy
```

Data flow on each page load:
1. `getCachedVIX()` reads `localStorage` synchronously — zero network latency.
2. If the cached value is ≥30 min old (or absent), `fetchVIX()` fires an async HTTP request through the CORS proxy.
3. `getTier(vixValue)` maps the number to one of 5 string keys (`tier1`–`tier5`).
4. `getAllocation(tier)` returns a normalized `{ BIL, SPY, QQQ, TQQQ }` percentage object.
5. `initChart()` / `updateChart()` render or update the doughnut chart on strategy.html.

---

## Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Markup | HTML5 | — | Two pages: index.html, strategy.html |
| Styling | CSS3 with custom properties | — | Single file: assets/css/styles.css |
| Logic | Vanilla JavaScript | ES2020+ | ES Modules (`type="module"`) throughout |
| Charts | Chart.js | 4.4.0 | Loaded as CDN UMD synchronous `<script>` tag |
| VIX data | Yahoo Finance JSON API | v8 | Not browser-accessible directly; requires CORS proxy |
| CORS proxy | allorigins.win | — | Public, unauthenticated relay service |
| Hosting | GitHub Pages | — | Serves static files from `main` branch root |

---

## Folder Structure

```
VIX/
├── index.html              # Pitch page — explains strategy rationale
├── strategy.html           # Live dashboard — real-time VIX allocation
├── assets/
│   ├── css/
│   │   └── styles.css      # All styles; CSS custom properties for theming
│   ├── js/
│   │   ├── vix.js          # VIX fetch, localStorage cache, getCachedVIX()
│   │   ├── strategy.js     # getTier(), getAllocation(), TICKERS, ALL_TIERS
│   │   └── chart.js        # initChart(), updateChart(), centerTextPlugin
│   └── img/
│       ├── logo.svg        # VIX wordmark with volatility spike polyline
│       └── favicon.svg     # Emoji favicon (📈 in SVG)
├── docs/
│   ├── PRD.md              # Product requirements
│   ├── TRD.md              # This file
│   ├── DESIGN.md           # Design system
│   ├── PATCHNOTES.md       # Full changelog
│   ├── PRFAQ.md            # Press release and FAQs
│   ├── TENETS.md           # Product tenets
│   ├── METRICS.md          # Success metrics
│   ├── ROADMAP.md          # Milestones and backlog
│   ├── SECURITY.md         # Security model
│   └── RUNBOOK.md          # Operational runbook
└── README.md               # Developer-facing setup guide
```

---

## Data Models

### VIX Cache Entry — stored in `localStorage['vix_last_known']`

```json
{
  "value": 18.43,
  "timestamp": "2026-06-08T14:30:00.000Z",
  "fetchedAt": 1749302400000
}
```

| Field | Type | Description |
|-------|------|-------------|
| `value` | number | The `regularMarketPrice` value from Yahoo Finance |
| `timestamp` | ISO 8601 string | The `regularMarketTime` from Yahoo Finance, converted from Unix seconds to Date |
| `fetchedAt` | Unix ms | When the value was saved; used to evaluate the 30-minute TTL |

### VIX Result Object — returned by `getCachedVIX()` and `fetchVIX()`

```typescript
// Success (live or cached)
{ value: number; timestamp: Date; fetchedAt?: number; fromCache: boolean; stale: boolean; }

// Total failure (no network, no cache)
{ value: null; timestamp: null; error: true; }
```

### Allocation Object — returned by `getAllocation(tier)`

```typescript
{ BIL: number; SPY: number; QQQ: number; TQQQ: number; }
```

All four values are percentages. They sum to exactly 100.0.

### Tier Key

`'tier1' | 'tier2' | 'tier3' | 'tier4' | 'tier5'`

| Key | VIX Range | Label |
|-----|-----------|-------|
| `tier1` | < 15 | Low Fear (Complacency) |
| `tier2` | 15–25 | Moderate Fear |
| `tier3` | 25–35 | Elevated Fear |
| `tier4` | 35–45 | High Fear |
| `tier5` | ≥ 45 | Extreme Fear (Crisis) |

### TICKERS Object — exported from `strategy.js`

```typescript
{
  [symbol: string]: {
    symbol: string;   // e.g. "BIL"
    name: string;     // e.g. "SPDR Bloomberg 1–3 Month T-Bill ETF"
    description: string;
    color: string;    // hex, e.g. "#3b82f6"
  }
}
```

---

## Internal Data Flow

Since there is no server, this section documents the browser-side data flow.

### index.html boot sequence

1. Inline `<script type="module">` imports `getCachedVIX` from `vix.js` and `getTier` from `strategy.js`.
2. `getCachedVIX()` reads `localStorage` synchronously — no network wait.
3. If a cached value exists, `updateGauge(cached.value)` sets the hero VIX display and tier badge immediately.
4. `fetchVIX()` fires asynchronously. On resolve, `updateGauge()` overwrites if the value changed.

### strategy.html boot sequence

1. `paintCached()` — reads localStorage, renders VIX number, tier banner, chart, and both tables immediately.
2. `refresh()` — fires async, calls all update functions when live value arrives.
3. `setInterval(refresh, 60_000)` — repeats live fetch every 60 seconds.
4. Refresh button — clears `localStorage['vix_last_known']`, then calls `refresh()`.

### VIX fetch sequence — inside `fetchVIX()`

1. Call `getCachedVIX()`. If age < 30 min, return immediately — no HTTP request.
2. Try proxy URL 1 (`query1.finance.yahoo.com`).
3. On failure, try proxy URL 2 (`query2.finance.yahoo.com`).
4. On success: parse `chart.result[0].meta.regularMarketPrice` and `regularMarketTime`, save to `localStorage`, return `{ ...result, fromCache: false, stale: false }`.
5. On total failure but cache present: return `{ ...cached, stale: true }`.
6. On total failure and no cache: return `{ value: null, timestamp: null, error: true }`.

---

## State Management

All state lives in exactly two places:

| Location | Contents | Lifetime |
|----------|----------|---------|
| `localStorage['vix_last_known']` | Serialized VIX value, ISO timestamp, fetchedAt Unix ms | Persists indefinitely across tabs, pages, and browser restarts until cleared by Refresh button or user |
| DOM | Rendered VIX number, tier label, chart data, table rows, badge state | Page session only; repopulated on each boot from cache + live fetch |

There is no in-memory state object, no reactive framework, and no event bus. Each page reads from localStorage and renders directly to the DOM.

---

## Third-Party Integrations

### Yahoo Finance JSON API

| Attribute | Value |
|-----------|-------|
| Endpoint | `https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX` |
| Fallback | `https://query2.finance.yahoo.com/v8/finance/chart/%5EVIX` |
| Authentication | None — public endpoint |
| Fields used | `chart.result[0].meta.regularMarketPrice` (float), `chart.result[0].meta.regularMarketTime` (Unix seconds) |
| Direct browser access | Blocked by CORS — must use proxy |

### allorigins.win CORS Proxy

| Attribute | Value |
|-----------|-------|
| Endpoint | `https://api.allorigins.win/raw?url=<encoded-target>` |
| Authentication | None — free public service |
| SLA | None |
| Failure mode | On outage: `fetchVIX()` falls back to cached value with `stale: true` |
| History | Replaced `corsproxy.io` in v1.0.2; `corsproxy.io` blocked by Yahoo Finance (HTTP 403) |

### Chart.js CDN (jsDelivr)

| Attribute | Value |
|-----------|-------|
| URL | `https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js` |
| Version | Pinned to 4.4.0 |
| Authentication | None |
| Load order | Synchronous `<script>` tag before any `type="module"` script — sets `window.Chart` |
| Failure mode | Chart canvas is blank; VIX value and allocation tables still render |
| SRI hash | Not implemented (known debt — see below) |

---

## Performance Requirements

| Metric | Target |
|--------|--------|
| VIX value in DOM (from cache) | < 100ms — synchronous localStorage read |
| Page fully interactive | < 1.5s on standard broadband |
| Live VIX fetch complete | < 5s (network-dependent; proxy adds ~300–800ms) |
| Minimum supported viewport | 375px wide |
| Chart.js CDN load | < 1s (pinned CDN, ~60KB gzipped) |
| Console errors on production load | 0 |

---

## Known Technical Debt

| Item | Current approach | Correct approach |
|------|-----------------|-----------------|
| CORS proxy dependency | Relies on free public allorigins.win | A Cloudflare Worker or similar serverless function would own the proxy and remove the third-party dependency |
| No SRI hash on Chart.js CDN | `<script src>` has no `integrity` attribute | Add `integrity="sha384-..."` to protect against CDN compromise |
| No fallback for chart failure | Blank canvas if jsDelivr is unreachable | Detect CDN load failure (`window.Chart` undefined) and render a text-only allocation display |
| Normalization is a no-op | Raw allocations already sum to 100%; normalization runs but changes nothing | Remove normalization or add an assertion that values sum to 100 |
| No automated tests | Zero test coverage | Add unit tests for `getTier()` and `getAllocation()` using Vitest or plain browser assertions |
| Manual version tracking | Version numbers updated by hand across multiple files | Automate with git tags and a single source-of-truth version constant |
