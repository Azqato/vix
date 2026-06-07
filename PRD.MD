# VIX Strategy – Product Requirements Document (PRD)

**Version:** 1.0.0  
**Status:** MVP Draft  
**Last Updated:** 2026-06-06  

---

## 1. Product Overview

**Product Name:** VIX Strategy  
**Tagline:** *Fear is a signal. Use it.*  
**Hosting:** GitHub Pages (fully static, browser-only, zero server required)  
**Tech Stack:** HTML5, CSS3, Vanilla JavaScript (ES Modules), Chart.js, Yahoo Finance JSON API via CORS proxy  

VIX Strategy is a public-facing, browser-based web application that educates investors on a rules-based, contrarian portfolio strategy that dynamically adjusts ETF allocations based on the CBOE Volatility Index (VIX). The app fetches live VIX data, computes the appropriate allocation tier, and renders a real-time pie chart and allocation table.

---

## 2. Goals and Objectives

- **Primary Goal:** Present the VIX-based allocation strategy as a credible, visually compelling investing framework.
- **Secondary Goal:** Display real-time VIX-driven portfolio allocations without any backend.
- **Tertiary Goal:** Serve as an evolving public tool that improves over time via versioned patch updates.

---

## 3. Target Audience

- Self-directed investors with high risk tolerance
- Traders interested in systematic/rules-based investing
- Retail investors who understand ETFs and volatility mechanics
- Aggressive long-term growth seekers (10+ year horizon)

---

## 4. Pages and Structure

### 4.1 `index.html` – The Pitch Page

**Purpose:** Rocket pitch that compels the viewer to understand why VIX-based investing is superior to static allocation.

**Sections:**
- **Hero Section:** Bold headline, animated VIX gauge visual, and primary CTA button ("See the Live Strategy")
- **The Problem:** Why static buy-and-hold underperforms during volatility spikes
- **The Insight:** VIX as a fear gauge and what high VIX historically signals (buying opportunities)
- **The Strategy:** Brief overview of how VIX tiers map to ETF allocations
- **Why Now:** AI/semiconductor secular growth thesis
- **Risk Disclosure:** Clear, honest summary of leverage decay and drawdown risks
- **CTA Footer:** Button linking to `strategy.html`

**Design Direction:**
- Dark, data-driven, financial-terminal aesthetic
- Color palette: Deep navy, electric green, white, amber accents
- Typography: Monospace/slab serif for data, clean sans-serif for body
- Animations: Subtle scanline effects, number counters on scroll

---

### 4.2 `strategy.html` – The Live Strategy Page

**Purpose:** Show the real-time VIX-driven portfolio allocation.

**Sections:**
- **Live VIX Feed Header:** Current VIX value displayed prominently with timestamp of last fetch
- **Active Tier Banner:** e.g., "VIX 18.4 → Tier: 15–25 (Moderate Growth)"
- **Pie Chart:** Dynamic Chart.js donut/pie chart showing current allocation percentages
- **Allocation Table:** Detailed breakdown of ticker, allocation %, and short description
- **Full Tier Reference Table:** All VIX tiers and their allocations for reference
- **Strategy Summary Block:** Collapsed accordion with the full strategy narrative
- **Disclaimer Footer:** "Not financial advice. For educational purposes only."

---

## 5. Strategy Logic – MVP

### 5.1 VIX Allocation Tiers (MVP v1.0)

| VIX Range | BIL | SPY | QQQ | TQQQ |
|-----------|-----|-----|-----|------|
| < 15      | 25% | 50% | 20% | 5%   |
| 15–25     | 20% | 40% | 30% | 10%  |
| 25–35     | 15% | 35% | 35% | 15%  |
| 35–45     | 10% | 30% | 40% | 20%  |
| > 45      | 5%  | 20% | 50% | 25%  |

**Tickers:**
- **BIL** – SPDR Bloomberg 1–3 Month T-Bill ETF (near-cash stability)
- **SPY** – SPDR S&P 500 ETF (broad market)
- **QQQ** – Invesco Nasdaq-100 ETF (tech/growth)
- **TQQQ** – ProShares UltraPro QQQ 3x Leveraged ETF (aggressive growth)

---

### 5.2 Strategy Philosophy

**Core Thesis:** The VIX is a mean-reverting fear gauge. When VIX is elevated, markets are pricing in maximum fear. Historically, these moments precede the strongest recoveries. This strategy mechanically increases leverage exposure when fear is highest and reduces it when complacency is present.

**Key Principles:**
- Contrarian by design: increase risk when others flee
- Rules-based: no emotional decision-making
- Rebalance: monthly on first trading day, or when VIX crosses a tier threshold
- Time Horizon: 10+ years required for leveraged ETF compounding to overcome volatility decay

---

### 5.3 Future Strategy Version (Post-MVP)

**VIX-Timed Growth Rocket – High-Risk Long-Term Version**

| VIX Range | QQQ (1x) | SMH (Semis) | TQQQ (3x) | SOXL (3x) | Total |
|-----------|----------|-------------|-----------|-----------|-------|
| < 15      | 35%      | 35%         | 20%       | 10%       | 100%  |
| 15–20     | 30%      | 30%         | 25%       | 15%       | 100%  |
| 20–30     | 20%      | 25%         | 30%       | 25%       | 100%  |
| 30–40     | 10%      | 15%         | 35%       | 40%       | 100%  |
| > 40      | 5%       | 10%         | 35%       | 50%       | 100%  |

**Additional Tickers (Future):**
- **SMH** – VanEck Semiconductor ETF (AI/chips sector)
- **SOXL** – Direxion Daily Semiconductor Bull 3x ETF (highest-beta)

---

## 6. Technical Requirements

### 6.1 Architecture

- **Hosting:** GitHub Pages (static only, no Node/Python server)
- **No Build Step Required:** Pure HTML/CSS/JS in root directory
- **Repository Structure:**

```
vix-strategy/
├── index.html          # Pitch page
├── strategy.html       # Live strategy dashboard
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── vix.js      # VIX data fetching logic
│   │   ├── chart.js    # Pie chart rendering
│   │   └── strategy.js # Allocation tier logic
│   └── img/
│       └── logo.svg
├── PRD.MD
├── README.MD
└── PATCHNOTES.MD
```

---

### 6.2 VIX Data Fetching

**Constraint:** `yfinance` is a Python library and cannot run in the browser. For a 100% static GitHub Pages deployment, VIX data must be fetched via browser-compatible HTTP calls.

**Solution:** Use Yahoo Finance's underlying JSON API via a public CORS proxy:

```
Primary endpoint:
https://api.allorigins.win/raw?url=https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX

Fallback endpoint:
https://api.allorigins.win/raw?url=https://query2.finance.yahoo.com/v8/finance/chart/%5EVIX
```

> **Note (v1.0.2):** `corsproxy.io` was the originally specified proxy but is blocked by Yahoo Finance (HTTP 403). `api.allorigins.win` is the confirmed working replacement.

**Data Parsed:**
- `chart.result[0].meta.regularMarketPrice` → Current VIX value
- `chart.result[0].meta.regularMarketTime` → Last updated timestamp

**Caching:** Store last fetched value and timestamp in `sessionStorage` to limit redundant API calls within the same session. Refresh interval: 60 seconds.

**Error Handling:**
- If fetch fails, display last known value with a warning badge
- If no data available, show a fallback message with manual refresh button

---

### 6.3 Chart.js Integration

- Load Chart.js via CDN: `https://cdn.jsdelivr.net/npm/chart.js`
- Chart type: Doughnut (pie with center label showing VIX value)
- Colors: Consistent palette per ticker, matching CSS variables
- Responsive: Scales to mobile viewport
- Animation: Smooth draw-in on load and on VIX tier change

---

### 6.4 Allocation Logic (JavaScript)

```javascript
function getTier(vix) {
  if (vix < 15) return 'tier1';
  if (vix < 25) return 'tier2';
  if (vix < 35) return 'tier3';
  if (vix < 45) return 'tier4';
  return 'tier5';
}

const allocations = {
  tier1: { BIL: 25, SPY: 50, QQQ: 20, TQQQ: 5 },
  tier2: { BIL: 20, SPY: 40, QQQ: 30, TQQQ: 10 },
  tier3: { BIL: 15, SPY: 35, QQQ: 35, TQQQ: 15 },
  tier4: { BIL: 10, SPY: 30, QQQ: 40, TQQQ: 20 },
  tier5: { BIL: 5,  SPY: 20, QQQ: 50, TQQQ: 25 }
};
```

> Note: Raw values from the user-provided table sum to 120% per tier. Allocations will be normalized to 100% before rendering. Confirm intended weighting before v1.0 release.

---

## 7. Non-Functional Requirements

- **Performance:** Page load under 2 seconds on standard broadband
- **Mobile Responsive:** Fully functional on screens 375px and wider
- **Accessibility:** ARIA labels on chart, sufficient color contrast (WCAG AA)
- **No Cookies / No Tracking:** Zero analytics, zero data collection
- **No Login Required:** Fully public, no auth
- **Offline Resilience:** App degrades gracefully when API is unreachable

---

## 8. MVP Scope (v1.0)

**In Scope:**
- Pitch page (`index.html`) with all sections listed in 4.1
- Strategy page (`strategy.html`) with live VIX fetch, pie chart, and allocation table
- Full tier reference table on strategy page
- CORS proxy-based VIX data fetching
- Session caching of VIX value
- Responsive mobile layout
- README.MD, PRD.MD, PATCHNOTES.MD

**Out of Scope (Post-MVP):**
- Backtesting module
- Portfolio performance tracker
- Trend filter (200-day MA overlay)
- VIX percentile rank mode
- SMH/SOXL allocation table (future strategy version)
- Historical VIX chart
- Email/notification alerts

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Yahoo Finance CORS block | Medium | High | Use allorigins.win proxy; corsproxy.io confirmed blocked (v1.0.2) |
| Allocation table sums exceed 100% | High | Medium | Normalize values in JS before render |
| Leverage decay misunderstanding | High | Medium | Clear risk disclosure on both pages |
| TQQQ/SOXL 70-95% drawdown in bear market | High | High | Prominent disclaimer, investor profile callout |
| Chart.js CDN outage | Low | Medium | Pin specific CDN version |

---

## 10. Legal and Compliance

- All pages must display: *"This is not financial advice. For educational and informational purposes only. Past performance is not indicative of future results."*
- No investment product sales, no brokerage affiliation implied
- TQQQ and SOXL risk disclosures must be prominently shown near any mention of leveraged ETFs

---

## 11. Future Enhancements (Roadmap)

1. **v1.1** – Add SMH/SOXL strategy tier as toggle option
2. **v1.2** – Add trend filter (QQQ vs 200-day MA) toggle
3. **v1.3** – Add VIX percentile rank mode
4. **v1.4** – Add historical VIX chart (12-month sparkline)
5. **v1.5** – Backtesting visualization using historical Yahoo Finance data
6. **v2.0** – Full portfolio tracker with user-entered holdings

---

*This document is maintained alongside the codebase. Update version numbers and PATCHNOTES.MD after every change.*
