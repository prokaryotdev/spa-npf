import type { Incident, Relief, Unit } from "./components/store";
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

/**
 * Approximate spots for the seed calls: the district's centre, close enough
 * to put a dot in the right part of town on the demo map. Not survey
 * positions. A live call carries the reporter's pin or the desk's.
 */
const SPOTS: Record<string, [number, number]> = {
  "NPF-4417": [6.6018, 3.3515], "NPF-4416": [6.93, 3.63],
  "NPF-4415": [9.064, 7.468], "NPF-4414": [12.0136, 8.5302],
  "NPF-4413": [4.8167, 7.0333], "NPF-4412": [6.4447, 7.5138],
  "NPF-4411": [7.43, 3.91], "NPF-4410": [6.335, 5.6037],
  "NPF-4409": [9.85, 8.9], "NPF-4408": [4.45, 7.17],
  "NPF-4407": [11.0855, 7.7199], "NPF-4406": [6.4281, 3.4219],
  "NPF-4405": [6.5918, 3.2913], "NPF-4404": [9.1556, 7.3222],
  "NPF-4403": [11.9925, 8.5236], "NPF-4402": [4.8679, 6.9969],
  "NPF-4401": [6.4889, 3.3478], "NPF-4400": [6.4275, 7.4952],
  "NPF-4399": [10.52, 7.43], "NPF-4398": [7.163, 3.33],
  "NPF-4397": [7.405, 3.91], "NPF-4396": [6.375, 5.615],
  "NPF-4395": [8.9428, 7.0833], "NPF-4394": [6.4593, 3.3889],
  "NPF-4393": [9.92, 8.89], "NPF-4392": [12.012, 8.535],
  "NPF-4391": [4.74, 7.04], "NPF-4390": [6.4478, 3.4723],
  "NPF-4389": [6.5958, 3.3889],
};

/** Risks the desk flags on a seed call, to show how they read on the board. */
const SEED_FLAGS: Record<string, string[]> = {
  "NPF-4417": ["Weapon reported"],
  "NPF-4414": ["Child or vulnerable person"],
  "NPF-4402": ["Weapon reported"],
  "NPF-4401": ["Domestic abuse"],
};

/** Seed cases opened from seed calls, so the call points back at its case. */
const SEED_CASE: Record<string, string> = {
  "NPF-4403": "CR/KAN/2026/0187",
  "NPF-4402": "CR/RIV/2026/0233",
  "NPF-4401": "CR/LAG/2026/0412",
  "NPF-4390": "CR/LAG/2026/0405",
};

/**
 * A month of earlier calls, so the report's week and month views and the
 * map's hotspots have something to count. Each is one of the calls above
 * replayed on an earlier day, a little moved in time and place: the same
 * kinds, places, units and words, so nothing here is new text and every
 * command's pattern stays its own. Illustrative, like the rest.
 *
 * A seeded generator rather than Math.random, so the month is the same for
 * everyone who opens the demo, and the same after a reload.
 */
function history(): Incident[] {
  let seed = 4242;
  const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  const out: Incident[] = [];
  let n = 4388;
  for (let day = 30; day >= 1; day--)
    for (const s of SEEDS) {
      // Busier on Fridays and Saturdays, as most control rooms are.
      const dow = new Date(Date.now() - day * 86_400_000).getDay();
      if (rand() > (dow === 5 || dow === 6 ? 0.55 : 0.4)) continue;
      const reported = day * 1440 + Math.floor(rand() * 1440) - 720;
      const toUnit = 2 + Math.floor(rand() * (s.priority === "P1" ? 8 : 25));
      const toScene = toUnit + 6 + Math.floor(rand() * 20);
      const toClose = toScene + 20 + Math.floor(rand() * 90);
      const spot = SPOTS[s.id];
      const outcome =
        s.outcome ?? callOutcomes[Math.floor(rand() * 7)];
      out.push({
        id: "NPF-" + n--,
        kind: s.kind,
        priority: s.priority,
        area: s.area,
        summary: s.summary,
        source: s.source,
        where: spot
          ? { ...s.where, geo: { lat: spot[0] + (rand() - 0.5) * 0.04, lng: spot[1] + (rand() - 0.5) * 0.04 } }
          : s.where,
        reported: minutesAgo(reported),
        dispatched: minutesAgo(reported - toUnit),
        onScene: minutesAgo(reported - toScene),
        closed: minutesAgo(reported - toClose),
        status: "Closed",
        assignee: s.assignee ?? null,
        unit: s.unit ?? null,
        outcome,
        log: [
          { at: minutesAgo(reported), text: "Call received via {source}.", vars: { source: s.source } },
          { at: minutesAgo(reported - toClose), text: "Outcome: {outcome}.", vars: { outcome } },
        ],
      });
    }
  return out;
}

export const seedIncidents = (): Incident[] => [
  ...SEEDS.map(({ at: [r, d, s, c], notes, ...rest }) => ({
    ...rest,
    where: SPOTS[rest.id]
      ? { ...rest.where, geo: { lat: SPOTS[rest.id][0], lng: SPOTS[rest.id][1] } }
      : rest.where,
    ...(SEED_FLAGS[rest.id] ? { flags: SEED_FLAGS[rest.id] } : {}),
    ...(SEED_CASE[rest.id] ? { caseId: SEED_CASE[rest.id] } : {}),
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
  })),
  ...history(),
];

type UnitSeed = Omit<Unit, "since"> & { sinceMins: number };

/**
 * The shift roster. Every callsign here is one an incident can be assigned
 * to, so the two boards are drawn from a single list rather than two that
 * drift apart.
 */
const UNITS: UnitSeed[] = [
  { callsign: "Patrol 04", state: "FCT", section: "Patrol", officer: "Cpl. H. Suleiman", status: "On Scene", sinceMins: 12, incident: "NPF-4415", area: "Wuse, Abuja", base: "Abuja Municipal", geo: { lat: 9.064, lng: 7.468 } },
  { callsign: "Patrol 09", state: "Lagos", section: "Patrol", officer: "Cpl. F. Adeyemi", status: "Available", sinceMins: 119, incident: null, area: "Lekki, Lagos", base: "Eti-Osa", geo: { lat: 6.4698, lng: 3.5852 } },
  { callsign: "Patrol 12", state: "Lagos", section: "Patrol", officer: "Sgt. R. Okafor", status: "Available", sinceMins: 6, incident: null, area: "Ikeja, Lagos", base: "Ikeja", geo: { lat: 6.605, lng: 3.345 } },
  { callsign: "Patrol 17", state: "Kano", section: "Patrol", officer: "Insp. S. Bello", status: "On Scene", sinceMins: 24, incident: "NPF-4414", area: "Sabon Gari, Kano", base: "Fagge", geo: { lat: 12.0136, lng: 8.5302 } },
  { callsign: "Patrol 21", state: "Edo", section: "Patrol", officer: "Sgt. M. Danladi", status: "Available", sinceMins: 108, incident: null, area: "Benin City", base: "Oredo", geo: { lat: 6.33, lng: 5.62 } },
  { callsign: "Patrol 26", state: "Oyo", section: "Patrol", officer: "Cpl. K. Ogundipe", status: "Unavailable", sinceMins: 41, incident: null, area: "Ibadan, refuelling", base: "Ibadan North", geo: { lat: 7.39, lng: 3.92 } },
  { callsign: "Traffic 07", state: "Rivers", section: "Traffic", officer: "Sgt. A. Garba", status: "Assigned", sinceMins: 44, incident: "NPF-4413", area: "Port Harcourt", base: "Port Harcourt", geo: { lat: 4.83, lng: 7.01 } },
  { callsign: "Traffic 11", state: "Kaduna", section: "Traffic", officer: "Cpl. M. Eze", status: "Available", sinceMins: 17, incident: null, area: "Zaria", base: "Zaria", geo: { lat: 11.08, lng: 7.71 } },
  { callsign: "Marine 02", state: "Rivers", section: "Marine", officer: "Sgt. Y. Musa", status: "Available", sinceMins: 142, incident: null, area: "Bonny River", base: "Bonny", geo: { lat: 4.45, lng: 7.17 } },
  { callsign: "Air Wing 01", state: "FCT", section: "Air Wing", officer: "ASP O. Nwosu", status: "Available", sinceMins: 203, incident: null, area: "Abuja, standby", base: "Abuja Municipal", geo: { lat: 9.0068, lng: 7.2632 } },
  { callsign: "K9 03", state: "Plateau", section: "K9", officer: "Cpl. T. Yakubu", status: "Unavailable", sinceMins: 88, incident: null, area: "Jos, training", base: "Jos North", geo: { lat: 9.89, lng: 8.86 } },
  { callsign: "Cybercrime 01", state: "Enugu", section: "Cybercrime", officer: "Insp. N. Aliyu", status: "Assigned", sinceMins: 58, incident: "NPF-4412", area: "Enugu", base: "Enugu North", geo: { lat: 6.45, lng: 7.5 } },
  { callsign: "Cybercrime 03", state: "Lagos", section: "Cybercrime", officer: "Insp. B. Adebayo", status: "Available", sinceMins: 236, incident: null, area: "Victoria Island, Lagos", base: "Eti-Osa", geo: { lat: 6.43, lng: 3.42 } },
  { callsign: "Highway 02", state: "Ogun", section: "Highway Patrol", officer: "Sgt. T. Olaniyan", status: "Available", sinceMins: 33, incident: null, area: "Sagamu Interchange", base: "Shagamu", geo: { lat: 6.85, lng: 3.65 } },
  { callsign: "Patrol 31", state: "Kano", section: "Patrol", officer: "Cpl. U. Abdullahi", status: "Available", sinceMins: 52, incident: null, area: "Nassarawa GRA, Kano", base: "Nasarawa", geo: { lat: 12.02, lng: 8.55 } },
];

// A second car in the busiest divisions, so backup has somewhere to come from.
UNITS.push(
  { callsign: "Patrol 14", state: "Lagos", section: "Patrol", officer: "Cpl. D. Okonkwo", status: "Available", sinceMins: 64, incident: null, area: "Allen Avenue, Ikeja", base: "Ikeja", geo: { lat: 6.6, lng: 3.355 } },
  { callsign: "Tactical 05", state: "Lagos", section: "Mobile Police", officer: "Insp. A. Bakare", status: "Available", sinceMins: 95, incident: null, area: "Alausa, Ikeja", base: "Ikeja", geo: { lat: 6.615, lng: 3.358 } },
  { callsign: "Patrol 33", state: "Kano", section: "Patrol", officer: "Cpl. Y. Sani", status: "Available", sinceMins: 21, incident: null, area: "Kofar Mata, Kano", base: "Kano Municipal", geo: { lat: 11.99, lng: 8.52 } },
  { callsign: "Patrol 08", state: "FCT", section: "Patrol", officer: "Sgt. E. Udoh", status: "Available", sinceMins: 37, incident: null, area: "Kubwa, Bwari", base: "Bwari", geo: { lat: 9.15, lng: 7.33 } },
);

/** The other two reliefs' crews, drawn from one illustrative list. */
const RELIEF_POOL = [
  "Cpl. A. Bello", "Sgt. O. Ojo", "Cpl. I. Nwankwo", "Sgt. B. Lawal",
  "Cpl. E. Akpan", "Sgt. G. Danjuma", "Cpl. R. Ibekwe", "Sgt. F. Ogunleye",
  "Cpl. S. Usman", "Sgt. C. Okeke",
];

/** The relief on duty now: A from 06:00, B from 14:00, C from 22:00 WAT. */
export function reliefNow(at = Date.now()): Relief {
  const h = (new Date(at).getUTCHours() + 1) % 24;
  return h >= 6 && h < 14 ? "A" : h >= 14 && h < 22 ? "B" : "C";
}

export const seedUnits = (): Unit[] => {
  const on = reliefNow();
  const order: Relief[] = ["A", "B", "C"];
  return UNITS.map(({ sinceMins, ...rest }, n) => {
    // The officer on the board now crews the relief on duty now; the other
    // two reliefs take the next names from the pool.
    const others = order.filter((r) => r !== on);
    const crew = {
      [on]: rest.officer,
      [others[0]]: RELIEF_POOL[(n * 2) % RELIEF_POOL.length],
      [others[1]]: RELIEF_POOL[(n * 2 + 1) % RELIEF_POOL.length],
    } as Record<Relief, string>;
    return { ...rest, since: minutesAgo(sinceMins), crew, relief: on };
  });
};

/** Call types the desk can log, in the order the desk reaches for them. */
export const callTypes = [
  ...new Set([
    "Road traffic collision",
    ...reportKinds.map((k) => k.kind),
    "Noise disturbance",
    "Marine assistance",
    "Lost child",
    "Shoplifting",
    "Officer needs assistance",
  ]),
];

export const callSources = [
  "112 call",
  "Nigeria Police Force App",
  "Rescue Me",
  "Walk-in",
  "Website report",
  "Cybercrime",
  "Radio emergency",
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
