# VIX Strategy – Patch Notes

All notable changes to VIX Strategy are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.0.0] – 2026-06-06

### Added
- Initial project scaffolding and repository structure
- `PRD.MD` – Full Product Requirements Document covering MVP scope, tech stack, strategy logic, risk table, and roadmap
- `README.MD` – App overview, structure guide, deployment instructions, and strategy summary
- `PATCHNOTES.MD` – This file; initialized for ongoing version tracking

### Defined
- MVP allocation strategy (v1.0): 5 VIX tiers using BIL, SPY, QQQ, TQQQ
- Future strategy roadmap: SMH + SOXL-based "VIX-Timed Growth Rocket" defined in PRD for post-MVP
- GitHub Pages as the hosting target (zero backend requirement)
- Yahoo Finance JSON API via CORS proxy as VIX data source (browser-compatible replacement for yfinance Python library)

### Technical Decisions Recorded
- No build step required; pure HTML/CSS/JS
- Chart.js via CDN for pie/donut chart rendering
- `sessionStorage` for 60-second VIX value caching
- Graceful degradation if CORS proxy is unreachable

---

## [1.0.1] – 2026-06-06

### Added
- `index.html` – Full pitch page with hero, problem, insight, strategy table, why-now, risk disclosure, and footer sections; pure HTML/CSS, no JS required
- `strategy.html` – Live strategy dashboard with VIX feed, active tier banner, Chart.js doughnut chart, allocation table, full tier reference table, and strategy accordion
- `assets/css/styles.css` – Complete dark financial-terminal theme; CSS custom properties, scanline overlay, responsive mobile-first layout, component library (cards, badges, buttons, tables, accordion)
- `assets/js/vix.js` – Async VIX fetch with primary CORS proxy, fallback URL, 60-second sessionStorage caching, and graceful error return
- `assets/js/strategy.js` – Tier logic (`getTier`, `getAllocation`, `getTierLabel`), normalization helper, `TICKERS` metadata, and `ALL_TIERS` reference array
- `assets/js/chart.js` – Chart.js 4.4.0 doughnut renderer with custom center-text plugin, smooth update animation, and dark-themed tooltips
- `assets/img/logo.svg` – Monospace "VIX" wordmark with volatility spike polyline in electric green

### Technical
- All JS files use ES Module syntax (`type="module"`)
- Chart.js loaded via pinned CDN UMD (`chart.js@4.4.0`) as a synchronous script; accessed as `window.Chart` from within the module
- Allocation values confirmed to already sum to 100% per tier; normalization code retained for correctness and future-proofing
- Auto-refresh every 60 seconds on strategy.html; manual refresh button clears sessionStorage cache

---

## [1.0.2] – 2026-06-06

### Fixed
- `assets/js/vix.js` – Replaced `corsproxy.io` with `api.allorigins.win` as the CORS proxy. `corsproxy.io` was returning HTTP 403 because Yahoo Finance blocks their server IPs. `allorigins.win` confirmed working and returning valid VIX data.

### Changed
- Fetch logic refactored from primary/fallback pair to an ordered `URLS` array iterated with a `for` loop — easier to add or reorder proxy options in future

---

*This file is updated after every change. Do not skip versions.*
