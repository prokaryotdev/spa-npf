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

THESIS: The board is a situation mosaic of the Force itself: every command (or, on a command desk, every division) as a tile carrying its live waiting, late and free-unit numbers, grouped by geopolitical zone. It refuses the SaaS row of four KPI cards over two lists.

OWN-WORLD: White tiles on the pale cloud ground, Force blue for the selected command, alert red only for late, amber for waiting, green for free units. Big tabular display numerals, sentence-case names, zone headings in the site display face. Hairline rims, 12–16px card radius, pills for small controls.

STORY: The officer sees in one look which commands have calls waiting and which are late, clicks one tile, and the queue under the mosaic narrows to that command, ready to dispatch in one step.

FIRST VIEWPORT: Title row with a one-line live readout (waiting, late, running, units free) on the right. Under it the mosaic: six zone columns on a desk, tiles stacked; active tiles carry a big number, quiet tiles fade. Below the fold line, the selected command's Pending queue with dispatch selects, Running, and Units by division beside them.

FORM: Command mosaic, position 4 on my ordered list of 7 (re-roll 1), seed key 9f3d6063.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Signature interaction: choosing a tile fills it Force blue and the queue below cross-fades to that command through a view transition; choosing it again returns to the whole Force.
