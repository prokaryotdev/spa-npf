import type { Incident, Unit } from "./components/store";
import { jurisdiction as at_ } from "./geo";
import { reportKinds } from "./content-report";

/**
 * Sample rows for the operations console. Nothing here is real Nigeria Police Force
 * data (no operational feed is public), so these are illustrative calls on
 * real Nigerian place names, and the console says as much on every screen.
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
    id: "NPF-4417",
    where: at_("Lagos", "Ikeja"),
    kind: "Assault",
    priority: "P1",
    area: "Ikeja, Lagos",
    at: [4, null, null, null],
    status: "New",
    assignee: null,
    unit: null,
    summary:
      "Two parties in a physical altercation outside a retail unit. Caller reports one party holding a bottle.",
    source: "112 call",
    notes: [[4, "Caller still on the line. Ambulance notified."]],
  },
  {
    id: "NPF-4416",
    where: at_("Ogun", "Ikenne"),
    kind: "Road traffic collision",
    priority: "P2",
    area: "Lagos–Ibadan Expressway, Ogere",
    at: [9, null, null, null],
    status: "New",
    assignee: null,
    unit: null,
    summary:
      "Three vehicles, second lane blocked. No injuries reported. FRSC notified for the lane closure.",
    source: "Nigeria Police Force App",
    notes: [[8, "Two further callers reporting the same collision."]],
  },
  {
    id: "NPF-4415",
    where: at_("FCT", "Abuja Municipal"),
    kind: "Theft",
    priority: "P2",
    area: "Wuse Market, Abuja",
    at: [21, 19, 12, null],
    status: "On Scene",
    assignee: "Cpl. H. Suleiman",
    unit: "Patrol 04",
    summary: "Handbag taken from a parked vehicle. CCTV available on site.",
    source: "Rescue Me",
    notes: [[11, "Store manager pulling camera footage for the last hour."]],
  },
  {
    id: "NPF-4414",
    where: at_("Kano", "Fagge"),
    kind: "Missing person",
    priority: "P2",
    area: "Sabon Gari, Kano",
    at: [34, 31, 24, null],
    status: "On Scene",
    assignee: "Insp. S. Bello",
    unit: "Patrol 17",
    summary:
      "Adult missing since the previous evening. Family at the address, enquiries ongoing.",
    source: "Walk-in",
    notes: [[22, "Last seen at the motor park on the evening bus to Zaria."]],
  },
  {
    id: "NPF-4413",
    where: at_("Rivers", "Port Harcourt"),
    kind: "Suspicious vehicle",
    priority: "P3",
    area: "Trans-Amadi, Port Harcourt",
    at: [48, 44, null, null],
    status: "Dispatched",
    assignee: "Sgt. A. Garba",
    unit: "Traffic 07",
    summary: "Vehicle parked across a loading bay for six hours.",
    source: "Rescue Me",
    notes: [],
  },
  {
    id: "NPF-4412",
    where: at_("Enugu", "Enugu North"),
    kind: "Fraud report",
    priority: "P2",
    area: "Independence Layout, Enugu",
    at: [63, 58, null, null],
    status: "Dispatched",
    assignee: "Insp. N. Aliyu",
    unit: "Cybercrime 01",
    summary: "Supplier invoice interception at a freight company.",
    source: "Cybercrime",
    notes: [[57, "Complainant asked to preserve the original email headers."]],
  },
  {
    id: "NPF-4411",
    where: at_("Oyo", "Ibadan North"),
    kind: "Noise disturbance",
    priority: "P4",
    area: "Bodija, Ibadan",
    at: [86, null, null, null],
    status: "New",
    assignee: null,
    unit: null,
    summary: "Repeat complaint about late construction work.",
    source: "Website report",
    notes: [[86, "Fourth report from this address this month."]],
  },
  {
    id: "NPF-4410",
    where: at_("Edo", "Oredo"),
    kind: "Lost child",
    priority: "P1",
    area: "Ring Road, Benin City",
    at: [124, 122, 117, 108],
    status: "Closed",
    assignee: "Sgt. M. Danladi",
    unit: "Patrol 21",
    summary: "Child reunited with family after fourteen minutes.",
    source: "112 call",
    notes: [[109, "Reunited with the mother at the information desk."]],
    outcome: "Resolved at scene",
  },
  {
    id: "NPF-4409",
    where: at_("Plateau", "Jos South"),
    kind: "Shoplifting",
    priority: "P4",
    area: "Rayfield, Jos",
    at: [151, 144, 131, 119],
    status: "Closed",
    assignee: "Cpl. T. Yakubu",
    unit: "K9 03",
    summary: "Goods recovered, complainant declined to press charges.",
    source: "Walk-in",
    notes: [],
    outcome: "Resolved at scene",
  },
  {
    id: "NPF-4408",
    where: at_("Rivers", "Bonny"),
    kind: "Marine assistance",
    priority: "P3",
    area: "Bonny River, Rivers",
    at: [188, 183, 168, 142],
    status: "Closed",
    assignee: "Sgt. Y. Musa",
    unit: "Marine 02",
    summary: "Passenger boat towed in after engine failure.",
    source: "112 call",
    notes: [],
    outcome: "Resolved at scene",
  },
  {
    id: "NPF-4407",
    where: at_("Kaduna", "Zaria"),
    kind: "Road traffic collision",
    priority: "P3",
    area: "Kaduna–Kano Expressway, Zaria",
    at: [232, 226, 214, 199],
    status: "Closed",
    assignee: "Cpl. M. Eze",
    unit: "Traffic 11",
    summary: "Minor collision cleared through the self-report service.",
    source: "Nigeria Police Force App",
    notes: [],
    outcome: "Resolved at scene",
  },
  {
    id: "NPF-4406",
    where: at_("Lagos", "Eti-Osa"),
    kind: "Cybercrime report",
    priority: "P3",
    area: "Victoria Island, Lagos",
    at: [281, 274, null, 236],
    status: "Closed",
    assignee: "Insp. B. Adebayo",
    unit: "Cybercrime 03",
    summary: "Recruitment scam reported by three complainants in one week.",
    source: "Cybercrime",
    notes: [[240, "Referred to the cybercrime investigation desk."]],
    outcome: "Referred for investigation",
  },
  // The earlier part of the last twelve hours, closed, so the shift report
  // has a shift to report on. Each unit is one from its own command's roster.
  { id: "NPF-4405", where: at_("Lagos", "Alimosho"), kind: "Burglary", priority: "P2", area: "Egbeda, Alimosho", at: [312, 305, 290, 248], status: "Closed", assignee: "Cpl. F. Adeyemi", unit: "Patrol 09", summary: "Shop shutter found forced at opening time. Owner listing what was taken.", source: "112 call", notes: [], outcome: "Report taken" },
  { id: "NPF-4404", where: at_("FCT", "Bwari"), kind: "Vehicle theft", priority: "P2", area: "Kubwa, Bwari", at: [338, 331, 318, 281], status: "Closed", assignee: "Cpl. H. Suleiman", unit: "Patrol 04", summary: "Saloon car taken from outside a residence overnight.", source: "Website report", notes: [], outcome: "Report taken" },
  { id: "NPF-4403", where: at_("Kano", "Kano Municipal"), kind: "Assault", priority: "P1", area: "Kofar Mata, Kano", at: [365, 361, 352, 318], status: "Closed", assignee: "Cpl. U. Abdullahi", unit: "Patrol 31", summary: "Fight at a market stall. One man injured, the other held by traders.", source: "112 call", notes: [], outcome: "Arrest made" },
  { id: "NPF-4402", where: at_("Rivers", "Obio/Akpor"), kind: "Armed robbery", priority: "P1", area: "Rumuokoro, Obio/Akpor", at: [392, 385, 371, 322], status: "Closed", assignee: "Sgt. A. Garba", unit: "Traffic 07", summary: "Two men with a gun took phones from a filling station attendant and left on a motorcycle.", source: "112 call", notes: [], outcome: "Referred for investigation" },
  { id: "NPF-4401", where: at_("Lagos", "Surulere"), kind: "Domestic violence", priority: "P1", area: "Aguda, Surulere", at: [418, 415, 404, 371], status: "Closed", assignee: "Sgt. R. Okafor", unit: "Patrol 12", summary: "Neighbour reports shouting and a woman calling for help.", source: "112 call", notes: [], outcome: "Arrest made" },
  { id: "NPF-4400", where: at_("Enugu", "Enugu South"), kind: "Threats or intimidation", priority: "P3", area: "Uwani, Enugu", at: [445, 431, null, 389], status: "Closed", assignee: "Insp. N. Aliyu", unit: "Cybercrime 01", summary: "Threatening text messages from a former business partner.", source: "Walk-in", notes: [], outcome: "Advice given" },
  { id: "NPF-4399", where: at_("Kaduna", "Kaduna North"), kind: "Road traffic collision", priority: "P2", area: "Ahmadu Bello Way, Kaduna", at: [471, 457, 446, 410], status: "Closed", assignee: "Cpl. M. Eze", unit: "Traffic 11", summary: "Two cars at the junction, one lane blocked.", source: "Nigeria Police Force App", notes: [], outcome: "Resolved at scene" },
  { id: "NPF-4398", where: at_("Ogun", "Abeokuta South"), kind: "Road traffic collision", priority: "P3", area: "Lafenwa, Abeokuta", at: [496, 482, 470, 441], status: "Closed", assignee: "Sgt. T. Olaniyan", unit: "Highway 02", summary: "Tanker and bus in contact at the roundabout. FRSC took over the scene.", source: "112 call", notes: [], outcome: "Handed to another agency" },
  { id: "NPF-4397", where: at_("Oyo", "Ibadan North"), kind: "Suspicious activity", priority: "P3", area: "Agodi, Ibadan", at: [524, 509, 497, 478], status: "Closed", assignee: "Cpl. K. Ogundipe", unit: "Patrol 26", summary: "Men seen checking parked cars along the road.", source: "Website report", notes: [], outcome: "No offence disclosed" },
  { id: "NPF-4396", where: at_("Edo", "Egor"), kind: "Theft", priority: "P3", area: "Uselu, Benin City", at: [553, 534, 520, 487], status: "Closed", assignee: "Sgt. M. Danladi", unit: "Patrol 21", summary: "Generator taken from a church compound.", source: "Walk-in", notes: [], outcome: "Report taken" },
  { id: "NPF-4395", where: at_("FCT", "Gwagwalada"), kind: "Missing person", priority: "P2", area: "Gwagwalada, FCT", at: [579, 571, 556, 503], status: "Closed", assignee: "Cpl. H. Suleiman", unit: "Patrol 04", summary: "Elderly man missing from home since the morning.", source: "112 call", notes: [], outcome: "Resolved at scene" },
  { id: "NPF-4394", where: at_("Lagos", "Lagos Island"), kind: "Drug offence", priority: "P3", area: "Idumota, Lagos Island", at: [606, 588, 574, 530], status: "Closed", assignee: "Cpl. F. Adeyemi", unit: "Patrol 09", summary: "Drugs reported being sold from a kiosk.", source: "Nigeria Police Force App", notes: [], outcome: "Arrest made" },
  { id: "NPF-4393", where: at_("Plateau", "Jos North"), kind: "Vandalism", priority: "P4", area: "Terminus, Jos", at: [634, 571, 552, 520], status: "Closed", assignee: "Cpl. T. Yakubu", unit: "K9 03", summary: "Streetlight cables cut along the market road.", source: "Website report", notes: [], outcome: "Report taken" },
  { id: "NPF-4392", where: at_("Kano", "Fagge"), kind: "Noise disturbance", priority: "P4", area: "Sabon Gari, Kano", at: [661, 618, 603, 594], status: "Closed", assignee: "Insp. S. Bello", unit: "Patrol 17", summary: "Loud generator and music from an event hall.", source: "112 call", notes: [], outcome: "Advice given" },
  { id: "NPF-4391", where: at_("Rivers", "Port Harcourt"), kind: "Marine assistance", priority: "P2", area: "Borokiri, Port Harcourt", at: [688, 681, 659, 612], status: "Closed", assignee: "Sgt. Y. Musa", unit: "Marine 02", summary: "Fishing boat adrift with two people on board.", source: "112 call", notes: [], outcome: "Resolved at scene" },
  { id: "NPF-4390", where: at_("Lagos", "Eti-Osa"), kind: "Fraud report", priority: "P3", area: "Lekki Phase 1", at: [702, 688, null, 640], status: "Closed", assignee: "Insp. B. Adebayo", unit: "Cybercrime 03", summary: "Payment sent for a car advertised online that does not exist.", source: "Cybercrime", notes: [], outcome: "Referred for investigation" },
  { id: "NPF-4389", where: at_("Lagos", "Kosofe"), kind: "Assault", priority: "P2", area: "Ketu, Kosofe", at: [715, 709, 701, 668], status: "Closed", assignee: "Sgt. R. Okafor", unit: "Patrol 12", summary: "Report of a man being beaten at a bus stop.", source: "112 call", notes: [], outcome: "No offence disclosed" },
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
              ...(rest.outcome
                ? [
                    {
                      at: minutesAgo(c),
                      text: "Outcome: {outcome}.",
                      vars: { outcome: rest.outcome },
                    },
                  ]
                : []),
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
  { callsign: "Patrol 04", state: "FCT", section: "Patrol", officer: "Cpl. H. Suleiman", status: "On Scene", sinceMins: 12, incident: "NPF-4415", area: "Wuse, Abuja" },
  { callsign: "Patrol 09", state: "Lagos", section: "Patrol", officer: "Cpl. F. Adeyemi", status: "Available", sinceMins: 119, incident: null, area: "Lekki, Lagos" },
  { callsign: "Patrol 12", state: "Lagos", section: "Patrol", officer: "Sgt. R. Okafor", status: "Available", sinceMins: 6, incident: null, area: "Ikeja, Lagos" },
  { callsign: "Patrol 17", state: "Kano", section: "Patrol", officer: "Insp. S. Bello", status: "On Scene", sinceMins: 24, incident: "NPF-4414", area: "Sabon Gari, Kano" },
  { callsign: "Patrol 21", state: "Edo", section: "Patrol", officer: "Sgt. M. Danladi", status: "Available", sinceMins: 108, incident: null, area: "Benin City" },
  { callsign: "Patrol 26", state: "Oyo", section: "Patrol", officer: "Cpl. K. Ogundipe", status: "Unavailable", sinceMins: 41, incident: null, area: "Ibadan, refuelling" },
  { callsign: "Traffic 07", state: "Rivers", section: "Traffic", officer: "Sgt. A. Garba", status: "Assigned", sinceMins: 44, incident: "NPF-4413", area: "Port Harcourt" },
  { callsign: "Traffic 11", state: "Kaduna", section: "Traffic", officer: "Cpl. M. Eze", status: "Available", sinceMins: 17, incident: null, area: "Zaria" },
  { callsign: "Marine 02", state: "Rivers", section: "Marine", officer: "Sgt. Y. Musa", status: "Available", sinceMins: 142, incident: null, area: "Bonny River" },
  { callsign: "Air Wing 01", state: "FCT", section: "Air Wing", officer: "ASP O. Nwosu", status: "Available", sinceMins: 203, incident: null, area: "Abuja, standby" },
  { callsign: "K9 03", state: "Plateau", section: "K9", officer: "Cpl. T. Yakubu", status: "Unavailable", sinceMins: 88, incident: null, area: "Jos, training" },
  { callsign: "Cybercrime 01", state: "Enugu", section: "Cybercrime", officer: "Insp. N. Aliyu", status: "Assigned", sinceMins: 58, incident: "NPF-4412", area: "Enugu" },
  { callsign: "Cybercrime 03", state: "Lagos", section: "Cybercrime", officer: "Insp. B. Adebayo", status: "Available", sinceMins: 236, incident: null, area: "Victoria Island, Lagos" },
  { callsign: "Highway 02", state: "Ogun", section: "Highway Patrol", officer: "Sgt. T. Olaniyan", status: "Available", sinceMins: 33, incident: null, area: "Sagamu Interchange" },
  { callsign: "Patrol 31", state: "Kano", section: "Patrol", officer: "Cpl. U. Abdullahi", status: "Available", sinceMins: 52, incident: null, area: "Nassarawa GRA, Kano" },
];

export const seedUnits = (): Unit[] =>
  UNITS.map(({ sinceMins, ...rest }) => ({
    ...rest,
    since: minutesAgo(sinceMins),
  }));

/** Call types the desk can log, in the order the desk reaches for them. */
export const callTypes = [
  ...new Set([
    "Road traffic collision",
    ...reportKinds.map((k) => k.kind),
    "Noise disturbance",
    "Marine assistance",
    "Lost child",
    "Shoplifting",
  ]),
];

export const callSources = [
  "112 call",
  "Nigeria Police Force App",
  "Rescue Me",
  "Walk-in",
  "Website report",
  "Cybercrime",
];

/**
 * How a call can end. Chosen as it closes, so the shift report can say what
 * the shift achieved and not only how fast it moved.
 */
export const callOutcomes = [
  "Arrest made",
  "Report taken",
  "Referred for investigation",
  "Resolved at scene",
  "Advice given",
  "Handed to another agency",
  "No offence disclosed",
  "False or hoax call",
  "Duplicate call",
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
