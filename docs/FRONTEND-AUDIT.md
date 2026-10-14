# Front-end audit — 10 October 2026

What was missing, what is fixed, and what is still open before the client
presentation. ✅ = fixed in this pass. 🟡 = open, front-end work.
🔵 = needs the backend. 🟣 = needs facts from the Nigeria Police Force.

## How complete is it?

These are judgement calls, not measurements. They count journeys a person can
finish from start to end, not pages that look done.

| Area | Before | Now | What holds it back |
|---|---|---|---|
| Look and layout of the screens | 85% | 90% | New screens need one visual review pass in a browser on a phone |
| Front-end journeys (report, apply, track, dispatch) | 30% | 85% | Payment step, registration, password reset, case file |
| Logic and data model (what the backend will build to) | 25% | 80% | Roles beyond citizen/officer, payments, file upload, audit trail |
| Content accuracy (services, fees, numbers) | 35% | 55% | 53 services still carry details copied from Dubai Police |
| Backend | 0% | 0% | Not started; `docs/API-CONTRACT.md` is the brief |

**Honest summary:** the front end is ready to *demonstrate* every main
journey. It is not ready to *launch*: the service catalogue still needs the
Force to confirm fees and documents, and everything in 🔵 needs a server.

## The example you gave: reporting a crime

Before: "Report a crime" was a button. One click and it said "Request opened".
No state, no place, no description, nothing reached the police.

Now (`/app/report`, open to everyone, no account needed):

1. **Is anyone in danger?** Yes → big "Call 112" first. You can carry on
   once safe.
2. **What happened** — 16 crime types, each with a starting grade
   (armed robbery, kidnapping and sexual assault start at P1). **When** —
   happening now / earlier today / before today.
3. **Where** — State → Local Government Area (all 774) → street or landmark.
   "Use my location" suggests the state. A card shows where it goes:
   *Kano State Command → Fagge Division*.
4. **Details** — description, is anyone hurt, suspects or vehicles,
   photos/video/documents.
5. **About you** — give name and number, or stay anonymous. "Is it safe to
   call this number?" for domestic-violence cases.
6. **Check and send** — read-back with "Change" links, and a declaration
   that false reports are an offence.
7. **Receipt** — reference number, the command and division that have it,
   what happens next, the Complaint Response Unit if it goes wrong.

Then on the police side:

- The report lands **only** on that state's console, graded, with the
  reporter's number (or "Anonymous", or "Do not call — not safe").
- Only units **from that command** can be sent. A Lagos car cannot be sent
  to Kano, even from the national desk.
- A wrong state or division can be **transferred**; the unit is stood down
  and the call goes to the right command's queue.
- Every move shows on the reporter's tracker, in plain words
  ("Officers assigned", "Case closed"), never officer names or the log.

## The full list

### Reporting a crime
1. ✅ One-click report with no details → six-step form.
2. ✅ No state → state is required, and decides the command.
3. ✅ No LGA or division → all 774 LGAs; division from the LGA.
4. ✅ No danger check → 112 first.
5. ✅ Reports never reached the police console → they create a call.
6. ✅ No grading → starting grade by crime type, raised if happening now or someone is hurt.
7. ✅ Needed an account → anonymous reporting allowed.
8. ✅ No way to follow an anonymous report → public tracker at `/app/track`.
9. ✅ No evidence → files can be attached (names kept until upload exists 🔵).
10. ✅ No "when" → now / today / date and time, future dates refused.
11. ✅ No suspects/vehicle details → optional field.
12. ✅ No safety option for the reporter's phone → "safe to call" tick.
13. ✅ No false-report declaration → required before sending.
14. ✅ A refresh lost the half-written report → draft kept in the tab.
15. ✅ No receipt → reference, route, next steps, print.
16. ✅ No complaint route → Complaint Response Unit numbers on the receipt (🟣 confirm numbers).
17. ✅ No "reporting is free / bail is free" notice → shown beside the form.
18. ✅ Advice per crime type (kidnapping: don't pay alone; fraud: call your bank first; sexual assault: female officer, keep clothing).
19. 🔵 SMS with the reference to the reporter.
20. 🔵 CAPTCHA and rate limit on anonymous reports.
21. ✅ Language of the reporter recorded, so the right officer calls back.
22. ✅ Report on behalf of someone else (a parent for a child, a company).

### Police console
23. ✅ Every officer saw every state → console filtered by command.
24. ✅ Force HQ desk can view all commands or pick one.
25. ✅ Officer had no command → chosen at sign-in (🔵 from posting).
26. ✅ Units from any state could be sent anywhere → own command only.
27. ✅ No transfer between commands/divisions → transfer, with stand-down.
28. ✅ Desk typed the area as free text → State + LGA + street.
29. ✅ Call detail had no reporter, injuries, evidence, command or division → shown.
30. ✅ Crime reports could be "approved" like a permit → link to the call instead.
31. ✅ Refusing a request had a canned reason → officer must write one.
32. ✅ Requests showed no command/division or what the applicant sent → shown.
33. ✅ "Division" meant Patrol/Traffic → renamed "Section"; Division now means the police division.
34. ✅ Sample data contradicted itself (a Lagos-posted unit closing a Zaria call) → fixed.
35. 🟡 Area Command level between State and Division is not shown.
36. ✅ All 17 zonal commands modelled, with a Zonal command (AIG) post scoped to its states.
37. ✅ Case files: officer (IPO), stage, people, statements, exhibits with chain of custody, updates to the complainant.
38. ✅ Posts with their own scope (control room, DPO, investigator, custody, Commissioner, Force HQ); the board shows what else needs attention.
39. 🟡 No per-command reports and statistics page.
40. ✅ Requests are taken by a named officer.
41. ✅ Officers attach photos and files to a call (fingerprinted) and documents to a request.
42. 🔵 Audit trail with the officer's service number on every change.
43. 🔵 Live updates across devices (today only across tabs of one browser).
44. 🔵 Shift sign-on/off and unit roster from the posting system.
45. ✅ Console locks after 10 idle minutes; padlock to lock at once.

### Applying for a service
46. ✅ One click opened a request with nothing in it → four-step application.
47. ✅ No command chosen → state and LGA of residence.
48. ✅ No documents → one upload per required document; "if applicable" ones optional.
49. ✅ Alternatives ("Fraud needs these, Forgery needs those") → asked as a choice.
50. ✅ No declaration → required.
51. ✅ Service name was stored in Hausa when applying from a Hausa page → stored in English.
52. ✅ A refused request blocked applying again → only open ones block.
53. ✅ "Application Status" needed sign-in → public tracker.
54. ✅ Contact phone and email are confirmed per application.
55. 🔵 Payment step after acceptance (invoice, gateway, receipt).
56. 🟡 Appointment booking for biometrics at the chosen command.
57. ✅ A reply to "Action needed" can carry the documents asked for.
58. 🟡 Profile has no state/LGA of residence to prefill the form.
59. 🔵 Certificates as signed PDFs with a verification code.

### Accounts and identity
60. ✅ Sign-in error messages were English on every language → translated.
61. 🔵 NINAuth is simulated; any 11-digit NIN signs in.
62. 🟡 No "create account" or "forgot password" screens.
63. 🔵 Officer sign-in needs service number + password + one-time code.
64. ✅ Six officer posts. 🟡 Lawyer/company citizen accounts still missing.

### Content and facts
65. ✅ 36 services copied from Dubai Police removed (sailing permits, gold trade audits, TWIMC letters, sports facility booking, diplomatic services, "Fast Track", "Smart Home Security"…).
66. ✅ Police Clearance Certificate rewritten from POSSAP: apply online, biometrics at a command, fee on the POSSAP invoice, at least 72 hours.
67. ✅ Footer said "Federal Ministry of Interior" → Federal Ministry of Police Affairs.
68. ✅ Footer service links all went to the same page → each opens its filter.
69. ✅ "Report a Crime" and "Track a Reference" added to the main menu and homepage.
70. 🟣 The other 53 older services still carry fees, documents, hours and terms from the Dubai catalogue (for example "legal translation in Hausa", Apple Pay, made-up fee tiers). Each needs the Force's real details.
71. ✅ Real NPF services added, each with its source noted in `content-services.ts`: Police Extract, Tinted Glass Permit, Firearm Licence, Police Escort and Guard, CID Clearance Certificate, Police Investigation Report, Supernumerary Police, Central Motor Registry (e-CMR), Complaint Against a Police Officer, Report a Missing Person, Report Sexual or Gender-Based Violence. "Apply for a Job" (Dubai) is now "Join the Nigeria Police Force", which hands over to the Police Service Commission portal. Fees are not printed where no official figure is published ("On your POSSAP invoice"). 🟣 The Force should still confirm documents and turnaround for each.
72. 🟣 Division names, addresses and phone numbers (the Force's directory).
73. 🟣 Complaint Response Unit numbers (0805 700 0001/2/3) are from 2019–2020 press; confirm.
74. 🟣 Emergency lines 199 (fire) and 116 (child helpline): confirm for Nigeria.
75. 🟣 "Rate this service" links to servicerating.gov.ng: confirm it exists.
76. 🟣 Homepage community stories (museum, West African Police Summit): confirm.
77. 🟣 Yoruba and Igbo were written without a native speaker; get them reviewed. Legal pages first.
78. 🟡 Privacy policy should say what happens to report data and evidence (Nigeria Data Protection Act 2023).

### Architecture and quality
79. ✅ One shared shape for "where" on every report, call, unit and request (`app/geo.ts`).
80. ✅ Backend contract written (`docs/API-CONTRACT.md`).
81. ✅ Wizards share one set of parts (`Wizard.tsx`), so report and apply behave alike.
82. ✅ Forms: labels, error messages under fields, focus moves to the first error and to each new step.
83. ✅ Files are fingerprinted (SHA-256) with a preview. 🔵 Still needs the upload endpoint with virus scan.
84. 🔵 Reference numbers are random in the browser; the server must issue them.
85. 🟡 End-to-end tests for the report, apply, transfer and track journeys.
86. 🟡 Accessibility scan (axe) over the new pages in all four languages.
87. 🟡 Weak-network handling beyond the tab draft (retry on send, offline notice).
88. 🟡 Print styles for the receipt page.

## For the presentation

Show it in this order; each step is live in the demo:

1. Homepage → **Report a Crime** → file a theft in Kano, Fagge LGA, anonymously.
2. Note the reference → **Track a Reference** → "Received by the command".
3. Sign in as an officer, desk **Kano State Command** → the call is at the top,
   only Kano units are offered. Dispatch one.
4. Back on the tracker → "Officers assigned".
5. Switch the desk to **Lagos State Command** → the Kano call is not there.
6. Sign in as the citizen → apply for a Police Clearance Certificate →
   Lagos, Ikeja → upload → send → see it on the Lagos console.


## Second pass — 14 October 2026: what advanced forces have that this did not

Benchmarked against UK forces (Single Online Home, TrackMyCrime, THRIVE call
grading, PACE custody rules), US CAD/RMS (unit recommendation, officer
emergency button, premise history, BOLO, NCIC-style checks) and Dubai Police
(Police Eye: photo and location evidence, anonymous reports).

### Added to the console
89. ✅ **Map** (`/app/police/map`): open calls by grade, units by status, closed calls of the shift; nearest free units to a call with a Send button. Calls without a pin show hollow at the command HQ.
90. ✅ **Risk flags** on calls (weapon, vulnerable person, domestic abuse, officer safety, suspect at scene, female officer needed).
91. ✅ **Premise history** (earlier calls at the same place) and **duplicate detection** (same kind, same LGA, within the hour) with one-click close as duplicate.
92. ✅ **Backup**: more than one unit on a call, nearest first; they clear with the call.
93. ✅ **Officer emergency button**: P1 call at the unit's position, red banner on every screen until stood down.
94. ✅ **Case files** (`/app/police/cases`), opened from a call or by hand, crime reference CR/STATE/YEAR/NNNN.
95. ✅ **Custody register** (`/app/police/custody`): 24/48-hour constitutional clock, rights checklist, hourly cell visits, bail/charge/release with reasons. Bail is free is said on the screen.
96. ✅ **Alerts** (`/app/police/alerts`): wanted, missing, stolen vehicle, officer safety, intelligence; to one command or all; publish as a public appeal; tips from the public.
97. ✅ **Records check**: name, plate or reference across alerts, custody, cases and calls.
98. ✅ Every log line says **who** wrote it (name and service number).

### Added for the public
99. ✅ Report form keeps **real photos** (preview + fingerprint) and the **exact pin** from “Use my location”.
100. ✅ Tracker shows the **case stage**, the **crime reference** (for insurers and banks) and **updates from the investigator**.
101. ✅ **Add information** to an existing report from the tracker.
102. ✅ **Appeals** page (`/app/appeals`) with anonymous tips.
103. ✅ **Verify a police document** (`/app/verify`) against forged clearance certificates; completed requests carry a document number.
104. ✅ The citizen gets a **notice** when an officer moves their request or report.

### Still open
105. ✅ All 17 zonal commands sourced (npf.gov.ng zone pages and 2024–2026 posting reports); every one of the 37 commands sits in exactly one zone, and a test checks it. 🟣 Kaduna under Zone 14 rests on the 2020 approval alone: confirm. Area Commands still need the Force's list.
106. ✅ FCT's 18 Divisional Headquarters are named, with their counters: a pinned FCT report goes to the nearest one. 🟣 Other commands' divisions, and every division's phone line, need the Force's directory (GET /geo/division).
107. ✅ Units can send their position from an officer's phone (map, nearest-unit and emergency pin use it). 🔵 The radios' own location feed still needs connecting.
108. 🔵 Body-worn camera and CCTV footage storage; this build keeps previews only.
109. ✅ Report covers 7 and 30 days with daily bars, change on the period before, and the by-division table (CompStat-style). A month of illustrative history is seeded.
110. ✅ Duty roster on the Units board: each unit's crew for reliefs A, B and C, the relief on duty, and the handover at shift change (units on a call are held over until they clear). 🔵 The roster itself, and leave, come from the Force's personnel system.
111. ✅ A missing-person appeal cannot be published until the family's consent is recorded.
112. ✅ Hidden bot trap on the report and tip forms, and one tip per appeal per ten minutes per browser. 🔵 Server CAPTCHA, rate limits and checking the reporter's phone or email before additions need the backend.

### Self-review, 14 October 2026

A full code review of the change found nine problems; all are fixed and the
store tests cover them:

113. ✅ Links into boards a post does not work (a control room clicking a case) now show the reference as text, and a deep link says the board is not part of the post instead of bouncing silently.
114. ✅ 30 log, timeline and sidebar lines had no Hausa, Yoruba or Igbo (some predate this pass): translated, and listed in `consoleLines` / `accountLines` so the coverage test now asks for them.
115. ✅ Citizen notices were composed English strings; they are now patterns read in the reader's language.
116. ✅ Removing a risk flag is logged.
117. ✅ A verified document shows its real issue date, and stops verifying if the request is moved off Completed.
118. ✅ The tracker's add-information form resets when the reference changes.
119. ✅ The call panel's mini map no longer redraws every marker each second.
120. ✅ A full browser store drops photo previews and keeps the records, and says so in the console, instead of losing every later change.
121. ✅ Daily report bars start at midnight WAT, as labelled.
122. ✅ One list of language names (`LANG_LABEL`).
