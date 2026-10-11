---
version: 1
slug: "app-components-opsoverview-tsx"
primary_target: "app/components/OpsOverview.tsx"
related_targets: ["app/app/police/page.tsx"]
---

Scope: the operations console command board (`/app/police`, OpsOverview), mode Operate. Shell and shared pieces follow.

Audience: control-room officer on a desk screen all shift; Force HQ desks see every command, command desks see their own.

Constraints: light, Force blue, site type and radii (PRODUCT.md brand commitments). No map, no all-caps labels, no square corners. Four languages.

## Direction contract

THESIS: The board is a situation mosaic of the Force itself: every command (or, on a command desk, every division) as one row carrying its live waiting, late, running and free-unit numbers, grouped by geopolitical zone. It refuses the SaaS row of four KPI cards over two lists.

OWN-WORLD: Zone strips inside one white panel on the pale cloud ground, Force blue for the selected command. The chip's fill is its state: red wash when a call is late, amber wash while one waits, pale Force-blue wash (npf-mist) while units are out, and bare steel text when quiet (no fill, no outline: nothing happening; fill = something is).

GRID (2026-10-11, round 4, replaced the wrapping outlined chips): each zone's commands sit in an auto-fill grid (min 7rem), identical in every strip, so cells line up in columns down the board. Counts sit at the cell's end; a long name truncates before a count does. Left column 9.5rem; cells 40px on a desk, 44px on a phone. Sentence-case names, zone headings in the site display face, 8px-radius chips, pills for small controls.

FOLD (2026-10-11, round 3): in each zone the busy commands lead as full rows, worst first; quiet commands fold into small cloud pills under them (hidden on a phone). The 37-row wall of mostly grey names buried the busy few and pushed the queue below the fold.

STRIPS (2026-10-11, replaced the six columns of 40px rows, which read as long lists of mostly quiet names): one strip per zone, ruled off by a hairline. Left (11rem): zone name in the display face and what it owes in words ("3 waiting, 1 late, 2 running", or "Queue clear" in steel). Right: its commands as 44px chips with an 8px radius (the chip token, not pills), in alphabetical order, so a command never moves. Quiet chip = bare steel text (see GRID); running = pale Force-blue wash; waiting = amber wash; late = red wash; chosen = Force blue. Busy chips carry their counts: waiting solid (amber, red once late), running outline. Units free lives in the spoken label and the Units panel, not on chips. A command desk gets the same chips by division, busiest first.

STORY: The officer sees in one look which commands have calls waiting and which are late, clicks one row, and the queue under the mosaic narrows to that command, ready to dispatch in one step.

FIRST VIEWPORT: The navy band (title, scope line, waiting / late / running / units free). Under it the mosaic: six zone columns on a desk, three on a tablet; on a phone, quiet commands and empty zones step off. Below, the selected command's Pending queue with dispatch selects, Running, and Units by section beside them.

FORM: Command mosaic, position 4 on my ordered list of 7 (re-roll 1), seed key 9f3d6063.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Signature interaction: choosing a row fills it Force blue and the queue below cross-fades to that command through a view transition; choosing it again returns to the whole Force.
