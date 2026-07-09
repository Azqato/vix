# Product Tenets

**Product:** VIX Strategy
**Version:** 1.0.11

Tenets are ordered by priority. When two tenets conflict, the higher one wins.

---

## 1. The Rule Is the Product

The strategy's value is its mechanical, unemotional nature. Every feature decision must reinforce rule-following, not discretion. If a feature invites users to override the allocation, tune parameters, or second-guess the current tier, it works against the product. Features that add "flexibility" at the cost of rules-based discipline are rejected. A tenet that everyone agrees with is not useful — this one forces us to cut popular "power user" features that would undermine the core thesis.

## 2. Show the Signal Instantly

A blank screen while waiting for the network costs user trust. The last-known VIX value is always available from localStorage and must be painted synchronously on every page load, before any async operation resolves. No feature may hold the primary display hostage to a network call. If the screen can be populated from cache, it must be — immediately.

## 3. Zero Trust in the Data Pipeline

The VIX data source (Yahoo Finance, fetched server-side by a scheduled GitHub Actions workflow, with a direct browser + CORS-proxy fallback) has no SLA and is not under our control. Every code path that depends on live data must handle failure gracefully: fall back to cached value first, then to an explicit error state. The user must always see the most useful available information — never a silent failure, never a broken layout.

## 4. No Backend, No Exceptions

Adding a persistent server introduces cost, maintenance burden, security surface, and operational risk. Every feature must be implementable in a browser with zero server-side execution *at request time*. The one exception, introduced in v1.1.0, is a scheduled GitHub Actions workflow that runs independently of any user request and only writes a static file (`data/vix.js`) back to the repo — it never serves a live request, has no API, and holds no state beyond that one file. This is deliberately distinct from a "backend": there is nothing running that a user request ever reaches. If a proposed feature requires code that responds to a live user request, it belongs in a post-v2.0 scope or must be redesigned around browser-only primitives.

## 5. The Disclaimer Is Non-Negotiable

Leveraged ETF strategies carry extreme risk. The legal and ethical obligation to display a clear, legible risk disclaimer is not a UX feature that can be minimized, collapsed, or de-prioritized to improve conversion. It must appear on every page that references TQQQ, in legible text, before the user reaches any call-to-action.
