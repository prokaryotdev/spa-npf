/**
 * The shaping the crash reporter applies before anything reaches the log.
 * /api/report-error is public and unauthenticated, so these caps are the only
 * thing between a stranger with curl and the log the site is operated from:
 *   node --import ./scripts/ts-resolve.mjs scripts/test-report-error.mjs
 */
import assert from "node:assert/strict";

import { clampReport, LIMITS } from "../app/report-error.ts";

// A real report survives intact.
const real = clampReport({
  message: "Cannot read properties of undefined (reading 'slug')",
  stack: "TypeError: ...\n  at ServiceCatalogue",
  digest: "1947283746",
  url: "https://fct.npf.gov.ng/app/services",
  source: "error-boundary",
});
assert.equal(real.message, "Cannot read properties of undefined (reading 'slug')");
assert.equal(real.digest, "1947283746");
assert.equal(real.source, "error-boundary");

// Nothing without a message is worth a log line.
for (const junk of [null, undefined, "a string", 42, [], {}, { message: "" }, { message: "   " }])
  assert.equal(clampReport(junk), null, `should reject ${JSON.stringify(junk)}`);

// Every field is capped, however much arrives.
const huge = clampReport({
  message: "x".repeat(10_000),
  stack: "y".repeat(100_000),
  digest: "z".repeat(1_000),
  url: "u".repeat(5_000),
  source: "s".repeat(500),
});
assert.equal(huge.message.length, LIMITS.message);
assert.equal(huge.stack.length, LIMITS.stack);
assert.equal(huge.digest.length, LIMITS.digest);
assert.equal(huge.url.length, LIMITS.url);
assert.equal(huge.source.length, 40);

// Non-strings are dropped rather than coerced, so an object cannot smuggle
// itself into the log line as "[object Object]".
const odd = clampReport({ message: "real", stack: { toString: () => "nope" }, digest: 12345 });
assert.equal(odd.message, "real");
assert.equal(odd.stack, undefined);
assert.equal(odd.digest, undefined);

// Fields that are absent stay absent rather than becoming empty strings.
const bare = clampReport({ message: "just a message" });
assert.equal(bare.stack, undefined);
assert.equal(bare.url, undefined);

console.log("crash reports are clamped before they reach the log — ok");
