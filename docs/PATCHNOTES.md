# VIX Strategy — Patch Notes

All notable changes are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.1.0] – 2026-07-09

### Added
- `.github/workflows/update-vix.yml` — Scheduled GitHub Actions workflow that fetches VIX directly from Yahoo Finance server-side (no CORS proxy needed) and commits the result to `data/vix.js`. Runs on 8 fixed cron schedules per weekday (9:45am–4:45pm ET, fixed to EST/UTC-5 year-round — drifts one hour later during EDT, an accepted tradeoff for a simple fixed schedule with no polling). Also supports manual `workflow_dispatch` runs. Uses `actions/checkout@v7` (Node 24 native).
- `data/vix.js` — New repo-committed data file: `window.__VIX_DATA__ = { value, timestamp, fetchedAt }`, refreshed by the workflow above. Loaded via `<script src>`, not `fetch()`.

### Changed
- `assets/js/vix.js`, `assets/js/strategy.js`, `assets/js/chart.js` — Converted from ES modules (`type="module"`, `import`/`export`) to classic scripts attaching to `window.VixData`, `window.VixStrategy`, `window.VixChart` namespaces. `fetchVIX()` now reads `window.__VIX_DATA__` synchronously (no network call) as the primary source, falling back to the existing allorigins.win proxy only if that global is unavailable.
- `index.html`, `strategy.html` — Script tags updated to plain `<script src>` (no `type="module"`), in dependency order: `data/vix.js` → `assets/js/vix.js` → `assets/js/strategy.js` → (`assets/js/chart.js`, strategy.html only) → inline boot script.
- **`file://` now fully supported** — this was the actual point of the module→classic-script conversion: browsers block `type="module"` scripts entirely under `file://`, which previously broke the site completely when `index.html` was opened by double-click instead of through a server. No local HTTP server is required anymore.
- `docs/TRD.md`, `docs/SECURITY.md`, `docs/RUNBOOK.md`, `docs/ROADMAP.md`, `docs/PRD.md`, `docs/TENETS.md`, `docs/PRFAQ.md`, `README.MD` — updated to document the new data pipeline, classic-script architecture, `file://` support, and monitoring steps.

### Known Debt
- The allorigins.win proxy fallback in `vix.js` remains in place until the new data-file pipeline is verified stable in production, then will be removed.

---

## [1.0.12] – 2026-06-15

### Added
- `strategy.html` — Live loading counter in the VIX number display. When a network fetch is required (no cache or stale cache), the big VIX value area shows `Loading 1`, `Loading 2`, `Loading 3`, etc., incrementing every second, so the user knows a live API call is in progress. Counter stops the instant the fetch resolves.
- `index.html` — Same loading counter in the hero gauge value area. Only activates on first load when there is no cached value at all; if stale cached data already exists it is shown immediately while the fresh fetch runs silently.
- `strategy.html` / `index.html` — API error state: if all proxy URLs fail and no cache is available, the loading counter text changes to `Error Please Refresh` (styled red) instead of the previous `--` placeholder.
- `assets/css/styles.css` — Four new modifier classes: `.vix-status-text` and `.vix-status-error` (for the strategy page big number) and `.gauge-status-text` and `.gauge-status-error` (for the index hero gauge). These shrink the font size and apply amber/red coloring so loading and error text fits the display area cleanly.

---

## [1.0.11] – 2026-06-08

### Added
- `docs/` directory created; all documentation moved here from project root.
- `docs/TRD.md` — Technical Requirements Document: system architecture diagram, full tech stack with versions, annotated folder structure, all data model shapes, internal data flow per page, state management table, third-party integration details, performance requirements, and known technical debt.
- `docs/DESIGN.md` — Design Document: design philosophy, complete color palette with all CSS tokens, full typography scale with sizes/weights/roles, spacing system (4px base unit), all three breakpoints with change descriptions, component patterns (buttons, nav links, cards, badges, tables, accordion), accessibility standards (WCAG AA), and animation inventory.
- `docs/PRFAQ.md` — Press release written as a public launch announcement, 10 internal stakeholder FAQs, and 10 external user FAQs.
- `docs/TENETS.md` — Five priority-ordered product tenets, each opinionated enough to resolve a real tradeoff.
- `docs/METRICS.md` — North star metric, acquisition/engagement/retention/performance metric definitions, targets, measurement methods, and reporting cadence.
- `docs/ROADMAP.md` — Current phase description, full milestone table (v1.0.0 through v2.0.0), per-milestone feature breakdown, and explicitly deferred items with reasoning.
- `docs/SECURITY.md` — Authentication model (none), authorization model (none), data storage inventory, environment variable reference (none required), third-party trust table, attack surface analysis with mitigations, known security debt (missing SRI hash), and dependency policy.
- `docs/RUNBOOK.md` — Local setup from scratch, build instructions (none required), GitHub Pages deploy steps, rollback procedure, environment configs table, common errors table with causes and fixes, and monitoring checklist.

### Changed
- `PRD.MD` → `docs/PRD.md` — Restructured to match required spec: added Problem Statement, Non-Goals, User Stories, Constraints, Assumptions, and Success Criteria sections. Strategy logic table updated to reflect actual implementation. Removed outdated placeholder notes (e.g., "allocations sum to 120%"). Version bumped to 1.0.11.
- `PATCHNOTES.MD` → `docs/PATCHNOTES.md` — Moved to `/docs/`. This entry is the first in the new location.
- `README.MD` — Fully rewritten for developer audience: removed marketing language, added exact tech stack table with versions, prerequisites, verbatim install/run commands, environment variable reference (none), build note (no build step), deploy instructions, rollback command, and full `/docs` link table.

---

## [1.0.10] – 2026-06-07

### Changed
- `assets/css/styles.css` — Added `.nav-links`, `.nav-link`, and `.nav-link.nav-active` CSS classes. All three navigation items now use a unified pill-style link with a subtle green highlight for the active page, replacing the previous mixed `btn-primary` / `btn-secondary` button approach.
- `index.html` — Navigation rebuilt: brand logo stays on the left; three links (About · Dashboard · Support) sit on the right in left-to-right order. `About` carries `nav-active` + `aria-current="page"` on this page.
- `strategy.html` — Same three-link navigation; `Dashboard` carries `nav-active` + `aria-current="page"` on this page.
- Mobile breakpoint (≤768px) — nav links scale down to `0.72rem` / `0.35rem 0.55rem` padding to stay legible on small screens.

---

## [1.0.9] – 2026-06-07

### Added
- `index.html` / `strategy.html` — Support link added to the navigation bar on both pages, opening `https://azqato.github.io/support.html` in a new tab.
- `index.html` / `strategy.html` — "Built by Azqato" footer credit added to both pages; "Azqato" links to `https://azqato.github.io/`.

---

## [1.0.8] – 2026-06-06

### Added
- `assets/img/favicon.svg` — 📈 emoji favicon (SVG format) for consistent browser tab and bookmark display.
- `index.html` / `strategy.html` — `<link rel="icon">` tag added to both pages pointing to the new favicon.

---

## [1.0.7] – 2026-06-06

### Changed
- `strategy.html` — Timestamp display on the VIX feed now renders in Eastern Time (`America/New_York`) with the timezone abbreviation shown (EST or EDT). Previously used the browser's local timezone with no label.

---

## [1.0.6] – 2026-06-06

### Changed
- `assets/js/vix.js` — Cache TTL increased from 60 seconds to 30 minutes (`REFRESH_TTL = 30 * 60 * 1000`). A live fetch is now attempted on every page load only when the cached value is older than 30 minutes; otherwise the stored value is returned immediately.
- `README.MD` / `PRD.MD` — Updated refresh interval documentation to reflect 30-minute TTL.

---

## [1.0.5] – 2026-06-06

### Changed
- `README.MD` — Updated version badge to v1.0.4; rewrote JS Architecture section to document `getCachedVIX()`, `stale` flag, and cross-page `localStorage` behaviour; rewrote VIX Data Fetching section with full LIVE / CACHED / STALE / ERROR badge state definitions; rewrote Running Locally section to clearly state a local HTTP server is required.
- `PRD.MD` — Updated caching spec from `sessionStorage` to `localStorage`; added `STALE` state to error handling spec; pinned Chart.js CDN version to `4.4.0`.

---

## [1.0.4] – 2026-06-06

### Changed
- `assets/js/vix.js` — Replaced `sessionStorage` with `localStorage` so the last-known VIX value persists across tabs, pages, and browser sessions. Added `getCachedVIX()` sync export for instant reads without a network round-trip. Added `stale` flag to return objects: when the live fetch fails but a prior value exists, it is returned with `stale: true` rather than an error.
- `index.html` — Hero gauge now shows the live/cached VIX value instead of the hardcoded static `18.4`. Reads `localStorage` synchronously on load (zero network wait), then updates if a fresh fetch succeeds.
- `strategy.html` — Added STALE badge state (red, distinct from ERROR). Dashboard now paints the last-known value from `localStorage` instantly on load before the async fetch resolves. Refresh button now clears `localStorage` (was incorrectly clearing `sessionStorage`).

### Fixed
- `index.html` — Static `18.4` placeholder replaced with live data wired to the same `localStorage` cache as `strategy.html`.

---

## [1.0.3] – 2026-06-06

### Fixed
- `strategy.html` — Dashboard never booted on GitHub Pages (page stuck on LOADING forever). Root cause: `DOMContentLoaded` listener inside a `type="module"` script fires before module imports resolve — the callback never ran. Fixed by replacing the listener with a direct async IIFE; `type="module"` scripts are deferred by spec and always run post-DOM-parse.

---

## [1.0.2] – 2026-06-06

### Fixed
- `assets/js/vix.js` — Replaced `corsproxy.io` with `api.allorigins.win` as the CORS proxy. `corsproxy.io` was returning HTTP 403 because Yahoo Finance blocks their server IPs. `allorigins.win` confirmed working.

### Changed
- Fetch logic refactored from primary/fallback pair to an ordered `URLS` array iterated with a `for` loop.

---

## [1.0.1] – 2026-06-06

### Added
- `index.html` — Full pitch page with hero, problem, insight, strategy table, why-now, risk disclosure, and footer sections.
- `strategy.html` — Live strategy dashboard with VIX feed, active tier banner, Chart.js doughnut chart, allocation table, full tier reference table, and strategy accordion.
- `assets/css/styles.css` — Complete dark financial-terminal theme; CSS custom properties, scanline overlay, responsive mobile-first layout, component library (cards, badges, buttons, tables, accordion).
- `assets/js/vix.js` — Async VIX fetch with primary CORS proxy, fallback URL, 60-second sessionStorage caching, and graceful error return.
- `assets/js/strategy.js` — Tier logic (`getTier`, `getAllocation`, `getTierLabel`), normalization helper, `TICKERS` metadata, and `ALL_TIERS` reference array.
- `assets/js/chart.js` — Chart.js 4.4.0 doughnut renderer with custom center-text plugin, smooth update animation, and dark-themed tooltips.
- `assets/img/logo.svg` — Monospace "VIX" wordmark with volatility spike polyline in electric green.

---

## [1.0.0] – 2026-06-06

### Added
- Initial project scaffolding and repository structure.
- `PRD.MD` — Full Product Requirements Document covering MVP scope, tech stack, strategy logic, risk table, and roadmap.
- `README.MD` — App overview, structure guide, deployment instructions, and strategy summary.
- `PATCHNOTES.MD` — This file; initialized for ongoing version tracking.

### Defined
- MVP allocation strategy (v1.0): 5 VIX tiers using BIL, SPY, QQQ, TQQQ.
- Future strategy roadmap: SMH + SOXL-based "VIX-Timed Growth Rocket" defined in PRD for post-MVP.
- GitHub Pages as the hosting target (zero backend requirement).
- Yahoo Finance JSON API via CORS proxy as VIX data source.

---

*This file is updated after every change. Do not skip versions.*
