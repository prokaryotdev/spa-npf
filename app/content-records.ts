import type { Alert, CaseFile, Detainee, Post } from "./components/store";
import { jurisdiction as at_ } from "./geo";

/**
 * Who signs in to the console, and the sample records behind its case files,
 * custody register and alerts.
 *
 * Like the calls in content-ops.ts, nothing here is real Nigeria Police Force
 * data: names, service numbers and crime references are illustrative, set on
 * real Nigerian places, and timed relative to now so the clocks read honestly.
 */
const minutesAgo = (m: number) =>
  new Date(Date.now() - m * 60_000).toISOString();
const hoursAgo = (h: number) => minutesAgo(h * 60);

/**
 * Risks the desk passes to whoever attends. They ride on the call as tags,
 * so the officer driving there reads "Weapon reported" before arriving, not
 * after. THRIVE (threat, harm, risk, investigation, vulnerability,
 * engagement), the UK control-room assessment, asks the same questions.
 */
export const callFlags = [
  "Weapon reported",
  "Child or vulnerable person",
  "Domestic abuse",
  "Officer safety risk",
  "Suspect still at scene",
  "Needs a female officer",
];

/* -------------------------------------------------------------------------
 * Who signs in to the console
 * ---------------------------------------------------------------------- */

export type PostDef = {
  post: Post;
  label: string;
  /** One line on what the post does, under its name on the sign-in card. */
  hint: string;
  /** How far the desk sees. */
  scope: "national" | "zone" | "command" | "division";
  /** The console boards the post works; the first is where it lands. */
  tabs: string[];
  officer: { name: string; rank: string; serviceNo: string };
};

const ALL = [
  "/app/police",
  "/app/police/incidents",
  "/app/police/units",
  "/app/police/map",
  "/app/police/cases",
  "/app/police/custody",
  "/app/police/requests",
  "/app/police/alerts",
  "/app/police/report",
];

/**
 * The jobs an officer signs in to. Each sees the boards its work needs and
 * nothing else: a custody officer has no use for the dispatch queue, and a
 * call-taker should not be reading case files. A real sign-in reads the post
 * from the officer's posting record; the sample officers stand in for it.
 *
 * Service numbers are illustrative. AP numbers are carried by officers of
 * the rank of inspector and above; F/No. by the rank and file.
 */
export const POSTS: PostDef[] = [
  {
    post: "control",
    label: "Control room",
    hint: "Take calls, dispatch units, issue alerts",
    scope: "command",
    // Requests stay with the control room, as they did before posts.
    tabs: [
      "/app/police",
      "/app/police/incidents",
      "/app/police/units",
      "/app/police/map",
      "/app/police/alerts",
      "/app/police/requests",
      "/app/police/report",
    ],
    officer: { name: "Insp. Ngozi Aliyu", rank: "Inspector", serviceNo: "AP 208417" },
  },
  {
    post: "dpo",
    label: "Divisional Police Officer",
    hint: "Run one division: calls, cases, cells and requests",
    scope: "division",
    tabs: ALL,
    officer: { name: "CSP Adamu Lawal", rank: "Chief Superintendent", serviceNo: "AP 154230" },
  },
  {
    post: "investigator",
    label: "Investigator (IPO)",
    hint: "Work case files, statements and exhibits",
    scope: "command",
    tabs: [
      "/app/police/cases",
      "/app/police/custody",
      "/app/police/alerts",
      "/app/police/map",
    ],
    officer: { name: "ASP Halima Ibrahim", rank: "Assistant Superintendent", serviceNo: "AP 231908" },
  },
  {
    post: "custody",
    label: "Custody officer",
    hint: "Keep the register of arrests and the cells",
    scope: "command",
    tabs: ["/app/police/custody", "/app/police/cases", "/app/police/alerts"],
    officer: { name: "Sgt. Peter Okon", rank: "Sergeant", serviceNo: "F/No. 427731" },
  },
  {
    post: "zone",
    label: "Zonal command (AIG)",
    hint: "Oversee the State Commands of one zone",
    scope: "zone",
    tabs: ALL,
    officer: { name: "AIG Bashir Musa", rank: "Assistant Inspector-General of Police", serviceNo: "AP 71304" },
  },
  {
    post: "commander",
    label: "Commissioner of Police",
    hint: "Oversee a whole State Command",
    scope: "command",
    tabs: ALL,
    officer: { name: "CP Olufemi Adeyemi", rank: "Commissioner of Police", serviceNo: "AP 98112" },
  },
  {
    post: "hq",
    label: "Force Headquarters",
    hint: "Every command in the country",
    scope: "national",
    tabs: ALL,
    officer: { name: "DCP Grace Eze", rank: "Deputy Commissioner of Police", serviceNo: "AP 110459" },
  },
];

/** A session's post. Sessions from before posts existed were control rooms. */
export const postOf = (post?: Post) =>
  POSTS.find((p) => p.post === (post ?? "control")) ?? POSTS[0];

/* -------------------------------------------------------------------------
 * Cases, custody and alerts
 * ---------------------------------------------------------------------- */

/** Who a person is to a case. */
export const caseRoles = ["Complainant", "Victim", "Suspect", "Witness"];

/** How an investigation can end, chosen as the case closes. */
export const caseResults = [
  "Convicted",
  "Acquitted",
  "Struck out",
  "No further action: insufficient evidence",
  "Withdrawn by complainant",
  "Transferred to another agency",
];

/** What can happen to an exhibit on its way to court. */
export const exhibitActions = [
  "Sent for forensic examination",
  "Returned from forensic examination",
  "Moved to the exhibit store",
  "Produced in court",
  "Returned to owner",
];

export const alertKinds: Alert["kind"][] = [
  "Wanted person",
  "Missing person",
  "Stolen vehicle",
  "Officer safety",
  "Intelligence",
];

export const seedCases = (): CaseFile[] => [
  {
    id: "CR/LAG/2026/0412",
    incident: "NPF-4401",
    offence: "Domestic violence",
    summary:
      "Neighbour reported shouting and a woman calling for help. The partner was arrested at the address.",
    where: at_("Lagos", "Surulere", "Aguda, Surulere"),
    opened: minutesAgo(365),
    updated: minutesAgo(95),
    stage: "Investigating",
    ipo: "ASP Halima Ibrahim",
    people: [
      { role: "Victim", name: "Funmi Adewale", detail: "Treated at the General Hospital and discharged" },
      { role: "Suspect", name: "Kunle Adewale", detail: "In custody" },
      { role: "Witness", name: "Neighbour (name withheld)" },
    ],
    statements: [
      {
        at: minutesAgo(300),
        by: "ASP Halima Ibrahim (AP 231908)",
        who: "Funmi Adewale",
        text: "Statement of the victim taken at the Gender Desk with a female officer present.",
      },
    ],
    exhibits: [],
    updates: [
      {
        at: minutesAgo(95),
        text: "The suspect is in custody and your statement has been recorded. The investigating officer will call you before the case goes to court.",
      },
    ],
    log: [
      { at: minutesAgo(365), by: "Sgt. R. Okafor", text: "Case opened from call {ref}.", vars: { ref: "NPF-4401" } },
      { at: minutesAgo(360), by: "CSP Adamu Lawal (AP 154230)", text: "Assigned to {ipo}.", vars: { ipo: "ASP Halima Ibrahim" } },
    ],
  },
  {
    id: "CR/LAG/2026/0405",
    incident: "NPF-4390",
    offence: "Fraud report",
    summary:
      "Payment sent for a car advertised online that does not exist. Details of the receiving account preserved.",
    where: at_("Lagos", "Eti-Osa", "Lekki Phase 1"),
    opened: minutesAgo(640),
    updated: minutesAgo(600),
    stage: "Investigating",
    ipo: "Insp. B. Adebayo",
    people: [{ role: "Complainant", name: "Tunde Bakare" }],
    statements: [],
    exhibits: [],
    updates: [],
    log: [
      { at: minutesAgo(640), by: "Insp. B. Adebayo", text: "Case opened from call {ref}.", vars: { ref: "NPF-4390" } },
    ],
  },
  {
    id: "CR/LAG/2026/0377",
    offence: "Burglary",
    summary:
      "Shop at Computer Village entered through the roof overnight. A suspect identified from CCTV and arrested.",
    where: at_("Lagos", "Ikeja", "Computer Village, Ikeja"),
    opened: hoursAgo(150),
    updated: hoursAgo(20),
    stage: "Charged to court",
    ipo: "ASP Halima Ibrahim",
    people: [
      { role: "Complainant", name: "Ikechukwu Nnaji" },
      { role: "Suspect", name: "Sodiq Lawal", detail: "Charged, remanded by the Magistrate Court" },
    ],
    statements: [
      {
        at: hoursAgo(140),
        by: "ASP Halima Ibrahim (AP 231908)",
        who: "Ikechukwu Nnaji",
        text: "List of goods taken: eleven phones, two laptops.",
      },
      {
        at: hoursAgo(100),
        by: "ASP Halima Ibrahim (AP 231908)",
        who: "Sodiq Lawal",
        text: "Statement under caution, recorded on video with his lawyer present (ACJA 2015 s.17).",
      },
    ],
    exhibits: [
      {
        id: "EX-1",
        label: "CCTV recording, 2 clips",
        trail: [
          { at: hoursAgo(146), by: "ASP Halima Ibrahim (AP 231908)", action: "Booked in as an exhibit" },
          { at: hoursAgo(120), by: "ASP Halima Ibrahim (AP 231908)", action: "Sent for forensic examination" },
          { at: hoursAgo(60), by: "Forensic Laboratory, Lagos", action: "Returned from forensic examination" },
        ],
      },
      {
        id: "EX-2",
        label: "Two recovered laptops",
        trail: [
          { at: hoursAgo(100), by: "ASP Halima Ibrahim (AP 231908)", action: "Booked in as an exhibit" },
          { at: hoursAgo(99), by: "Sgt. Peter Okon (F/No. 427731)", action: "Moved to the exhibit store" },
        ],
      },
    ],
    updates: [
      {
        at: hoursAgo(20),
        text: "The suspect has been charged to the Magistrate Court, Ikeja. You will be told the hearing date.",
      },
    ],
    log: [
      { at: hoursAgo(150), by: "ASP Halima Ibrahim (AP 231908)", text: "Case opened." },
      { at: hoursAgo(20), by: "ASP Halima Ibrahim (AP 231908)", text: "Stage: {stage}.", vars: { stage: "Charged to court" } },
    ],
  },
  {
    id: "CR/KAN/2026/0187",
    incident: "NPF-4403",
    offence: "Assault",
    summary:
      "Fight at a market stall. One man injured, the other held by traders until the patrol arrived.",
    where: at_("Kano", "Kano Municipal", "Kofar Mata, Kano"),
    opened: minutesAgo(330),
    updated: minutesAgo(300),
    stage: "Investigating",
    ipo: "Insp. Musa Danjuma",
    people: [
      { role: "Victim", name: "Abdullahi Yusuf", detail: "Cut to the arm" },
      { role: "Suspect", name: "Musa Garba", detail: "In custody" },
    ],
    statements: [],
    exhibits: [],
    updates: [],
    log: [
      { at: minutesAgo(330), by: "Cpl. U. Abdullahi", text: "Case opened from call {ref}.", vars: { ref: "NPF-4403" } },
    ],
  },
  {
    id: "CR/RIV/2026/0233",
    incident: "NPF-4402",
    offence: "Armed robbery",
    summary:
      "Two men with a gun took phones from a filling station attendant and left on a motorcycle.",
    where: at_("Rivers", "Obio/Akpor", "Rumuokoro, Obio/Akpor"),
    opened: minutesAgo(320),
    updated: minutesAgo(320),
    stage: "Investigating",
    ipo: null,
    people: [{ role: "Victim", name: "Filling station attendant" }],
    statements: [],
    exhibits: [],
    updates: [],
    log: [
      { at: minutesAgo(320), by: "Sgt. A. Garba", text: "Case opened from call {ref}.", vars: { ref: "NPF-4402" } },
    ],
  },
];

const RIGHTS_GIVEN = { informed: true, kin: true, lawyer: true, medical: false };

export const seedCustody = (): Detainee[] => [
  {
    id: "DET-0104",
    name: "Emeka Obi",
    age: 22,
    sex: "Male",
    offence: "Burglary",
    where: at_("FCT", "Bwari", "Kubwa"),
    arrested: hoursAgo(26),
    booked: hoursAgo(25.5),
    by: "Sgt. E. Udoh",
    courtNear: true,
    status: "In custody",
    rights: { informed: true, kin: false, lawyer: false, medical: false },
    property: "Phone, wallet with ₦4,500, belt",
    checks: [{ at: hoursAgo(3), by: "Sgt. E. Udoh", note: "Awake, ate breakfast, no complaint." }],
    log: [{ at: hoursAgo(25.5), by: "Sgt. E. Udoh", text: "Booked into custody." }],
  },
  {
    id: "DET-0103",
    name: "Chukwudi Eze",
    age: 31,
    sex: "Male",
    offence: "Drug offence",
    incident: "NPF-4394",
    where: at_("Lagos", "Lagos Island", "Idumota"),
    arrested: minutesAgo(570),
    booked: minutesAgo(540),
    by: "Cpl. F. Adeyemi",
    courtNear: true,
    status: "In custody",
    rights: RIGHTS_GIVEN,
    property: "Phone, ₦12,000",
    checks: [
      { at: minutesAgo(70), by: "Sgt. Peter Okon (F/No. 427731)", note: "Seen and spoken to. No complaint." },
    ],
    log: [{ at: minutesAgo(540), by: "Cpl. F. Adeyemi", text: "Booked into custody." }],
  },
  {
    id: "DET-0102",
    name: "Kunle Adewale",
    age: 38,
    sex: "Male",
    offence: "Domestic violence",
    caseId: "CR/LAG/2026/0412",
    incident: "NPF-4401",
    where: at_("Lagos", "Surulere", "Aguda, Surulere"),
    arrested: minutesAgo(400),
    booked: minutesAgo(380),
    by: "Sgt. R. Okafor",
    courtNear: true,
    status: "In custody",
    rights: { ...RIGHTS_GIVEN, medical: true },
    checks: [
      { at: minutesAgo(140), by: "Sgt. Peter Okon (F/No. 427731)", note: "Calm. Asked for his lawyer; lawyer called." },
    ],
    log: [{ at: minutesAgo(380), by: "Sgt. R. Okafor", text: "Booked into custody." }],
  },
  {
    id: "DET-0101",
    name: "Musa Garba",
    age: 27,
    sex: "Male",
    offence: "Assault",
    caseId: "CR/KAN/2026/0187",
    incident: "NPF-4403",
    where: at_("Kano", "Kano Municipal", "Kofar Mata"),
    arrested: minutesAgo(345),
    booked: minutesAgo(325),
    by: "Cpl. U. Abdullahi",
    courtNear: true,
    status: "In custody",
    rights: RIGHTS_GIVEN,
    checks: [],
    log: [{ at: minutesAgo(325), by: "Cpl. U. Abdullahi", text: "Booked into custody." }],
  },
  {
    id: "DET-0100",
    name: "Sodiq Lawal",
    age: 24,
    sex: "Male",
    offence: "Burglary",
    caseId: "CR/LAG/2026/0377",
    where: at_("Lagos", "Ikeja", "Computer Village"),
    arrested: hoursAgo(101),
    booked: hoursAgo(100.5),
    by: "ASP Halima Ibrahim (AP 231908)",
    courtNear: true,
    status: "Charged to court",
    released: hoursAgo(80),
    rights: RIGHTS_GIVEN,
    checks: [],
    log: [
      { at: hoursAgo(100.5), by: "ASP Halima Ibrahim (AP 231908)", text: "Booked into custody." },
      { at: hoursAgo(80), by: "ASP Halima Ibrahim (AP 231908)", text: "Status: {status}.", vars: { status: "Charged to court" } },
    ],
  },
];

export const seedAlerts = (): Alert[] => [
  {
    id: "BOL-0031",
    kind: "Missing person",
    title: "Young man missing from Sabon Gari, Kano",
    details:
      "19 years old, slim, about 1.75 m. Last seen at the motor park on the evening bus to Zaria, wearing a white kaftan and black sandals.",
    names: ["Ibrahim Sule"],
    scope: null,
    issued: minutesAgo(26),
    by: "Insp. S. Bello",
    public: false,
    active: true,
    incident: "NPF-4414",
    tips: [],
  },
  {
    id: "BOL-0030",
    kind: "Stolen vehicle",
    title: "Silver Toyota Corolla taken in Kubwa",
    details:
      "Silver Toyota Corolla saloon, 2012 model, dent on the rear bumper. Taken from outside a residence overnight.",
    plate: "ABJ 482 KD",
    scope: null,
    issued: minutesAgo(310),
    by: "Cpl. H. Suleiman",
    public: false,
    active: true,
    incident: "NPF-4404",
    tips: [],
  },
  {
    id: "BOL-0029",
    kind: "Wanted person",
    title: "Two armed men on a red motorcycle, Rumuokoro",
    details:
      "Robbed a filling station attendant at gunpoint. One wore a black cap and a red jersey. Both left towards Rumuola on a red motorcycle with no plate. Do not approach alone.",
    scope: "Rivers",
    issued: minutesAgo(380),
    by: "Sgt. A. Garba",
    public: false,
    active: true,
    incident: "NPF-4402",
    tips: [],
  },
  {
    id: "BOL-0028",
    kind: "Intelligence",
    title: "ATM card-swap fraud at Ikeja malls",
    details:
      "Three reports this week of a man offering help at ATMs and swapping the card. Patrols near Ikeja City Mall and the Allen Avenue banks to watch for loiterers at ATMs.",
    scope: "Lagos",
    issued: hoursAgo(30),
    by: "CP Olufemi Adeyemi (AP 98112)",
    public: false,
    active: true,
    tips: [],
  },
];

/* -------------------------------------------------------------------------
 * Zonal commands
 * ---------------------------------------------------------------------- */

export type ZonalCommand = {
  id: string;
  /** "Zone 2, Lagos" where the Force numbers it; the headquarters otherwise. */
  name: string;
  states: string[];
};

/**
 * The Force's seventeen zonal commands, each under an Assistant
 * Inspector-General, between Force Headquarters and the State Commands.
 *
 * Sources, read 14 October 2026:
 * - npf.gov.ng / police.gov.ng zone pages: Zones 1, 2, 4, 6, 7, 8, 10, 15, 17.
 * - Recent posting and assumption-of-duty reports (Vanguard, Tribune,
 *   Guardian, The Sun, P.M. News, Daily Times, CrossRiverWatch, 2024-2026):
 *   Zones 3, 5, 9, 11, 12, 13, 14, 16.
 * - The May 2020 approval of Zones 13-17 (ThisDay, 28 May 2020).
 *
 * Where older lists disagree with recent ones, recent wins: Ebonyi is now
 * under Zone 9 (Umuahia), not Zone 13; Gombe under Zone 12 (Bauchi), not
 * Zone 3; Rivers under Zone 16 (Yenagoa), not Zone 6. Every one of the 37
 * commands falls in exactly one zone below, which scripts/test-store.mjs
 * checks. Kaduna under Zone 14 rests on the 2020 approval alone; recent
 * reports name Katsina only, so it is the one line to confirm with the Force.
 */
export const ZONAL_COMMANDS: ZonalCommand[] = [
  { id: "1", name: "Zone 1, Kano", states: ["Kano", "Jigawa"] },
  { id: "2", name: "Zone 2, Lagos", states: ["Lagos", "Ogun"] },
  { id: "3", name: "Zone 3, Yola", states: ["Adamawa", "Taraba"] },
  { id: "4", name: "Zone 4, Makurdi", states: ["Benue", "Plateau", "Nasarawa"] },
  { id: "5", name: "Zone 5, Benin", states: ["Edo", "Delta"] },
  { id: "6", name: "Zone 6, Calabar", states: ["Akwa Ibom", "Cross River"] },
  { id: "7", name: "Zone 7, Abuja", states: ["FCT", "Niger"] },
  { id: "8", name: "Zone 8, Lokoja", states: ["Kogi", "Kwara"] },
  { id: "9", name: "Zone 9, Umuahia", states: ["Abia", "Imo", "Ebonyi"] },
  { id: "10", name: "Zone 10, Sokoto", states: ["Sokoto", "Kebbi", "Zamfara"] },
  { id: "11", name: "Zone 11, Osogbo", states: ["Osun", "Oyo"] },
  { id: "12", name: "Zone 12, Bauchi", states: ["Bauchi", "Gombe"] },
  { id: "13", name: "Zone 13, Ukpo", states: ["Anambra", "Enugu"] },
  { id: "14", name: "Zone 14, Katsina", states: ["Katsina", "Kaduna"] },
  { id: "15", name: "Zone 15, Maiduguri", states: ["Borno", "Yobe"] },
  { id: "16", name: "Zone 16, Yenagoa", states: ["Bayelsa", "Rivers"] },
  { id: "17", name: "Zone 17, Akure", states: ["Ondo", "Ekiti"] },
];

export const zonalCommand = (id?: string) =>
  ZONAL_COMMANDS.find((z) => z.id === id) ?? null;

/** Whether a session's post works a board: for links into another board. */
export const postSees = (post: Post | undefined, href: string) =>
  postOf(post).tabs.includes(href);

/**
 * The patterns the console writes into logs, timelines and diaries, and the
 * sidebar's group names. Shown through t() from data, so the coverage test
 * cannot find them in the code; listed here so it asks every language.
 */
export const consoleLines = [
  "Operations",
  "Investigation",
  "Desk",
  "{unit} assigned.",
  "{unit} released.",
  "{unit} sent in support.",
  "Flagged: {flag}.",
  "Flag removed: {flag}.",
  "Graded {from} → {to}.",
  "{n} files attached.",
  "{name} booked into custody as {id}.",
  "Case file {case} opened.",
  "Complainant updated: {text}",
  "Emergency stood down: {unit} is safe.",
  "Exhibit {ex} booked in: {label}.",
  "Exhibit {ex}: {action}.",
  "Officer removed.",
  "Reporter added: {text}",
  "Reporter attached {n} files.",
  "Linked as a duplicate of {ref}.",
  "{role} added: {name}.",
  "Statement taken from {who}.",
  "Done: {what}.",
  "Returned to custody.",
  "Unit stood down.",
  "Dispatched.",
  "Arrived on scene.",
  "Call closed.",
  "This board is not part of your post",
  "Your post works these boards instead.",
];
