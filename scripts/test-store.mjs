/**
 * The store's one moving part worth a check: the session is per-tab, the work
 * is shared. Getting that split wrong is invisible in one tab and breaks the
 * whole two-sided demo in two:
 *   node --import ./scripts/ts-resolve.mjs scripts/test-store.mjs
 */
import assert from "node:assert/strict";

/** Just enough browser for the module to run outside one. */
const store = () => {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
};

const handlers = [];
globalThis.localStorage = store();
globalThis.sessionStorage = store();
globalThis.window = {
  addEventListener: (type, fn) => type === "storage" && handlers.push(fn),
  removeEventListener: () => {},
};

const { KEY, signIn, submitRequest, advanceRequest, signOut, subscribe, updateIncident } =
  await import("../app/components/store.ts");

// subscribe() is what hydrates the module from storage; nothing reads until
// a screen mounts, so the test has to mount one.
subscribe(() => {});

const shared = () => JSON.parse(localStorage.getItem(KEY) ?? "{}");
const session = () => JSON.parse(sessionStorage.getItem("dp:session") ?? "null");

// --- the session is this tab's, and nobody else's ------------------------
signIn({
  name: "Chinedu Okafor",
  nin: "12345678901",
  email: "k@example.ng",
  phone: "+234 803 123 4567",
  role: "citizen",
});
assert.equal(session().role, "citizen", "session lands in sessionStorage");
assert.ok(
  !("session" in shared()),
  "the shared blob must never carry a session — that is what evicted the other tab",
);

// --- the work is everyone's ----------------------------------------------
const filed = submitRequest({
  slug: "police-character-certificate",
  service: "Police Character Certificate",
  fee: "Shown on POSSAP before you pay",
});
assert.equal(shared().requests[0].id, filed.id, "a request is shared work");
assert.equal(shared().requests[0].status, "Submitted");

// --- the officer tab decides it, and this tab keeps its own session ------
// Another tab writes the shared blob, then the browser raises `storage` here.
const theirs = shared();
theirs.requests = theirs.requests.map((r) =>
  r.id === filed.id ? { ...r, status: "In Review" } : r,
);
localStorage.setItem("dp:state:v2", JSON.stringify(theirs));
for (const fn of handlers) fn({ key: "dp:state:v2" });

assert.equal(
  session().nin,
  "12345678901",
  "another tab's work must not sign this one out",
);

// --- the applicant answers, and the request goes back to the officer -----
// "Action Needed" parks a request on the citizen's screen. If replying does
// not clear the note and move it back into the queue, it parks there for good.
advanceRequest(filed.id, "Action Needed", "Send a clearer passport copy.");
assert.equal(
  shared().requests.find((r) => r.id === filed.id).note,
  "Send a clearer passport copy.",
  "the ask is the note the applicant reads",
);

advanceRequest(filed.id, "In Review", "Uploaded a new copy.", "Reply sent");
const answered = shared().requests.find((r) => r.id === filed.id);
assert.equal(answered.status, "In Review", "replying returns it to the queue");
assert.equal(answered.note, undefined, "and clears the ask it answered");
assert.deepEqual(
  answered.timeline.at(-1).label,
  "Reply sent",
  "the history says the applicant moved it, not the officer",
);
assert.equal(answered.timeline.at(-1).note, "Uploaded a new copy.");

// --- and signing out here leaves the shared work standing ---------------
advanceRequest(filed.id, "Completed");
signOut();
assert.equal(session(), null, "signing out clears this tab");
assert.equal(
  shared().requests.find((r) => r.id === filed.id).status,
  "Completed",
  "signing out must not take the work with it",
);

// --- and the bug this split exists to kill --------------------------------
// A second tab is a second sessionStorage over the same localStorage. Signing
// in there used to overwrite the one session everybody shared, which signed
// the first tab out. Swapping the backing store is what a second tab *is*.
const tabOne = sessionStorage;
signIn({
  name: "Chinedu Okafor",
  nin: "12345678901",
  email: "k@example.ng",
  phone: "+234 803 123 4567",
  role: "citizen",
});

globalThis.sessionStorage = store();
signIn({
  name: "Insp. Ngozi Aliyu",
  nin: "76543210987",
  email: "n@npf.gov.ng",
  phone: "+234 803 987 6543",
  role: "officer",
  rank: "Inspector",
  station: "Wuse Police Station",
});

assert.equal(
  JSON.parse(sessionStorage.getItem("dp:session")).role,
  "officer",
  "the officer tab is the officer",
);
assert.equal(
  JSON.parse(tabOne.getItem("dp:session")).role,
  "citizen",
  "the citizen tab is still the citizen — this is the whole fix",
);
assert.ok(!("session" in shared()), "and neither one leaked into shared work");

// --- a call closes with its outcome, and reopening takes it back ----------
const call = () => shared().incidents.find((i) => i.id === "NPF-4415");
updateIncident("NPF-4415", { status: "Closed", outcome: "Arrest made" });
assert.equal(call().outcome, "Arrest made", "the outcome lands on the call");
assert.ok(
  call().log.some((l) => l.text === "Outcome: {outcome}." && l.vars.outcome === "Arrest made"),
  "and in its log",
);
assert.equal(
  shared().units.find((u) => u.callsign === "Patrol 04").status,
  "Available",
  "the unit goes back on the air",
);
updateIncident("NPF-4415", { status: "On Scene" });
assert.equal(call().outcome, undefined, "reopening clears the outcome");
assert.equal(call().closed, null, "and the closing stamp");

console.log("store: session per tab, work shared — ok");
console.log("store: a call closes with its outcome — ok");
console.log("store: two tabs, two roles, one queue — ok");

// --- the records behind the calls ------------------------------------------
const more = await import("../app/components/store.ts");
const unit = (c) => shared().units.find((u) => u.callsign === c);

// Backup units wear the call's status, and go back on the air when it closes.
more.updateIncident("NPF-4417", { unit: "Patrol 12", assignee: "Sgt. R. Okafor", status: "Dispatched" });
more.updateIncident("NPF-4417", { backup: ["Patrol 14"] });
assert.equal(unit("Patrol 14").status, "Assigned", "backup goes en route with the call");
assert.equal(unit("Patrol 14").incident, "NPF-4417");
more.updateIncident("NPF-4417", { status: "Closed", outcome: "Arrest made" });
assert.equal(unit("Patrol 14").status, "Available", "backup clears with the call");
assert.equal(unit("Patrol 12").status, "Available");

// A case opened from a call points both ways, and books a suspect in.
const opened = more.openCase({
  incident: "NPF-4417",
  offence: "Assault",
  summary: "Test",
  where: shared().incidents.find((i) => i.id === "NPF-4417").where,
});
assert.match(opened.id, /^CR\/LAG\/\d{4}\/\d{4}$/, "crime reference format");
assert.equal(shared().incidents.find((i) => i.id === "NPF-4417").caseId, opened.id);
const held = more.bookIn({
  name: "Test Suspect",
  sex: "Male",
  offence: "Assault",
  caseId: opened.id,
  where: opened.where,
  arrested: new Date(Date.now() - 25 * 3_600_000).toISOString(),
  courtNear: true,
  rights: { informed: true, kin: true, lawyer: true, medical: false },
});
assert.equal(more.custodyLimit(held), 24, "a court within 40 km is the 24-hour limit");
assert.ok(
  shared().cases.find((c) => c.id === opened.id).people.some((p) => p.name === "Test Suspect"),
  "the suspect joins the case",
);
more.updateDetainee(held.id, { status: "Bail granted" });
assert.ok(shared().custody.find((d) => d.id === held.id).released, "leaving custody is stamped");

// The emergency button puts a P1 at the top of that command's queue.
const sos = more.raiseEmergency("Patrol 09");
assert.equal(sos.priority, "P1");
assert.equal(unit("Patrol 09").emergency, sos.id);
more.clearEmergency("Patrol 09");
assert.equal(unit("Patrol 09").emergency, null, "a supervisor stands it down");

// A reporter adding to their report reaches the call and its case.
assert.ok(more.addToReport("npf-4417", "The car was a red Golf.", []));
assert.ok(
  shared().cases.find((c) => c.id === opened.id).log.some((l) => l.by === "Reporter"),
  "the investigator sees what the reporter added",
);
assert.equal(more.addToReport("NPF-0000", "x", []), false, "an unknown reference adds nothing");

// A completed request issues a number anyone can verify.
more.advanceRequest(filed.id, "Completed");
const doc = shared().requests.find((r) => r.id === filed.id).docNo;
assert.match(doc, /^NPF\/\d{4}\/\d{6}$/);
assert.equal(more.findDocument(doc.toLowerCase())?.id, filed.id, "verification ignores case");
assert.equal(more.findDocument("NPF/2026/000000"), null, "a made-up number is not ours");

// A withdrawn document stops verifying; its issue date does not drift.
const issued = shared().requests.find((r) => r.id === filed.id).docIssued;
more.attachToRequest(filed.id, ["scan.pdf"]);
assert.equal(shared().requests.find((r) => r.id === filed.id).docIssued, issued, "later edits keep the issue date");
more.advanceRequest(filed.id, "Rejected", "Issued in error");
assert.equal(more.findDocument(doc), null, "a withdrawn document no longer verifies");

// Taking a warning off a call is logged, as putting it on is.
more.updateIncident("NPF-4416", { flags: ["Weapon reported"] });
more.updateIncident("NPF-4416", { flags: [] });
assert.ok(
  shared().incidents.find((i) => i.id === "NPF-4416").log.some((l) => l.text === "Flag removed: {flag}."),
  "removing a flag writes a line",
);

// A relief handover changes free crews now and busy ones when they clear.
const before12 = unit("Patrol 12");
const next = before12.relief === "A" ? "B" : "A";
more.updateIncident("NPF-4411", { unit: "Patrol 26", status: "Dispatched" });
more.handOver(["Patrol 12", "Patrol 26"], next);
assert.equal(unit("Patrol 12").officer, before12.crew[next], "a free unit takes the next crew");
assert.equal(unit("Patrol 26").heldOver, next, "a busy unit is held over");
more.updateIncident("NPF-4411", { status: "Closed", outcome: "Advice given" });
assert.equal(unit("Patrol 26").relief, next, "and changes crew when it clears");
more.reportPosition("Patrol 12", { lat: 6.6, lng: 3.35 });
assert.ok(unit("Patrol 12").fixAt, "a position report is stamped");

console.log("store: backup, cases, custody, emergencies, verification, roster — ok");

// Every State Command sits in exactly one zonal command.
const { ZONAL_COMMANDS } = await import("../app/content-records.ts");
const { STATES } = await import("../app/geo.ts");
const placed = ZONAL_COMMANDS.flatMap((z) => z.states);
assert.equal(ZONAL_COMMANDS.length, 17, "seventeen zonal commands");
assert.deepEqual([...placed].sort(), STATES.map((s) => s.name).sort(), "all 37 commands, each once");
console.log("zones: 17 zonal commands cover the 37 commands once each — ok");

// A pinned FCT report reaches the nearest real division; elsewhere, the LGA.
const geo = await import("../app/geo.ts");
assert.equal(geo.divisionFor("FCT", "Abuja Municipal", { lat: 9.077, lng: 7.475 }), "Wuse II Division");
assert.equal(geo.divisionFor("FCT", "Abuja Municipal"), "Abuja Municipal Division", "no pin, no guess");
assert.equal(geo.divisionFor("Lagos", "Ikeja", { lat: 6.6, lng: 3.35 }), "Ikeja Division");
console.log("divisions: a pin finds the nearest real division — ok");

// A reference as people type or paste it off a receipt.
{
  const { cleanRef } = await import("../app/components/store.ts");
  for (const raw of ["npf 4418", "NPF4418", "#4418", "4418", "Ref: NPF-4418.", "npf_4418", "NPF–44I8", " npf-O418 "])
    assert.match(cleanRef(raw), /^NPF-[01]?4[14]18$|^NPF-0418$/, raw);
  assert.equal(cleanRef("npf 2026 1234"), "NPF-2026-1234");
  assert.equal(cleanRef("NPF—2026–1234"), "NPF-2026-1234");
  assert.equal(cleanRef("npf"), "");
  console.log("references: typed and pasted shapes clean up — ok");
}
