/**
 * Translation coverage. Fails when a string a reader can see has no Hausa
 * entry, which is the only way to keep a 1,700-string dictionary honest as
 * the content files grow:
 *   node --import ./scripts/ts-resolve.mjs scripts/test-i18n.mjs
 *
 * Pass --list to print what is missing instead of failing on the count.
 */
import assert from "node:assert/strict";
import { collectWanted } from "./wanted-strings.mjs";
import { PROPER_NOUNS } from "./proper-nouns.mjs";

import { dictionary } from "../app/i18n/ha.ts";
import { haChrome } from "../app/i18n/ha-chrome.ts";
import { haHome } from "../app/i18n/ha-home.ts";
import { haServices } from "../app/i18n/ha-services.ts";
import { haPages } from "../app/i18n/ha-pages.ts";
import { haLegal } from "../app/i18n/ha-legal.ts";
import { haAccount } from "../app/i18n/ha-account.ts";
import { haOps } from "../app/i18n/ha-ops.ts";

const wanted = await collectWanted();

const missing = [...wanted].filter(([key]) => !(key in dictionary));

// No two dictionary files may claim the same English string, or the spread
// order silently decides which Hausa ships.
const parts = {
  haChrome,
  haHome,
  haServices,
  haPages,
  haLegal,
  haAccount,
  haOps,
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

// Hausa and English share the Latin alphabet, so there is no script test to
// lean on the way an Arabic dictionary could: an entry left in English looks
// exactly like a translated one. What is still catchable is the copy-paste
// that translated nothing at all, so an entry whose value equals its key is
// treated as untranslated — unless it is one of the names in proper-nouns.mjs,
// which are identical in both languages on purpose and carry no entry at all.
const notHausa = Object.entries(dictionary).filter(
  ([key, value]) => value === key && !PROPER_NOUNS.has(key),
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
    notHausa.map(([k]) => k),
    [],
    "dictionary entries left in English",
  );
  assert.equal(
    missing.length,
    0,
    `${missing.length} of ${wanted.size} strings have no Hausa:\n` +
      missing
        .slice(0, 20)
        .map(([k, w]) => `  ${w}\t${k}`)
        .join("\n"),
  );
  console.log(`hausa coverage ok — ${wanted.size} strings`);
}
