# Product Requirements Document

**Product:** VIX Strategy
**Version:** 1.0.11
**Status:** Live — MVP shipped
**Last Updated:** 2026-06-08

---

## Problem Statement

Retail investors using a buy-and-hold strategy have no systematic mechanism to respond to market volatility signals. When the CBOE VIX spikes — historically a leading indicator of imminent recovery — most investors panic-sell at exactly the wrong moment rather than increasing exposure. There is no free, simple, browser-based tool that computes rules-based ETF allocations from live VIX data without requiring a brokerage account, a Python environment, or a financial advisor.

---

## Target Users

**Primary: Aggressive long-term retail investor**
Self-directed, 10+ year time horizon, comfortable with leveraged ETFs and drawdowns of 50–95%. Actively monitors market conditions but wants a rules-based system rather than discretionary decisions. Uses a Roth IRA or taxable brokerage account. Already familiar with TQQQ, QQQ, and SPY.

**Secondary: Rules-based investing researcher**
Interested in systematic strategies and backtesting frameworks. Uses this app as a live reference while developing their own allocation models. May share or cite the tool in investment communities.

**Tertiary: Developer or curious observer**
Arrives via GitHub, wants to understand how the strategy works technically, may fork or adapt the codebase.

---

## Goals

1. Present the VIX-based allocation strategy as a credible, visually compelling investing framework.
2. Display real-time VIX-driven portfolio allocations without any backend or server.
3. Serve as a versioned, evolving public tool with a transparent changelog.

---

## Non-Goals

- Not a brokerage or trading platform — no order execution, no account integration.
- Not a backtesting engine — no historical return simulation in the current version.
- Not a general financial planning tool — one strategy, one fixed set of tickers.
- Not a personalized advisor — does not account for individual tax situation, risk tolerance, or existing holdings.
- Not a native mobile app — web only, no iOS/Android wrapper.
- Will not store any user data on any server.
- Will not display advertising or collect analytics without explicit user consent.

---

## User Stories

- As a retail investor, I want to see the current VIX value and which allocation tier it maps to, so that I know what my portfolio should look like right now.
- As a retail investor, I want the allocation percentages to update automatically as the VIX changes, so that I don't have to do the math myself.
- As a researcher, I want to see all five VIX tiers and their allocations in one table, so that I can understand the full strategy at a glance.
- As a long-term investor, I want a clear risk disclosure on every page, so that I understand the dangers of leveraged ETFs before using this strategy.
- As a developer, I want clean, modular JavaScript with no build system, so that I can read and fork the codebase easily.
- As any visitor, I want the last-known VIX value to display instantly on load even before the network request completes, so that I never see a blank or loading state.
- As any visitor, I want the site to work even if the VIX data source is temporarily unreachable, so that I still see the most recent allocation.

---

## Feature List

### MVP (Shipped — v1.0.x)

- **Pitch page (index.html):** Hero with live VIX gauge, problem statement, VIX insight section, strategy allocation table, AI/semiconductor thesis, risk disclosure, footer CTA.
- **Strategy dashboard (strategy.html):** Live VIX number with status badge and Eastern Time timestamp, active tier banner, Chart.js doughnut chart with VIX value in center, allocation breakdown table, full tier reference table with active tier highlighted, strategy summary accordion.
- **Live VIX data:** Fetched from Yahoo Finance JSON API via allorigins.win CORS proxy. No backend required.
- **localStorage caching:** VIX value persists across tabs and browser sessions. 30-minute TTL. Instant synchronous read on page load.
- **Status badges:** LIVE / CACHED / STALE / ERROR states with distinct colors.
- **Auto-refresh:** strategy.html refreshes VIX every 60 seconds automatically.
- **Manual refresh:** Button clears cache and forces a live fetch.
- **Sticky navigation:** About / Dashboard / Support links with active-page green highlight and `aria-current="page"`.
- **Footer credit:** "Built by Azqato" with link on all pages.
- **Responsive design:** Fully functional at 375px wide and up, with breakpoints at 900px, 768px, and 480px.

### Future (Post-MVP)

- SMH / SOXL "Growth Rocket" strategy as a toggle (v1.1)
- Trend filter — QQQ vs. 200-day MA overlay (v1.2)
- VIX percentile rank mode (v1.3)
- 12-month historical VIX sparkline (v1.4)
- Backtesting visualization using Yahoo Finance historical data (v1.5)
- Full portfolio tracker with user-entered holdings (v2.0)

---

## Strategy Logic

### VIX Allocation Tiers

| VIX Range | BIL | SPY | QQQ | TQQQ | Fear Level |
|-----------|-----|-----|-----|------|-----------|
| < 15      | 25% | 50% | 20% | 5%   | Low (Complacency) |
| 15–25     | 20% | 40% | 30% | 10%  | Moderate |
| 25–35     | 15% | 35% | 35% | 15%  | Elevated |
| 35–45     | 10% | 30% | 40% | 20%  | High |
| > 45      | 5%  | 20% | 50% | 25%  | Extreme (Crisis) |

All values are exact; raw allocations already sum to 100% per tier. Normalization is applied in code as a guard.

**Tickers:**
- **BIL** – SPDR Bloomberg 1–3 Month T-Bill ETF (near-cash stability)
- **SPY** – SPDR S&P 500 ETF (broad market core holding)
- **QQQ** – Invesco Nasdaq-100 ETF (tech/growth, increases with fear)
- **TQQQ** – ProShares UltraPro QQQ 3x Leveraged ETF (maximum recovery capture at peak fear, never exceeds 25%)

### Rebalancing Rules

- Monthly on the first trading day of each month
- Immediately when VIX crosses into a different tier (either direction)

### Future Strategy Version: VIX-Timed Growth Rocket (Post-MVP)

| VIX Range | QQQ | SMH | TQQQ | SOXL |
|-----------|-----|-----|------|------|
| < 15      | 35% | 35% | 20%  | 10%  |
| 15–20     | 30% | 30% | 25%  | 15%  |
| 20–30     | 20% | 25% | 30%  | 25%  |
| 30–40     | 10% | 15% | 35%  | 40%  |
| > 40      | 5%  | 10% | 35%  | 50%  |

Additional tickers: **SMH** (VanEck Semiconductor ETF), **SOXL** (Direxion Daily Semiconductor Bull 3x ETF)

---

## Constraints

- **Hosting:** GitHub Pages — static files only, no server-side execution.
- **No build tooling:** No Node.js, no bundler, no npm. Must deploy as raw files.
- **CORS:** Yahoo Finance API blocks direct browser requests. All VIX fetches must go through a public CORS proxy.
- **Legal:** Risk disclaimer must be displayed on every page that mentions TQQQ.
- **No data collection:** Zero analytics, zero cookies, zero user tracking in current version.

---

## Assumptions

- The allorigins.win CORS proxy remains publicly available at no cost.
- Yahoo Finance's internal JSON API (`/v8/finance/chart/`) continues to return VIX data with the field `chart.result[0].meta.regularMarketPrice`.
- Users are already familiar with ETF investing concepts; no onboarding flow is required.
- VIX values remain within 0–100; the tier5 catch-all handles any value ≥ 45.
- TQQQ and QQQ remain publicly available ETFs with sufficient liquidity.

---

## Success Criteria

- strategy.html loads and displays a valid VIX value within 5 seconds on standard broadband.
- All five VIX tier allocations render correctly, with the active tier highlighted in the reference table.
- The doughnut chart reflects the correct allocation percentages for the current VIX tier.
- The site renders without layout breakage on screens 375px wide and wider.
- Zero JavaScript console errors on load in production.
- The "Built by Azqato" footer credit and Support nav link are present on both pages.
- Risk disclaimer is visible without scrolling on both pages.
