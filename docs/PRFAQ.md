# PR/FAQ

**Product:** VIX Strategy
**Date:** 2026-06-08

---

## Press Release

**FOR IMMEDIATE RELEASE**

### VIX Strategy Launches Free Browser Tool That Turns Market Fear Into a Portfolio Action Plan

*A rules-based allocation dashboard shows investors exactly how to position their ETF portfolio based on the live CBOE Volatility Index — no signup, no backend, no guesswork.*

**ONLINE, June 8, 2026** — Azqato today launched VIX Strategy, a free browser-based tool that reads the live CBOE VIX (Volatility Index) and instantly computes a rules-based portfolio allocation across four ETFs: BIL (T-Bills), SPY (S&P 500), QQQ (Nasdaq-100), and TQQQ (3x leveraged Nasdaq).

The strategy operates on a simple premise: the VIX is a mean-reverting fear gauge. When market fear peaks, the VIX spikes — and historically, those spikes have preceded the strongest equity recoveries on record. VIX Strategy translates that insight into five mechanical tiers. As fear rises, the tool automatically shifts the recommended allocation toward more aggressive positions. As markets calm, it tilts back toward safety. No emotion, no guesswork, no brokerage required.

"I kept watching VIX spike and knowing I should be doing something, but I never had a clear answer for exactly what," said one early user. "This gives me the specific percentages every single time."

VIX Strategy is completely free, requires no login, collects no user data, and runs entirely in the browser. It is hosted on GitHub Pages and available at [https://azqato.github.io/vix/](https://azqato.github.io/vix/).

---

## Internal FAQ

**1. Why build this as a fully static site with no backend?**
Zero operational cost, zero server maintenance, and zero data collection liability. GitHub Pages is free and globally distributed. VIX data is refreshed by a scheduled GitHub Actions workflow that commits a static file — it never serves a live request. The only remaining external dependency is a public CORS relay, used only as a fallback. Adding a real backend would introduce billing, uptime obligations, and security surface with no benefit.

**2. What happens if the committed VIX data and the allorigins.win CORS proxy both fail?**
The app degrades gracefully to the last cached VIX value, displayed with a STALE badge. If no cache exists, it shows an ERROR badge with a `--` placeholder. The page never crashes. The user can click Refresh to retry.

**3. Why TQQQ? Isn't 3x leverage extremely risky?**
Yes, deliberately. The strategy targets aggressive long-term investors who understand volatility decay. TQQQ's allocation is capped at 25% (at extreme VIX) and starts at just 5% (at low VIX). The risk disclosure on both pages is explicit about 70–95% drawdown potential. The tool assumes a 10+ year time horizon.

**4. How does the 30-minute cache TTL avoid showing stale data?**
VIX moves slowly enough that a 30-minute reading is actionable for monthly rebalancing decisions. The tradeoff — fewer API calls and faster load times — is acceptable. Users who want the freshest value can click Refresh at any time to clear the cache and fetch live.

**5. What must be true for this strategy to outperform buy-and-hold?**
Three conditions: (1) the VIX remains mean-reverting over the investor's time horizon, (2) QQQ and TQQQ continue their long-term upward trend, and (3) the investor holds through drawdowns of 70–95% without panic-selling. None of these are guaranteed. The strategy is a framework, not a guarantee.

**6. Is this financial advice?**
No. The disclaimer is displayed on every page. This is an educational tool for investors who have already decided to explore VIX-based allocation and want a clean, rules-based implementation.

**7. Can this be forked and customized?**
Yes. The code is open source on GitHub, intentionally simple — three JS files, one CSS file, two HTML pages, no build step. Anyone can clone it and replace the allocation table with their own strategy.

**8. What would v2.0 look like?**
A portfolio tracker where users enter their current holdings and the app computes the delta — "sell X of BIL, buy Y of TQQQ." This requires persistent user state, which means either a backend or a complex localStorage-only UX. It is the most-requested future feature but the most architecturally complex.

**9. How is the VIX data sourced?**
Yahoo Finance's internal JSON API at `query1.finance.yahoo.com/v8/finance/chart/^VIX`. A scheduled GitHub Actions workflow fetches it directly (no proxy needed outside a browser) and commits the value to the repo, refreshed 8 times per weekday during market hours. If that committed value is ever unavailable, the browser falls back to fetching the same endpoint directly, proxied through allorigins.win to bypass the browser CORS block. No API key is required either way. The same endpoint powers most retail VIX charts.

**10. Why not use a paid, reliable data API?**
Most financial data APIs with SLAs require API keys, user accounts, and billing — all of which violate the no-backend, no-data-collection design constraints. The free, unauthenticated Yahoo Finance endpoint, fetched server-side on a schedule, is the best fit for a free, fully static deployment.

---

## External FAQ

**1. What does this tool do?**
It reads the current CBOE VIX (Volatility Index) and shows you exactly how to divide a portfolio across four ETFs based on a preset rules-based strategy. It updates live and recalculates every time the VIX changes tiers.

**2. Is it free?**
Yes. No signup, no payment, no email required. It runs entirely in your browser and collects no data about you.

**3. What data does it use?**
Only the live VIX value from Yahoo Finance. Nothing about you or your portfolio is ever collected or transmitted anywhere.

**4. How current is the VIX data?**
The VIX is fetched live and cached in your browser for up to 30 minutes. The status badge tells you whether you are seeing live, cached, or stale data. You can force a live refresh at any time using the Refresh button.

**5. What are BIL, SPY, QQQ, and TQQQ?**
BIL is a T-Bill fund — near-cash, very low risk. SPY tracks the S&P 500. QQQ tracks the Nasdaq-100, which is heavy in tech companies. TQQQ is 3x leveraged QQQ — it amplifies both gains and losses by a factor of three on a daily basis.

**6. Can I lose money following this strategy?**
Yes, and potentially a lot. TQQQ lost approximately 80% of its value in 2022 and over 90% during the 2020 COVID crash. This strategy is designed for capital you will not need for at least 10 years and can afford to see temporarily drop by 70–95%.

**7. Does this tell me when to buy or sell?**
It tells you what percentage of your portfolio each ETF should represent right now. If your current holdings differ from the target allocation, you rebalance to match. You buy or sell in your own brokerage account.

**8. How often should I rebalance?**
Monthly on the first trading day of the month. Additionally, rebalance immediately when the VIX crosses into a different tier — in either direction.

**9. Does it track my portfolio or record my trades?**
No. You enter no personal information, and nothing is stored on any server. Your browser stores only the last VIX number it fetched, so the page loads instantly on your next visit.

**10. Is this financial advice?**
No. This tool is for educational and informational purposes only. Past performance is not indicative of future results. Please consult a qualified financial advisor before making investment decisions, especially those involving leveraged ETFs.
