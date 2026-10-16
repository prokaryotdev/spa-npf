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
- **Data face (console only):** IBM Plex Mono (`font-mono`, loaded in `app/app/police/layout.tsx`) for call references, clocks, big figures and numeric table cells. Never for words: counts like "3 waiting", callsigns and labels stay in the body face. (User asked for a "dashboard mono feel", 2026-10-12.)
- 11px (`text-2xs`) is the floor. Nothing is set smaller.
- Sentence case everywhere. No all-caps labels, no eyebrow kickers.
- The font stack is load-bearing: Hausa hooked letters (ɓ ɗ ƙ ƴ) and Yoruba/Igbo diacritics fall back per character to Segoe UI / Noto Sans.

## Layout

- Desk: a fixed 272px white sidebar (crest, five destinations, duty officer), a 64px sticky bar (command in view, waiting-call alarm, clock and relief, language), and the work area on `npf-cloud`, max 1800px.
- Below 1024px the sidebar becomes a wrapping row of tabs under the bar. Below 640px the tabs leave the sticky bar for a dock fixed to the foot of the screen (icon over a short word, count on the icon); past five boards the dock scrolls sideways with the sixth peeking, and the current board is kept in view. The sticky bar is then one row (`--ops-top` 4rem).
- Every screen opens with the navy band (title, scope line, figures, the screen's main action), then one row of filters, then panels.
- Lists that pin under the chrome offset by `--ops-top`, never a guessed number.

## Elevation & Depth

- Panels sit on the ground with a 1px navy hairline (`--ops-shadow`), no drop shadow.
- Things that float over the work (the new-call alert, menus) add `--shadow-raised`: offset, soft, navy-tinted.
- The band is flat Force navy (`npf-blue-deep`) with no shadow, gradient or struck crest (2026-10-16: it read as the homepage hero on every board).

## Shapes

- Console (since 2026-10-12): panels and the band 12px (`--radius-card` overridden on `.npf-ops`); buttons, selects, search and inputs 8px (`--ops-control-radius`), white on a 1px `npf-line` rim with one soft lift; status and grade tags 4–5px; pills only for counts and dots. A period picker is a segmented control. The public site keeps its pills.
- Chart bars have a 4px rounded data end and a square baseline; dots carry a 2px white ring.

## Components

- **OpsHead** — the navy band, kept short (16px padding, 26px title, 30px figures) so the work starts high on a laptop: title, one-line scope (period, command), `OpsFigures`, and the main action as a white pill.
- **Sidebar** — 40px rows; the foot holds the officer and the lock and end-shift buttons only (the station well was removed 2026-10-16); the icon sits bare in steel and only the current board gets its Force-blue tile, so all of an HQ desk's boards fit without scrolling.
- **Elapsed** — a live mm:ss clock under an hour; past it, a span in words ("1 h 26 min", "1 d 6 h"), never "30:00:03".
- **Calls list** — open calls first, then a cloud-washed ruled head "Closed, last 24 hours" with its count over the day's closed calls. With nothing chosen, the detail panel offers "Open the oldest waiting call".
- **Requests (2026-10-16)** — the same list + record layout as Calls and Case files: a table (service and ref · status · command · handled by · days waiting) and, beside it, the chosen request as a labelled record (status, service, a dt/dd grid, Details, History, a folded "Attach a document", then Approve · Start review · Ask for more, Reject at the far end). "To decide / All requests" is a segmented control with counts. The old card grid was called "very very poor and not professional" by the user.
- **Dropdowns and folds** — every menu (OpsPicker triggers, native selects, the language switch) ends in a down arrow, never a chevron; it turns up while open. Every `<summary>` in the console gets the same arrow from one CSS rule. The open select lights its chosen row in mist.
- **Records** — a record's facts sit in a label/value grid, never in a dotted run-on line (detainee: offence, age, sex now rows). No decorative icon repeated down a list (the alert bell tile was dropped).
- **Unit row** — the radio's demo controls (send position, emergency button) fold under a quiet "Radio" disclosure; a raised emergency still shows on the row.
- **OpsFigures** — up to four big numbers with a label under each; `of` renders "24/26". Colour only when it means something (red late, green free). On a phone, four counts share a row; a reading like "7 min" switches them to 2×2.
- **OpsPanel** — white tile with an optional title bar (heading + count pill + action) over a hairline. `flush` lets a table run edge to edge.
- **OpsButton** — `brand` (filled Force blue), `quiet` (chip fill), `ghost` (routine control repeated down a list), `danger`. Presses scale to 0.97.
- **PriorityTag** — "P1"–"P4" in its own hue on a tinted chip; the word ("Immediate") is the accessible label. The grade is read aloud on radio, so the number leads. P1 alone is set solid (white on red); P2–P4 are tinted with a rim of their own hue.
- **Queues (board Pending / Running)** — ruled column heads from a 42rem panel up (the right column is 24rem so a 1440px desk gets them) (stacked below it) (grade · call · waiting · dispatch; grade · call · status · unit · elapsed), call type first with the ref in mono beside it. Dispatch is an OpsPicker of the call's own command's free units (was a plain select, 2026-10-12; user asked for a better dropdown, 2026-10-13). Rows breathe: 20px vertical padding on Pending, 16px on Running.
- **OpsStatus / UnitStatusTag** — pill with a dot and the word: Pending, En route, On scene, Closed; Available, Off the air.
- **Commands table (board, 2026-10-13, replaced the mosaic of chips; user picked "desk table")** — one ruled head (Command · Waiting · Running · Units free), then a band per zone on a cloud wash carrying the zone's totals in the same columns and a red "n late" tag beside its name; its busy commands under it, indented, worst first; zones worst first too. A quiet zone is its band alone with a green "✓ Queue clear" tag across the two count columns. Rows: a state dot (red late, amber waiting, blue running), the name, waiting as a solid pill (red once late), running as an outline pill, units free as "n/m" with a short green share bar; nobody free is a red "0/m" tag; nothing is a steel dash read as 0. The whole row is the button (aria-pressed); a late row carries a 4% red wash; the chosen row is Force blue. A command desk gets the same table by division, without the units column.
- **Units table (board, 2026-10-13)** — one fleet bar split by status (free green, en route indigo, on scene teal, off the air grey; never orange) with each share counted under it, then a table: Section · Free · En route · On scene · Off the air, each head topped by its colour, so the head is the legend. Free leads; nobody free is a red "0" tag.
- **OpsPicker (2026-10-13)** — the console's pop-up menu, replacing native selects for the command in view and dispatch: a button opening a top-layer popover (platform light dismiss and Escape), placed under its trigger, flipping above when short of room, closing if the page scrolls. Rows carry a label, an optional second line, a status dot and an end badge; arrow keys, Home/End; the command picker adds a search (filterBy, so slips and zone names match) and groups commands by zone with live waiting counts. Dispatch rows: green dot, callsign, then area · officer. Chevron turns over while open.
- **OpsEmpty (2026-10-13)** — set on the panel's reading line, not a centred poster: a 40px tile with a 10px radius, then the title (display face) and the hint in body ink, inside a flush panel. Three tones: `clear` (green tile, tick that draws itself once), `none` (a search or filter left nothing; always carries the action back out, e.g. "Clear filters", "Clear search", "Last 24 hours", "All commands"), `idle` (nothing on or nothing chosen, a blue tile with the board's own glyph). It is a live region, so a filter that empties the list is announced. A search miss is never reported as "Queue clear".
- **Units table heads** stay on one line from 640px up in every language; on a phone only the Hausa and Yoruba heads may wrap.
- **Elapsed + TargetBar** — a live clock and a thin bar showing how much of the grade's dispatch target a waiting call has used: blue, amber in the last quarter, red when late.
- **Close call** — always through an outcome (`callOutcomes`), so the shift report can say what the shift achieved.
- **New-call alert** — bottom-end card for a call that lands from another tab: grade, reference, type, command, "Open the call". P1/P2 also sound two short tones.
- **Charts (Shift report)** — single-series columns (calls by hour), horizontal bars (types, outcomes), and a per-grade dot strip against its target line (time to dispatch). Every mark has a hover and keyboard-focus tooltip, value first; every chart has a "Show as a table" view. One period control above all charts scopes every figure.

## Do's and Don'ts

- Do lead with what is getting worse while nobody looks: the oldest unassigned call, the late clock.
- Do give each screen one filled action; repeat routine controls as ghosts.
- Do translate every visible string into Hausa, Yoruba and Igbo (`npm test` fails otherwise).
- Don't add a map, a dark theme, all-caps labels or square corners to the console.
- Don't put status colour on text or use it for a chart series; text stays in ink.
- Don't use a dual-axis chart or more than one series colour plus "late".
- Don't close a call without an outcome, or show a timestamp as "07:00" when it is a span ("7 min").
