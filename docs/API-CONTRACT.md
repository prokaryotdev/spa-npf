# API contract for the front end

Everything behind the screens today is `app/components/store.ts`: one object
in `localStorage`, read by every screen through `useStore()`. Each exported
function in that file is one API call waiting to happen. This page lists them,
the shapes they send and receive, and the rules the server has to enforce
because the browser cannot be trusted to.

Swap the bodies in `store.ts` for `fetch` calls and nothing else in the app
changes. The types below are the ones already in `store.ts` and `app/geo.ts`.

## 1. The shape every record carries: where it belongs

```ts
type Jurisdiction = {
  state: string;    // "Lagos", "Akwa Ibom", "FCT" — one of the 37 commands
  lga: string;      // one of that state's LGAs (774 in total, app/geo.ts)
  division: string; // the division covering that LGA
  address?: string; // street / landmark / village
};
```

The Force is organised Force HQ → Zone → State Command → Area Command →
Division → Station. The front end asks people for **state** and **LGA**,
because those are the two things a member of the public knows. The server
turns them into the real division.

| Endpoint | Returns | Notes |
|---|---|---|
| `GET /geo/states` | `{ name, capital, zone, lat, lng }[]` | 36 states + FCT. Today: `STATES` in `app/geo.ts`. |
| `GET /geo/states/{state}/lgas` | `string[]` | Today: `STATES[i].lgas`. |
| `GET /geo/division?state=&lga=&lat=&lng=` | `{ id, name, address, phone, areaCommand, zone }` | **Needed from the Force.** Today `divisionFor()` names the division after the LGA. When an LGA has several divisions, the server picks by coordinates or street. |

## 2. Accounts

| Store function | Endpoint | Body → Response |
|---|---|---|
| `signIn(CITIZEN)` | `GET /auth/ninauth/start` → `GET /auth/ninauth/callback` | NINAuth (NIMC) handshake → `Session` cookie |
| `signIn(form)` | `POST /auth/signin` | `{ nin, password }` → `Session` |
| `signIn(deskSession)` | `POST /auth/officer` | `{ serviceNumber, password, otp }` → `Session` with `role:"officer"`, `rank`, `station`, `command` (absent for Force HQ desks) |
| `signOut()` | `POST /auth/signout` | — |
| (read) | `GET /me` | `Session` |

`Session.command` comes from the officer's **posting**, never from the
client. A command desk must not be able to ask for another command's data.

## 3. Reporting a crime (public, no account needed)

| Store function | Endpoint |
|---|---|
| `fileReport(input)` | `POST /reports` (multipart: JSON + evidence files) |
| `findReference(ref)` | `GET /track/{ref}` |

`POST /reports` body:

```ts
{
  kind: string;            // from content-report.ts reportKinds
  priority: "P1"|"P2"|"P3"|"P4"; // suggested by gradeReport(); server may override
  where: Jurisdiction;     // state + lga + address
  summary: string;         // ≤ 4,000 chars (+ suspects/vehicles text)
  occurred?: string;       // ISO time, absent when "happening now"
  reporter: { name, phone, safeToCall } | null; // null = anonymous
  injuries: "Yes"|"No"|"Not sure";
  evidence: File[];        // ≤ 5 files, ≤ 20 MB each, image/video/audio/pdf
}
→ { incident: { id, where, status }, request?: { id } }
```

Server must:

- Resolve `where` to a real division and put the call on **that command's**
  board only.
- Create a request in the reporter's account when signed in (same reference).
- Rate-limit and CAPTCHA anonymous reports; virus-scan uploads.
- Send an SMS with the reference to `reporter.phone` **only if
  `safeToCall`** is true.

`GET /track/{ref}` is public, so it returns a **redacted** view: kind,
public status ("Received", "Officers assigned", "Officers attending",
"Case closed"), times, command and division. Never unit callsigns, officer
names, the reporter's details or the desk log. See `TrackForm.tsx`.

## 4. Service applications (signed in)

| Store function | Endpoint |
|---|---|
| `submitRequest(input)` | `POST /requests` (multipart) |
| `advanceRequest(id, "In Review", reply, "Reply sent")` | `POST /requests/{id}/reply` |
| (read) | `GET /me/requests` |

```ts
POST /requests
{
  slug: string;   // service
  where: Jurisdiction;  // the applicant's state + LGA + address
  answers: { label: string; value: string }[]; // purpose, phone, email…
  documents: { label: string; file: File }[];  // one entry per required document
}
→ TrackedRequest
```

Fees: paid services are paid **after** the command accepts the application.
The server adds a "Payment due" step with an invoice link (POSSAP / the
Federal Government's gateway). The front end shows `fee` and the timeline;
it never takes card details itself.

## 5. The operations console (officers only)

Every console endpoint is filtered by the caller's command on the server.
A Force HQ desk may pass `?command=` (`setViewing()` in the store).

| Store function | Endpoint |
|---|---|
| (read incidents) | `GET /console/incidents?command=` |
| `logIncident(input)` | `POST /console/incidents` |
| `updateIncident(id, patch)` | `PATCH /console/incidents/{id}` |
| (read units) | `GET /console/units?command=` |
| `setUnitStatus(callsign, status)` | `PATCH /console/units/{callsign}` |
| (read requests) | `GET /console/requests?command=` |
| `advanceRequest(id, status, note)` | `POST /console/requests/{id}/decision` |
| (live) | `GET /console/stream?command=` (Server-Sent Events) |

Rules the server enforces (today `updateIncident` does them in the browser):

1. **Units only attend calls in their own command.** Reject a `unit` whose
   `state` differs from the call's `where.state`.
2. **Status stamps are server time.** `dispatched`, `onScene`, `closed` are
   set by the server when the status moves, never sent by the client.
3. **Transfer across a state line** stands the unit down, sets the call back
   to `New`, and moves it to the new command's queue.
4. **The reporter's copy follows the call**: Dispatched/On Scene → request
   "In Review" ("Officers assigned"); Closed → "Completed" ("Case closed").
5. **Refusing a request needs a reason** the applicant can read.
6. Every change is written to an audit log with the officer's service
   number. The front end's `log` lines become the public part of it.

## 6. Fines and notices

| Store function | Endpoint |
|---|---|
| `payFine(id)` | `POST /fines/{id}/pay` → `{ paymentUrl }`, then a webhook marks it paid |
| `markNoticesRead()` | `POST /me/notices/read` |
| (read) | `GET /me/fines`, `GET /me/notices`, `GET /me/documents` |

## 7. What the front end already handles for you

- Every reader-visible string exists in English, Hausa, Yoruba and Igbo.
  Data is stored in **English** (the officer's record); screens translate on
  the way out. Keep API values in English.
- Reference formats: calls `NPF-4418`, requests `NPF-2026-1234`. The tracker
  accepts both.
- Phone numbers are validated as Nigerian mobiles (`PHONE` in `Wizard.tsx`).
