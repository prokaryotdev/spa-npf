import type { Fine, Notice, TrackedRequest } from "./components/store";

/**
 * Sample rows for the signed-in portal. Nothing here came from Nigeria Police Force —
 * there is no account API behind this build, so the screens are seeded with
 * illustrative records and say so on the page.
 *
 * Dates are fixed rather than relative: a "3 days ago" computed at render time
 * differs between the server and the client and breaks hydration.
 */

export const seedRequests: TrackedRequest[] = [
  {
    id: "NPF-2026-4417",
    slug: "police-clearance-certificate",
    service: "Police Clearance Certificate",
    status: "In Review",
    submitted: "2026-09-08T09:12:00.000Z",
    updated: "2026-09-11T14:40:00.000Z",
    fee: "₦88,000",
    channel: "Nigeria Police Force Website",
    timeline: [
      {
        at: "2026-09-08T09:12:00.000Z",
        label: "Submitted",
        note: "Received by Nigeria Police Force.",
      },
      {
        at: "2026-09-09T08:05:00.000Z",
        label: "Documents verified",
        note: "NIN and passport copy accepted.",
      },
      {
        at: "2026-09-11T14:40:00.000Z",
        label: "In review",
        note: "With the Criminal Records department.",
      },
    ],
  },
  {
    id: "NPF-2026-4102",
    slug: "hqvisit",
    service: "HQ Entry Permit",
    status: "Action Needed",
    submitted: "2026-09-02T11:30:00.000Z",
    updated: "2026-09-05T10:15:00.000Z",
    fee: "Free of Charge",
    channel: "Nigeria Police Force App",
    note: "The visit date you chose is a public holiday. Pick another date.",
    timeline: [
      { at: "2026-09-02T11:30:00.000Z", label: "Submitted" },
      {
        at: "2026-09-05T10:15:00.000Z",
        label: "Action needed",
        note: "The visit date you chose is a public holiday. Pick another date.",
      },
    ],
  },
  {
    id: "NPF-2026-3866",
    slug: "report-lost-item",
    service: "Report Lost Item",
    status: "Completed",
    submitted: "2026-08-19T16:45:00.000Z",
    updated: "2026-08-24T12:00:00.000Z",
    fee: "Free of Charge",
    channel: "Nigeria Police Force Website",
    timeline: [
      { at: "2026-08-19T16:45:00.000Z", label: "Submitted" },
      {
        at: "2026-08-21T09:20:00.000Z",
        label: "Matched",
        note: "A matching item was handed in at Asokoro station.",
      },
      {
        at: "2026-08-24T12:00:00.000Z",
        label: "Completed",
        note: "Collected. Case closed.",
      },
    ],
  },
  {
    id: "NPF-2026-3401",
    slug: "traffic-status-certificate",
    service: "Traffic Status Certificate",
    status: "Completed",
    submitted: "2026-07-30T07:10:00.000Z",
    updated: "2026-07-30T07:12:00.000Z",
    fee: "₦48,000",
    channel: "Divisional Police Station",
    timeline: [
      { at: "2026-07-30T07:10:00.000Z", label: "Submitted" },
      {
        at: "2026-07-30T07:12:00.000Z",
        label: "Issued",
        note: "Certificate available to download.",
      },
    ],
  },
];

export const seedFines: Fine[] = [
  {
    id: "TF-88214",
    reason: "Exceeding the speed limit by 20 km/h",
    amount: 300,
    issued: "2026-09-06T18:22:00.000Z",
    location: "Nnamdi Azikiwe Expressway, before Junction 3",
    points: 0,
    paid: false,
  },
  {
    id: "TF-87003",
    reason: "Parking in a space reserved for persons with disabilities",
    amount: 1000,
    issued: "2026-08-28T13:05:00.000Z",
    location: "Wuse 1",
    points: 6,
    paid: false,
  },
  {
    id: "TF-85517",
    reason: "Using a mobile phone while driving",
    amount: 800,
    issued: "2026-07-14T08:41:00.000Z",
    location: "Outer Southern Expressway",
    points: 4,
    paid: true,
  },
];

export const seedNotices: Notice[] = [
  {
    id: "N-9001",
    title: "Your Police Clearance Certificate moved to review",
    body: "Request NPF-2026-4417 is with the Criminal Records department. No action is needed from you.",
    at: "2026-09-11T14:40:00.000Z",
    read: false,
  },
  {
    id: "N-9000",
    title: "HQ Entry Permit needs a new date",
    body: "The date you chose falls on a public holiday. Open the request to pick another one.",
    at: "2026-09-05T10:15:00.000Z",
    read: false,
  },
  {
    id: "N-8994",
    title: "New fine recorded",
    body: "Fine TF-88214 was issued on Nnamdi Azikiwe Expressway. Paying within 30 days gets a 25% discount.",
    at: "2026-09-06T18:30:00.000Z",
    read: true,
  },
];

/** Rows for the "My documents" tab; each one comes from a completed request. */
export const seedDocuments = [
  {
    id: "DOC-4411",
    name: "Traffic Status Certificate",
    issued: "2026-07-30T07:12:00.000Z",
    expires: "2027-07-30T00:00:00.000Z",
    request: "NPF-2026-3401",
  },
  {
    id: "DOC-4288",
    name: "Lost Item Report — receipt",
    issued: "2026-08-24T12:00:00.000Z",
    expires: null,
    request: "NPF-2026-3866",
  },
];
