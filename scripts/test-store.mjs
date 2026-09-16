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

const { signIn, submitRequest, advanceRequest, signOut, subscribe } =
  await import("../app/components/store.ts");

// subscribe() is what hydrates the module from storage; nothing reads until
// a screen mounts, so the test has to mount one.
subscribe(() => {});

const shared = () => JSON.parse(localStorage.getItem("dp:state") ?? "{}");
const session = () => JSON.parse(sessionStorage.getItem("dp:session") ?? "null");

// --- the session is this tab's, and nobody else's ------------------------
signIn({
  name: "Khalid Al Mansoori",
  emiratesId: "784-1989-1234567-1",
  email: "k@example.ae",
  phone: "+971 50 123 4567",
  role: "citizen",
});
assert.equal(session().role, "citizen", "session lands in sessionStorage");
assert.ok(
  !("session" in shared()),
  "the shared blob must never carry a session — that is what evicted the other tab",
);

// --- the work is everyone's ----------------------------------------------
const filed = submitRequest({
  slug: "police-clearance-certificate",
  service: "Police Clearance Certificate",
  fee: "AED 200",
});
assert.equal(shared().requests[0].id, filed.id, "a request is shared work");
assert.equal(shared().requests[0].status, "Submitted");

// --- the officer tab decides it, and this tab keeps its own session ------
// Another tab writes the shared blob, then the browser raises `storage` here.
const theirs = shared();
theirs.requests = theirs.requests.map((r) =>
  r.id === filed.id ? { ...r, status: "In Review" } : r,
);
localStorage.setItem("dp:state", JSON.stringify(theirs));
for (const fn of handlers) fn({ key: "dp:state" });

assert.equal(
  session().emiratesId,
  "784-1989-1234567-1",
  "another tab's work must not sign this one out",
);

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
  name: "Khalid Al Mansoori",
  emiratesId: "784-1989-1234567-1",
  email: "k@example.ae",
  phone: "+971 50 123 4567",
  role: "citizen",
});

globalThis.sessionStorage = store();
signIn({
  name: "Lt. Noura Bin Haider",
  emiratesId: "784-1991-7654321-3",
  email: "n@dubaipolice.gov.ae",
  phone: "+971 50 987 6543",
  role: "officer",
  rank: "Lieutenant",
  station: "Al Barsha Police Station",
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

console.log("store: session per tab, work shared — ok");
console.log("store: two tabs, two roles, one queue — ok");
