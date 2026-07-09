# Technical Requirements Document

**Product:** VIX Strategy
**Version:** 1.2.0
**Last Updated:** 2026-07-09

---

## System Architecture

VIX Strategy is a **fully static, browser-only application** deployed on GitHub Pages. There is no server, no database, no build pipeline, and no Node.js runtime for the site itself. The one exception is a scheduled GitHub Actions workflow that fetches VIX data server-side and commits it to the repo — see below.

```
GitHub Actions (update-vix.yml)                     Browser
  8 fixed cron runs/weekday, EST-basis                └── index.html  /  strategy.html
    │                                                        ├── assets/css/styles.css      (all styling)
    ├── [External] Yahoo Finance JSON API                    ├── data/vix.js                (window.__VIX_DATA__ global)
    │     (direct — no CORS restriction server-side)          ├── assets/js/vix.js           (data read + localStorage cache)
    │                                                        ├── assets/js/strategy.js      (tier logic + allocation)
    └── commits → data/vix.js ────────────────────────────────┤ assets/js/chart.js         (Chart.js 4.4.0 wrapper)
                                                                    │
                                                                    ├── [CDN] Chart.js 4.4.0 — jsdelivr.net
                                                                    └── [External, fallback only] Yahoo Finance JSON API
                                                                          └── via allorigins.win CORS proxy
```

All four scripts (`data/vix.js`, `assets/js/vix.js`, `assets/js/strategy.js`, `assets/js/chart.js`) are loaded as plain classic `<script src="...">` tags, in that order, followed by an inline `<script>` — no `type="module"`. Each file attaches its exports to a `window.*` namespace (`window.VixData`, `window.VixStrategy`, `window.VixChart`) instead of using `import`/`export`. This is a deliberate choice: `type="module"` scripts are blocked entirely by browsers when loaded via `file://`, which broke the site whenever someone opened `index.html` directly instead of through a server. Classic scripts execute under `file://`, `http://localhost`, and GitHub Pages identically.

Data flow on each page load:
1. `getCachedVIX()` reads `localStorage` synchronously — zero network latency.
2. If the cached value is ≥30 min old (or absent), `fetchVIX()` reads `window.__VIX_DATA__` (set synchronously by `data/vix.js`, no network call, no CORS concern). If that global is unavailable, it falls back to the CORS-proxied Yahoo Finance request.
3. `getTier(vixValue)` maps the number to one of 5 string keys (`tier1`–`tier5`).
4. `getAllocation(tier)` returns a normalized `{ BIL, SPY, QQQ, TQQQ }` percentage object.
5. `initChart()` / `updateChart()` render or update the doughnut chart on strategy.html.

Data flow for `data/vix.js` itself:
1. `.github/workflows/update-vix.yml` runs on 8 fixed cron schedules per weekday (9:45am–4:45pm ET, hourly, fixed to EST/UTC-5 year-round — see Third-Party Integrations below for the DST tradeoff).
2. The workflow calls the Yahoo Finance endpoint directly from the runner (no CORS proxy needed outside a browser).
3. On success, it writes `data/vix.js` (a `window.__VIX_DATA__ = {...}` assignment, not JSON) and commits/pushes only if the value changed.
4. On failure, the step is skipped and the previous `data/vix.js` value remains live until the next scheduled run.

---

## Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Markup | HTML5 | — | Three pages: index.html, strategy.html, custom.html |
| Styling | CSS3 with custom properties | — | Single file: assets/css/styles.css |
| Logic | Vanilla JavaScript | ES2020+ | Classic scripts (`<script src>`, no `type="module"`), each attaching to a `window.*` namespace — chosen so the site works under `file://`, not just HTTP(S) |
| Charts | Chart.js | 4.4.0 | Loaded as CDN UMD synchronous `<script>` tag |
| VIX data (primary) | `data/vix.js` (repo file) | — | `window.__VIX_DATA__` global, loaded via `<script src>`; refreshed by scheduled GitHub Actions workflow; no network call from the browser |
| VIX data (fallback) | Yahoo Finance JSON API | v8 | Not browser-accessible directly; requires CORS proxy. Only used if `window.__VIX_DATA__` is unavailable |
| CORS proxy | allorigins.win | — | Public, unauthenticated relay service; fallback path only |
| Scheduled data refresh | GitHub Actions (`update-vix.yml`) | — | 8 fixed cron runs per weekday, fetches Yahoo Finance directly (no proxy) and commits `data/vix.js` |
| Hosting | GitHub Pages | — | Serves static files from `main` branch root |

---

## Folder Structure

```
vix/
├── index.html              # Pitch page — explains strategy rationale
├── strategy.html           # Live dashboard — real-time VIX allocation
├── custom.html             # Custom strategy builder — user-chosen tickers per risk category
├── data/
│   └── vix.js              # window.__VIX_DATA__ = { value, timestamp, fetchedAt } — written by update-vix.yml
├── .github/
│   └── workflows/
│       └── update-vix.yml  # Scheduled Yahoo Finance fetch → commits data/vix.js
├── assets/
│   ├── css/
│   │   └── styles.css      # All styles; CSS custom properties for theming
│   ├── js/
│   │   ├── vix.js          # window.VixData — VIX read (data file + proxy fallback), localStorage cache
│   │   ├── strategy.js     # window.VixStrategy — getTier(), getAllocation(), TICKERS, ALL_TIERS
│   │   ├── chart.js        # window.VixChart — initChart(), updateChart(), centerTextPlugin
│   │   └── custom.js       # window.VixCustom — CATEGORIES, getCustomConfig(), saveCustomConfig(), sanitizeTicker()
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

### VIX Data File — `data/vix.js`

```javascript
window.__VIX_DATA__ = {
  "value": 15.98,
  "timestamp": "2026-07-09T17:48:01.000Z",
  "fetchedAt": 1783620198259
};
```

| Field | Type | Description |
|-------|------|-------------|
| `value` | number | `regularMarketPrice` from Yahoo Finance, as fetched by the workflow |
| `timestamp` | ISO 8601 string | `regularMarketTime` from Yahoo Finance, converted from Unix seconds |
| `fetchedAt` | Unix ms | When the GitHub Actions run wrote this value |

Written by `.github/workflows/update-vix.yml`; loaded via a plain `<script src="data/vix.js">` tag (not `fetch()`) so it works under `file://` as well as HTTP(S). Read synchronously by `getDataFileVIX()` in `vix.js` as the primary VIX source.

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

All four values are percentages. They sum to exactly 100.0. `custom.html` reuses this object unmodified — the keys (`BIL`/`SPY`/`QQQ`/`TQQQ`) are fixed "slots" for percentage math; only the *displayed* ticker per slot differs (see Custom Ticker Config below).

### Custom Ticker Config — stored in `localStorage['vix_custom_tickers']`

```json
{
  "RISK_OFF": "BIL",
  "DIVERSIFY": "SPY",
  "RISK_ON": "QQQ",
  "FULL_RISK": "TQQQ"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `RISK_OFF` / `DIVERSIFY` / `RISK_ON` / `FULL_RISK` | string | User-entered ticker for that category, sanitized by `sanitizeTicker()` in `custom.js`: uppercased, restricted to `[A-Z0-9.-]`, max 10 characters. Defaults to the core strategy's ticker for that slot (BIL/SPY/QQQ/TQQQ respectively) if empty, invalid, or unset. |

Written and read by `getCustomConfig()`/`saveCustomConfig()`/`resetCustomConfig()` in `custom.js`. Each category also carries a fixed `slot` (`RISK_OFF` → `BIL`, `DIVERSIFY` → `SPY`, `RISK_ON` → `QQQ`, `FULL_RISK` → `TQQQ`) used only to look up the correct percentage from the `Allocation Object` above — the slot names are internal plumbing, never shown in the UI.

### Tier Key

`'tier1' | 'tier2' | 'tier3' | 'tier4' | 'tier5'`

| Key | VIX Range | Label |
|-----|-----------|-------|
| `tier1` | < 15 | Low Fear (Complacency) |
| `tier2` | 15–25 | Moderate Fear |
| `tier3` | 25–35 | Elevated Fear |
| `tier4` | 35–45 | High Fear |
| `tier5` | ≥ 45 | Extreme Fear (Crisis) |

### TICKERS Object — `window.VixStrategy.TICKERS`, defined in `strategy.js`

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

### Script load order (all three pages)

`data/vix.js` → `assets/js/vix.js` → `assets/js/strategy.js` → `assets/js/chart.js` (strategy.html and custom.html only) → `assets/js/custom.js` (custom.html only) → inline `<script>`. All are classic scripts (no `type="module"`), loaded in this exact order at the end of `<body>`, so each namespace (`window.VixStrategy`, `window.VixData`, `window.VixChart`, `window.VixCustom`) exists by the time later scripts and the inline boot code run.

### index.html boot sequence

1. Inline `<script>` reads `getCachedVIX`/`fetchVIX` from `window.VixData` and `getTier` from `window.VixStrategy`.
2. `getCachedVIX()` reads `localStorage` synchronously — no network wait.
3. If a cached value exists, `updateGauge(cached.value)` sets the hero VIX display and tier badge immediately.
4. `fetchVIX()` fires asynchronously. On resolve, `updateGauge()` overwrites if the value changed.

### strategy.html boot sequence

1. `paintCached()` — reads localStorage, renders VIX number, tier banner, chart, and both tables immediately.
2. `refresh()` — fires async, calls all update functions when live value arrives.
3. `setInterval(refresh, 60_000)` — repeats live fetch every 60 seconds.
4. Refresh button — clears `localStorage['vix_last_known']`, then calls `refresh()`.

### custom.html boot sequence

1. `getCustomConfig()` reads `localStorage['vix_custom_tickers']` synchronously (falls back to BIL/SPY/QQQ/TQQQ defaults) and `buildFormFields()` populates the four ticker inputs.
2. `paintCached()` — reads the VIX localStorage cache, renders VIX number, tier banner, chart (with custom ticker labels), and allocation table immediately, same pattern as strategy.html.
3. `refresh()` — fires async, same VIX fetch path as strategy.html (`window.VixData.fetchVIX()`), re-renders on resolve.
4. `setInterval(refresh, 60_000)` — repeats live fetch every 60 seconds, same as strategy.html.
5. Save button (`customize-form` submit) — reads the four inputs, calls `saveCustomConfig()`, rebuilds the form fields with sanitized values, and re-renders the chart/legend/table against the currently cached VIX value (no new VIX fetch needed — only the ticker labels changed).
6. Reset button — calls `resetCustomConfig()`, rebuilds the form with defaults, re-renders.

### VIX fetch sequence — inside `fetchVIX()`

1. Call `getCachedVIX()`. If age < 30 min, return immediately — no HTTP request.
2. Read `window.__VIX_DATA__` via `getDataFileVIX()` — synchronous, no network, works under `file://`.
3. If that global is missing/malformed, fall back to proxy URL 1 (`query1.finance.yahoo.com` via allorigins.win).
4. On failure, fall back to proxy URL 2 (`query2.finance.yahoo.com` via allorigins.win).
5. On success: save to `localStorage`, return `{ ...result, fromCache: false, stale: false }`.
6. On total failure but cache present: return `{ ...cached, stale: true }`.
7. On total failure and no cache: return `{ value: null, timestamp: null, error: true }`.

### Scheduled data refresh sequence — inside `update-vix.yml`

1. Cron fires on one of 8 fixed weekday schedules (see Third-Party Integrations below).
2. Fetch `query1.finance.yahoo.com` directly from the runner; on failure, try `query2.finance.yahoo.com`.
3. On success: write `data/vix.js` (a `window.__VIX_DATA__ = {...}` assignment), commit and push only if the value changed from the last commit.
4. On total failure: skip the commit step entirely; the previous `data/vix.js` stays live until the next scheduled run.

---

## State Management

All state lives in these places:

| Location | Contents | Lifetime |
|----------|----------|---------|
| `localStorage['vix_last_known']` | Serialized VIX value, ISO timestamp, fetchedAt Unix ms | Persists indefinitely across tabs, pages, and browser restarts until cleared by Refresh button or user |
| `localStorage['vix_custom_tickers']` | Four sanitized ticker strings, one per risk category | Persists indefinitely until Reset button or user clears it; only read/written by `custom.html` |
| `data/vix.js` (repo) → `window.__VIX_DATA__` | VIX value, ISO timestamp, fetchedAt Unix ms | Overwritten by `update-vix.yml` on each successful scheduled run; otherwise persists as the last-known value |
| DOM | Rendered VIX number, tier label, chart data, table rows, badge state, form field values | Page session only; repopulated on each boot from cache + live fetch (+ custom config on custom.html) |

There is no in-memory state object, no reactive framework, and no event bus. Each page reads from localStorage and renders directly to the DOM.

---

## Third-Party Integrations

### GitHub Actions — `update-vix.yml`

| Attribute | Value |
|-----------|-------|
| Trigger | 8 fixed `schedule` cron entries (weekdays only) + `workflow_dispatch` for manual runs |
| Schedule basis | Fixed to EST (UTC-5) year-round — intentionally not DST-aware |
| Nominal times (EST, Nov–Mar) | 9:45am, 10:45am, 11:45am, 12:45pm, 1:45pm, 2:45pm, 3:45pm, 4:45pm ET |
| Actual times during EDT (Mar–Nov) | Same list, shifted one hour later (e.g. the close-of-day run lands at 5:45pm ET instead of 4:45pm) |
| Permissions | `contents: write`, to commit `data/vix.js` back to `main` |
| Failure mode | Fetch step failure skips the commit; previous `data/vix.js` stays live until the next scheduled run |
| Runner Node version | `actions/checkout@v7` (targets Node 24 natively — v4 was forced onto Node 24 with a deprecation warning since it targets Node 20) |

The DST drift is an accepted tradeoff for a simple, fixed, low-frequency schedule (8 runs/weekday, no polling) — see `docs/ROADMAP.md` v1.1.0.

### Yahoo Finance JSON API

| Attribute | Value |
|-----------|-------|
| Endpoint | `https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX` |
| Fallback | `https://query2.finance.yahoo.com/v8/finance/chart/%5EVIX` |
| Authentication | None — public endpoint |
| Fields used | `chart.result[0].meta.regularMarketPrice` (float), `chart.result[0].meta.regularMarketTime` (Unix seconds) |
| Direct browser access | Blocked by CORS |
| Direct server-side access (GitHub Actions runner) | Not blocked — CORS only applies to browsers, so `update-vix.yml` calls this endpoint directly with no proxy |

### allorigins.win CORS Proxy

| Attribute | Value |
|-----------|-------|
| Endpoint | `https://api.allorigins.win/raw?url=<encoded-target>` |
| Authentication | None — free public service |
| SLA | None |
| Role | Fallback only, used by the browser if `window.__VIX_DATA__` is unavailable |
| Failure mode | On outage: `fetchVIX()` falls back to cached value with `stale: true` |
| History | Replaced `corsproxy.io` in v1.0.2; `corsproxy.io` blocked by Yahoo Finance (HTTP 403) |

### Chart.js CDN (jsDelivr)

| Attribute | Value |
|-----------|-------|
| URL | `https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js` |
| Version | Pinned to 4.4.0 |
| Authentication | None |
| Load order | Synchronous `<script>` tag before the classic scripts below it — sets `window.Chart` |
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
| ~~CORS proxy dependency~~ | Resolved in v1.1.0 — `data/vix.js` (fetched server-side by `update-vix.yml`, loaded via `<script src>`) is now the primary source; allorigins.win is fallback only | Once the data-file path is verified stable in production, the proxy fallback can be removed from `vix.js` entirely |
| ~~ES modules blocked under `file://`~~ | Resolved in v1.1.0 — `vix.js`/`strategy.js`/`chart.js` converted from `type="module"`/`import`/`export` to classic `<script src>` tags with `window.*` namespaces | None — this was the correct approach, adopted to fix `file://` support |
| No SRI hash on Chart.js CDN | `<script src>` has no `integrity` attribute | Add `integrity="sha384-..."` to protect against CDN compromise |
| No fallback for chart failure | Blank canvas if jsDelivr is unreachable | Detect CDN load failure (`window.Chart` undefined) and render a text-only allocation display |
| Normalization is a no-op | Raw allocations already sum to 100%; normalization runs but changes nothing | Remove normalization or add an assertion that values sum to 100 |
| No automated tests | Zero test coverage | Add unit tests for `getTier()` and `getAllocation()` using Vitest or plain browser assertions |
| Manual version tracking | Version numbers updated by hand across multiple files | Automate with git tags and a single source-of-truth version constant |
