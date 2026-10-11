---
name: Nigeria Police Force — website, portal and operations console
description: One light, Force-blue system from the public pages into the control room.
colors:
  npf-blue: "#1b3f7a"
  npf-blue-deep: "#14315f"
  npf-blue-mid: "#2c5fa8"
  npf-blue-ink: "#17376b"
  npf-night: "#0a1526"
  npf-ink: "#1a2338"
  npf-body: "#4a5468"
  npf-steel: "#5d6d84"
  npf-cloud: "#f4f6fa"
  npf-chip: "#e8eef8"
  npf-mist: "#eef3fa"
  npf-line: "#d3dcea"
  surface: "#ffffff"
  ops-p1: "#b30900"
  ops-p2: "#8a4b06"
  ops-p3: "#1d628f"
  ops-p4: "#4a5870"
  ops-route: "#36309b"
  ops-scene: "#0b5a54"
  ops-ok: "#0e6b41"
  chart-series: "#2c5fa8"
  chart-late: "#b30900"
typography:
  display:
    fontFamily: "var(--font-secondary-face), Segoe UI, Noto Sans, Tahoma, system-ui, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.025em"
    lineHeight: 1.05
  body:
    fontFamily: "var(--font-primary-face), Segoe UI, Noto Sans, Tahoma, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
  meta:
    fontSize: "0.75rem"
  floor:
    fontSize: "0.6875rem"
rounded:
  chip: "0.5rem"
  card: "1rem"
  tile: "1.5rem"
  pill: "9999px"
spacing:
  row: "14px"
  panel: "20px"
  gap: "16px"
  section: "24px"
components:
  ops-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "20px"
  ops-band:
    backgroundColor: "{colors.npf-blue-deep}"
    textColor: "{colors.surface}"
    rounded: "{rounded.card}"
  button-brand:
    backgroundColor: "{colors.npf-blue}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    height: "40px"
  button-brand-hover:
    backgroundColor: "{colors.npf-blue-deep}"
  button-quiet:
    backgroundColor: "{colors.npf-chip}"
    textColor: "{colors.npf-ink}"
    rounded: "{rounded.pill}"
    height: "40px"
  grade-chip:
    rounded: "6px"
    height: "20px"
  status-pill:
    rounded: "{rounded.pill}"
    padding: "4px 10px 4px 8px"
---

## Overview

The Nigeria Police Force site, the citizen portal and the operations console are one system. The console (`/app/police`) is light and wears the public site's Force blue, crest, type and radii, so an officer and a citizen are plainly using the same Force's software. Its one dark moment is the navy title band at the top of each screen, carrying the screen's live figures.

The console is an **operate** surface for a control-room officer working an eight-hour relief at a desk. Density, scan order and one-step actions outrank expression. Brand lives in the details: the crest, Force blue on the active state, the display face on titles and figures.

## Colors

- **Force blue** (`npf-blue`, `npf-blue-deep`) is the brand and the primary action. `npf-blue-mid` is the accent: links, focus rings, chart marks.
- **Neutrals** are navy-tinted, never pure grey: `npf-ink` for text, `npf-steel` for secondary text, `npf-cloud` for the console ground, white for panels.
- **Status colours are reserved** and always ship with a word: P1 red (also "late"), P2 amber (also "waiting"), P3 slate blue, P4 grey; en route indigo, on scene teal, available green. None of them is ever used as decoration or as a chart series.
- **Charts** use one series colour, `chart-series` (Force blue-mid). The only second colour is `chart-late`, and it always comes with a second shape (diamond against circle) and a label. The pair passes the colour-blind check (ΔE 23.7 deutan, 29.8 normal).

## Typography

- Display face (`--font-secondary`) for titles, panel headings, callsigns and big figures; body face (`--font-primary`) for everything else.
- Every number on a board is `tabular-nums`, so clocks and counts do not jitter as they tick.
- 11px (`text-2xs`) is the floor. Nothing is set smaller.
- Sentence case everywhere. No all-caps labels, no eyebrow kickers.
- The font stack is load-bearing: Hausa hooked letters (ɓ ɗ ƙ ƴ) and Yoruba/Igbo diacritics fall back per character to Segoe UI / Noto Sans.

## Layout

- Desk: a fixed 272px white sidebar (crest, five destinations, duty officer), a 64px sticky bar (command in view, clock and relief, sample-data tag, language), and the work area on `npf-cloud`, max 1800px.
- Below 1024px the sidebar becomes a row of five tabs under the bar; below 640px each tab is an icon over a short word, with its count on the icon. All five always fit in one row.
- Every screen opens with the navy band (title, scope line, figures, the screen's main action), then one row of filters, then panels.
- Lists that pin under the chrome offset by `--ops-top`, never a guessed number.

## Elevation & Depth

- Panels sit on the ground with a 1px navy hairline (`--ops-shadow`), no drop shadow.
- Things that float over the work (the new-call alert, menus) add `--shadow-raised`: offset, soft, navy-tinted.
- The band carries the one deep shadow on the screen.

## Shapes

- Panels and the band: 16px (`rounded.card`). Chips and inputs in forms: 8px. Small controls, filters, buttons and status: pills.
- Chart bars have a 4px rounded data end and a square baseline; dots carry a 2px white ring.

## Components

- **OpsHead** — the navy band: title, one-line scope (period, command), `OpsFigures`, and the main action as a white pill.
- **OpsFigures** — up to four big numbers with a label under each; `of` renders "24/26". Colour only when it means something (red late, green free). On a phone, four counts share a row; a reading like "7 min" switches them to 2×2.
- **OpsPanel** — white tile with an optional title bar (heading + count pill + action) over a hairline. `flush` lets a table run edge to edge.
- **OpsButton** — `brand` (filled Force blue), `quiet` (chip fill), `ghost` (routine control repeated down a list), `danger`. Presses scale to 0.97.
- **PriorityTag** — "P1"–"P4" in its own hue on a tinted chip; the word ("Immediate") is the accessible label. The grade is read aloud on radio, so the number leads.
- **OpsStatus / UnitStatusTag** — pill with a dot and the word: Pending, En route, On scene, Closed; Available, Off the air.
- **Elapsed + TargetBar** — a live clock and a thin bar showing how much of the grade's dispatch target a waiting call has used: blue, amber in the last quarter, red when late.
- **Close call** — always through an outcome (`callOutcomes`), so the shift report can say what the shift achieved.
- **New-call alert** — bottom-end card for a call that lands from another tab: grade, reference, type, command, "Open the call". P1/P2 also sound two short tones.
- **Charts (Shift report)** — single-series columns (calls by hour), horizontal bars (types, outcomes), and a per-grade dot strip against its target line (time to dispatch). Every mark has a hover and keyboard-focus tooltip, value first; every chart has a "Show as a table" view. One period control above all charts scopes every figure.

## Do's and Don'ts

- Do lead with what is getting worse while nobody looks: the oldest unassigned call, the late clock.
- Do give each screen one filled action; repeat routine controls as ghosts.
- Do say "Sample data" while the boards are seeded; delete it with `app/backend.ts`.
- Do translate every visible string into Hausa, Yoruba and Igbo (`npm test` fails otherwise).
- Don't add a map, a dark theme, all-caps labels or square corners to the console.
- Don't put status colour on text or use it for a chart series; text stays in ink.
- Don't use a dual-axis chart or more than one series colour plus "late".
- Don't close a call without an outcome, or show a timestamp as "07:00" when it is a span ("7 min").
