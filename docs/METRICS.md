# Metrics

**Product:** VIX Strategy
**Version:** 1.0.11
**Last Updated:** 2026-06-08

---

## North Star Metric

**Weekly unique visitors to strategy.html**

Rationale: strategy.html is the core product — the live allocation dashboard. A visitor who reaches strategy.html is an investor who found the tool useful enough to check their allocation. index.html visits alone may be one-time reads. Repeat visits to strategy.html represent the retained, high-value user.

---

## Acquisition Metrics

| Metric | Definition | Target | Timeframe |
|--------|-----------|--------|-----------|
| Monthly unique visitors | Total unique sessions across both pages | 500/month | 3 months post-launch |
| GitHub referral traffic | Sessions originating from GitHub (stars, README, links) | ≥ 30% of total | Ongoing |
| Organic search sessions | Sessions arriving via search engine | 100/month | 6 months post-launch |
| GitHub stars | Total stars on the repository | 25 | 6 months post-launch |

**Measurement method:** GitHub Insights provides referral and traffic data. Page view analytics require adding a privacy-respecting analytics script (e.g., Plausible, GoatCounter) to both pages. Until then, GitHub star and fork count serve as the primary acquisition proxy.

---

## Engagement Metrics

| Metric | Definition | Target | Timeframe |
|--------|-----------|--------|-----------|
| strategy.html visit rate | % of all sessions that include strategy.html | ≥ 60% | Ongoing |
| Average session duration | Time from first to last recorded page event | > 90 seconds | Ongoing |
| Manual refresh rate | Clicks on the Refresh button per session | — (diagnostic only; no target) | Ongoing |

**Measurement method:** Analytics tool with page-view and click-event tracking. Without analytics, session duration and engagement cannot be measured.

---

## Retention Metrics

| Metric | Definition | Target | Timeframe |
|--------|-----------|--------|-----------|
| Returning visitor rate | % of sessions from a visitor who has visited before | ≥ 30% | 6 months post-launch |
| Weekly active users | Unique visitors in any rolling 7-day window | 100/week | 6 months post-launch |

**Measurement method:** Analytics tool with return-visit identification. A weak proxy is available without analytics: presence of `localStorage['vix_last_known']` in the user's browser indicates at least one prior visit.

---

## Performance Metrics

| Metric | Definition | Target | Measurement method |
|--------|-----------|--------|--------------------|
| VIX value display time | Time until any value (cached or live) appears in the DOM | < 200ms | Browser DevTools performance timeline |
| Largest Contentful Paint (LCP) | Time until main content renders | < 1.5s | Lighthouse audit |
| Live fetch latency | Time from page load to live VIX value available | < 5s | Console timing |
| Console errors on load | JavaScript errors logged in production | 0 | Browser console + manual QA per release |

---

## Targets

| Metric | Current | 90-day Target |
|--------|---------|---------------|
| Weekly unique visitors to strategy.html | Unknown | 100/week |
| GitHub stars | 0 | 10 |
| Returning visitor rate | Unknown | 25% |
| LCP | ~0.8s | < 1.5s |
| Console errors on production load | 0 | 0 |

---

## Measurement Method

| Layer | Tool | Status |
|-------|------|--------|
| Page views, sessions, referrers | GitHub Traffic Insights | Available now (aggregate, 14-day window) |
| Stars, forks, watchers | GitHub repository stats | Available now |
| Page performance | Chrome DevTools Lighthouse | Manual, per release |
| Functional correctness | Manual QA checklist in RUNBOOK.md | Per release |
| Detailed analytics (sessions, duration, events) | Not yet implemented | Requires adding analytics script |

---

## Reporting Cadence

| Cadence | What to review |
|---------|----------------|
| Weekly | GitHub Traffic Insights — page views, unique visitors, top referrers |
| Monthly | GitHub stars, forks, open issues |
| Per release | Lighthouse score, console error check, manual smoke test on mobile and desktop |
