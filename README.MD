# VIX Strategy

A rules-based, browser-only ETF allocation dashboard that maps the live CBOE VIX reading to a specific portfolio allocation across four ETFs.

**Live site:** https://azqato.github.io/vix/

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Markup | HTML5 | — |
| Styling | CSS3 with custom properties | — |
| Logic | Vanilla JavaScript, classic scripts (`window.*` namespaces) | ES2020+ |
| Charts | Chart.js (CDN UMD) | 4.4.0 |
| Data | `data/vix.js` (scheduled GitHub Actions fetch, same-origin `<script src>`), with a Yahoo Finance JSON API + allorigins.win CORS proxy fallback | v8 |
| Hosting | GitHub Pages | — |
| Scheduled data refresh | GitHub Actions (`.github/workflows/update-vix.yml`) | 8 fixed weekday runs |

---

## Prerequisites

- No local HTTP server, Node.js, package manager, or build step required. `index.html`/`strategy.html` can be opened directly via `file://`.

---

## Installation

```bash
git clone https://github.com/Azqato/vix.git
cd vix
```

No dependencies to install.

---

## Running Locally

Just open `index.html` directly in a browser — double-click it, or drag it into a browser window. No server needed.

If you'd rather run a local server (optional, behaves identically):

| Method | Command | Default URL |
|--------|---------|-------------|
| VS Code Live Server | Right-click `index.html` → Open with Live Server | `http://127.0.0.1:5500` |
| Python 3 | `python -m http.server 8080` | `http://localhost:8080` |
| Node http-server | `npx http-server -p 8080` | `http://localhost:8080` |

The VIX value loads from `data/vix.js` (committed to the repo, refreshed on a schedule) and is saved to `localStorage`. Subsequent visits show the last-known value instantly; a live proxy fetch only runs as a fallback if `data/vix.js` is unavailable.

---

## Environment Variables

None. This application has no backend and no secrets. No `.env` file is required or used. The Yahoo Finance CORS proxy URL is a public, unauthenticated endpoint hardcoded in `assets/js/vix.js`.

---

## Build

No build step. The repository is the deployable artifact.

---

## Deploy

1. Commit and push to `main`:
   ```bash
   git push origin main
   ```
2. GitHub Pages deploys automatically within 1–3 minutes.
3. Verify at: `https://azqato.github.io/vix/`

**First-time setup:** Go to **Settings → Pages**, set source to `Deploy from a branch`, branch `main`, folder `/ (root)`.

---

## Rollback

```bash
git revert HEAD
git push origin main
```

GitHub Pages redeploys automatically after the push.

---

## Documentation

Full documentation is in [`/docs`](./docs):

| File | Purpose |
|------|---------|
| [PRD.md](docs/PRD.md) | Product requirements, user stories, feature scope |
| [TRD.md](docs/TRD.md) | Technical architecture, data models, internal data flow |
| [DESIGN.md](docs/DESIGN.md) | Color palette, typography, spacing, component patterns |
| [PATCHNOTES.md](docs/PATCHNOTES.md) | Changelog, all version history |
| [PRFAQ.md](docs/PRFAQ.md) | Press release and internal/external FAQs |
| [TENETS.md](docs/TENETS.md) | Product principles and priority-ordered design decisions |
| [METRICS.md](docs/METRICS.md) | Success metrics, targets, and measurement plan |
| [ROADMAP.md](docs/ROADMAP.md) | Milestone table and feature backlog |
| [SECURITY.md](docs/SECURITY.md) | Security model, data handling, attack surface |
| [RUNBOOK.md](docs/RUNBOOK.md) | Local setup, deploy, rollback, common errors |
