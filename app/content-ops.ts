import type { Incident } from "./components/store";

/**
 * Sample rows for the operations console. Nothing here is real Dubai Police
 * data — no operational feed is public — so these are illustrative incidents
 * on real Dubai place names, and the console says as much on every screen.
 *
 * Fixed timestamps, for the same hydration reason as the account seeds.
 */

export const seedIncidents: Incident[] = [
  {
    id: "DXB-4417",
    kind: "Assault",
    priority: "Critical",
    area: "Al Barsha 1",
    reported: "2026-09-14T11:52:00.000Z",
    status: "Dispatched",
    assignee: "Sgt. R. Al Marri",
    unit: "Patrol 12",
    summary: "Two parties in a physical altercation outside a retail unit.",
    source: "999 call",
  },
  {
    id: "DXB-4416",
    kind: "Theft",
    priority: "High",
    area: "Deira, Al Rigga",
    reported: "2026-09-14T11:41:00.000Z",
    status: "On Scene",
    assignee: "Cpl. H. Suleiman",
    unit: "Patrol 04",
    summary: "Handbag taken from a parked vehicle. CCTV available on site.",
    source: "Police Eye",
  },
  {
    id: "DXB-4415",
    kind: "Road traffic collision",
    priority: "High",
    area: "Sheikh Zayed Road, Interchange 3",
    reported: "2026-09-14T11:28:00.000Z",
    status: "On Scene",
    assignee: "Sgt. A. Khalifa",
    unit: "Traffic 07",
    summary: "Three vehicles, one lane blocked. No injuries reported.",
    source: "Dubai Police App",
  },
  {
    id: "DXB-4414",
    kind: "Noise disturbance",
    priority: "Low",
    area: "Jumeirah 2",
    reported: "2026-09-14T11:05:00.000Z",
    status: "New",
    assignee: null,
    unit: null,
    summary: "Repeat complaint about late construction work.",
    source: "Website report",
  },
  {
    id: "DXB-4413",
    kind: "Suspicious vehicle",
    priority: "Medium",
    area: "Al Quoz Industrial 3",
    reported: "2026-09-14T10:47:00.000Z",
    status: "New",
    assignee: null,
    unit: null,
    summary: "Vehicle parked across a loading bay for six hours.",
    source: "Police Eye",
  },
  {
    id: "DXB-4412",
    kind: "Cybercrime report",
    priority: "Medium",
    area: "Business Bay",
    reported: "2026-09-14T10:22:00.000Z",
    status: "Dispatched",
    assignee: "Lt. N. Bin Haider",
    unit: "e-Crime desk",
    summary: "Work-visa scam reported by three complainants in one week.",
    source: "eCrime",
  },
  {
    id: "DXB-4411",
    kind: "Lost child",
    priority: "Critical",
    area: "Dubai Mall, Lower Ground",
    reported: "2026-09-14T09:58:00.000Z",
    status: "Closed",
    assignee: "Sgt. M. Al Zaabi",
    unit: "Patrol 21",
    summary: "Child reunited with family after 14 minutes.",
    source: "999 call",
  },
  {
    id: "DXB-4410",
    kind: "Shoplifting",
    priority: "Low",
    area: "Mirdif City Centre",
    reported: "2026-09-14T09:31:00.000Z",
    status: "Closed",
    assignee: "Cpl. F. Darwish",
    unit: "Patrol 09",
    summary: "Goods recovered, complainant declined to press charges.",
    source: "Walk-in",
  },
  {
    id: "DXB-4409",
    kind: "Road traffic collision",
    priority: "Medium",
    area: "Al Khail Road, near Al Quoz",
    reported: "2026-09-14T08:54:00.000Z",
    status: "Closed",
    assignee: "Sgt. A. Khalifa",
    unit: "Traffic 07",
    summary: "Minor collision cleared through the self-report service.",
    source: "Dubai Police App",
  },
  {
    id: "DXB-4408",
    kind: "Fraud report",
    priority: "High",
    area: "Jebel Ali",
    reported: "2026-09-14T08:12:00.000Z",
    status: "Dispatched",
    assignee: "Lt. N. Bin Haider",
    unit: "e-Crime desk",
    summary: "Supplier invoice interception at a freight company.",
    source: "eCrime",
  },
  {
    id: "DXB-4407",
    kind: "Marine assistance",
    priority: "Medium",
    area: "Dubai Creek Harbour",
    reported: "2026-09-14T07:40:00.000Z",
    status: "Closed",
    assignee: "Sgt. Y. Al Hammadi",
    unit: "Marine 02",
    summary: "Recreational craft towed in after engine failure.",
    source: "999 call",
  },
  {
    id: "DXB-4406",
    kind: "Missing person",
    priority: "High",
    area: "Al Nahda 2",
    reported: "2026-09-14T06:55:00.000Z",
    status: "On Scene",
    assignee: "Lt. S. Al Suwaidi",
    unit: "Patrol 17",
    summary: "Adult missing since the previous evening; enquiries ongoing.",
    source: "Walk-in",
  },
];

/** The station roster the assignment control picks from. */
export const officers = [
  "Sgt. R. Al Marri",
  "Cpl. H. Suleiman",
  "Sgt. A. Khalifa",
  "Lt. N. Bin Haider",
  "Sgt. M. Al Zaabi",
  "Cpl. F. Darwish",
  "Sgt. Y. Al Hammadi",
  "Lt. S. Al Suwaidi",
];

export const units = [
  "Patrol 04",
  "Patrol 09",
  "Patrol 12",
  "Patrol 17",
  "Patrol 21",
  "Traffic 07",
  "Marine 02",
  "Air Wing 01",
  "e-Crime desk",
];

/**
 * Response times for the last twelve hours, in minutes. Illustrative, and
 * labelled that way wherever it is drawn.
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

/** Units on duty by division, for the readiness strip. */
export const deployment = [
  { division: "Patrol", onDuty: 24, available: 9 },
  { division: "Traffic", onDuty: 11, available: 4 },
  { division: "Marine", onDuty: 4, available: 2 },
  { division: "Air Wing", onDuty: 3, available: 3 },
  { division: "e-Crime", onDuty: 6, available: 5 },
];
