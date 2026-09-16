import type { Incident, Unit } from "./components/store";

/**
 * Sample rows for the operations console. Nothing here is real Dubai Police
 * data — no operational feed is public — so these are illustrative calls on
 * real Dubai place names, and the console says as much on every screen.
 *
 * Times are offsets in minutes rather than fixed strings, so a call taken
 * "four minutes ago" reads that way whenever the demo is opened and the
 * elapsed clocks on the board have something honest to count. Nothing below
 * reaches the server render — the console's credential guard holds the first
 * paint — so resolving them against the local clock cannot desync hydration.
 */
const minutesAgo = (m: number) =>
  new Date(Date.now() - m * 60_000).toISOString();

type Seed = Omit<
  Incident,
  "reported" | "dispatched" | "onScene" | "closed" | "log"
> & {
  /** Minutes before now: call taken, unit assigned, unit arrived, closed. */
  at: [number, number | null, number | null, number | null];
  notes: [number, string][];
};

const SEEDS: Seed[] = [
  {
    id: "DXB-4417",
    kind: "Assault",
    priority: "P1",
    area: "Al Barsha 1",
    at: [4, null, null, null],
    status: "New",
    assignee: null,
    unit: null,
    summary:
      "Two parties in a physical altercation outside a retail unit. Caller reports one party holding a bottle.",
    source: "999 call",
    notes: [[4, "Caller still on the line. Ambulance notified."]],
  },
  {
    id: "DXB-4416",
    kind: "Road traffic collision",
    priority: "P2",
    area: "Sheikh Zayed Road, Interchange 3",
    at: [9, null, null, null],
    status: "New",
    assignee: null,
    unit: null,
    summary:
      "Three vehicles, second lane blocked. No injuries reported. RTA notified for the lane closure.",
    source: "Dubai Police App",
    notes: [[8, "Two further callers reporting the same collision."]],
  },
  {
    id: "DXB-4415",
    kind: "Theft",
    priority: "P2",
    area: "Deira, Al Rigga",
    at: [21, 19, 12, null],
    status: "On Scene",
    assignee: "Cpl. H. Suleiman",
    unit: "Patrol 04",
    summary: "Handbag taken from a parked vehicle. CCTV available on site.",
    source: "Police Eye",
    notes: [[11, "Store manager pulling camera footage for the last hour."]],
  },
  {
    id: "DXB-4414",
    kind: "Missing person",
    priority: "P2",
    area: "Al Nahda 2",
    at: [34, 31, 24, null],
    status: "On Scene",
    assignee: "Lt. S. Al Suwaidi",
    unit: "Patrol 17",
    summary:
      "Adult missing since the previous evening. Family at the address, enquiries ongoing.",
    source: "Walk-in",
    notes: [[22, "Last known location traced to Al Nahda Pond Park."]],
  },
  {
    id: "DXB-4413",
    kind: "Suspicious vehicle",
    priority: "P3",
    area: "Al Quoz Industrial 3",
    at: [48, 44, null, null],
    status: "Dispatched",
    assignee: "Sgt. A. Khalifa",
    unit: "Traffic 07",
    summary: "Vehicle parked across a loading bay for six hours.",
    source: "Police Eye",
    notes: [],
  },
  {
    id: "DXB-4412",
    kind: "Fraud report",
    priority: "P2",
    area: "Jebel Ali",
    at: [63, 58, null, null],
    status: "Dispatched",
    assignee: "Lt. N. Bin Haider",
    unit: "e-Crime 01",
    summary: "Supplier invoice interception at a freight company.",
    source: "eCrime",
    notes: [[57, "Complainant asked to preserve the original email headers."]],
  },
  {
    id: "DXB-4411",
    kind: "Noise disturbance",
    priority: "P4",
    area: "Jumeirah 2",
    at: [86, null, null, null],
    status: "New",
    assignee: null,
    unit: null,
    summary: "Repeat complaint about late construction work.",
    source: "Website report",
    notes: [[86, "Fourth report from this address this month."]],
  },
  {
    id: "DXB-4410",
    kind: "Lost child",
    priority: "P1",
    area: "Dubai Mall, Lower Ground",
    at: [124, 122, 117, 108],
    status: "Closed",
    assignee: "Sgt. M. Al Zaabi",
    unit: "Patrol 21",
    summary: "Child reunited with family after fourteen minutes.",
    source: "999 call",
    notes: [[109, "Reunited with the mother at the information desk."]],
  },
  {
    id: "DXB-4409",
    kind: "Shoplifting",
    priority: "P4",
    area: "Mirdif City Centre",
    at: [151, 144, 131, 119],
    status: "Closed",
    assignee: "Cpl. F. Darwish",
    unit: "Patrol 09",
    summary: "Goods recovered, complainant declined to press charges.",
    source: "Walk-in",
    notes: [],
  },
  {
    id: "DXB-4408",
    kind: "Marine assistance",
    priority: "P3",
    area: "Dubai Creek Harbour",
    at: [188, 183, 168, 142],
    status: "Closed",
    assignee: "Sgt. Y. Al Hammadi",
    unit: "Marine 02",
    summary: "Recreational craft towed in after engine failure.",
    source: "999 call",
    notes: [],
  },
  {
    id: "DXB-4407",
    kind: "Road traffic collision",
    priority: "P3",
    area: "Al Khail Road, near Al Quoz",
    at: [232, 226, 214, 199],
    status: "Closed",
    assignee: "Sgt. A. Khalifa",
    unit: "Traffic 07",
    summary: "Minor collision cleared through the self-report service.",
    source: "Dubai Police App",
    notes: [],
  },
  {
    id: "DXB-4406",
    kind: "Cybercrime report",
    priority: "P3",
    area: "Business Bay",
    at: [281, 274, null, 236],
    status: "Closed",
    assignee: "Lt. N. Bin Haider",
    unit: "e-Crime 01",
    summary: "Work-visa scam reported by three complainants in one week.",
    source: "eCrime",
    notes: [[240, "Referred to the cybercrime investigation desk."]],
  },
];

export const seedIncidents = (): Incident[] =>
  SEEDS.map(({ at: [r, d, s, c], notes, ...rest }) => ({
    ...rest,
    reported: minutesAgo(r),
    dispatched: d === null ? null : minutesAgo(d),
    onScene: s === null ? null : minutesAgo(s),
    closed: c === null ? null : minutesAgo(c),
    log: (
      [
        {
          at: minutesAgo(r),
          text: "Call received via {source}.",
          vars: { source: rest.source },
        },
        ...(d === null
          ? []
          : [
              {
                at: minutesAgo(d),
                text: "Dispatched — {unit}.",
                vars: { unit: rest.unit ?? "" },
              },
            ]),
        ...(s === null
          ? []
          : [
              {
                at: minutesAgo(s),
                text: "Arrived on scene — {unit}.",
                vars: { unit: rest.unit ?? "" },
              },
            ]),
        ...notes.map(([m, text]) => ({ at: minutesAgo(m), text })),
        ...(c === null
          ? []
          : [
              {
                at: minutesAgo(c),
                text: "Call closed — {unit}.",
                vars: { unit: rest.unit ?? "" },
              },
            ]),
      ] as Incident["log"]
    ).sort((a, b) => a.at.localeCompare(b.at)),
  }));

type UnitSeed = Omit<Unit, "since"> & { sinceMins: number };

/**
 * The shift roster. Every callsign here is one an incident can be assigned
 * to, so the two boards are drawn from a single list rather than two that
 * drift apart.
 */
const UNITS: UnitSeed[] = [
  {
    callsign: "Patrol 04",
    division: "Patrol",
    officer: "Cpl. H. Suleiman",
    status: "On Scene",
    sinceMins: 12,
    incident: "DXB-4415",
    area: "Deira, Al Rigga",
  },
  {
    callsign: "Patrol 09",
    division: "Patrol",
    officer: "Cpl. F. Darwish",
    status: "Available",
    sinceMins: 119,
    incident: null,
    area: "Mirdif",
  },
  {
    callsign: "Patrol 12",
    division: "Patrol",
    officer: "Sgt. R. Al Marri",
    status: "Available",
    sinceMins: 6,
    incident: null,
    area: "Al Barsha",
  },
  {
    callsign: "Patrol 17",
    division: "Patrol",
    officer: "Lt. S. Al Suwaidi",
    status: "On Scene",
    sinceMins: 24,
    incident: "DXB-4414",
    area: "Al Nahda 2",
  },
  {
    callsign: "Patrol 21",
    division: "Patrol",
    officer: "Sgt. M. Al Zaabi",
    status: "Available",
    sinceMins: 108,
    incident: null,
    area: "Downtown Dubai",
  },
  {
    callsign: "Patrol 26",
    division: "Patrol",
    officer: "Cpl. K. Al Blooshi",
    status: "Unavailable",
    sinceMins: 41,
    incident: null,
    area: "Al Rashidiya — refuelling",
  },
  {
    callsign: "Traffic 07",
    division: "Traffic",
    officer: "Sgt. A. Khalifa",
    status: "Assigned",
    sinceMins: 44,
    incident: "DXB-4413",
    area: "Al Quoz",
  },
  {
    callsign: "Traffic 11",
    division: "Traffic",
    officer: "Cpl. M. Al Ali",
    status: "Available",
    sinceMins: 17,
    incident: null,
    area: "Sheikh Zayed Road",
  },
  {
    callsign: "Marine 02",
    division: "Marine",
    officer: "Sgt. Y. Al Hammadi",
    status: "Available",
    sinceMins: 142,
    incident: null,
    area: "Dubai Creek",
  },
  {
    callsign: "Air Wing 01",
    division: "Air Wing",
    officer: "Capt. O. Al Falasi",
    status: "Available",
    sinceMins: 203,
    incident: null,
    area: "Al Minhad — standby",
  },
  {
    callsign: "K9 03",
    division: "K9",
    officer: "Cpl. T. Rashed",
    status: "Unavailable",
    sinceMins: 88,
    incident: null,
    area: "Al Qusais — training",
  },
  {
    callsign: "e-Crime 01",
    division: "e-Crime",
    officer: "Lt. N. Bin Haider",
    status: "Assigned",
    sinceMins: 58,
    incident: "DXB-4412",
    area: "Jebel Ali",
  },
];

export const seedUnits = (): Unit[] =>
  UNITS.map(({ sinceMins, ...rest }) => ({
    ...rest,
    since: minutesAgo(sinceMins),
  }));

/** The roster the assignment controls pick from. */
export const officers = UNITS.map((u) => u.officer).sort();
export const units = UNITS.map((u) => u.callsign);

/** Call types the desk can log, in the order the desk reaches for them. */
export const callTypes = [
  "Road traffic collision",
  "Assault",
  "Theft",
  "Suspicious vehicle",
  "Missing person",
  "Noise disturbance",
  "Fraud report",
  "Cybercrime report",
  "Marine assistance",
  "Lost child",
  "Shoplifting",
];

export const callSources = [
  "999 call",
  "Dubai Police App",
  "Police Eye",
  "Walk-in",
  "Website report",
  "eCrime",
];

/**
 * Median response time by hour over the day, in minutes — the number the duty
 * supervisor is measured on. Illustrative, and labelled that way where drawn.
 */
export const responseTrend = [
  { hour: "00", minutes: 5.1 },
  { hour: "02", minutes: 4.6 },
  { hour: "04", minutes: 4.2 },
  { hour: "06", minutes: 3.9 },
  { hour: "08", minutes: 5.4 },
  { hour: "10", minutes: 6.1 },
  { hour: "12", minutes: 5.2 },
  { hour: "14", minutes: 4.4 },
  { hour: "16", minutes: 4.8 },
  { hour: "18", minutes: 6.3 },
  { hour: "20", minutes: 5.0 },
  { hour: "22", minutes: 4.3 },
];

/**
 * Minutes a call of each grade may wait for a unit. A pending call past its
 * target is the one thing on the board that has to be impossible to miss.
 */
export const dispatchTarget: Record<Incident["priority"], number> = {
  P1: 5,
  P2: 10,
  P3: 30,
  P4: 120,
};
