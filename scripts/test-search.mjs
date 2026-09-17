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

// --- hausa --------------------------------------------------------------
// The index is built from English content, so a Hausa query only works if the
// dictionary is folded into the haystack. These break the moment the two come
// apart.
assert.equal(
  search("takardar shaidar tsabtar rikodi")[0]?.title,
  "Police Clearance Certificate",
);
assert.ok(search("takardar shaida").length > 0, "a Hausa query finds services");

// Nobody has ɓ ɗ ƙ on their keyboard, so the hooked spelling and the plain
// one have to return the same list — in both directions.
const titles = (q) => search(q).map((h) => h.title);
assert.deepEqual(titles("bukatu"), titles("buƙatu"));
assert.deepEqual(titles("'yan sanda"), titles("yan sanda"));
assert.ok(titles("buƙatu").length > 0, "the folded query still matches");

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
assert.equal(pcc.feeSummary, "From ₦48,000", "cheapest tier plus the levies");
const naira = (s) => Number(s.replace(/[^\d.]/g, ""));
for (const service of services) {
  if (service.feeSummary === "Free of Charge") continue;
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

console.log("search, catalogue and seeds ok");
