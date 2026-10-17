/**
 * The project's one runnable check: search ranking, and the slug references
 * that tie the seeded portal rows to the generated catalogue. Node strips the
 * types, so there is no test runner and no build step:
 *   npm test
 */
import assert from "node:assert/strict";
import { filterBy } from "../app/search-text.ts";
import { search, suggest, popularServices, nearest } from "../app/search-index.ts";
import { services } from "../app/content-services.ts";
import { seedRequests, seedDocuments } from "../app/content-account.ts";

const top = (q) => search(q)[0]?.title;

// --- ranking -------------------------------------------------------------
// A whole-title match wins over a title that merely contains the word.
assert.equal(top("police clearance"), "Police Clearance Certificate");
// A word at the front of the title beats the same word buried mid-title
// ("Report a Police Officer").
assert.match(top("police"), /^Police /);
// Every term has to appear; nonsense matches nothing.
assert.equal(search("zzzz").length, 0);
assert.equal(search("").length, 0);
// Word order, punctuation and a typo still find it.
assert.equal(top("clearance police"), "Police Clearance Certificate");
assert.equal(top("police-clearance"), "Police Clearance Certificate");
assert.equal(top("polce clearance"), "Police Clearance Certificate");
// A real word never pulls in its lookalikes.
assert.ok(search("fine").map((h) => h.title).every((t) => !/\bline\b/i.test(t)));
// Short terms stay exact, or "fin" would match half the site.
assert.equal(search("qqq").length, 0);
// Services lead the grouping, and the panel stays capped.
assert.equal(suggest("permit")[0].section, "Services");
assert.ok(suggest("permit").flatMap((g) => g.hits).length <= 8);
// The empty state has something to show.
assert.equal(popularServices.length, 5);

// --- hausa --------------------------------------------------------------
// The index is built from English content, so a Hausa query only works if the
// dictionary is folded into the haystack. These break the moment the two come
// apart.
assert.equal(
  search("takardar shaida")[0]?.title,
  "Police Clearance Certificate",
);
assert.ok(search("takardar shaida").length > 0, "a Hausa query finds services");

// Nobody has ɓ ɗ ƙ on their keyboard, so the hooked spelling and the plain
// one have to return the same list — in both directions.
const titles = (q) => search(q).map((h) => h.title);
assert.deepEqual(titles("bukatu"), titles("buƙatu"));
assert.deepEqual(titles("'yan sanda"), titles("yan sanda"));
assert.ok(titles("buƙatu").length > 0, "the folded query still matches");

// The common name finds the official one.
assert.equal(top("character certificate"), "Police Clearance Certificate");

// --- smarter matching ------------------------------------------------------
// A question is not six required words.
assert.equal(top("how do i get a police clearance"), "Police Clearance Certificate");
// Plurals, endings and two slips in a long word.
assert.equal(top("clearence certificat"), "Police Clearance Certificate");
assert.ok(titles("accidents").some((t) => /Accident/.test(t)));
// What people call it finds the service.
assert.equal(top("gun"), "Firearm Licence");
assert.equal(top("bribe"), "Complaint Against a Police Officer");
// Short words only start a word: "cid" is not inside "incident".
assert.equal(top("cid"), "CID Clearance Certificate");
assert.ok(search("id").every((h) => /Lost/.test(h.title)));
// Table rows find their Information page, which opens filtered.
assert.match(search("seat belt")[0].href, /traffic-offences-and-penalties\?q=seat%20belt$/);
assert.match(top("police act"), /Laws/);
// "&" and "and" are one word.
assert.deepEqual(titles("lost & found"), titles("lost and found"));
// No hit has every word: offer what has most of them, not nothing.
assert.ok(search("stolen phone").length > 0);
// Yoruba and Igbo, typed without their marks.
assert.equal(top("Iwe-eri Imototo Olopaa"), "Police Clearance Certificate");
assert.equal(top("Asambodo Nkwenye Ndi Uwe Ojii"), "Police Clearance Certificate");

// --- board filter --------------------------------------------------------
// The request, incident and unit boards: any word order, hooks folded, a
// slip forgiven.
const board = ["Police Character Certificate NPF-001", "Ƙasa patrol unit", "Escort request"];
const pick = (q) => filterBy(board, q, (x) => x);
assert.deepEqual(pick("certificate police"), [board[0]]);
assert.deepEqual(pick("kasa"), [board[1]]);
assert.deepEqual(pick("escrot"), [board[2]]);
assert.deepEqual(pick("npf-001"), [board[0]]);
assert.deepEqual(pick(""), board);
assert.equal(pick("zzzz").length, 0);
// A minus drops a word; a hyphen inside one is still part of it.
assert.deepEqual(pick("-patrol"), [board[0], board[2]]);
assert.deepEqual(pick("certificate -npf"), []);
// Quotes hold words together, in order, from the start of a word.
assert.deepEqual(pick('"patrol unit"'), [board[1]]);
assert.deepEqual(pick('"unit patrol"'), []);
assert.deepEqual(pick('"character cert'), [board[0]]);

// Everyday words for what the rows call something else.
{
  const { penaltyPoints } = await import("../app/content-sub.ts");
  const rows = (q) =>
    filterBy(penaltyPoints.rows, q, (r) => Object.values(r).join(" ")).map((r) => r.description);
  assert.match(rows("seatbelt")[0], /seat belt/);
  assert.match(rows("drunk")[0], /alcohol/);
  assert.match(rows("overspeding")[0], /speed limit/);
}

// --- catalogue -----------------------------------------------------------
const slugs = new Set(services.map((s) => s.slug));
assert.equal(slugs.size, services.length, "service slugs must be unique");
for (const service of services) {
  // A slug is a route segment. An absolute CMS URL once leaked into one and
  // took the whole build down at the prerender step.
  assert.match(service.slug, /^[a-z0-9-]+$/, `bad slug: ${service.slug}`);
  for (const related of service.related)
    assert.ok(slugs.has(related.slug), `dangling related: ${related.slug}`);
}
// Service hits link at the detail route, not the catalogue.
assert.match(
  search("police clearance")[0].href,
  /^\/app\/services\/[a-z0-9-]+$/,
);

// --- fees ----------------------------------------------------------------
// The summary is generated arithmetic, so it is the one field on a service
// that can be quietly, enormously wrong. One row reads "₦120,000"; stripping
// every non-digit from it made 120000, which summed into a ₦168,000 police
// clearance certificate on the catalogue card.
const pcc = services.find((s) => s.slug === "police-clearance-certificate");
// Its fee is set per application on the POSSAP invoice, and the page says
// so rather than printing a figure nobody published.
assert.equal(pcc.feeSummary, "On your POSSAP invoice");
/** Fees set by another system, named rather than priced. */
const SET_ELSEWHERE = new Set(["On your POSSAP invoice", "On the CMRIS portal"]);
const naira = (s) => Number(s.replace(/[^\d.]/g, ""));
for (const service of services) {
  if (service.feeSummary === "Free of Charge") continue;
  if (SET_ELSEWHERE.has(service.feeSummary)) continue;
  assert.match(
    service.feeSummary,
    /^(From )?₦\d{1,3}(,\d{3})*(\.\d+)?$/,
    `bad fee summary on ${service.slug}: ${service.feeSummary}`,
  );
  // No Nigeria Police Force service costs seven figures. A summary that says
  // so is a parse failure, not a price.
  const amount = naira(service.feeSummary);
  assert.ok(amount < 1_000_000, `implausible fee on ${service.slug}: ${amount}`);
  // Every row the summary was built from has to be legible on its own too.
  for (const fee of service.fees)
    assert.ok(fee.value.trim(), `empty fee row on ${service.slug}`);
}

// --- seeds ---------------------------------------------------------------
for (const request of seedRequests)
  assert.ok(slugs.has(request.slug), `seed request slug: ${request.slug}`);
const ids = new Set(seedRequests.map((r) => r.id));
for (const doc of seedDocuments)
  assert.ok(ids.has(doc.request), `seed document request: ${doc.request}`);

// --- 404 guesses ---------------------------------------------------------
const guess = (path) => nearest(path).map((h) => h.href);
// A slug that names a page wins, whatever its case or dashes.
assert.equal(guess("/app/contactus")[0], "/app/home/contactUs");
assert.equal(guess("/app/police-clearence")[0], "/app/services/police-clearance-certificate");
// A dead slug under a section still offers the section.
assert.deepEqual(guess("/app/services/no-such-service"), ["/app/services"]);
// Nothing close is nothing, not a scatter of half matches.
assert.deepEqual(guess("/app/this-page-is-gone"), []);
assert.deepEqual(guess("/x/%E0%A4%A"), []);

console.log("search, catalogue and seeds ok");

// --- services page order -------------------------------------------------
// Every service has exactly one place in the importance order.
{
  const { serviceImportance } = await import("../app/content-services.ts");
  const slugs = services.map((s) => s.slug);
  assert.deepEqual([...serviceImportance].sort(), [...slugs].sort());
  assert.equal(new Set(serviceImportance).size, serviceImportance.length);
}
