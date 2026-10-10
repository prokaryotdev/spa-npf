import type { Priority } from "./components/store";

/**
 * What a member of the public can report, and the grade the board gives it
 * before an officer has read a word. The grade is a starting point: the
 * report form raises it when the thing is still happening, and the duty
 * officer can move it either way on the console.
 *
 * `kind` is the English the board records and the dispatcher searches by.
 * The same strings name calls the desk takes by phone (content-ops
 * callTypes), so a robbery reported online and one phoned in read alike.
 */
export type ReportKind = {
  kind: string;
  hint: string;
  priority: Priority;
  /** A line shown when this kind is picked: who else helps, what to keep. */
  advice?: string;
};

export const reportKinds: ReportKind[] = [
  {
    kind: "Armed robbery",
    hint: "Someone used or showed a weapon to take something",
    priority: "P1",
  },
  {
    kind: "Kidnapping",
    hint: "Someone has been taken or is being held",
    priority: "P1",
    advice:
      "Do not pay or negotiate alone. Keep every message and call record from the kidnappers.",
  },
  {
    kind: "Sexual assault",
    hint: "Rape, sexual assault or abuse, of an adult or a child",
    priority: "P1",
    advice:
      "You can ask for a female officer. Try not to wash or change clothes before a medical examination, and keep what you were wearing.",
  },
  {
    kind: "Assault",
    hint: "Someone was attacked, beaten or wounded",
    priority: "P2",
  },
  {
    kind: "Domestic violence",
    hint: "Violence or threats from a partner or family member",
    priority: "P2",
    advice:
      "Every command has a Gender Desk. Say if it is not safe for us to call you at home.",
  },
  {
    kind: "Missing person",
    hint: "Someone has not come home and cannot be reached",
    priority: "P2",
    advice:
      "There is no waiting period. Have a recent photograph ready and note what they were wearing.",
  },
  {
    kind: "Burglary",
    hint: "Someone broke into a home, shop or office",
    priority: "P2",
    advice: "If you can, leave things as you found them until officers arrive.",
  },
  {
    kind: "Vehicle theft",
    hint: "A car, motorcycle or tricycle was stolen",
    priority: "P2",
    advice: "Have the plate number, chassis number and the vehicle papers ready.",
  },
  {
    kind: "Theft",
    hint: "Phone, bag, money or goods taken without force",
    priority: "P3",
  },
  {
    kind: "Fraud report",
    hint: "Money taken by a scam, a fake deal or a bad cheque",
    priority: "P3",
    advice:
      "Call your bank first to freeze the transfer. Keep receipts, account numbers and the messages.",
  },
  {
    kind: "Cybercrime report",
    hint: "Hacking, online scams, sextortion or harassment online",
    priority: "P3",
    advice:
      "Take screenshots with the date showing, and do not delete the chats or the account.",
  },
  {
    kind: "Threats or intimidation",
    hint: "Someone threatened to hurt you or your family",
    priority: "P3",
  },
  {
    kind: "Suspicious activity",
    hint: "A person, vehicle or package that looks wrong",
    priority: "P3",
  },
  {
    kind: "Drug offence",
    hint: "Drugs being sold, made or used",
    priority: "P3",
  },
  {
    kind: "Vandalism",
    hint: "Property, a vehicle or public facilities damaged",
    priority: "P4",
  },
  {
    kind: "Something else",
    hint: "A crime that is not on this list",
    priority: "P4",
  },
];

/** When it happened, as the reporter would say it. */
export const reportWhen = [
  { value: "now", label: "It is happening now" },
  { value: "today", label: "Earlier today" },
  { value: "before", label: "Before today" },
];

export const reportInjuries = ["Yes", "No", "Not sure"];

/** Grade a report: a crime still happening goes one grade up. */
export function gradeReport(kind: string, when: string, injured: string) {
  const base = reportKinds.find((k) => k.kind === kind)?.priority ?? "P4";
  const n = Number(base[1]);
  const raised = Math.max(
    1,
    n - (when === "now" ? 1 : 0) - (injured === "Yes" ? 1 : 0),
  );
  return `P${raised}` as Priority;
}

/**
 * The Force's public line for complaints about how a report was handled.
 * The Complaint Response Unit publishes these numbers; check them against
 * npf.gov.ng before launch, as numbers change.
 */
export const complaintLines = {
  calls: ["0805 700 0001", "0805 700 0002"],
  whatsapp: "0805 700 0003",
};

/**
 * Services that are a crime being reported, and the kind the report form
 * should start on. These never need an account: they go to /app/report.
 */
const REPORTS: Record<string, string> = {
  "open-criminal-case": "",
  "report-criminal-complaint": "",
  ecrime: "Cybercrime report",
  "ecrime-101364": "Cybercrime report",
  "report-bounce-cheques": "Fraud report",
  "report-bounce-cheques-bank": "Fraud report",
  "missing-person": "Missing person",
  "gender-based-violence": "Sexual assault",
};

/**
 * Services another body runs on its own site. The page explains them and
 * the button goes there: constables are recruited by the Police Service
 * Commission, not by the Force.
 */
export const externalPortals: Record<string, { href: string; name: string }> = {
  "apply-for-a-job": {
    href: "https://psc.gov.ng/",
    name: "Police Service Commission",
  },
};

/** Turnarounds that are not a length of time, so "Takes about…" does not fit. */
export const openEndedTurnaround = new Set([
  "Depends on the case",
  "Set by each recruitment exercise",
  "At least 72 hours",
]);

/** The report form's address for a service, or null if it is not a report. */
export function reportSlug(slug: string) {
  if (slug === "application-status") return "/app/track";
  if (slug in externalPortals) return externalPortals[slug].href;
  if (!(slug in REPORTS)) return null;
  return REPORTS[slug]
    ? `/app/report?kind=${encodeURIComponent(REPORTS[slug])}`
    : "/app/report";
}
