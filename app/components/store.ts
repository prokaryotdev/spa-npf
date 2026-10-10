"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { seedFines, seedNotices, seedRequests } from "../content-account";
import { seedIncidents, seedUnits } from "../content-ops";
import type { Jurisdiction } from "../geo";

/**
 * The whole of the app's "backend": one object in localStorage, read through
 * useSyncExternalStore so every mounted screen sees the same thing.
 *
 * ponytail: no server, no auth, no database. Signing in accepts any Nigeria
 * ID of the right shape and a request is a row this file appends. Swap the
 * four functions at the bottom for fetch calls when an API exists; nothing
 * else in the app touches storage.
 */

export type Session = {
  name: string;
  nin: string;
  email: string;
  phone: string;
  /** Which side of the house the account belongs to. */
  role: "citizen" | "officer";
  /** Officers carry a rank and a station; citizens do not. */
  rank?: string;
  station?: string;
  /**
   * The command an officer's desk answers for: "Lagos", "FCT". Absent for a
   * Force Headquarters desk, which sees every command and narrows the view
   * with `viewing`.
   */
  command?: string;
  /** The command this tab's console is showing. Absent means all of them. */
  viewing?: string;
};

export type RequestStatus =
  "Submitted" | "In Review" | "Action Needed" | "Completed" | "Rejected";

export type TrackedRequest = {
  id: string;
  slug: string;
  service: string;
  status: RequestStatus;
  submitted: string;
  updated: string;
  fee: string;
  channel: string;
  note?: string;
  timeline: { at: string; label: string; note?: string }[];
  /** The command and division that own the request. */
  where?: Jurisdiction;
  /** What the applicant wrote, in order: purpose, contact and the rest. */
  answers?: { label: string; value: string }[];
  /** Files attached, by the document each one answers. */
  documents?: { label: string; file: string }[];
  /** The call on the board, when the request is a crime report. */
  incident?: string;
};

export type Fine = {
  id: string;
  reason: string;
  amount: number;
  issued: string;
  location: string;
  points: number;
  paid: boolean;
};

export type Notice = {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
};

export type IncidentStatus = "New" | "Dispatched" | "On Scene" | "Closed";

/**
 * P1-P4 rather than words. Dispatch grades calls by number because it is the
 * field read aloud over a radio, and "P1" cannot be misheard as "high" the
 * way "critical" can. The words stay as the accessible label beside it.
 */
export type Priority = "P1" | "P2" | "P3" | "P4";

export type Incident = {
  id: string;
  kind: string;
  priority: Priority;
  area: string;
  /** Call received. The clock every other timestamp is measured against. */
  reported: string;
  /** Stamped as a unit is assigned, arrives, and clears. */
  dispatched: string | null;
  onScene: string | null;
  closed: string | null;
  status: IncidentStatus;
  assignee: string | null;
  unit: string | null;
  summary: string;
  source: string;
  /** The command and division the call belongs to. */
  where: Jurisdiction;
  /** When it happened, if that was before it was reported. */
  occurred?: string;
  /**
   * Who reported it. `null` for an anonymous report, so nobody spends ten
   * minutes looking for a callback number that is not there; absent for a
   * call the desk took itself.
   */
  reporter?: { name: string; phone: string; safeToCall: boolean } | null;
  /** "Yes", "No" or "Not sure": whether anyone is hurt. */
  injuries?: string;
  /** Evidence the reporter attached, by file name. */
  evidence?: string[];
  /**
   * What was written on the call, oldest first. A line the system writes is
   * stored as its English pattern plus the values that fill it, so the board
   * can render it in either language; a line an operator typed is stored
   * verbatim and shown as typed.
   */
  log: { at: string; text: string; vars?: Record<string, string> }[];
};

export type UnitStatus = "Available" | "Assigned" | "On Scene" | "Unavailable";

export type Unit = {
  callsign: string;
  /** Patrol, Traffic, Marine…: what kind of unit, not where it is. */
  section: string;
  /** The command the unit belongs to. It is only sent to that command's calls. */
  state: string;
  officer: string;
  status: UnitStatus;
  /** Last status change — the elapsed clock on the board counts from here. */
  since: string;
  incident: string | null;
  area: string;
};

type State = {
  session: Session | null;
  requests: TrackedRequest[];
  fines: Fine[];
  notices: Notice[];
  incidents: Incident[];
  units: Unit[];
};

// Versioned: the shape changed (word priorities became P1-P4) and an old blob
// crashes the board. Bump on any breaking change to Shared — seed data makes
// a migration pointless.
//
// v3 is a content break rather than a shape one, and it is the more dangerous
// kind. readShared() spreads the saved collections over the fresh ones, so a
// blob written before the seeds moved (Dubai, then the FCT, then the whole
// country) survives every
// deploy: the console keeps serving Sheikh Zayed Road and DXB references, and
// the fixed timestamps in it age into elapsed clocks reading ninety hours.
// Anyone who opened the console once sees that version forever. Bump the key
// whenever the seeds change, not only when their shape does.
//
// Exported so scripts/test-store.mjs reads the blob under whatever the
// current key is: a copy of the string in the test turns the next bump into
// a failing test rather than a passing one.
export const KEY = "dp:state:v5";
/**
 * The work lives in localStorage; who is signed in lives in sessionStorage.
 *
 * Both sides of the house read one store, so a request a citizen opens lands
 * on the officer's queue as it is written. Keeping the session in that shared
 * blob as well meant the second sign-in evicted the first, which made the one
 * thing worth showing — both screens live, side by side — impossible to show.
 * sessionStorage is per-tab by definition, so the tabs now disagree about who
 * is signed in and agree about everything else, which is exactly the split
 * the demo needs.
 */
const SESSION_KEY = "dp:session";

/** Everything the tabs share. The session is deliberately not in here. */
type Shared = Omit<State, "session">;

const freshShared = (): Shared => ({
  requests: seedRequests,
  fines: seedFines,
  notices: seedNotices,
  incidents: seedIncidents(),
  units: seedUnits(),
});

const fresh = (): State => ({ session: null, ...freshShared() });

let state: State = fresh();
let hydrated = false;
const listeners = new Set<() => void>();

function readShared(): Shared {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return freshShared();
    const saved = JSON.parse(raw);
    // Seeded collections are merged in, not trusted from storage wholesale: a
    // build that adds a new seed row should show it to someone who signed in
    // last week, and a half-written value should not blank the screen.
    return { ...freshShared(), ...saved };
  } catch {
    return freshShared();
  }
}

function readSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

// `session` is spread last on purpose: a blob written by an older build still
// carries one, and this tab's own session has to win over it.
const read = (): State => ({ ...readShared(), session: readSession() });

function write(next: State) {
  const { session, ...shared } = next;
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(shared));
    if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Private browsing: the session still works, it just will not survive.
  }
  for (const listener of listeners) listener();
}

// Exported for the check in scripts/test-store.mjs, which has no React to
// mount and so needs the store's own subscribe to hydrate it.
export function subscribe(listener: () => void) {
  if (!hydrated) {
    hydrated = true;
    state = read();
  }
  listeners.add(listener);
  // Work done in another tab, arriving here. Re-reading is safe now that the
  // session is per-tab: only the shared half can have changed, and the half
  // this tab owns is read back from its own sessionStorage.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    state = read();
    for (const l of listeners) l();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const server = fresh();

/**
 * False while the server renders and through hydration, true once the browser
 * owns the tree. Anything that reads localStorage, formats a local time or
 * runs a clock waits for this, or the two renders disagree.
 *
 * This was a `useSyncExternalStore` reading `() => true` against
 * `() => false` twice over — once sharing the store's subscription, once with
 * its own. Both left the flag stuck false on a hard load of some routes, and a
 * screen that never learns the browser has arrived sits on its loading
 * skeleton for good with nothing in the console to say why. Both failures were
 * reproduced against a clean build and fixed by the line below.
 *
 * react-hooks/set-state-in-effect is aimed at effects that recompute state
 * React could have derived while rendering. This one cannot be derived: the
 * whole question is whether the render is the server's or the browser's, and
 * a mount effect is the only thing that knows. It fires once per mount and
 * never again.
 */
export function useHydrated() {
  const [hydratedNow, setHydratedNow] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setHydratedNow(true), []);
  return hydratedNow;
}

/**
 * `loaded` is false for the first client render. The server rendered the
 * signed-out page, so a screen that flips on `session` has to wait for this
 * or React reports a hydration mismatch.
 */
export function useStore(): State & { loaded: boolean } {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => state,
    () => server,
  );
  return { ...snapshot, loaded: useHydrated() };
}

const now = () => new Date().toISOString();

/** NPF-2026-0417 — the reference number people are asked to quote. */
function reference(prefix: string) {
  const year = new Date().getFullYear();
  const n = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${n}`;
}

export function signIn(session: Session) {
  write({ ...state, session });
}

export function signOut() {
  write({ ...state, session: null });
}

export function submitRequest(input: {
  slug: string;
  service: string;
  fee: string;
  channel?: string;
  where?: Jurisdiction;
  answers?: TrackedRequest["answers"];
  documents?: TrackedRequest["documents"];
  incident?: string;
}): TrackedRequest {
  const at = now();
  const created: TrackedRequest = {
    id: reference("NPF"),
    slug: input.slug,
    service: input.service,
    status: "Submitted",
    submitted: at,
    updated: at,
    fee: input.fee,
    channel: input.channel ?? "Nigeria Police Force Website",
    where: input.where,
    answers: input.answers,
    documents: input.documents,
    incident: input.incident,
    timeline: [
      input.where
        ? {
            at,
            label: "Submitted",
            note: "Sent to {command}, {division}.",
          }
        : { at, label: "Submitted", note: "Received by Nigeria Police Force." },
    ],
  };
  write({ ...state, requests: [created, ...state.requests] });
  return created;
}

/**
 * A crime reported by a member of the public. One write puts the call on
 * the board of the command it happened in and, for a signed-in reporter,
 * a request in their account that follows it — the same reference on both,
 * so the officer and the reporter quote the same number to each other.
 */
export function fileReport(input: {
  kind: string;
  priority: Priority;
  where: Jurisdiction;
  summary: string;
  occurred?: string;
  reporter: Incident["reporter"];
  injuries: string;
  evidence: string[];
}): Incident {
  const incident = logIncident({
    kind: input.kind,
    priority: input.priority,
    area: input.where.address || input.where.lga,
    summary: input.summary,
    source: "Website report",
    where: input.where,
    occurred: input.occurred,
    reporter: input.reporter,
    injuries: input.injuries,
    evidence: input.evidence,
  });
  if (state.session?.role === "citizen") {
    const at = now();
    const created: TrackedRequest = {
      id: incident.id,
      slug: "open-criminal-case",
      service: "File Criminal Complaint",
      status: "Submitted",
      submitted: at,
      updated: at,
      fee: "Free of Charge",
      channel: "Nigeria Police Force Website",
      where: input.where,
      incident: incident.id,
      answers: [
        { label: "What happened", value: input.kind },
        { label: "What you told us", value: input.summary },
      ],
      documents: input.evidence.map((file) => ({ label: "Evidence", file })),
      timeline: [
        { at, label: "Submitted", note: "Sent to {command}, {division}." },
      ],
    };
    write({ ...state, requests: [created, ...state.requests] });
  }
  return incident;
}

/** Look a reference up from the public tracker: a request, or a report. */
export function findReference(ref: string) {
  const id = ref.trim().toUpperCase();
  return {
    request: state.requests.find((r) => r.id.toUpperCase() === id) ?? null,
    incident: state.incidents.find((i) => i.id.toUpperCase() === id) ?? null,
  };
}

/**
 * Which command this tab's console shows. A command desk is held to its
 * own; a Force Headquarters desk can look at any, or at all of them.
 */
export function setViewing(command: string | undefined) {
  if (!state.session || state.session.command) return;
  write({ ...state, session: { ...state.session, viewing: command } });
}

/** The command a console tab is showing, or null for every command. */
export const viewingOf = (session: Session | null) =>
  session?.command ?? session?.viewing ?? null;

/**
 * The values a routing line is written with. Stored as the state and LGA,
 * not as the finished names, so the line reads in whichever language the
 * person opening it uses: see routeLabels in ./Where.
 */
export const routeVars = (where?: Jurisdiction) =>
  where ? { state: where.state, lga: where.lga } : undefined;

/**
 * Moving a request, from either side. The officer decides one; the applicant
 * answers an "Action Needed" by sending it back to review. Either way the same
 * timeline entry is written, so the two screens never disagree.
 *
 * `label` names that entry when the status alone would misread it: an
 * applicant's reply is a move to "In Review", but a history line reading
 * "In Review" makes it look like the officer picked it up again.
 */
export function advanceRequest(
  id: string,
  status: RequestStatus,
  note?: string,
  label: string = status,
) {
  const at = now();
  write({
    ...state,
    requests: state.requests.map((r) =>
      r.id === id
        ? {
            ...r,
            status,
            updated: at,
            note: status === "Action Needed" ? note : undefined,
            timeline: [...r.timeline, { at, label, note }],
          }
        : r,
    ),
  });
}

export function markNoticesRead() {
  write({
    ...state,
    notices: state.notices.map((n) => ({ ...n, read: true })),
  });
}

export function payFine(id: string) {
  write({
    ...state,
    fines: state.fines.map((f) => (f.id === id ? { ...f, paid: true } : f)),
  });
}

/** Which unit status a call status implies, so the two boards never disagree. */
const UNIT_FOR: Record<IncidentStatus, UnitStatus> = {
  New: "Available",
  Dispatched: "Assigned",
  "On Scene": "On Scene",
  Closed: "Available",
};

/**
 * One write moves the call, stamps the timestamp that status earns, logs the
 * line, and moves the unit's own status with it.
 *
 * Dispatch is not four independent fields an operator keeps in sync by hand —
 * a unit showing Available while its call shows On Scene is how a second car
 * gets sent to an incident that already has one.
 */
export function updateIncident(id: string, patch: Partial<Incident>) {
  const at = now();
  const before = state.incidents.find((i) => i.id === id);
  if (!before) return;
  const after: Incident = { ...before, ...patch };

  // A call sent to the wrong command goes back to that command's pending
  // queue with nobody on it: a Lagos unit cannot attend in Kano.
  const moved =
    patch.where &&
    (patch.where.state !== before.where.state ||
      patch.where.lga !== before.where.lga);
  if (moved) {
    if (patch.where!.state !== before.where.state && before.status !== "Closed") {
      patch = { ...patch, unit: null, status: "New" };
      after.unit = null;
      after.assignee = null;
      after.status = "New";
      after.dispatched = null;
      after.onScene = null;
    }
    after.log = [
      ...after.log,
      {
        at,
        text: "Transferred to {command}, {division}.",
        vars: routeVars(after.where),
      },
    ];
  }

  if (patch.status && patch.status !== before.status) {
    if (patch.status === "Dispatched") after.dispatched ??= at;
    if (patch.status === "On Scene") {
      after.dispatched ??= at;
      after.onScene ??= at;
    }
    if (patch.status === "Closed") after.closed = at;
    // Reopening a closed call clears the closing stamp, or its age freezes.
    if (before.status === "Closed" && patch.status !== "Closed")
      after.closed = null;
    after.log = [...after.log, { at, ...statusLine(patch.status, after.unit) }];
  }

  if (patch.unit !== undefined && patch.unit !== before.unit)
    after.log = [
      ...after.log,
      patch.unit
        ? { at, text: "{unit} assigned.", vars: { unit: patch.unit } }
        : { at, text: "Unit stood down." },
    ];

  const touched = new Set([before.unit, after.unit].filter(Boolean));

  write({
    ...state,
    incidents: state.incidents.map((i) => (i.id === id ? after : i)),
    // The reporter's copy follows the call, in the words a reporter needs:
    // not "Dispatched — Patrol 12" but that officers are on it.
    requests: state.requests.map((r) => {
      if (r.incident !== id) return r;
      const lines: TrackedRequest["timeline"] = [];
      let status = r.status;
      if (moved)
        lines.push({ at, label: "Transferred", note: "Sent to {command}, {division}." });
      if (patch.status && patch.status !== before.status) {
        if (after.status === "Dispatched" || after.status === "On Scene") {
          if (r.status !== "In Review")
            lines.push({ at, label: "Officers assigned" });
          status = "In Review";
        } else if (after.status === "Closed") {
          lines.push({ at, label: "Case closed" });
          status = "Completed";
        } else if (r.status === "Completed") {
          lines.push({ at, label: "Reopened" });
          status = "Submitted";
        }
      }
      if (!lines.length) return r;
      return {
        ...r,
        status,
        updated: at,
        where: after.where,
        timeline: [...r.timeline, ...lines],
      };
    }),
    units: state.units.map((u) => {
      if (!touched.has(u.callsign)) return u;
      // The unit that just left the call goes back on the air.
      if (u.callsign !== after.unit || after.status === "Closed")
        return u.status === "Available" && !u.incident
          ? u
          : { ...u, status: "Available", incident: null, since: at };
      const next = UNIT_FOR[after.status];
      return u.status === next && u.incident === after.id
        ? u
        : {
            ...u,
            status: next,
            incident: after.id,
            since: at,
            area: after.area,
          };
    }),
  });
}

function statusLine(
  status: IncidentStatus,
  unit: string | null,
): { text: string; vars?: Record<string, string> } {
  const vars = unit ? { unit } : undefined;
  if (status === "Dispatched")
    return { text: unit ? "Dispatched — {unit}." : "Dispatched.", vars };
  if (status === "On Scene")
    return {
      text: unit ? "Arrived on scene — {unit}." : "Arrived on scene.",
      vars,
    };
  if (status === "Closed")
    return { text: unit ? "Call closed — {unit}." : "Call closed.", vars };
  return { text: "Returned to the pending queue." };
}

/** A unit going off the air, or back on it, without a call being involved. */
export function setUnitStatus(callsign: string, status: UnitStatus) {
  const at = now();
  write({
    ...state,
    units: state.units.map((u) =>
      u.callsign === callsign
        ? {
            ...u,
            status,
            since: at,
            incident:
              status === "Available" || status === "Unavailable"
                ? null
                : u.incident,
          }
        : u,
    ),
  });
}

/** A new call taken at the desk. Lands at the top of the pending queue. */
export function logIncident(
  input: Pick<
    Incident,
    "kind" | "priority" | "area" | "summary" | "source" | "where"
  > &
    Partial<
      Pick<Incident, "occurred" | "reporter" | "injuries" | "evidence">
    >,
): Incident {
  const at = now();
  const n = Math.max(
    4400,
    ...state.incidents.map((i) => Number(i.id.split("-")[1]) || 0),
  );
  const created: Incident = {
    id: `NPF-${n + 1}`,
    ...input,
    reported: at,
    dispatched: null,
    onScene: null,
    closed: null,
    status: "New",
    assignee: null,
    unit: null,
    log: [
      {
        at,
        text: "Call received via {source}.",
        vars: { source: input.source },
      },
      {
        at,
        text: "Routed to {command}, {division}.",
        vars: routeVars(input.where),
      },
    ],
  };
  write({ ...state, incidents: [created, ...state.incidents] });
  return created;
}

/** Wipes the demo back to its seeded state, session included. */
export function resetDemo() {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
  write(fresh());
}
