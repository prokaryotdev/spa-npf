/**
 * Translation coverage. Fails when a string a reader can see has no Arabic
 * entry, which is the only way to keep a 1,700-string dictionary honest as
 * the content files grow:
 *   node --import ./scripts/ts-resolve.mjs scripts/test-i18n.mjs
 *
 * Pass --list to print what is missing instead of failing on the count.
 */
import assert from "node:assert/strict";
import { collectWanted } from "./wanted-strings.mjs";

import { dictionary } from "../app/i18n/ar.ts";
import { arChrome } from "../app/i18n/ar-chrome.ts";
import { arHome } from "../app/i18n/ar-home.ts";
import { arServices } from "../app/i18n/ar-services.ts";
import { arPages } from "../app/i18n/ar-pages.ts";
import { arLegal } from "../app/i18n/ar-legal.ts";
import { arAccount } from "../app/i18n/ar-account.ts";
import { arOps } from "../app/i18n/ar-ops.ts";

const wanted = await collectWanted();

const missing = [...wanted].filter(([key]) => !(key in dictionary));

// No two dictionary files may claim the same English string, or the spread
// order silently decides which Arabic ships.
const parts = {
  arChrome,
  arHome,
  arServices,
  arPages,
  arLegal,
  arAccount,
  arOps,
};
const seen = new Map();
const clashes = [];
for (const [name, part] of Object.entries(parts))
  for (const key of Object.keys(part)) {
    const first = seen.get(key);
    if (first && part[key] !== parts[first][key])
      clashes.push(`${key}  (${first} vs ${name})`);
    else if (!first) seen.set(key, name);
  }

// Every Arabic value must actually be Arabic — a copy-paste that left the
// English in place reads as "translated" to the fallback but not to a reader.
const notArabic = Object.entries(dictionary).filter(
  ([key, value]) => !/\p{Script=Arabic}/u.test(value) && value === key,
);

if (process.argv.includes("--list")) {
  for (const [key, where] of missing)
    console.log(`${where}\t${JSON.stringify(key)}`);
  console.log(`\n${missing.length} missing of ${wanted.size}`);
} else {
  assert.deepEqual(
    clashes,
    [],
    `conflicting dictionary entries:\n${clashes.join("\n")}`,
  );
  assert.deepEqual(
    notArabic.map(([k]) => k),
    [],
    "dictionary entries left in English",
  );
  assert.equal(
    missing.length,
    0,
    `${missing.length} of ${wanted.size} strings have no Arabic:\n` +
      missing
        .slice(0, 20)
        .map(([k, w]) => `  ${w}\t${k}`)
        .join("\n"),
  );
  console.log(`arabic coverage ok — ${wanted.size} strings`);
}
