# Security Document

**Product:** VIX Strategy
**Version:** 1.2.0
**Last Updated:** 2026-07-09

---

## Authentication Model

None. VIX Strategy has no user authentication, no login flow, no sessions, and no user accounts. All pages are publicly accessible to anyone with a browser. There is no admin interface and no privileged access.

---

## Authorization Model

None. There are no user roles and no access-controlled resources. The application is entirely read-only from the user's perspective — it fetches public market data and renders it.

---

## Data Storage

| Data | Storage location | Contents | Accessible by | Protection mechanism |
|------|-----------------|----------|---------------|---------------------|
| VIX cache | `localStorage` (browser-side) | Last VIX value (float), ISO timestamp, fetchedAt Unix ms | JavaScript running on the same origin only | Browser same-origin policy |
| VIX data file | `data/vix.js` (repo, loaded via `<script src>`) | Last VIX value (float), ISO timestamp, fetchedAt Unix ms, assigned to `window.__VIX_DATA__` | Publicly readable, writable only by the `update-vix.yml` GitHub Actions workflow via `GITHUB_TOKEN` | Committed to `main` by a scheduled workflow only; no user input path can write to it |
| Custom strategy tickers | `localStorage['vix_custom_tickers']` (browser-side) | Four ticker strings (Risk Off / Diversify / Risk On / Full Risk categories), sanitized to `[A-Z0-9.-]`, max 10 chars each | JavaScript running on the same origin only | Browser same-origin policy; input sanitized in `custom.js` before storage |

**No user data of any kind is collected, stored server-side, or transmitted.** localStorage holds only the last-known VIX number and the timestamp of when it was fetched. It contains zero personally identifiable information (PII).

---

## Environment Variables

None. This application has no backend, no build step, and no secrets of any kind. There is no `.env` file, no API key, no database credential, and no configuration value that must be protected.

**Nothing should ever be committed to this repository that resembles a secret.** The Yahoo Finance endpoint and allorigins.win proxy URL are public, unauthenticated, and intentionally visible in source code.

---

## Third-Party Trust

Every outbound request made by the application:

| Service | URL | Data transmitted | Purpose |
|---------|-----|-----------------|---------|
| `data/vix.js` (same origin) | `/data/vix.js` on `azqato.github.io` | None — loaded as a `<script src>`, not a `fetch()` | Primary VIX data source, refreshed on a schedule server-side; also works under `file://` |
| allorigins.win | `https://api.allorigins.win/raw?url=...` | Target URL + browser IP (implicit) | Fallback only, used if `window.__VIX_DATA__` is unavailable |
| Yahoo Finance | `https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX` | Browser IP and user-agent (via relay); no browser IP when fetched server-side by the GitHub Actions workflow | Source of VIX market data, fetched directly (no proxy) by `update-vix.yml`, and as a browser fallback via allorigins.win |
| jsDelivr CDN | `https://cdn.jsdelivr.net/npm/chart.js@4.4.0/...` | Browser IP and user-agent | Serve Chart.js library |

**No user's personal data, financial data, portfolio information, or identifying information is transmitted to any party.** The only data leaving the browser is the standard HTTP metadata inherent in any web request (IP address, user-agent).

---

## Known Attack Surface

### CORS Proxy Response Injection

**Risk:** A compromised allorigins.win could return malicious JSON instead of valid VIX data.

**Mitigation:** The `parseResponse()` function in `vix.js` accesses only two specific fields: `chart.result[0].meta.regularMarketPrice` (coerced to a number) and `chart.result[0].meta.regularMarketTime` (coerced to a Date). No content from the proxy response is passed to `eval()`, `innerHTML`, or `Function()`. A malformed response throws an error and the cached value is used instead.

### DOM Injection via Rendered Data

**Risk:** If VIX values, ETF names, or user-entered tickers were inserted into the DOM unsanitized, they could carry XSS payloads.

**Mitigation:**
- VIX values from the API are numbers — inserted via `.textContent`, which never executes HTML.
- ETF names and descriptions on `index.html`/`strategy.html` are hardcoded constants in `strategy.js` (`TICKERS` object), not derived from any API response.
- Template literals used for table row and legend HTML (`innerHTML`) on `index.html`/`strategy.html` render only from the `TICKERS` constant and numeric allocation values — never from user input or API text fields.
- `custom.html` (v1.2.0) renders all four DOM surfaces that display user-entered ticker text (form label associations, chart legend, allocation table, Chart.js labels) using `document.createElement()` + `.textContent`/`.value` exclusively — no `innerHTML` string concatenation is used anywhere the ticker value is involved. This is deliberate: it's the first user-input surface in the app, so DOM-injection safety doesn't depend solely on the input sanitizer.

### Custom Ticker Input (v1.2.0)

**Risk:** `custom.html` is the first page in this app to accept free-text user input (a ticker per risk category). Unsanitized or unescaped user input is the single most common source of XSS in web applications.

**Mitigation (defense in depth, two independent layers):**
1. **Input sanitization** — `sanitizeTicker()` in `custom.js` uppercases the input and strips everything outside `[A-Z0-9.-]`, capped at 10 characters, before it's ever stored in `localStorage` or read back. This alone rules out `<`, `>`, `"`, `'`, and every other HTML-meaningful character.
2. **Safe rendering** — even if the sanitizer were ever loosened or bypassed, every render path for that value uses `.textContent`/`.value`, not `innerHTML` (see above), so no string of characters could execute as markup.

**Known limitation:** The ticker is not verified against a real quote (deferred to v1.2.1 — see `docs/ROADMAP.md`). A user can enter any string matching the sanitizer's charset, valid ticker or not; this is a data-quality gap, not a security one, since the rendering path is already injection-safe regardless of whether the ticker "means" anything.

### CDN Compromise (Chart.js)

**Risk:** If jsDelivr is compromised, a modified Chart.js bundle could execute arbitrary JavaScript in every visitor's browser.

**Mitigation (current):** The CDN version is pinned to `4.4.0`. This prevents silent upgrades but does not prevent a targeted replacement of that specific version's files.

**Known debt:** No Subresource Integrity (SRI) hash is present on the `<script src>` tag. Adding `integrity="sha384-..."` would cause the browser to reject any CDN response that doesn't match the expected hash, providing strong protection against CDN compromise. This should be added.

### `data/vix.js` as Executable Script

**Risk:** Unlike the JSON file it replaced, `data/vix.js` is loaded via `<script src>` and executed directly as JavaScript, not parsed as inert data. If anything other than the intended value ever landed in that file, it would run with full page privileges.

**Mitigation:** The only write path to `data/vix.js` is the `update-vix.yml` GitHub Actions workflow, which generates the file from a template with two numeric/string values interpolated from Yahoo Finance's own response fields (`regularMarketPrice`, `regularMarketTime`) — no other input reaches this file. Repository branch protection and `GITHUB_TOKEN` scoping to this repo are the operative controls; this is the same trust boundary as any other file in `main`.

### User Input Surface

As of v1.2.0, `custom.html` accepts free-text ticker input per risk category (see "Custom Ticker Input" above) — the only user input in the app. `index.html` and `strategy.html` remain entirely read-only with no forms, search fields, or query parameters that affect rendering. There is no SQL injection surface (no database), and no CSRF surface (no authenticated state, no server-side mutations to forge).

---

## Dependency Policy

- **Runtime dependencies:** One — Chart.js 4.4.0, loaded via CDN UMD `<script>` tag.
- **Development dependencies:** None. No `package.json`, no lock file, no npm.
- **Version pinning:** Chart.js is pinned directly in the `<script src>` URL. Updates require a deliberate code change.
- **Vulnerability scanning:** Not automated. No Dependabot, no Snyk, no GitHub security alerts (no `package.json` to scan).
- **Update policy:** Chart.js updates are applied manually when a security vulnerability is publicly disclosed for the pinned version. Check https://github.com/chartjs/Chart.js/security/advisories periodically.
