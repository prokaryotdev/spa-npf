/**
 * The project's one runnable check: search ranking, and the slug references
 * that tie the seeded portal rows to the generated catalogue. Node strips the
 * types, so there is no test runner and no build step:
 *   npm test
 */
import assert from "node:assert/strict";
import { search, suggest, popularServices } from "../app/search-index.ts";
import { services } from "../app/content-services.ts";
import { seedRequests, seedDocuments } from "../app/content-account.ts";

const top = (q) => search(q)[0]?.title;

// --- ranking -------------------------------------------------------------
// A whole-title match wins over a title that merely contains the word.
assert.equal(top("police clearance"), "Police Clearance Certificate");
// A word at the front of the title beats the same word buried mid-title.
assert.equal(top("fines"), "Fines Inquiry and Payment");
// Every term has to appear; nonsense matches nothing.
assert.equal(search("zzzz").length, 0);
assert.equal(search("").length, 0);
// Services lead the grouping, and the panel stays capped.
assert.equal(suggest("permit")[0].section, "Services");
assert.ok(suggest("permit").flatMap((g) => g.hits).length <= 8);
// The empty state has something to show.
assert.equal(popularServices.length, 5);

// --- arabic --------------------------------------------------------------
// The index is built from English content, so an Arabic query only works if
// the dictionary is folded into the haystack. These break the moment the two
// come apart.
assert.equal(search("حسن السيرة")[0]?.title, "Police Clearance Certificate");
assert.ok(search("شهادة").length > 0, "an Arabic query finds services");
// A typist writes hamza and teh marbuta either way; both must land.
const titles = (q) => search(q).map((h) => h.title);
assert.deepEqual(titles("شهاده"), titles("شهادة"));
assert.deepEqual(titles("الامن"), titles("الأمن"));
assert.ok(titles("الأمن").length > 0, "the folded query still matches");

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
// that can be quietly, enormously wrong. One CMS row reads "AED 300 or $ 88";
// stripping every non-digit from it made 30088, which summed into a 30,508
// dirham police clearance certificate on the catalogue card.
const pcc = services.find((s) => s.slug === "police-clearance-certificate");
assert.equal(pcc.feeSummary, "From AED 120", "cheapest tier plus the dirhams");
for (const service of services) {
  if (service.feeSummary === "Free of Charge") continue;
  assert.match(
    service.feeSummary,
    /^(From )?AED \d+(\.\d+)?$/,
    `bad fee summary on ${service.slug}: ${service.feeSummary}`,
  );
  // No Dubai Police service costs five figures. A summary that says so is a
  // parse failure, not a price.
  const amount = Number(service.feeSummary.match(/\d+(\.\d+)?/)[0]);
  assert.ok(amount < 10000, `implausible fee on ${service.slug}: ${amount}`);
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

console.log("search, catalogue and seeds ok");
