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

OWN-WORLD: Rows inside one white panel on the pale cloud ground, Force blue for the selected command. The row's fill is its state: red wash when a call is late, amber wash while one waits, white with a hairline rim while units are out, no fill (steel text) when quiet. Sentence-case names, zone headings in the site display face, 8px row radius, pills for small controls.

ROWS (2026-10-11, replaced the taller busy tiles, which zig-zagged the columns): every row is 40px, so the six zones line up row for row. Figures sit in fixed slots at the row's end, in this order: waiting (solid amber pill, solid red once late), running (outline pill), units free as "free/all". An empty slot keeps its width so each slot reads as a column down the whole board. Waiting and running differ by shape (solid vs outline) as well as colour. A legend in the panel title (desk only) names the slots; each row's full summary is its accessible name and its hover title.

STORY: The officer sees in one look which commands have calls waiting and which are late, clicks one row, and the queue under the mosaic narrows to that command, ready to dispatch in one step.

FIRST VIEWPORT: The navy band (title, scope line, waiting / late / running / units free). Under it the mosaic: six zone columns on a desk, three on a tablet; on a phone, quiet commands and empty zones step off. Below, the selected command's Pending queue with dispatch selects, Running, and Units by section beside them.

FORM: Command mosaic, position 4 on my ordered list of 7 (re-roll 1), seed key 9f3d6063.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Signature interaction: choosing a row fills it Force blue and the queue below cross-fades to that command through a view transition; choosing it again returns to the whole Force.
