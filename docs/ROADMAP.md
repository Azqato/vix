# Roadmap

**Product:** VIX Strategy
**Version:** 1.2.0
**Last Updated:** 2026-07-09

---

## Current Phase

**Phase 2 — Server-Side Data + Custom Strategies (v1.1.x–v1.2.x)**
The MVP (v1.0.x) is complete and deployed. VIX data refreshes on a schedule via GitHub Actions in addition to the live browser fetch. The "Custom" strategy builder (v1.2.0) has shipped with free-text ticker entry; live ticker verification against a real quote is deferred to v1.2.1. Next up: verification, then the existing v1.3.0+ feature backlog.

---

## Milestone Table

| Milestone | Version | Status | Completed |
|-----------|---------|--------|-----------|
| Initial scaffolding and documentation | v1.0.0 | Complete | 2026-06-06 |
| Full HTML/CSS/JS implementation | v1.0.1 | Complete | 2026-06-06 |
| CORS proxy fix (allorigins.win) | v1.0.2 | Complete | 2026-06-06 |
| Dashboard boot fix (module race condition) | v1.0.3 | Complete | 2026-06-06 |
| localStorage migration + getCachedVIX() | v1.0.4 | Complete | 2026-06-06 |
| Documentation update | v1.0.5 | Complete | 2026-06-06 |
| Cache TTL increase to 30 minutes | v1.0.6 | Complete | 2026-06-06 |
| Eastern Time timestamp display | v1.0.7 | Complete | 2026-06-06 |
| Emoji favicon | v1.0.8 | Complete | 2026-06-06 |
| Footer credit + Support nav link | v1.0.9 | Complete | 2026-06-07 |
| Navigation rebuild with active-page highlight | v1.0.10 | Complete | 2026-06-07 |
| Full documentation audit | v1.0.11 | Complete | 2026-06-08 |
| Server-side VIX data pipeline (GitHub Actions) | v1.1.0 | Complete | 2026-07-09 |
| Fix inline-script global scope collision (SyntaxError breaking VIX display) | v1.1.1 | Complete | 2026-07-09 |
| Custom strategy builder ("Custom" tab), free-text tickers | v1.2.0 | Complete | 2026-07-09 |
| Live ticker verification against a real quote | v1.2.1 | Planned | TBD |
| SMH/SOXL strategy toggle | v1.3.0 | Planned | TBD |
| QQQ vs 200-day MA trend filter | v1.4.0 | Planned | TBD |
| VIX percentile rank mode | v1.5.0 | Planned | TBD |
| 12-month historical VIX sparkline | v1.6.0 | Planned | TBD |
| Backtesting visualization | v1.7.0 | Planned | TBD |
| Full portfolio tracker | v2.0.0 | Planned | TBD |

---

## Feature Breakdown Per Milestone

### v1.1.0 — Server-Side VIX Data Pipeline + `file://` Support — Complete
- New scheduled GitHub Actions workflow (`update-vix.yml`) fetches VIX directly from Yahoo Finance's `v8/finance/chart/^VIX` endpoint server-side (no CORS proxy needed off-browser) and commits the result to `data/vix.js` in the repo, as a `window.__VIX_DATA__ = {...}` assignment (not JSON)
- Runs on 8 fixed cron schedules per weekday, 9:45am–4:45pm ET, hourly. Fixed to EST (UTC-5) year-round rather than DST-aware — during EDT (roughly March–November) every run lands one hour later in ET (e.g. the close-of-day run fires at 5:45pm ET instead of 4:45pm). Accepted tradeoff to keep the schedule simple and low-frequency (8 runs/weekday, no polling)
- `vix.js`, `strategy.js`, and `chart.js` converted from ES modules (`type="module"`, `import`/`export`) to classic `<script src>` tags with `window.*` namespaces (`window.VixData`, `window.VixStrategy`, `window.VixChart`). This was necessary, not just a nicety: browsers block `type="module"` scripts entirely under `file://`, so the site previously failed completely when opened by double-clicking `index.html` instead of via a server
- `data/vix.js` is loaded via a plain `<script src>` tag rather than `fetch()`, since fetching a local file is separately blocked under `file://` even for classic scripts — `vix.js`'s `fetchVIX()` now reads the resulting `window.__VIX_DATA__` global synchronously, no network call involved, working identically under `file://`, a local server, or GitHub Pages
- Net result: `index.html`/`strategy.html` can now be opened directly via `file://` with no local server required, and still show real (if not up-to-the-second) VIX data
- Falls back to the existing allorigins.win proxy fetch only if `window.__VIX_DATA__` is unavailable
- Resolves both the CORS-proxy-dependency and `file://`-support items in TRD.md's Known Technical Debt; the proxy fallback remains in `vix.js` as a safety net
- Requires `permissions: contents: write` on the workflow; failed fetches skip the commit and let the next scheduled run retry
- `actions/checkout` bumped from `v4` to `v7` to target Node 24 natively (v4 targets Node 20, which GitHub now forces onto Node 24 with a deprecation warning)

### v1.1.1 — Fix Inline-Script Global Scope Collision — Complete
- The v1.1.0 classic-script conversion introduced a regression: `index.html`/`strategy.html`'s inline boot `<script>` blocks destructured `getCachedVIX`, `fetchVIX`, `getTier`, etc. as top-level `const` — but classic scripts share one global scope, and `vix.js`/`strategy.js` already declared top-level `function` bindings with those exact names. The redeclaration threw a `SyntaxError` on every page load, silently killing the entire inline script before any DOM update ran
- Symptom: VIX value stuck on `--`, no loading counter, no tier badge — on GitHub Pages, `file://`, and local servers alike, including incognito (ruling out a caching explanation)
- Fixed by wrapping each inline script's content in an IIFE (`(function () { ... })();`), giving its `const` declarations their own scope so they safely shadow the globals instead of colliding with them
- See `docs/PATCHNOTES.md` [1.1.1] for full detail

### v1.2.0 — Custom Strategy Builder ("Custom" tab) — Complete
- New `custom.html` page, added to the nav on every page as **Custom**, between Dashboard and Azqato Invests
- Four fixed risk categories, seeded from the core strategy: **Risk Off** (default BIL), **Diversify** (default SPY), **Risk On** (default QQQ), **Full Risk** (default TQQQ) — each with a free-text input for the user's own ticker
- Input is free-text, not verified against a live quote — sanitized client-side (`assets/js/custom.js`: uppercased, restricted to `[A-Z0-9.-]`, max 10 chars) as basic hygiene only, not existence validation. The UI explicitly labels this ("tickers are not yet verified") so it isn't mistaken for real validation. Live verification is deferred to v1.2.1
- Recomputes the VIX-tier allocation table using the same tier boundaries and percentage weights as the core strategy (`getAllocation()` in `strategy.js`, unmodified) — only the displayed ticker per category changes, not the math
- Selections persist in `localStorage['vix_custom_tickers']` only, consistent with the site's no-backend model
- `chart.js`'s `initChart()`/`updateChart()` extended with an optional `labels` parameter so the doughnut chart can show custom ticker symbols instead of the hardcoded BIL/SPY/QQQ/TQQQ labels, without touching the core strategy.html usage (labels default to the original four when omitted)
- All user-entered ticker text is rendered via `.textContent`/`.value`, never `innerHTML` — this is the first user-input surface in the app, so DOM-injection safety was treated as a hard requirement, not an afterthought (see `docs/SECURITY.md`)

### v1.2.1 — Live Ticker Verification
- On blur (or explicit action), verify the entered ticker actually resolves to a quote — reuse the existing Yahoo Finance `v8/finance/chart/<TICKER>` endpoint via the allorigins.win proxy, the same pattern already used for VIX itself
- Show inline state: `Verifying…` → ✓ valid (surface the resolved company/fund name) or ✗ invalid (`Ticker not found`)
- Debounce input and cache verified tickers for the session to avoid redundant lookups
- Degrade gracefully if allorigins.win is unavailable — don't hard-block saving, since the proxy has no SLA
- Does not attempt to confirm the ticker is actually an ETF (vs. a single stock) or a sensible fit for its category — Yahoo's response doesn't cleanly distinguish instrument type; scope stays to "does this symbol exist and trade"

### v1.3.0 — SMH/SOXL Strategy Toggle
- Add a second allocation table: QQQ / SMH (VanEck Semiconductor) / TQQQ / SOXL (Direxion Semiconductor 3x)
- UI toggle between "Core Strategy" and "Growth Rocket" mode on strategy.html
- Same VIX tier boundaries; different allocations per tier
- No changes to existing tier logic, VIX fetch, or chart infrastructure

### v1.4.0 — Trend Filter
- Fetch QQQ 200-day moving average from Yahoo Finance historical endpoint
- Optional toggle: if QQQ is below its 200-day MA, suppress TQQQ allocation (redistribute to QQQ)
- Display QQQ MA relationship as a supplemental badge or indicator
- Filter is opt-in; default behavior unchanged

### v1.5.0 — VIX Percentile Rank
- Fetch 252 days of VIX historical data from Yahoo Finance
- Compute current VIX's percentile rank vs. trailing year
- Display as supplemental badge adjacent to the current VIX value on strategy.html
- Adds context for whether the current VIX is historically high or low

### v1.6.0 — Historical VIX Sparkline
- Render a 12-month Chart.js line chart on strategy.html
- Show the five tier boundary lines as horizontal reference lines
- Mark the current VIX value with a distinct point
- Data from Yahoo Finance historical daily endpoint via CORS proxy

### v1.7.0 — Backtesting Visualization
- Fetch multi-year daily VIX and ETF price history from Yahoo Finance
- Simulate strategy portfolio value over time vs. SPY buy-and-hold
- Render results as a Chart.js multi-line chart
- Largest feature to date; requires significant data processing in the browser

### v2.0.0 — Portfolio Tracker
- User enters current holdings (ticker, shares or dollar value)
- App computes target allocation in dollars and the delta from current state ("buy $X of TQQQ, sell $Y of BIL")
- Requires persistent user data — browser-only localStorage approach preferred to avoid adding a backend
- Significant UX complexity; scope needs further definition before starting

---

## Explicitly Deferred

| Feature | Reason deferred |
|---------|----------------|
| Push/email notifications for tier changes | Requires service worker and either a backend or third-party push service. Violates the no-backend tenet. |
| Brokerage integration (auto-rebalance) | Requires OAuth flows, API keys per broker, and regulatory considerations far outside current scope. |
| Native mobile app (iOS/Android) | No evidence of demand. The web app is fully responsive. Build cost is not justified. |
| Dark/light mode toggle | The dark terminal aesthetic is intentional and core to the design identity. Adding a light mode adds maintenance cost with no clear user benefit. |
| Multi-strategy comparison view | Adds UI complexity that risks confusing users who come for a single clear answer. Deferred until post-v2.0 when user research is available. |
| VIX-based options strategy guidance | Requires options-specific risk disclosure, regulatory complexity, and deeper financial expertise outside the current product scope. |
