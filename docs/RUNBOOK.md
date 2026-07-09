# Runbook

**Product:** VIX Strategy
**Version:** 1.0.11
**Last Updated:** 2026-06-08

---

## Local Setup

Complete steps to run the project from a fresh machine.

### Prerequisites

| Requirement | Purpose | Notes |
|------------|---------|-------|
| Git | Clone and manage the repository | Any recent version |
| Local HTTP server | Serve files over HTTP so ES modules load | See options below |
| Modern browser | Run and test the application | Chrome, Firefox, Safari, Edge — any 2022+ version |

**No Node.js is required** unless you use `npx http-server`. No npm, no package.json.

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Azqato/vix.git
cd vix

# 2. Start a local HTTP server (pick one)
python -m http.server 8080
# OR
npx http-server -p 8080

# 3. Open in browser
# → http://localhost:8080
```

**VS Code Live Server alternative:** Right-click `index.html` in the Explorer panel → **Open with Live Server**. URL will be `http://127.0.0.1:5500`.

### Why an HTTP Server Is Required

ES modules (`type="module"`) are blocked by all modern browsers when loaded from the `file://` protocol. Double-clicking `index.html` will silently fail to load any JavaScript. The VIX display will show `--` and no tier badge will appear. This is expected behavior for file:// — it is not a bug.

---

## Build

There is no build step. The repository is the deployable artifact. No compilation, bundling, transpilation, or minification is required or used.

---

## Deploy

### GitHub Pages — Production

1. Commit all changes:
   ```bash
   git add <files>
   git commit -m "description"
   ```

2. Push to `main`:
   ```bash
   git push origin main
   ```

3. GitHub Pages deploys automatically within 1–3 minutes.

4. Verify the deployment at: `https://azqato.github.io/vix/`

5. Check the **Actions** tab on GitHub for deployment status if the site doesn't update.

### First-Time GitHub Pages Setup

Only required once per repository:

1. Go to the repository on GitHub.
2. Click **Settings → Pages**.
3. Set **Source** to `Deploy from a branch`.
4. Set **Branch** to `main`, folder to `/ (root)`.
5. Click **Save**.

GitHub will show the published URL in the Pages settings once the first deployment completes.

---

## Rollback

### Revert the most recent commit

```bash
git revert HEAD
git push origin main
```

### Revert to a specific version

```bash
# Find the target commit hash
git log --oneline

# Create a revert commit (safe — does not rewrite history)
git revert <commit-sha>
git push origin main
```

GitHub Pages redeploys automatically after the push. The rollback is live within 1–3 minutes.

**Do not use `git reset --hard` on `main`.** It rewrites history and requires a force push, which is disruptive and may break GitHub Pages deployment history.

---

## Environment Configs

| Environment | URL | Branch | Deploy method |
|-------------|-----|--------|---------------|
| Production | `https://azqato.github.io/vix/` | `main` | Automatic on every push to `main` |
| Local dev | `http://localhost:8080` (or Live Server port) | Any branch | Manual HTTP server start |

There is no staging environment. Test all changes locally before pushing to `main`, since `main` is always the live site.

---

## Common Errors

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| VIX shows `--`, no tier badge, no chart | Opened `index.html` via `file://` protocol | Start a local HTTP server (see Local Setup) |
| VIX shows `STALE` badge | `data/vix.json` fetch failed and allorigins.win proxy also unreachable, or Yahoo Finance changed their API | Click Refresh; check `https://azqato.github.io/vix/data/vix.json` and `https://api.allorigins.win/` directly; check the **Actions** tab for `update-vix.yml` failures |
| `data/vix.json` not updating during market hours | `update-vix.yml` run failed (Yahoo endpoint changed/unreachable) or repo went 60+ days without a commit (GitHub auto-disables scheduled workflows) | Check the **Actions** tab; re-run manually via `workflow_dispatch` if needed; push any commit to re-enable a disabled schedule |
| VIX shows `ERROR` badge and `--` | Live fetch failed and no prior cached value | Check network; click Refresh after a moment |
| Chart canvas is blank, but VIX value and tables show | Chart.js CDN (jsDelivr) failed to load | Check `https://status.jsdelivr.com`; verify the CDN URL in `strategy.html` is accessible |
| Navigation active highlight is on the wrong page | `nav-active` class applied to wrong `<a>` tag in HTML | Check `index.html` has `nav-active` on the About link; `strategy.html` has it on the Dashboard link |
| Cached VIX is very old (hours or days old) | localStorage was not cleared; Refresh button not clicked | Click Refresh; `localStorage['vix_last_known']` is cleared by the button |
| `Unexpected VIX response shape` in console | Yahoo Finance changed their API response structure | Update `parseResponse()` in `vix.js` to match the new field path |
| `window.Chart is not defined` | Chart.js CDN `<script>` tag failed to load before the module script ran | Verify the CDN URL; check jsDelivr status; ensure the `<script src>` is before `<script type="module">` in `strategy.html` |
| Site deploys but shows old version | Browser cache serving stale files | Hard refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`); GitHub Pages CDN cache clears within minutes of deploy |

---

## Monitoring

VIX Strategy has no server-side monitoring because it has no server. All monitoring is manual.

| Check | How | When |
|-------|-----|------|
| Live VIX fetch works | Open `https://azqato.github.io/vix/strategy.html`; verify status badge shows `LIVE` | Per release; after any change to `vix.js` |
| `update-vix.yml` scheduled runs are succeeding | Check the **Actions** tab, filter by `Update VIX Data` | Weekly, or if `data/vix.json` looks stale |
| `data/vix.json` is up to date | Open `https://azqato.github.io/vix/data/vix.json`; compare `fetchedAt` to the current time during market hours | If VIX display looks stale |
| No console errors | Open browser DevTools → Console on both pages | Per release |
| Both pages render correctly on mobile | Test at 375px viewport width | Per release |
| GitHub Pages deployment succeeded | Check **Actions** tab on GitHub | After every push to `main` |
| allorigins.win is operational | Visit `https://api.allorigins.win/` directly | When STALE errors are reported by users |
| Chart.js CDN is accessible | Visit the CDN URL directly; check `https://status.jsdelivr.com` | When chart is blank |
