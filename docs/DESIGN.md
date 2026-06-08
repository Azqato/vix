# Design Document

**Product:** VIX Strategy
**Version:** 1.0.11
**Last Updated:** 2026-06-08

---

## Design Philosophy

VIX Strategy uses a dark financial terminal aesthetic to signal precision and data authority. Every visual decision reinforces that this is a live data tool, not a marketing page. Clarity and legibility take strict priority over decoration. Motion is used only to signal live data state — it is never decorative.

---

## Color Palette

All colors are defined as CSS custom properties in `assets/css/styles.css`.

### Backgrounds

| Token | Hex | Use |
|-------|-----|-----|
| `--bg-primary` | `#0a0e1a` | Page background |
| `--bg-secondary` | `#0d1220` | Alternate sections, VIX feed header, footer |
| `--bg-card` | `#111827` | Cards, table rows, accordion body |
| `--bg-card-hover` | `#1a2235` | Card and table row hover state |

### Text

| Token | Hex | Use |
|-------|-----|-----|
| `--text-primary` | `#ffffff` | Headings, key data values |
| `--text-secondary` | `#9ca3af` | Body copy, descriptions, subheadings |
| `--text-muted` | `#6b7280` | Timestamps, sublabels, fine print, footer copyright |

### Accent Colors

| Token | Hex | Use |
|-------|-----|-----|
| `--accent-green` | `#00ff88` | Primary brand accent; active states, CTAs, live VIX value, active nav link |
| `--accent-amber` | `#f59e0b` | Warnings, CACHED badge, risk section heading |
| `--accent-blue` | `#3b82f6` | BIL ticker color; informational |
| `--accent-red` | `#ef4444` | STALE and ERROR badges, TQQQ ticker color |
| `--accent-orange` | `#f97316` | Tier 4 (High Fear) indicator |

### Borders

| Token | Value | Use |
|-------|-------|-----|
| `--border` | `rgba(255,255,255,0.08)` | Default border on cards, sections, table wrappers |
| `--border-accent` | `rgba(0,255,136,0.3)` | Green-tinted border on active elements and hero gauge |

### Ticker Colors (must match `TICKERS` in `strategy.js`)

| Token | Hex | Ticker |
|-------|-----|--------|
| `--color-bil` | `#3b82f6` | BIL |
| `--color-spy` | `#00ff88` | SPY |
| `--color-qqq` | `#f59e0b` | QQQ |
| `--color-tqqq` | `#ef4444` | TQQQ |

### Tier Colors

| Token | Hex | Tier |
|-------|-----|------|
| `--tier1-color` | `#3b82f6` | Tier 1 — Low Fear |
| `--tier2-color` | `#10b981` | Tier 2 — Moderate Fear |
| `--tier3-color` | `#f59e0b` | Tier 3 — Elevated Fear |
| `--tier4-color` | `#f97316` | Tier 4 — High Fear |
| `--tier5-color` | `#ef4444` | Tier 5 — Extreme Fear |

---

## Typography

### Font Families

| Token | Stack | Use |
|-------|-------|-----|
| `--font-body` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | Body paragraphs, descriptions, section leads |
| `--font-mono` | `'Courier New', 'Lucida Console', monospace` | All numeric data, labels, nav, badges, buttons, table headers |

### Type Scale

| Role | CSS size | Computed | Weight | Font | Notes |
|------|----------|----------|--------|------|-------|
| Hero headline | `clamp(2.5rem, 6vw, 4.25rem)` | 40–68px | 900 | Body | Gradient text fill |
| H1 | `clamp(2rem, 5vw, 3.5rem)` | 32–56px | 700 | Body | |
| H2 / section title | `clamp(1.5rem, 3vw, 2.25rem)` | 24–36px | 700 | Body | Green underbar via `::after` |
| H3 | `1.25rem` | 20px | 700 | Body | Card titles |
| H4 | `0.78rem` | 12.5px | 700 | Mono | Uppercase, 0.1em tracking; accordion sub-headings |
| Body | `1rem` | 16px | 400 | Body | Line-height 1.6 |
| Section lead | `1.1rem` | 17.6px | 400 | Body | Color: `--text-secondary` |
| VIX large number | `clamp(4rem, 10vw, 6rem)` | 64–96px | 700 | Mono | strategy.html only |
| Data values (tables) | `0.9375rem` | 15px | 600 | Mono | |
| Table headers | `0.72rem` | 11.5px | 700 | Mono | Uppercase, 0.1em tracking |
| Nav links | `0.8rem` | 12.8px | 600 | Mono | 0.04em tracking |
| Badges | `0.68rem` | 10.9px | 700 | Mono | Uppercase, 0.1em tracking |
| Footer / copyright | `0.72rem` | 11.5px | 400 | Mono | |
| Gauge sublabels | `0.62–0.65rem` | ~10px | 400 | Mono | Uppercase, high letter-spacing |

---

## Spacing System

Base unit: **4px** (0.25rem). All layout spacing uses one of these seven tokens.

| Token | Value | Pixels |
|-------|-------|--------|
| `--sp-xs` | `0.25rem` | 4px |
| `--sp-sm` | `0.5rem` | 8px |
| `--sp-md` | `1rem` | 16px |
| `--sp-lg` | `1.5rem` | 24px |
| `--sp-xl` | `2rem` | 32px |
| `--sp-2xl` | `3rem` | 48px |
| `--sp-3xl` | `4rem` | 64px |

### Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `--r-sm` | `4px` | Buttons, badges, nav links, small chips |
| `--r-md` | `8px` | Accordion content, legend items, blockquote, disclaimer box |
| `--r-lg` | `12px` | Cards, table wrappers, hero gauge, chart area |

### Global Transition

`--transition: all 0.2s ease` — applied to hover states on buttons, cards, table rows, nav links.

---

## Breakpoints

| Breakpoint | Condition | Layout changes |
|-----------|-----------|----------------|
| Wide (default) | > 900px | Chart grid: fixed 360px column + 1fr legend column |
| Tablet | ≤ 900px | Chart grid collapses to single column; chart constrained to 320px max, centered |
| Mobile | ≤ 768px | Nav padding reduced; nav link font shrinks to 0.72rem; hero height becomes 100svh; gauge wrapper stacks vertically; problem/why/insight grids become 1 column; VIX feed stacks vertically; section padding reduced from 4rem to 3rem; table cell padding reduced |
| Small mobile | ≤ 480px | Container side padding reduced; VIX large number shrinks to 3.5rem; card padding reduced; tier banner font and padding shrink |

---

## Component Patterns

### Buttons

**Primary (`.btn-primary`):** Solid `--accent-green` background, `#000` text. Monospace. Used for main CTAs. Hover: slightly brighter green, 1px upward lift, green glow shadow.

**Secondary (`.btn-secondary`):** Transparent background, `--accent-green` border and text. Used for secondary navigation actions. Hover: faint green background tint.

**Large variant (`.btn-large`):** Added to `.btn-primary` for hero and footer CTAs. Larger padding and font size.

### Navigation Links (`.nav-link`)

Pill-shaped, monospace. Default: `--text-secondary` color, transparent border. Hover: `--text-primary` color, faint `--border` visible. Active (`.nav-active`): `--accent-green` color, `--border-accent` border, `rgba(0,255,136,0.08)` background. The active class is hardcoded per page in HTML; no JS required.

### Cards (`.card`)

Background: `--bg-card`. Border: `--border` (8% white). Border-radius: 12px. Padding: `--sp-xl` (32px). Hover: border shifts to `rgba(0,255,136,0.18)`, background lightens to `--bg-card-hover`.

### Badges

All badges share the `.badge` base class (mono, 0.68rem, uppercase, 0.1em tracking):

| Class | Color | Use |
|-------|-------|-----|
| `.badge-live` | `--accent-green` | Fresh VIX data; animated pulse |
| `.badge-cached` | `--accent-amber` | Data within 30-minute TTL |
| `.badge-error` | `--accent-red` | STALE or ERROR state |
| `.badge-tier1`–`.badge-tier5` | Tier colors | Tier indicator in hero section |

### Tables

Header: `--bg-secondary` background, mono uppercase text at 0.72rem. Body rows: `--bg-card` background, hover lightens. Last row has no bottom border. Data cells use mono font at weight 600. Tier rows have a 3px colored left border keyed to `data-tier` attribute. Active tier row in reference table gets green background tint and all cells turn green.

### Accordion

Uses native HTML `<details>` / `<summary>`. Custom `::after` chevron rotates 180° when open. Summary has hover background change. Content area has mono sub-headings at 0.78rem uppercase in `--accent-green`.

### Tier Banner

Inline-block, mono, font-weight 700. Color, border, and background all update dynamically based on `data-tier` attribute matching tier-specific CSS rules. Transitions smoothly between states.

---

## Accessibility Standards

**Target:** WCAG 2.1 AA

**Color contrast:**
- `--text-primary` (#fff) on `--bg-primary` (#0a0e1a): 18.9:1 ✓
- `--accent-green` (#00ff88) on `--bg-primary` (#0a0e1a): 11.5:1 ✓
- `--text-secondary` (#9ca3af) on `--bg-primary` (#0a0e1a): 5.7:1 ✓

**ARIA:**
- `aria-live="polite"` on VIX value, tier banner, allocation table body, and chart legend.
- `role="status"` on the tier banner element.
- `aria-label` on the canvas element, chart wrapper, and navigation landmark.
- `aria-current="page"` on the active nav link for the current page.
- `alt` text on logo image.
- `aria-label` on the manual Refresh button.

**Keyboard navigation:** All interactive elements (links, buttons, `<details>` summary) are natively keyboard-accessible. No custom focus management required.

**Known accessibility debt:** No `prefers-reduced-motion` media query implemented. The `gauge-pulse`, `pulse-badge`, and `flash-update` animations run unconditionally. This should be addressed before a v1.1 release.

---

## Animation and Motion

All motion signals live data — none is decorative.

| Animation | Element | Duration | Easing | Trigger |
|-----------|---------|----------|--------|---------|
| `gauge-pulse` | Hero VIX number | 3s, infinite | ease-in-out | Always — indicates live data connection |
| `pulse-badge` | LIVE badge | 2.5s, infinite | ease-in-out | When badge state is LIVE |
| `flash-update` | VIX number on dashboard | 0.5s, once | ease forwards | On each VIX data refresh |
| Chart draw-in | Canvas | 600ms | easeInOutQuart | On `initChart()` and `updateChart()` |
| Button hover lift | `.btn-primary` | 0.2s | ease | Hover |
| Card hover | `.card` | 0.2s | ease | Hover |
| Row hover | Table rows, legend items | 0.2s | ease | Hover |
| Accordion chevron | `::after` on summary | 0.2s | ease | `<details>` open/close |
