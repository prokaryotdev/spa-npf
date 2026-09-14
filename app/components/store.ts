"use client";

import { useSyncExternalStore } from "react";
import { seedFines, seedNotices, seedRequests } from "../content-account";
import { seedIncidents } from "../content-ops";

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
  | "Submitted"
  | "In Review"
  | "Action Needed"
  | "Completed"
  | "Rejected";

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

export type Incident = {
  id: string;
  kind: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  area: string;
  reported: string;
  status: IncidentStatus;
  assignee: string | null;
  unit: string | null;
  summary: string;
  source: string;
};

type State = {
  session: Session | null;
  requests: TrackedRequest[];
  fines: Fine[];
  notices: Notice[];
  incidents: Incident[];
};

const KEY = "dp:state";

const fresh = (): State => ({
  session: null,
  requests: seedRequests,
  fines: seedFines,
  notices: seedNotices,
  incidents: seedIncidents,
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
  const loaded = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return { ...snapshot, loaded };
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

export function updateIncident(id: string, patch: Partial<Incident>) {
  write({
    ...state,
    incidents: state.incidents.map((i) =>
      i.id === id ? { ...i, ...patch } : i,
    ),
  });
}

/** Wipes the demo back to its seeded state, session included. */
export function resetDemo() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  write(fresh());
}
