# VIX Strategy

> *Fear is a signal. Use it.*

**Current version: v1.0.4**

A rules-based, browser-only portfolio strategy dashboard that uses the CBOE VIX (Volatility Index) to dynamically compute ETF allocations in real time. Built for GitHub Pages with zero backend.

---

## What Is This?

VIX Strategy is a two-page static web application:

1. **index.html** – A pitch page explaining why VIX-based dynamic allocation is a powerful long-term investing framework.
2. **strategy.html** – A live dashboard showing the current VIX value and the resulting portfolio allocation via a doughnut chart and allocation table.

There is no server, no login, no database. Everything runs in the browser.

---

## The Strategy (Overview)

The core idea: **the VIX is a mean-reverting fear gauge**. When markets panic, VIX spikes. Historically, elevated VIX precedes the strongest market recoveries. This strategy mechanically tilts toward more aggressive leveraged ETF exposure precisely when fear is highest, and reduces risk when markets are calm.

### Allocation Table (v1.0.4 — Live)

| VIX Range | BIL | SPY | QQQ | TQQQ |
|-----------|-----|-----|-----|------|
| < 15      | 25% | 50% | 20% | 5%   |
| 15–25     | 20% | 40% | 30% | 10%  |
| 25–35     | 15% | 35% | 35% | 15%  |
| 35–45     | 10% | 30% | 40% | 20%  |
| > 45      | 5%  | 20% | 50% | 25%  |

**Key Tickers:**
- **BIL** – SPDR Bloomberg 1–3 Month T-Bill ETF (near-cash)
- **SPY** – SPDR S&P 500 ETF
- **QQQ** – Invesco Nasdaq-100 ETF
- **TQQQ** – ProShares UltraPro QQQ 3x Leveraged ETF

**Rebalance Rule:** Monthly on the first trading day, or when VIX crosses into a new tier.

**Time Horizon:** 10+ years. Designed for aggressive investors.

> ⚠️ This is not financial advice. TQQQ can lose 70–95% in severe bear markets. Use only in tax-advantaged accounts if possible.

---

## How It's Built

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 with CSS custom properties (variables) |
| Logic | Vanilla JavaScript (ES Modules) |
| Charts | Chart.js 4.4.0 (pinned CDN) |
| Data | Yahoo Finance JSON API via CORS proxy |
| Hosting | GitHub Pages (static) |

### No Build Step

This app has no bundler, no Node.js, no npm. Open `index.html` in a browser and it works.

### JavaScript Architecture

All three JS files (`vix.js`, `strategy.js`, `chart.js`) are ES Modules. `strategy.html` loads them via `<script type="module">`. `index.html` imports `vix.js` and `strategy.js` for its hero gauge. Chart.js is loaded as a synchronous UMD script (sets `window.Chart` globally) before any module executes.

- **`vix.js`** — exports `getCachedVIX()` (synchronous localStorage read, zero network wait) and `fetchVIX()` (async, tries proxy URLs in order). Returns `{ value, timestamp, fromCache, stale }` on success, or `{ error: true }` on total failure. When the live fetch fails but a prior value exists in localStorage, it returns that value with `stale: true` rather than an error.
- **`strategy.js`** — exports `getTier()`, `getAllocation()`, `getTierLabel()`, `TICKERS` metadata, and the full `ALL_TIERS` reference array.
- **`chart.js`** — exports `initChart()` and `updateChart()`. Includes a custom Chart.js plugin that renders the live VIX value as a center label inside the doughnut hole.

### VIX Data Fetching

Since `yfinance` is a Python library and cannot run in the browser, live VIX data is fetched via Yahoo Finance's underlying HTTP API through a public CORS proxy:

```
Primary:  https://api.allorigins.win/raw?url=https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX
Fallback: https://api.allorigins.win/raw?url=https://query2.finance.yahoo.com/v8/finance/chart/%5EVIX
```

> **Note:** `corsproxy.io` was the original proxy but is blocked by Yahoo Finance (returns 403). `allorigins.win` is confirmed working as of v1.0.2.

The fetched value is saved to `localStorage` under the key `vix_last_known` with no expiry — it persists across tabs, pages, and browser sessions. Both `index.html` and `strategy.html` read this cache synchronously on load so they always show the last real value instantly, with no blank or `--` state while waiting for the network.

**Refresh logic:**
- Cache younger than 60 seconds → return immediately, no fetch
- Cache older than 60 seconds → attempt live fetch; if it succeeds, update cache and display; if it fails, return the stale value with a `STALE` badge instead of an error

**Status badges:** `LIVE` (green) — fresh fetch · `CACHED` (amber) — within TTL · `STALE` (red) — fetch failed, showing last known value · `ERROR` (red) — fetch failed and no prior value exists

The manual Refresh button clears `localStorage` and forces a new fetch.

---

## Repository Structure

```
vix-strategy/
├── index.html              # Pitch page (the "why")
├── strategy.html           # Live dashboard (the "what now")
├── assets/
│   ├── css/
│   │   └── styles.css      # Global styles and CSS variables
│   ├── js/
│   │   ├── vix.js          # VIX fetching, localStorage caching, getCachedVIX()
│   │   ├── chart.js        # Pie/donut chart rendering logic
│   │   └── strategy.js     # Tier logic and allocation computation
│   └── img/
│       └── logo.svg
├── PRD.MD                  # Full product requirements document
├── README.MD               # This file
└── PATCHNOTES.MD           # Version history and changelog
```

---

## Deploying to GitHub Pages

1. Push the repository to GitHub
2. Go to **Settings > Pages**
3. Set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`
4. GitHub will publish at `https://yourusername.github.io/vix-strategy/`

No build action required. The site goes live as-is.

---

## Running Locally

**A local HTTP server is required.** ES modules are blocked by all modern browsers when opened via the `file://` protocol, so double-clicking `index.html` will not work — the JS will silently fail to load.

Use one of these options:

| Method | Command | URL |
|--------|---------|-----|
| VS Code Live Server | Right-click `index.html` → Open with Live Server | `http://127.0.0.1:5500` |
| Python | `python -m http.server 8080` | `http://localhost:8080` |

Once the server is running, the VIX fetch will work and the value will be saved to `localStorage`. Subsequent visits (including direct file opens on GitHub Pages) will show the last-known value instantly while the fresh fetch runs in the background.

---

## The Value of This Strategy

- **Systematic:** No emotion. The VIX tells you what to do.
- **Contrarian:** Buys into fear, which historically precedes recovery.
- **Growth-oriented:** Leveraged ETFs in high-fear environments maximize recovery capture.
- **Flexible:** Allocation table is designed to evolve over time via patch updates.
- **Transparent:** Every allocation decision is explained and visible.

---

## Documents

| File | Purpose |
|------|---------|
| `PRD.MD` | Full product requirements, technical spec, and roadmap |
| `README.MD` | App overview, structure, and deployment guide |
| `PATCHNOTES.MD` | Changelog updated after every version |

---

## Roadmap

| Version | Planned Feature |
|---------|----------------|
| v1.1 | SMH / SOXL "Growth Rocket" strategy as a toggle |
| v1.2 | Trend filter — QQQ vs. 200-day MA overlay |
| v1.3 | VIX percentile rank mode |
| v1.4 | 12-month historical VIX sparkline |
| v1.5 | Backtesting visualization using Yahoo Finance historical data |
| v2.0 | Full portfolio tracker with user-entered holdings |

---

*Built with no backend. Powered by VIX.*
