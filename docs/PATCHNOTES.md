# VIX Strategy - Patch Notes

All notable changes are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.3.0] - 2026-10-02

### Added
- `data/vix.json`: the same reading as `data/vix.js`, as plain JSON. `update-vix.yml` writes both on
every run. Azqato Invests (azqato.com/invests/) reads it from raw.githubusercontent.com as its second
VIX source: raw GitHub serves files with CORS headers but won't run `vix.js`. This repository is now a
data feed for Azqato Invests (its PRD Part 2, D21 and P12).

---

## [1.2.1] - 2026-08-25

Documentation-only release. No application code, styles, or workflow files were changed.

### Added
- `docs/PRD.md`: Rewritten and greatly expanded into the project's single product document. New sections written from scratch during this audit: Tenets, Roadmap, Metrics, Runbook, Technical Requirements, Conventions, Writing Style, Browser Testing, Security, Deprecation and Removal, Documentation Versus Reality, Risks and Open Questions, Working Practice, Press Release, and Frequently Asked Questions. The Conventions section was derived by reading the code and the git history rather than from any external style guide, and names the dominant form plus its deviations wherever the codebase is inconsistent.
- `docs/PRD.md`: New "Documentation Versus Reality" table recording 22 discrepancies (D-01 through D-22) found between the documentation and the code, with the source trusted for each and how it was resolved. Nothing was silently corrected: where a document and the code disagreed, both readings were kept side by side.
- `docs/PRD.md`: New "Risks and Open Questions" section listing what the audit could not verify, the fragile areas of the codebase, changes that are dangerous without more context, and 9 numbered open questions for the author.
- `docs/PRD.md`: New "Working Practice" section: a pre-edit checklist, a table mapping each kind of work to the file to open first, a list of things never to do here with the reason for each, a manual verification procedure, and the post-change documentation checklist.
- `docs/DESIGN.md`: New tables covering colors hardcoded outside the token system (11 entries across `chart.js` and the stylesheet), layout container widths, and a substantially longer type scale covering roughly 35 text roles with computed pixel sizes, weights, font families, line heights, and notes.
- `docs/DESIGN.md`: New component pattern sections for Form Inputs, Chart, Legend, Page Chrome (the scanline overlay, hero radial glow, headline gradient, section rhythm, and title underbar), and Status Text States, none of which had been documented before.
- `docs/DESIGN.md`: New closing section of notes for anyone, human or model, editing the visuals.

### Changed
- Documentation consolidated from ten files to four: `README.md` at the repository root, and `PRD.md`, `DESIGN.md`, and `PATCHNOTES.md` in `/docs`.
- `README.MD` renamed to `README.md`. The rename required a two-step `git mv` through a temporary name because Windows treats the two spellings as the same file.
- `README.md` rewritten for a general reader rather than a developer. It now carries only the project name and description, the live site link, a plain-language description of what the three pages offer, who it is for, the current status, and a link table to `/docs`. Every command, version number, prerequisite, and deploy instruction it previously carried was moved into the Runbook and Technical Requirements sections of `docs/PRD.md`, so nothing was lost.
- `docs/DESIGN.md`: Contrast table recomputed from the WCAG relative luminance formula and expanded to 13 rows. Three previously documented ratios did not match the recomputation (18.9:1, 11.5:1, and 5.7:1 against recomputed values of 19.3:1, 14.4:1, and 7.6:1). The original figures are preserved in a Note column rather than deleted. All three pass either way.
- `docs/DESIGN.md`: The original design philosophy paragraph was kept verbatim and three concrete rules added beneath it.
- `docs/PATCHNOTES.md`: All existing entries were retained. Their punctuation was normalized to the writing style adopted in this release: 57 lines containing em dashes and 17 containing en dashes were rewritten to use colons, commas, or single hyphens. No entry's content, dates, or version numbers were altered.
- `docs/PRD.md`: The 12-month historical VIX sparkline moved from v1.2.1 to v1.3.0, because this documentation release consumed the v1.2.1 number. Renumbering an unshipped milestone is low-risk but is flagged as open question 9 for the author to confirm.

### Removed
- `docs/TRD.md`, `docs/ROADMAP.md`, `docs/METRICS.md`, `docs/TENETS.md`, `docs/RUNBOOK.md`, `docs/SECURITY.md`, and `docs/PRFAQ.md` were deleted. Their content was folded into the correspondingly named sections of `docs/PRD.md`. Per the removal policy now recorded in that document, these are internal files rather than public-facing addresses, so they were plain deletes with no stub or redirect. The old-path-to-new-section mapping is in the Retired Items table in `docs/PRD.md`.

### Fixed
- `docs/PRD.md`: The success criterion stating that the risk disclaimer is "visible without scrolling" is now marked as not met, with the observed position of the disclaimer on all three pages recorded beside it. The original text was not deleted.
- `docs/PRD.md`: Descriptions of the Refresh button as forcing a "live fetch" were corrected to say it clears the cache and re-runs the fetch path. Since v1.1.0 that path reads the committed `data/vix.js` before touching the network, so Refresh cannot produce a value newer than the last successful scheduled workflow run.
- `docs/PRD.md`: The architecture diagram and script inventory, which predated `custom.html`, were redrawn to cover all three pages and all five project scripts.
- `docs/PRD.md`: The two conflicting cached-display performance targets (under 100ms in the retired TRD, under 200ms in the retired METRICS) were consolidated to a single 200ms figure, with the contradiction noted in place.

### Security
- No code changed, so no security posture changed. The missing Subresource Integrity hash on the Chart.js CDN tag remains the highest-value outstanding security improvement and is recorded as a one-line fix in the Known Technical Debt and Security sections of `docs/PRD.md`.
- Whether branch protection is enabled on `main` could not be verified from a local clone. The retired `SECURITY.md` asserted it as an operative control; `docs/PRD.md` now records it as unverified and raises it as open question 8. It matters because `data/vix.js` is executed as JavaScript by every visitor.

### Notes
- **Writing style sweep.** A prose style rule prohibiting em dashes in all three forms (the literal Unicode character, the `&mdash;` entity, and the double dash used as punctuation) was adopted and written into `docs/PRD.md`. The whole repository was then searched for violations. Found: 274 literal em dash characters across 19 files, zero `&mdash;` entities, and zero double dashes used as punctuation. Every `--` occurrence in the codebase is legitimate syntax: a CSS custom property, a CLI flag, an HTML comment delimiter, or the `--` placeholder the UI shows for an unknown VIX value.
- Per-file em dash counts at the time of the sweep: `docs/PATCHNOTES.md` 62, `docs/TRD.md` 57, `docs/ROADMAP.md` 27, `index.html` 21, `docs/PRFAQ.md` 14, `docs/PRD.md` 12, `strategy.html` 11, `docs/SECURITY.md` 11, `assets/css/styles.css` 9, `docs/DESIGN.md` 9, `docs/RUNBOOK.md` 7, `custom.html` 6, `assets/js/vix.js` 5, `assets/js/strategy.js` 5, `assets/js/custom.js` 5, `docs/TENETS.md` 4, `README.MD` 4, `docs/METRICS.md` 3, `.github/workflows/update-vix.yml` 2.
- **The 62 em dashes in the four surviving documents were fixed** by this release. The remaining 43 in `index.html`, `strategy.html`, `custom.html`, `styles.css`, the four JavaScript files, and the workflow were **not** changed. Editing them would mean rewriting shipped UI copy and code comments, which is a product change rather than a documentation change, and this audit was scoped to documentation. Whether to clean them up is open question 7 in `docs/PRD.md`. The 169 in the seven deleted documents went away with those files.
- **The scheduled VIX data pipeline was briefly believed to be dormant, and is not.** During the audit `data/vix.js` appeared to have been unchanged since 2026-07-09, 47 days earlier, which was recorded as the audit's most serious finding. Fetching before the release push showed the local clone was 261 commits behind `origin/main`, every one a `chore: update VIX data [skip ci]` commit, and the published value was same-day. The workflow is healthy. The finding is retained as D-21 in `docs/PRD.md` with its resolution, because the mistake is instructive: a local clone is not evidence about production. The weekly Actions check was added to the Runbook regardless, since nothing else monitors that workflow.

---

## [Unreleased] - retroactively recorded 2026-08-25

Two changes shipped between v1.0.12 and v1.1.0 with no patch notes entry. They are recorded here rather than back-dated into an existing version, because inventing a version number for them would misrepresent the history. Identified during the v1.2.1 documentation audit.

### Added
- `index.html`, `strategy.html`: "Azqato Invests" link added to the navigation bar. Commit `c0d0477`, "feat: add Azqato Invests link to navigation". The link is live on all three pages today.

### Changed
- Repository and URL references updated to the lowercase `vix` spelling. Commit `028582a`, "docs: update repo/URL references to lowercase vix".

---

## [1.2.0] - 2026-07-09

### Added
- `custom.html`: New "Custom" strategy builder page. Lets a user substitute their own ticker into each of four fixed risk categories (Risk Off, Diversify, Risk On, Full Risk), while keeping the exact same VIX-tier percentage weights as the core strategy. Includes its own live VIX feed, tier banner, doughnut chart, and allocation table, mirroring `strategy.html`'s dashboard.
- `assets/js/custom.js`: New library: category metadata (slot mapping, labels, colors, descriptions), `localStorage['vix_custom_tickers']` persistence, and `sanitizeTicker()`: uppercases and restricts free-text input to `[A-Z0-9.-]`, max 10 characters. This is basic input hygiene, **not** verification that the ticker exists; the UI says so explicitly. Live verification is deferred to v2.3.
- **"Custom" nav link** added to `index.html`, `strategy.html`, and `custom.html`, positioned between Dashboard and Azqato Invests.
- `assets/css/styles.css`: New `.customize-*` classes for the ticker input form (grid layout, styled text inputs, save/reset actions, status message).

### Changed
- `assets/js/chart.js`: `initChart()` and `updateChart()` now accept an optional `labels` parameter, defaulting to `['BIL', 'SPY', 'QQQ', 'TQQQ']` when omitted. `strategy.html`'s existing usage is unaffected; `custom.html` passes the user's custom ticker symbols instead.

### Security
- This is the first user-input surface in the app (previous versions had none). All user-entered ticker text is rendered via `.textContent` or `.value`, never `innerHTML`, in addition to the `sanitizeTicker()` character-allowlist, defense in depth against DOM injection even though the current charset alone already blocks it. See `docs/SECURITY.md`.

---

## [1.1.1] - 2026-07-09

### Fixed
- `index.html`, `strategy.html`: Inline boot `<script>` blocks were throwing a `SyntaxError` on every page load (`Identifier 'getTier' has already been declared`), silently killing the entire script before it ran. Cause: classic `<script>` tags share one global scope, so `vix.js`'s top-level `function getCachedVIX(){}` / `fetchVIX(){}` and `strategy.js`'s `getTier(){}` / `getAllocation(){}` / etc. became global bindings, and the inline scripts then re-declared those exact same names via `const { getCachedVIX, fetchVIX } = window.VixData` destructuring, which collides in the same scope. This broke the VIX display entirely (stuck on `--`, no loading counter, no tier badge) on GitHub Pages, `file://`, and local servers alike, introduced by the v1.1.0 classic-script conversion. Fixed by wrapping each inline script's content in an IIFE so its `const` declarations get their own scope and safely shadow the globals instead of redeclaring them.

---

## [1.1.0] - 2026-07-09

### Added
- `.github/workflows/update-vix.yml`: Scheduled GitHub Actions workflow that fetches VIX directly from Yahoo Finance server-side (no CORS proxy needed) and commits the result to `data/vix.js`. Runs on 8 fixed cron schedules per weekday (9:45am-4:45pm ET, fixed to EST/UTC-5 year-round, drifts one hour later during EDT, an accepted tradeoff for a simple fixed schedule with no polling). Also supports manual `workflow_dispatch` runs. Uses `actions/checkout@v7` (Node 24 native).
- `data/vix.js`: New repo-committed data file: `window.__VIX_DATA__ = { value, timestamp, fetchedAt }`, refreshed by the workflow above. Loaded via `<script src>`, not `fetch()`.

### Changed
- `assets/js/vix.js`, `assets/js/strategy.js`, `assets/js/chart.js`: Converted from ES modules (`type="module"`, `import`/`export`) to classic scripts attaching to `window.VixData`, `window.VixStrategy`, `window.VixChart` namespaces. `fetchVIX()` now reads `window.__VIX_DATA__` synchronously (no network call) as the primary source, falling back to the existing allorigins.win proxy only if that global is unavailable.
- `index.html`, `strategy.html`: Script tags updated to plain `<script src>` (no `type="module"`), in dependency order: `data/vix.js` → `assets/js/vix.js` → `assets/js/strategy.js` → (`assets/js/chart.js`, strategy.html only) → inline boot script.
- **`file://` now fully supported**: this was the actual point of the module→classic-script conversion: browsers block `type="module"` scripts entirely under `file://`, which previously broke the site completely when `index.html` was opened by double-click instead of through a server. No local HTTP server is required anymore.
- `docs/TRD.md`, `docs/SECURITY.md`, `docs/RUNBOOK.md`, `docs/ROADMAP.md`, `docs/PRD.md`, `docs/TENETS.md`, `docs/PRFAQ.md`, `README.MD`: updated to document the new data pipeline, classic-script architecture, `file://` support, and monitoring steps.

### Known Debt
- The allorigins.win proxy fallback in `vix.js` remains in place until the new data-file pipeline is verified stable in production, then will be removed.

---

## [1.0.12] - 2026-06-15

### Added
- `strategy.html`: Live loading counter in the VIX number display. When a network fetch is required (no cache or stale cache), the big VIX value area shows `Loading 1`, `Loading 2`, `Loading 3`, etc., incrementing every second, so the user knows a live API call is in progress. Counter stops the instant the fetch resolves.
- `index.html`: Same loading counter in the hero gauge value area. Only activates on first load when there is no cached value at all; if stale cached data already exists it is shown immediately while the fresh fetch runs silently.
- `strategy.html` / `index.html`: API error state: if all proxy URLs fail and no cache is available, the loading counter text changes to `Error Please Refresh` (styled red) instead of the previous `--` placeholder.
- `assets/css/styles.css`: Four new modifier classes: `.vix-status-text` and `.vix-status-error` (for the strategy page big number) and `.gauge-status-text` and `.gauge-status-error` (for the index hero gauge). These shrink the font size and apply amber/red coloring so loading and error text fits the display area cleanly.

---

## [1.0.11] - 2026-06-08

### Added
- `docs/` directory created; all documentation moved here from project root.
- `docs/TRD.md`: Technical Requirements Document: system architecture diagram, full tech stack with versions, annotated folder structure, all data model shapes, internal data flow per page, state management table, third-party integration details, performance requirements, and known technical debt.
- `docs/DESIGN.md`: Design Document: design philosophy, complete color palette with all CSS tokens, full typography scale with sizes/weights/roles, spacing system (4px base unit), all three breakpoints with change descriptions, component patterns (buttons, nav links, cards, badges, tables, accordion), accessibility standards (WCAG AA), and animation inventory.
- `docs/PRFAQ.md`: Press release written as a public launch announcement, 10 internal stakeholder FAQs, and 10 external user FAQs.
- `docs/TENETS.md`: Five priority-ordered product tenets, each opinionated enough to resolve a real tradeoff.
- `docs/METRICS.md`: North star metric, acquisition/engagement/retention/performance metric definitions, targets, measurement methods, and reporting cadence.
- `docs/ROADMAP.md`: Current phase description, full milestone table (v1.0.0 through v2.0.0), per-milestone feature breakdown, and explicitly deferred items with reasoning.
- `docs/SECURITY.md`: Authentication model (none), authorization model (none), data storage inventory, environment variable reference (none required), third-party trust table, attack surface analysis with mitigations, known security debt (missing SRI hash), and dependency policy.
- `docs/RUNBOOK.md`: Local setup from scratch, build instructions (none required), GitHub Pages deploy steps, rollback procedure, environment configs table, common errors table with causes and fixes, and monitoring checklist.

### Changed
- `PRD.MD` → `docs/PRD.md`: Restructured to match required spec: added Problem Statement, Non-Goals, User Stories, Constraints, Assumptions, and Success Criteria sections. Strategy logic table updated to reflect actual implementation. Removed outdated placeholder notes (e.g., "allocations sum to 120%"). Version bumped to 1.0.11.
- `PATCHNOTES.MD` → `docs/PATCHNOTES.md`: Moved to `/docs/`. This entry is the first in the new location.
- `README.MD`: Fully rewritten for developer audience: removed marketing language, added exact tech stack table with versions, prerequisites, verbatim install/run commands, environment variable reference (none), build note (no build step), deploy instructions, rollback command, and full `/docs` link table.

---

## [1.0.10] - 2026-06-07

### Changed
- `assets/css/styles.css`: Added `.nav-links`, `.nav-link`, and `.nav-link.nav-active` CSS classes. All three navigation items now use a unified pill-style link with a subtle green highlight for the active page, replacing the previous mixed `btn-primary` / `btn-secondary` button approach.
- `index.html`: Navigation rebuilt: brand logo stays on the left; three links (About · Dashboard · Support) sit on the right in left-to-right order. `About` carries `nav-active` + `aria-current="page"` on this page.
- `strategy.html`: Same three-link navigation; `Dashboard` carries `nav-active` + `aria-current="page"` on this page.
- Mobile breakpoint (≤768px): nav links scale down to `0.72rem` / `0.35rem 0.55rem` padding to stay legible on small screens.

---

## [1.0.9] - 2026-06-07

### Added
- `index.html` / `strategy.html`: Support link added to the navigation bar on both pages, opening `https://azqato.github.io/support.html` in a new tab.
- `index.html` / `strategy.html`: "Built by Azqato" footer credit added to both pages; "Azqato" links to `https://azqato.github.io/`.

---

## [1.0.8] - 2026-06-06

### Added
- `assets/img/favicon.svg`: 📈 emoji favicon (SVG format) for consistent browser tab and bookmark display.
- `index.html` / `strategy.html`: `<link rel="icon">` tag added to both pages pointing to the new favicon.

---

## [1.0.7] - 2026-06-06

### Changed
- `strategy.html`: Timestamp display on the VIX feed now renders in Eastern Time (`America/New_York`) with the timezone abbreviation shown (EST or EDT). Previously used the browser's local timezone with no label.

---

## [1.0.6] - 2026-06-06

### Changed
- `assets/js/vix.js`: Cache TTL increased from 60 seconds to 30 minutes (`REFRESH_TTL = 30 * 60 * 1000`). A live fetch is now attempted on every page load only when the cached value is older than 30 minutes; otherwise the stored value is returned immediately.
- `README.MD` / `PRD.MD`: Updated refresh interval documentation to reflect 30-minute TTL.

---

## [1.0.5] - 2026-06-06

### Changed
- `README.MD`: Updated version badge to v1.0.4; rewrote JS Architecture section to document `getCachedVIX()`, `stale` flag, and cross-page `localStorage` behaviour; rewrote VIX Data Fetching section with full LIVE / CACHED / STALE / ERROR badge state definitions; rewrote Running Locally section to clearly state a local HTTP server is required.
- `PRD.MD`: Updated caching spec from `sessionStorage` to `localStorage`; added `STALE` state to error handling spec; pinned Chart.js CDN version to `4.4.0`.

---

## [1.0.4] - 2026-06-06

### Changed
- `assets/js/vix.js`: Replaced `sessionStorage` with `localStorage` so the last-known VIX value persists across tabs, pages, and browser sessions. Added `getCachedVIX()` sync export for instant reads without a network round-trip. Added `stale` flag to return objects: when the live fetch fails but a prior value exists, it is returned with `stale: true` rather than an error.
- `index.html`: Hero gauge now shows the live/cached VIX value instead of the hardcoded static `18.4`. Reads `localStorage` synchronously on load (zero network wait), then updates if a fresh fetch succeeds.
- `strategy.html`: Added STALE badge state (red, distinct from ERROR). Dashboard now paints the last-known value from `localStorage` instantly on load before the async fetch resolves. Refresh button now clears `localStorage` (was incorrectly clearing `sessionStorage`).

### Fixed
- `index.html`: Static `18.4` placeholder replaced with live data wired to the same `localStorage` cache as `strategy.html`.

---

## [1.0.3] - 2026-06-06

### Fixed
- `strategy.html`: Dashboard never booted on GitHub Pages (page stuck on LOADING forever). Root cause: `DOMContentLoaded` listener inside a `type="module"` script fires before module imports resolve, the callback never ran. Fixed by replacing the listener with a direct async IIFE; `type="module"` scripts are deferred by spec and always run post-DOM-parse.

---

## [1.0.2] - 2026-06-06

### Fixed
- `assets/js/vix.js`: Replaced `corsproxy.io` with `api.allorigins.win` as the CORS proxy. `corsproxy.io` was returning HTTP 403 because Yahoo Finance blocks their server IPs. `allorigins.win` confirmed working.

### Changed
- Fetch logic refactored from primary/fallback pair to an ordered `URLS` array iterated with a `for` loop.

---

## [1.0.1] - 2026-06-06

### Added
- `index.html`: Full pitch page with hero, problem, insight, strategy table, why-now, risk disclosure, and footer sections.
- `strategy.html`: Live strategy dashboard with VIX feed, active tier banner, Chart.js doughnut chart, allocation table, full tier reference table, and strategy accordion.
- `assets/css/styles.css`: Complete dark financial-terminal theme; CSS custom properties, scanline overlay, responsive mobile-first layout, component library (cards, badges, buttons, tables, accordion).
- `assets/js/vix.js`: Async VIX fetch with primary CORS proxy, fallback URL, 60-second sessionStorage caching, and graceful error return.
- `assets/js/strategy.js`: Tier logic (`getTier`, `getAllocation`, `getTierLabel`), normalization helper, `TICKERS` metadata, and `ALL_TIERS` reference array.
- `assets/js/chart.js`: Chart.js 4.4.0 doughnut renderer with custom center-text plugin, smooth update animation, and dark-themed tooltips.
- `assets/img/logo.svg`: Monospace "VIX" wordmark with volatility spike polyline in electric green.

---

## [1.0.0] - 2026-06-06

### Added
- Initial project scaffolding and repository structure.
- `PRD.MD`: Full Product Requirements Document covering MVP scope, tech stack, strategy logic, risk table, and roadmap.
- `README.MD`: App overview, structure guide, deployment instructions, and strategy summary.
- `PATCHNOTES.MD`: This file; initialized for ongoing version tracking.

### Defined
- MVP allocation strategy (v1.0): 5 VIX tiers using BIL, SPY, QQQ, TQQQ.
- Future strategy roadmap: SMH + SOXL-based "VIX-Timed Growth Rocket" defined in PRD for post-MVP.
- GitHub Pages as the hosting target (zero backend requirement).
- Yahoo Finance JSON API via CORS proxy as VIX data source.

---

*This file is updated after every change. Do not skip versions.*
