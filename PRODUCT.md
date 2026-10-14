# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Citizens** across Nigeria: apply for police services, report crime (no account needed), track a request, see fines and documents in their portal.
- **Force personnel** in the operations console (`/app/police`). *Inferred (2026-10-11, question unanswered):* the primary console user is a control-room officer working a whole shift at a desk screen, taking calls, dispatching units and moving requests on. Supervisors and commanders check the same board less often.

## Product Purpose

The public website and service portal of the Nigeria Police Force, with an operations console on top. The site is being presented to the Force as a production-grade front end. Success: a citizen finds and applies for a service without help; an officer sees what is waiting, what is late, who is running and who is free, and acts in one step.

## Positioning

A national police front end built around real Force structure: Force HQ → 37 State Commands → Divisions (one per LGA, 774 in `app/geo.ts`). Every report, call, unit and request carries state + LGA + division, and the console is scoped to the officer's command (a Force HQ desk sees all commands and can narrow to one).

## Operating Context

- Console boards: Command board, Calls, Units, Map, Case files, Custody, Alerts, Requests and a printable Shift report. Which ones an officer sees depends on their post (control room, DPO, investigator, custody officer, Commissioner, Force HQ; `POSTS` in `app/content-records.ts`). A DPO desk sees one division only.
- Custody runs the constitutional 24/48-hour clock (s.35); evidence is fingerprinted (SHA-256); every log line names the officer and service number.
- Public side also has Appeals (`/app/appeals`, tips from the public) and Verify a Police Document (`/app/verify`).
- A call closes with an outcome (`callOutcomes` in `app/content-ops.ts`); a call that lands from another tab raises an alert and a tone for P1/P2.
- Call grades P1–P4 with dispatch targets (`app/content-ops.ts`); three eight-hour reliefs (A from 06:00 WAT); West Africa Time throughout.
- Officers dispatch from the queue, transfer calls between commands, and decide service requests.
- No backend yet: everything lives in `app/components/store.ts` (localStorage); `docs/API-CONTRACT.md` is the contract for the real one.

## Capabilities and Constraints

- Next.js 16 (read `node_modules/next/dist/docs/` before using framework APIs), React 19, Tailwind 4. No UI libraries.
- Four languages: English, Hausa, Yoruba, Igbo. Every visible string needs entries in `app/i18n/ha-*`, `yo-*`, `ig-*` or `npm test` fails. Yoruba and Igbo need native review.
- Hausa hooked letters (ɓ ɗ ƙ ƴ) fall back per character; the font stack is not decorative.
- Accessibility and responsive behaviour are checked by Playwright + axe (`npm run test:e2e`).

## Brand Commitments

- Nigeria Police Force crest and wordmark (`app/components/Wordmark.tsx`), Force blue.
- Console is **light** and reads as one site with the public pages (user decision 2026-10-10). The map came back on 2026-10-14 at the user's request, as its own board (light Esri tiles), not as the board background. No all-caps labels unless the user asks.
- Footer credit: "Designed and built by Cloudbrella" → https://www.cloudbrella.ng/.

## Evidence on Hand

- Statutes, traffic offences, penalty points, speed limits, Area Commands and Divisional HQs are real.
- 53 services still carry unverified Dubai-derived fees and documents (`docs/FRONTEND-AUDIT.md` items 70–78). Never invent replacement facts.
- Photographs are placeholders to replace before deployment.
- Console incidents, units and officers are seeded demo data.

## Product Principles

1. The thing getting worse while nobody looks (an unassigned call) always leads.
2. One step for the action a screen exists for.
3. Nationally correct: every record knows its command and division.
4. Sourced facts only; flag gaps for the Force rather than fill them.
5. Equal in all four languages.

## Accessibility & Inclusion

WCAG AA, checked with axe in CI across all four languages; full keyboard use; status never by colour alone.
