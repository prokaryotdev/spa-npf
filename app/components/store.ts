"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { seedFines, seedNotices, seedRequests } from "../content-account";
import { seedIncidents, seedUnits } from "../content-ops";

/**
 * The whole of the app's "backend": one object in localStorage, read through
 * useSyncExternalStore so every mounted screen sees the same thing.
 *
 * ponytail: no server, no auth, no database. Signing in accepts any Emirates
 * ID of the right shape and a request is a row this file appends. Swap the
 * four functions at the bottom for fetch calls when an API exists; nothing
 * else in the app touches storage.
 */

export type Session = {
  name: string;
  emiratesId: string;
  email: string;
  phone: string;
  /** Which side of the house the account belongs to. */
  role: "citizen" | "officer";
  /** Officers carry a rank and a station; citizens do not. */
  rank?: string;
  station?: string;
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
  division: string;
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

const KEY = "dp:state";

const fresh = (): State => ({
  session: null,
  requests: seedRequests,
  fines: seedFines,
  notices: seedNotices,
  incidents: seedIncidents(),
  units: seedUnits(),
});

let state: State = fresh();
let hydrated = false;
const listeners = new Set<() => void>();

function read(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    const saved = JSON.parse(raw);
    // Seeded collections are merged in, not trusted from storage wholesale: a
    // build that adds a new seed row should show it to someone who signed in
    // last week, and a half-written value should not blank the screen.
    return { ...fresh(), ...saved };
  } catch {
    return fresh();
  }
}

function write(next: State) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private browsing: the session still works, it just will not survive.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  if (!hydrated) {
    hydrated = true;
    state = read();
  }
  listeners.add(listener);
  // Another tab signing out should sign this one out too.
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

/** DP-2026-0417 — the reference number people are asked to quote. */
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
  note?: string;
}): TrackedRequest {
  const at = now();
  const created: TrackedRequest = {
    id: reference("DP"),
    slug: input.slug,
    service: input.service,
    status: "Submitted",
    submitted: at,
    updated: at,
    fee: input.fee,
    channel: input.channel ?? "Dubai Police Website",
    note: input.note,
    timeline: [{ at, label: "Submitted", note: "Received by Dubai Police." }],
  };
  write({ ...state, requests: [created, ...state.requests] });
  return created;
}

/**
 * The officer side of a request. Moving it also writes the timeline entry the
 * citizen reads on their own screen, so the two views never disagree.
 */
export function advanceRequest(
  id: string,
  status: RequestStatus,
  note?: string,
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
            timeline: [...r.timeline, { at, label: status, note }],
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
export function logIncident(input: {
  kind: string;
  priority: Priority;
  area: string;
  summary: string;
  source: string;
}): Incident {
  const at = now();
  const n = Math.max(
    4400,
    ...state.incidents.map((i) => Number(i.id.split("-")[1]) || 0),
  );
  const created: Incident = {
    id: `DXB-${n + 1}`,
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
    ],
  };
  write({ ...state, incidents: [created, ...state.incidents] });
  return created;
}

/** Wipes the demo back to its seeded state, session included. */
export function resetDemo() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  write(fresh());
}
