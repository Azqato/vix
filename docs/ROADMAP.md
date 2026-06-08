# Roadmap

**Product:** VIX Strategy
**Version:** 1.0.11
**Last Updated:** 2026-06-08

---

## Current Phase

**Phase 1 — MVP Live (v1.0.x)**
The core product is complete and deployed. Both pages are functional. VIX data fetches live from Yahoo Finance. Navigation, documentation, footer credit, and responsive layout are all in place. All v1.0.x work is incremental polish and documentation, not new features.

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
| SMH/SOXL strategy toggle | v1.1.0 | Planned | TBD |
| QQQ vs 200-day MA trend filter | v1.2.0 | Planned | TBD |
| VIX percentile rank mode | v1.3.0 | Planned | TBD |
| 12-month historical VIX sparkline | v1.4.0 | Planned | TBD |
| Backtesting visualization | v1.5.0 | Planned | TBD |
| Full portfolio tracker | v2.0.0 | Planned | TBD |

---

## Feature Breakdown Per Milestone

### v1.1.0 — SMH/SOXL Strategy Toggle
- Add a second allocation table: QQQ / SMH (VanEck Semiconductor) / TQQQ / SOXL (Direxion Semiconductor 3x)
- UI toggle between "Core Strategy" and "Growth Rocket" mode on strategy.html
- Same VIX tier boundaries; different allocations per tier
- No changes to existing tier logic, VIX fetch, or chart infrastructure

### v1.2.0 — Trend Filter
- Fetch QQQ 200-day moving average from Yahoo Finance historical endpoint
- Optional toggle: if QQQ is below its 200-day MA, suppress TQQQ allocation (redistribute to QQQ)
- Display QQQ MA relationship as a supplemental badge or indicator
- Filter is opt-in; default behavior unchanged

### v1.3.0 — VIX Percentile Rank
- Fetch 252 days of VIX historical data from Yahoo Finance
- Compute current VIX's percentile rank vs. trailing year
- Display as supplemental badge adjacent to the current VIX value on strategy.html
- Adds context for whether the current VIX is historically high or low

### v1.4.0 — Historical VIX Sparkline
- Render a 12-month Chart.js line chart on strategy.html
- Show the five tier boundary lines as horizontal reference lines
- Mark the current VIX value with a distinct point
- Data from Yahoo Finance historical daily endpoint via CORS proxy

### v1.5.0 — Backtesting Visualization
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
