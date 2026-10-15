"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { seedFines, seedNotices, seedRequests } from "../content-account";
import { seedIncidents, seedUnits } from "../content-ops";
import { seedAlerts, seedCases, seedCustody } from "../content-records";
import { STATES, jurisdiction, type Geo, type Jurisdiction } from "../geo";

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
  /**
   * The job the officer signed in to do. It decides which boards the console
   * offers and how far it sees: see `POSTS` in content-ops.ts.
   */
  post?: Post;
  /** Force service number: stamped on every change the officer makes. */
  serviceNo?: string;
  /** A divisional desk's LGA. The console shows that division only. */
  division?: string;
  /** A zonal desk's zonal command id: it sees that zone's states only. */
  zone?: string;
  /** Where a citizen lives, kept on the profile to fill in applications. */
  home?: { state: string; lga: string; address: string };
};

export type Post =
  | "control"
  | "dpo"
  | "investigator"
  | "custody"
  | "commander"
  | "zone"
  | "hq";

/**
 * A photo, clip or document attached to a report, a call or a case.
 *
 * The bytes are fingerprinted (SHA-256) the moment they are picked, so a
 * court can be shown that the exhibit opened today is the one the reporter
 * sent. Images keep a small preview here; the full file goes to the upload
 * endpoint in docs/API-CONTRACT.md.
 */
export type Media = {
  id: string;
  name: string;
  /** MIME type: image/jpeg, video/mp4, application/pdf… */
  type: string;
  size: number;
  /** A downscaled JPEG data URL, images only. */
  thumb?: string;
  sha256: string;
  at: string;
  /** Who added it: "Reporter", or the officer's name and service number. */
  by: string;
};

/** One line in a record's history, with who wrote it. */
export type LogLine = {
  at: string;
  text: string;
  vars?: Record<string, string>;
  /** The officer, "Reporter" or "System". Absent on older lines. */
  by?: string;
};

export type CaseStage =
  | "Investigating"
  | "Charged to court"
  | "Closed";

/**
 * A case file: what a call becomes once it needs investigating. Owned by an
 * Investigating Police Officer, it gathers the people, statements and
 * exhibits, and it is what the complainant is kept informed about.
 */
export type CaseFile = {
  /** CR/LAG/2026/0412: the crime reference number. */
  id: string;
  incident?: string;
  offence: string;
  summary: string;
  where: Jurisdiction;
  opened: string;
  updated: string;
  stage: CaseStage;
  /** The Investigating Police Officer. Null until one is assigned. */
  ipo: string | null;
  /** How a closed case ended. */
  result?: string;
  people: { role: string; name: string; detail?: string }[];
  statements: { at: string; by: string; who: string; text: string }[];
  exhibits: {
    id: string;
    label: string;
    media?: Media;
    /** Chain of custody: every hand the exhibit passed through. */
    trail: { at: string; by: string; action: string }[];
  }[];
  /** What the complainant has been told, newest last. Shown on the tracker. */
  updates: { at: string; text: string }[];
  log: LogLine[];
};

export type DetaineeStatus =
  | "In custody"
  | "Bail granted"
  | "Charged to court"
  | "Released"
  | "Transferred";

/**
 * One line of the register of arrests a station must keep (ACJA 2015
 * s.15–17), with the clock the Constitution s.35(5) starts at arrest: a court
 * within 40 km means 24 hours to charge or release, otherwise 48.
 */
export type Detainee = {
  id: string;
  name: string;
  age?: number;
  sex: string;
  offence: string;
  caseId?: string;
  incident?: string;
  where: Jurisdiction;
  arrested: string;
  booked: string;
  by: string;
  /** A court of competent jurisdiction within 40 km: the 24-hour limit. */
  courtNear: boolean;
  status: DetaineeStatus;
  released?: string;
  rights: {
    /** Told of the offence and the right to silence and a lawyer. */
    informed: boolean;
    /** Next of kin or family told where they are held. */
    kin: boolean;
    /** Allowed to see a lawyer of their choice. */
    lawyer: boolean;
    /** Seen by a medical officer where needed. */
    medical: boolean;
  };
  property?: string;
  checks: { at: string; by: string; note: string }[];
  log: LogLine[];
};

export type AlertKind =
  | "Wanted person"
  | "Missing person"
  | "Stolen vehicle"
  | "Officer safety"
  | "Intelligence";

/**
 * A "be on the lookout": a wanted or missing person, a stolen vehicle or a
 * warning, sent to one command or the whole Force. A public one is shown on
 * the appeals page, and what the public send back lands on it as tips.
 */
export type Alert = {
  id: string;
  kind: AlertKind;
  title: string;
  details: string;
  /** Registration number, for a vehicle. Matched by the records check. */
  plate?: string;
  /** Names the person is known by, for the records check. */
  names?: string[];
  photo?: Media;
  /** The command it is sent to, or null for every command. */
  scope: string | null;
  issued: string;
  by: string;
  public: boolean;
  /**
   * For a missing person: the family agreed to a public appeal with the
   * photo. Publishing waits for it.
   */
  consent?: boolean;
  active: boolean;
  incident?: string;
  tips: { at: string; text: string; contact?: string; read?: boolean }[];
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
  /** `vars` fill the note's {placeholders}, as a log line's do. */
  timeline: {
    at: string;
    label: string;
    note?: string;
    vars?: Record<string, string>;
  }[];
  /** The command and division that own the request. */
  where?: Jurisdiction;
  /** What the applicant wrote, in order: purpose, contact and the rest. */
  answers?: { label: string; value: string }[];
  /** Files attached, by the document each one answers. */
  documents?: { label: string; file: string }[];
  /** The call on the board, when the request is a crime report. */
  incident?: string;
  /** The officer handling it, once one has picked it up. */
  assignee?: string;
  /**
   * The number printed on what a completed request issues. Anyone handed the
   * document can check it at /app/verify.
   */
  docNo?: string;
  /** When the document was issued: not `updated`, which later edits move. */
  docIssued?: string;
  /** A booked visit to the command, for fingerprints and a photograph. */
  appointment?: string;
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
  /** English patterns; `vars` fill them, so a notice reads in any language. */
  title: string;
  body: string;
  vars?: Record<string, string>;
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
  /** How the call ended, chosen as it closes: one of `callOutcomes`. */
  outcome?: string;
  /** Photos, clips and documents, from the reporter or the officers. */
  media?: Media[];
  /** Risks the desk has to pass to whoever attends: see `callFlags`. */
  flags?: string[];
  /** Units sent in support of the first one. */
  backup?: string[];
  /** The case file opened from this call. */
  caseId?: string;
  /** The language the reporter used, so the right officer calls back. */
  lang?: string;
  /** Who the reporter was reporting for, when it was not themselves. */
  onBehalf?: string;
  /**
   * What was written on the call, oldest first. A line the system writes is
   * stored as its English pattern plus the values that fill it, so the board
   * can render it in either language; a line an operator typed is stored
   * verbatim and shown as typed.
   */
  log: LogLine[];
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
  /** The LGA the unit works from, so a divisional desk sees its own cars. */
  base?: string;
  /** Last reported position (from the radio's GPS on a live system). */
  geo?: Geo;
  /** Set when the officer presses the emergency button. */
  emergency?: string | null;
  /**
   * Who crews the unit on each of the three reliefs (A from 06:00 WAT), and
   * which relief has it now. A real roster comes from the Force's personnel
   * system; the console only hands over between reliefs.
   */
  crew?: Record<Relief, string>;
  relief?: Relief;
  /** A relief change waiting for the unit to clear its call. */
  heldOver?: Relief;
  /** When the position was last reported, and by what. */
  fixAt?: string;
};

export type Relief = "A" | "B" | "C";

type State = {
  session: Session | null;
  requests: TrackedRequest[];
  fines: Fine[];
  notices: Notice[];
  incidents: Incident[];
  units: Unit[];
  cases: CaseFile[];
  custody: Detainee[];
  alerts: Alert[];
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
export const KEY = "dp:state:v9";
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
  cases: seedCases(),
  custody: seedCustody(),
  alerts: seedAlerts(),
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
    try {
      localStorage.setItem(KEY, JSON.stringify(shared));
    } catch (e) {
      if (!(e instanceof DOMException) || e.name !== "QuotaExceededError") throw e;
      // Full: photo previews are the bulk. Keep the work and drop the
      // pictures (the files themselves live in the evidence store) rather
      // than lose every change after this one without a word.
      console.error("Browser storage is full; photo previews were dropped to keep the records.");
      localStorage.setItem(KEY, JSON.stringify(shared, (k, v) => (k === "thumb" ? undefined : v)));
    }
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

/**
 * Who is making a change, as the audit trail records it: the officer's name
 * and service number. A server takes this from the session cookie and never
 * from the request body; here it is the tab's own session.
 */
export function actor(session: Session | null = state.session) {
  if (!session) return "Reporter";
  if (session.role !== "officer") return session.name;
  return session.serviceNo ? `${session.name} (${session.serviceNo})` : session.name;
}

/** The next number in a series: DET-0105 after DET-0104. */
function nextId(prefix: string, ids: string[], start: number, width = 4) {
  const n = Math.max(
    start,
    ...ids.map((id) => Number(id.split(/[-/]/).pop()) || 0),
  );
  return `${prefix}${String(n + 1).padStart(width, "0")}`;
}

/** A line in the signed-in citizen's notices, newest first. */
function notice(
  what: string,
  ref: string,
  body: string = "Open the request to see what changed.",
  vars?: Record<string, string>,
): Notice {
  return {
    id: `N-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    title: "{ref}: {what}",
    body,
    vars: { ref, what, ...vars },
    at: now(),
    read: false,
  };
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
  media: Media[];
  flags?: string[];
  lang?: string;
  onBehalf?: string;
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
    evidence: input.media.map((m) => m.name),
    media: input.media,
    flags: input.flags,
    lang: input.lang,
    onBehalf: input.onBehalf,
  });
  const evidence = input.media.map((m) => m.name);
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
      documents: evidence.map((file) => ({ label: "Evidence", file })),
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
 * A document number checked by whoever was handed the paper: an employer, an
 * embassy, a bank. Says whether the Force issued it, for what and when, and
 * nothing about the holder beyond that.
 */
export function findDocument(no: string) {
  const want = no.trim().toUpperCase().replace(/\s+/g, "");
  // A request moved off Completed (refused on appeal, reopened) has its
  // document withdrawn: the number no longer verifies.
  return (
    state.requests.find(
      (r) =>
        r.status === "Completed" &&
        r.docNo &&
        r.docNo.toUpperCase().replace(/\s+/g, "") === want,
    ) ?? null
  );
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

/** The LGA a divisional desk is held to, or null above division level. */
export const divisionOf = (session: Session | null) =>
  session?.division ?? null;

/**
 * The values a routing line is written with. Stored as the state and LGA,
 * not as the finished names, so the line reads in whichever language the
 * person opening it uses: see routeLabels in ./Where.
 */
export const routeVars = (where?: Jurisdiction) =>
  where ? { state: where.state, lga: where.lga, division: where.division } : undefined;

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
  const officer = state.session?.role === "officer";
  const before = state.requests.find((r) => r.id === id);
  // What a completed request issues carries a number anyone can check.
  const docNo =
    status === "Completed" && !before?.docNo
      ? `NPF/${new Date().getFullYear()}/${String(
          Math.floor(100000 + Math.random() * 900000),
        )}`
      : before?.docNo;
  write({
    ...state,
    requests: state.requests.map((r) =>
      r.id === id
        ? {
            ...r,
            status,
            updated: at,
            docNo,
            docIssued: docNo && !r.docIssued ? at : r.docIssued,
            assignee: r.assignee ?? (officer ? actor() : undefined),
            note: status === "Action Needed" ? note : undefined,
            timeline: [...r.timeline, { at, label, note }],
          }
        : r,
    ),
    // The applicant hears about an officer's decision without having to
    // come and look; their own reply needs no notice back to themselves.
    notices:
      officer && before
        ? [
            notice(label, before.service, note),
            ...state.notices,
          ]
        : state.notices,
  });
}

/** An officer takes a request on, or hands it to a named colleague. */
export function assignRequest(id: string, officer: string) {
  const at = now();
  write({
    ...state,
    requests: state.requests.map((r) =>
      r.id === id
        ? {
            ...r,
            assignee: officer,
            updated: at,
            timeline: [
              ...r.timeline,
              { at, label: "Assigned to an officer" },
            ],
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
 * The units on a call, as a set: the first unit and its backup, or nobody
 * once it closes. Every unit in the set wears the call's status.
 */
const crewOf = (i: Incident) =>
  i.status === "Closed"
    ? []
    : ([i.unit, ...(i.backup ?? [])].filter(Boolean) as string[]);

/**
 * One write moves the call, stamps the timestamp that status earns, logs the
 * line, and moves the units' own status with it.
 *
 * Dispatch is not four independent fields an operator keeps in sync by hand —
 * a unit showing Available while its call shows On Scene is how a second car
 * gets sent to an incident that already has one.
 */
export function updateIncident(id: string, patch: Partial<Incident>) {
  const at = now();
  const by = actor();
  const before = state.incidents.find((i) => i.id === id);
  if (!before) return;
  const after: Incident = { ...before, ...patch };
  const stamp = (text: string, vars?: Record<string, string>): LogLine =>
    vars ? { at, text, vars, by } : { at, text, by };

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
      after.backup = [];
      after.status = "New";
      after.dispatched = null;
      after.onScene = null;
    }
    after.log = [
      ...after.log,
      stamp("Transferred to {command}, {division}.", routeVars(after.where)),
    ];
  }

  if (patch.status && patch.status !== before.status) {
    if (patch.status === "Dispatched") after.dispatched ??= at;
    if (patch.status === "On Scene") {
      after.dispatched ??= at;
      after.onScene ??= at;
    }
    if (patch.status === "Closed") after.closed = at;
    // Reopening a closed call clears the closing stamp, or its age freezes,
    // and its outcome, or the shift report counts a live call as finished.
    if (before.status === "Closed" && patch.status !== "Closed") {
      after.closed = null;
      after.outcome = undefined;
    }
    // Back to pending means nobody is on it, backup included.
    if (patch.status === "New") after.backup = [];
    const { text, vars } = statusLine(patch.status, after.unit);
    after.log = [...after.log, stamp(text, vars)];
    if (patch.status === "Closed" && after.outcome)
      after.log.push(stamp("Outcome: {outcome}.", { outcome: after.outcome }));
  }

  if (patch.unit !== undefined && patch.unit !== before.unit)
    after.log = [
      ...after.log,
      patch.unit
        ? stamp("{unit} assigned.", { unit: patch.unit })
        : stamp("Unit stood down."),
    ];

  if (patch.backup) {
    const had = new Set(before.backup ?? []);
    const has = new Set(after.backup ?? []);
    for (const u of has)
      if (!had.has(u)) after.log.push(stamp("{unit} sent in support.", { unit: u }));
    for (const u of had)
      if (!has.has(u)) after.log.push(stamp("{unit} released.", { unit: u }));
  }

  if (patch.flags) {
    const had = new Set(before.flags ?? []);
    const has = new Set(patch.flags);
    for (const f of has)
      if (!had.has(f)) after.log.push(stamp("Flagged: {flag}.", { flag: f }));
    // Withdrawing a warning officers were relying on is logged as well.
    for (const f of had)
      if (!has.has(f)) after.log.push(stamp("Flag removed: {flag}.", { flag: f }));
  }

  if (patch.priority && patch.priority !== before.priority)
    after.log.push(
      stamp("Graded {from} → {to}.", { from: before.priority, to: patch.priority }),
    );

  const was = new Set(crewOf(before));
  const crew = new Set(crewOf(after));

  // The reporter's copy follows the call, in the words a reporter needs:
  // not "Dispatched — Patrol 12" but that officers are on it.
  const told: Notice[] = [];
  const requests = state.requests.map((r) => {
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
        // A call that became a case is not over for the person who reported
        // it: the investigation is just starting.
        if (after.caseId) {
          // Opening the case already said so; once is enough.
          if (!r.timeline.some((s) => s.label === "Passed to investigators"))
            lines.push({ at, label: "Passed to investigators" });
          status = "In Review";
        } else {
          lines.push({ at, label: "Case closed" });
          status = "Completed";
        }
      } else if (r.status === "Completed") {
        lines.push({ at, label: "Reopened" });
        status = "Submitted";
      }
    }
    if (!lines.length) return r;
    for (const l of lines)
      told.push(notice(l.label, r.id));
    return {
      ...r,
      status,
      updated: at,
      where: after.where,
      timeline: [...r.timeline, ...lines],
    };
  });

  write({
    ...state,
    incidents: state.incidents.map((i) => (i.id === id ? after : i)),
    requests,
    notices: [...told, ...state.notices],
    units: releaseHeldOver(state.units.map((u) => {
      if (crew.has(u.callsign)) {
        const next = UNIT_FOR[after.status];
        return u.status === next && u.incident === after.id
          ? u
          : {
              ...u,
              status: next,
              incident: after.id,
              since: at,
              area: after.area,
              // On scene, the unit is where the call is.
              geo:
                next === "On Scene" && after.where.geo ? after.where.geo : u.geo,
            };
      }
      // A unit that just left the call goes back on the air.
      if (was.has(u.callsign))
        return u.status === "Available" && !u.incident
          ? u
          : { ...u, status: "Available", incident: null, since: at };
      return u;
    }), at),
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

/** Officers adding scene photos or documents to a call. */
export function attachToCall(id: string, media: Media[]) {
  const at = now();
  const by = actor();
  write({
    ...state,
    incidents: state.incidents.map((i) =>
      i.id === id
        ? {
            ...i,
            media: [...(i.media ?? []), ...media],
            log: [
              ...i.log,
              {
                at,
                by,
                text: "{n} files attached.",
                vars: { n: String(media.length) },
              },
            ],
          }
        : i,
    ),
  });
}

/**
 * A reporter coming back with more: something they remembered, a photo they
 * found. It reaches the call, the case if there is one, and their own copy.
 *
 * ponytail: anyone holding the reference can add to it. The server should ask
 * for the phone number or email the report was made with, as UK forces' online
 * "add information" forms do.
 */
export function addToReport(ref: string, text: string, media: Media[]) {
  const at = now();
  const id = ref.trim().toUpperCase();
  const incident = state.incidents.find((i) => i.id.toUpperCase() === id);
  if (!incident) return false;
  const lines: LogLine[] = [];
  if (text) lines.push({ at, by: "Reporter", text: "Reporter added: {text}", vars: { text } });
  if (media.length)
    lines.push({
      at,
      by: "Reporter",
      text: "Reporter attached {n} files.",
      vars: { n: String(media.length) },
    });
  write({
    ...state,
    incidents: state.incidents.map((i) =>
      i.id === incident.id
        ? {
            ...i,
            media: [...(i.media ?? []), ...media],
            evidence: [...(i.evidence ?? []), ...media.map((m) => m.name)],
            log: [...i.log, ...lines],
          }
        : i,
    ),
    cases: state.cases.map((c) =>
      c.id === incident.caseId ? { ...c, updated: at, log: [...c.log, ...lines] } : c,
    ),
    requests: state.requests.map((r) =>
      r.incident === incident.id
        ? {
            ...r,
            updated: at,
            documents: [
              ...(r.documents ?? []),
              ...media.map((m) => ({ label: "Evidence", file: m.name })),
            ],
            timeline: [...r.timeline, { at, label: "You added information", note: text || undefined }],
          }
        : r,
    ),
  });
  return true;
}

/** A unit going off the air, or back on it, without a call being involved. */
export function setUnitStatus(callsign: string, status: UnitStatus) {
  const at = now();
  write({
    ...state,
    units: releaseHeldOver(state.units, at).map((u) =>
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

/**
 * The officer's emergency button. On a live system the radio sends it; here
 * the Units board does. It puts a P1 "Officer needs assistance" call at the
 * top of that command's queue, at the unit's last position, and the console
 * shows a banner on every screen until a supervisor stands it down.
 */
export function raiseEmergency(callsign: string) {
  const u = state.units.find((x) => x.callsign === callsign);
  if (!u || u.emergency) return;
  const lgas = STATES.find((s) => s.name === u.state)?.lgas ?? [];
  const call = logIncident({
    kind: "Officer needs assistance",
    priority: "P1",
    area: u.area,
    summary: `Emergency button pressed by ${u.callsign} (${u.officer}). Send the nearest units.`,
    source: "Radio emergency",
    where: jurisdiction(u.state, u.base ?? lgas[0] ?? "", u.area, u.geo),
    flags: ["Officer safety risk"],
  });
  write({
    ...state,
    units: state.units.map((x) =>
      x.callsign === callsign ? { ...x, emergency: call.id } : x,
    ),
  });
  return call;
}

/** A supervisor standing an emergency down once the officer is safe. */
export function clearEmergency(callsign: string) {
  const at = now();
  const u = state.units.find((x) => x.callsign === callsign);
  if (!u?.emergency) return;
  write({
    ...state,
    units: state.units.map((x) =>
      x.callsign === callsign ? { ...x, emergency: null } : x,
    ),
    incidents: state.incidents.map((i) =>
      i.id === u.emergency
        ? {
            ...i,
            log: [
              ...i.log,
              { at, by: actor(), text: "Emergency stood down: {unit} is safe.", vars: { unit: callsign } },
            ],
          }
        : i,
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
      Pick<
        Incident,
        | "occurred"
        | "reporter"
        | "injuries"
        | "evidence"
        | "media"
        | "flags"
        | "lang"
        | "onBehalf"
      >
    >,
): Incident {
  const at = now();
  const by = state.session?.role === "officer" ? actor() : "System";
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
        by,
        text: "Call received via {source}.",
        vars: { source: input.source },
      },
      {
        at,
        by: "System",
        text: "Routed to {command}, {division}.",
        vars: routeVars(input.where),
      },
    ],
  };
  write({ ...state, incidents: [created, ...state.incidents] });
  return created;
}

/* -------------------------------------------------------------------------
 * Case files
 * ---------------------------------------------------------------------- */

/** "Akwa Ibom" → "AKW", "FCT" → "FCT": the state part of a crime reference. */
export const stateCode = (state: string) =>
  state.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase();

/**
 * Opening a case file, usually from a call. The call points at the case, the
 * reporter's copy says investigators have it, and the case starts its own
 * history with who opened it.
 */
export function openCase(input: {
  incident?: string;
  offence: string;
  summary: string;
  where: Jurisdiction;
  people?: CaseFile["people"];
  ipo?: string | null;
}): CaseFile {
  const at = now();
  const by = actor();
  const year = new Date().getFullYear();
  const prefix = `CR/${stateCode(input.where.state)}/${year}/`;
  const id = nextId(
    prefix,
    state.cases.filter((c) => c.id.startsWith(prefix)).map((c) => c.id),
    100,
  );
  const created: CaseFile = {
    id,
    incident: input.incident,
    offence: input.offence,
    summary: input.summary,
    where: input.where,
    opened: at,
    updated: at,
    stage: "Investigating",
    ipo: input.ipo ?? null,
    people: input.people ?? [],
    statements: [],
    exhibits: [],
    updates: [],
    log: [
      input.incident
        ? { at, by, text: "Case opened from call {ref}.", vars: { ref: input.incident } }
        : { at, by, text: "Case opened." },
      ...(input.ipo
        ? [{ at, by, text: "Assigned to {ipo}.", vars: { ipo: input.ipo } }]
        : []),
    ],
  };
  const call = input.incident
    ? state.incidents.find((i) => i.id === input.incident)
    : undefined;
  // Media the reporter and the officers attached to the call come across as
  // exhibits, each with its trail starting at the call.
  if (call?.media?.length)
    created.exhibits = call.media.map((m, n) => ({
      id: `EX-${n + 1}`,
      label: m.name,
      media: m,
      trail: [
        { at: m.at, by: m.by, action: "Received with the report" },
        { at, by, action: "Booked in as an exhibit" },
      ],
    }));
  write({
    ...state,
    cases: [created, ...state.cases],
    incidents: state.incidents.map((i) =>
      i.id === input.incident
        ? {
            ...i,
            caseId: id,
            log: [...i.log, { at, by, text: "Case file {case} opened.", vars: { case: id } }],
          }
        : i,
    ),
    requests: state.requests.map((r) =>
      input.incident && r.incident === input.incident
        ? {
            ...r,
            status: r.status === "Completed" ? "In Review" : r.status,
            updated: at,
            timeline: [
              ...r.timeline,
              { at, label: "Passed to investigators", note: "Crime reference {case}.", vars: { case: id } },
            ],
          }
        : r,
    ),
    notices: input.incident && state.requests.some((r) => r.incident === input.incident)
      ? [notice("Passed to investigators", input.incident, "Crime reference {case}.", { case: id }), ...state.notices]
      : state.notices,
  });
  return created;
}

/**
 * Any change to a case, with the line it writes. Stage and officer changes
 * write their own lines; everything else passes `line`.
 */
export function updateCase(
  id: string,
  patch: Partial<CaseFile>,
  line?: { text: string; vars?: Record<string, string> },
) {
  const at = now();
  const by = actor();
  const before = state.cases.find((c) => c.id === id);
  if (!before) return;
  const lines: LogLine[] = [];
  if (patch.stage && patch.stage !== before.stage)
    lines.push({ at, by, text: "Stage: {stage}.", vars: { stage: patch.stage } });
  if (patch.ipo !== undefined && patch.ipo !== before.ipo)
    lines.push(
      patch.ipo
        ? { at, by, text: "Assigned to {ipo}.", vars: { ipo: patch.ipo } }
        : { at, by, text: "Officer removed." },
    );
  if (line) lines.push({ at, by, ...line });
  const after = { ...before, ...patch, updated: at, log: [...before.log, ...lines] };
  // Whoever reported it hears when the case is charged or closed.
  const stageNote =
    patch.stage && patch.stage !== before.stage
      ? patch.stage === "Charged to court"
        ? "Charged to court"
        : patch.stage === "Closed"
          ? "Investigation closed"
          : "Investigation reopened"
      : null;
  write({
    ...state,
    cases: state.cases.map((c) => (c.id === id ? after : c)),
    requests: stageNote
      ? state.requests.map((r) =>
          before.incident && r.incident === before.incident
            ? {
                ...r,
                status: patch.stage === "Investigating" ? "In Review" : "Completed",
                updated: at,
                timeline: [...r.timeline, { at, label: stageNote, note: patch.result }],
              }
            : r,
        )
      : state.requests,
    notices:
      stageNote && state.requests.some((r) => before.incident && r.incident === before.incident)
        ? [notice(stageNote, before.id, patch.result), ...state.notices]
        : state.notices,
  });
}

/**
 * A message to the complainant: what the investigation has done, in plain
 * words. The Victims' Code in England and Wales sets this as a right; here it
 * is how the person who reported a crime stops having to ring the station.
 */
export function updateComplainant(id: string, text: string) {
  const at = now();
  const c = state.cases.find((x) => x.id === id);
  if (!c) return;
  write({
    ...state,
    cases: state.cases.map((x) =>
      x.id === id
        ? {
            ...x,
            updated: at,
            updates: [...x.updates, { at, text }],
            log: [...x.log, { at, by: actor(), text: "Complainant updated: {text}", vars: { text } }],
          }
        : x,
    ),
    requests: state.requests.map((r) =>
      c.incident && r.incident === c.incident
        ? {
            ...r,
            updated: at,
            timeline: [...r.timeline, { at, label: "Update from the investigator", note: text }],
          }
        : r,
    ),
    notices: state.requests.some((r) => c.incident && r.incident === c.incident)
      ? [notice("Update from the investigator", c.id, text), ...state.notices]
      : state.notices,
  });
}

/** An exhibit booked into the case, or moved on along its chain. */
export function addExhibit(id: string, label: string, media?: Media) {
  const c = state.cases.find((x) => x.id === id);
  if (!c) return;
  const at = now();
  const by = actor();
  const exhibit = {
    id: nextId("EX-", c.exhibits.map((e) => e.id), 0, 1),
    label,
    media,
    trail: [{ at, by, action: "Booked in as an exhibit" }],
  };
  updateCase(
    id,
    { exhibits: [...c.exhibits, exhibit] },
    { text: "Exhibit {ex} booked in: {label}.", vars: { ex: exhibit.id, label } },
  );
}

export function moveExhibit(id: string, exhibit: string, action: string) {
  const c = state.cases.find((x) => x.id === id);
  if (!c) return;
  const at = now();
  const by = actor();
  updateCase(
    id,
    {
      exhibits: c.exhibits.map((e) =>
        e.id === exhibit ? { ...e, trail: [...e.trail, { at, by, action }] } : e,
      ),
    },
    { text: "Exhibit {ex}: {action}.", vars: { ex: exhibit, action } },
  );
}

/* -------------------------------------------------------------------------
 * Custody
 * ---------------------------------------------------------------------- */

/** Hours the Constitution allows before a suspect is charged or released. */
export const custodyLimit = (d: Pick<Detainee, "courtNear">) =>
  d.courtNear ? 24 : 48;

/** Booking a suspect into the cells: one line of the register of arrests. */
export function bookIn(
  input: Omit<Detainee, "id" | "booked" | "by" | "status" | "checks" | "log">,
): Detainee {
  const at = now();
  const by = actor();
  const created: Detainee = {
    ...input,
    id: nextId("DET-", state.custody.map((d) => d.id), 100),
    booked: at,
    by,
    status: "In custody",
    checks: [],
    log: [{ at, by, text: "Booked into custody." }],
  };
  write({
    ...state,
    custody: [created, ...state.custody],
    cases: state.cases.map((c) =>
      c.id === input.caseId
        ? {
            ...c,
            updated: at,
            people: c.people.some((p) => p.name === input.name)
              ? c.people
              : [...c.people, { role: "Suspect", name: input.name, detail: "In custody" }],
            log: [...c.log, { at, by, text: "{name} booked into custody as {id}.", vars: { name: input.name, id: created.id } }],
          }
        : c,
    ),
  });
  return created;
}

/** A change on the register: rights given, released, charged, bailed. */
export function updateDetainee(
  id: string,
  patch: Partial<Detainee>,
  line?: { text: string; vars?: Record<string, string> },
) {
  const at = now();
  const by = actor();
  write({
    ...state,
    custody: state.custody.map((d) => {
      if (d.id !== id) return d;
      const lines: LogLine[] = [];
      if (patch.status && patch.status !== d.status)
        lines.push({ at, by, text: "Status: {status}.", vars: { status: patch.status } });
      if (line) lines.push({ at, by, ...line });
      return {
        ...d,
        ...patch,
        released:
          patch.status && patch.status !== "In custody" ? at : patch.status ? undefined : d.released,
        log: [...d.log, ...lines],
      };
    }),
  });
}

/** A cell visit: the officer saw the detainee and noted their condition. */
export function welfareCheck(id: string, note: string) {
  const at = now();
  const by = actor();
  write({
    ...state,
    custody: state.custody.map((d) =>
      d.id === id ? { ...d, checks: [...d.checks, { at, by, note }] } : d,
    ),
  });
}

/* -------------------------------------------------------------------------
 * Alerts and the public's tips
 * ---------------------------------------------------------------------- */

export function issueAlert(
  input: Pick<
    Alert,
    "kind" | "title" | "details" | "plate" | "names" | "photo" | "scope" | "public" | "incident" | "consent"
  >,
): Alert {
  const created: Alert = {
    ...input,
    id: nextId("BOL-", state.alerts.map((a) => a.id), 0),
    issued: now(),
    by: actor(),
    active: true,
    tips: [],
  };
  write({ ...state, alerts: [created, ...state.alerts] });
  return created;
}

export function updateAlert(id: string, patch: Partial<Alert>) {
  write({
    ...state,
    alerts: state.alerts.map((a) => (a.id === id ? { ...a, ...patch } : a)),
  });
}

/** Information from the public about an appeal. Anonymous unless they say. */
export function sendTip(id: string, text: string, contact?: string) {
  const at = now();
  write({
    ...state,
    alerts: state.alerts.map((a) =>
      a.id === id ? { ...a, tips: [...a.tips, { at, text, contact }] } : a,
    ),
  });
}

/** Wipes the demo back to its seeded state, session included. */
export function resetDemo() {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
  write(fresh());
}

/**
 * Files added to a request after it was sent: what the applicant was asked
 * for, or a document the officer adds to the file (a scanned form, the
 * signed certificate). Kept by name here, like the application's own.
 */
export function attachToRequest(id: string, files: string[]) {
  if (!files.length) return;
  const at = now();
  const officer = state.session?.role === "officer";
  write({
    ...state,
    requests: state.requests.map((r) =>
      r.id === id
        ? {
            ...r,
            updated: at,
            documents: [
              ...(r.documents ?? []),
              ...files.map((file) => ({
                label: officer ? "Added by the officer" : "Sent with the reply",
                file,
              })),
            ],
            timeline: [
              ...r.timeline,
              { at, label: "Documents added", note: files.join(", ") },
            ],
          }
        : r,
    ),
  });
}

/** A unit taking the next relief's crew: the officer changes, the car stays. */
const crewed = (u: Unit, to: Relief, at: string): Unit => ({
  ...u,
  relief: to,
  heldOver: undefined,
  officer: u.crew?.[to] ?? u.officer,
  since: at,
});

/**
 * The shift handover: every unit in view takes the incoming relief's crew.
 * A unit still on a call keeps its officers until the call clears (they are
 * "held over", as control rooms say), and changes over then.
 */
export function handOver(callsigns: string[], to: Relief) {
  const at = now();
  const mine = new Set(callsigns);
  write({
    ...state,
    units: state.units.map((u) => {
      if (!mine.has(u.callsign) || u.relief === to) return u;
      const busy = u.status === "Assigned" || u.status === "On Scene";
      return busy ? { ...u, heldOver: to } : crewed(u, to, at);
    }),
  });
}

/** Units that were held over change crew as they come back on the air. */
function releaseHeldOver(units: Unit[], at: string) {
  return units.map((u) =>
    u.heldOver && u.status === "Available" ? crewed(u, u.heldOver, at) : u,
  );
}

/**
 * A unit's position, sent from the officer's own phone: the stand-in for a
 * radio's GPS until the Force's vehicle-location feed is connected.
 */
export function reportPosition(callsign: string, geo: Geo) {
  const at = now();
  write({
    ...state,
    units: state.units.map((u) =>
      u.callsign === callsign ? { ...u, geo, fixAt: at } : u,
    ),
  });
}

/**
 * Booking (or moving) the visit where a command takes the applicant's
 * fingerprints and photograph. The command sees it on the request.
 */
export function bookAppointment(id: string, at: string) {
  const now_ = now();
  write({
    ...state,
    requests: state.requests.map((r) =>
      r.id === id
        ? {
            ...r,
            appointment: at,
            updated: now_,
            timeline: [
              ...r.timeline,
              { at: now_, label: r.appointment ? "Appointment moved" : "Appointment booked" },
            ],
          }
        : r,
    ),
  });
}
