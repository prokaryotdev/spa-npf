/**
 * Translation coverage. Fails when a string a reader can see has no entry in
 * the Hausa, Yoruba or Igbo dictionary, which is the only way to keep three
 * 1,200-string dictionaries honest as the content files grow:
 *   node --import ./scripts/ts-resolve.mjs scripts/test-i18n.mjs
 *
 * Pass --list to print what is missing instead of failing on the count.
 */
import assert from "node:assert/strict";
import { collectWanted } from "./wanted-strings.mjs";
import { PROPER_NOUNS } from "./proper-nouns.mjs";

import * as ha from "../app/i18n/ha.ts";
import * as yo from "../app/i18n/yo.ts";
import * as ig from "../app/i18n/ig.ts";
import { haChrome } from "../app/i18n/ha-chrome.ts";
import { haHome } from "../app/i18n/ha-home.ts";
import { haServices } from "../app/i18n/ha-services.ts";
import { haPages } from "../app/i18n/ha-pages.ts";
import { haLegal } from "../app/i18n/ha-legal.ts";
import { haAccount } from "../app/i18n/ha-account.ts";
import { haOps } from "../app/i18n/ha-ops.ts";
import { haRecords } from "../app/i18n/ha-records.ts";
import { yoChrome } from "../app/i18n/yo-chrome.ts";
import { yoHome } from "../app/i18n/yo-home.ts";
import { yoServices } from "../app/i18n/yo-services.ts";
import { yoPages } from "../app/i18n/yo-pages.ts";
import { yoLegal } from "../app/i18n/yo-legal.ts";
import { yoAccount } from "../app/i18n/yo-account.ts";
import { yoOps } from "../app/i18n/yo-ops.ts";
import { yoRecords } from "../app/i18n/yo-records.ts";
import { igChrome } from "../app/i18n/ig-chrome.ts";
import { igHome } from "../app/i18n/ig-home.ts";
import { igServices } from "../app/i18n/ig-services.ts";
import { igPages } from "../app/i18n/ig-pages.ts";
import { igLegal } from "../app/i18n/ig-legal.ts";
import { igAccount } from "../app/i18n/ig-account.ts";
import { igOps } from "../app/i18n/ig-ops.ts";
import { igRecords } from "../app/i18n/ig-records.ts";

const wanted = await collectWanted();

const LANGS = {
  Hausa: {
    dictionary: ha.dictionary,
    parts: { haChrome, haHome, haServices, haPages, haLegal, haAccount, haOps, haRecords },
  },
  Yoruba: {
    dictionary: yo.dictionary,
    parts: { yoChrome, yoHome, yoServices, yoPages, yoLegal, yoAccount, yoOps, yoRecords },
  },
  Igbo: {
    dictionary: ig.dictionary,
    parts: { igChrome, igHome, igServices, igPages, igLegal, igAccount, igOps, igRecords },
  },
};

const list = process.argv.includes("--list");
for (const [name, { dictionary, parts }] of Object.entries(LANGS)) {
  const missing = [...wanted].filter(([key]) => !(key in dictionary));

  // No two files of one language may claim the same English string, or the
  // spread order silently decides which translation ships.
  const seen = new Map();
  const clashes = [];
  for (const [file, part] of Object.entries(parts))
    for (const key of Object.keys(part)) {
      const first = seen.get(key);
      if (first && part[key] !== parts[first][key])
        clashes.push(`${key}  (${first} vs ${file})`);
      else if (!first) seen.set(key, file);
    }

  // All four languages share the Latin alphabet, so there is no script test
  // to lean on: an entry left in English looks exactly like a translated one.
  // What is still catchable is the copy-paste that translated nothing at all,
  // so an entry whose value equals its key is treated as untranslated, unless
  // it is one of the names in proper-nouns.mjs, which read the same in every
  // language on purpose and carry no entry at all.
  const untranslated = Object.entries(dictionary).filter(
    ([key, value]) => value === key && !PROPER_NOUNS.has(key),
  );

  if (list) {
    for (const [key, where] of missing)
      console.log(`${name}\t${where}\t${JSON.stringify(key)}`);
    console.log(`${name}: ${missing.length} missing of ${wanted.size}`);
    continue;
  }
  assert.deepEqual(clashes, [], `${name}: conflicting entries:\n${clashes.join("\n")}`);
  assert.deepEqual(
    untranslated.map(([k]) => k),
    [],
    `${name}: dictionary entries left in English`,
  );
  assert.equal(
    missing.length,
    0,
    `${missing.length} of ${wanted.size} strings have no ${name}:\n` +
      missing
        .slice(0, 20)
        .map(([k, w]) => `  ${w}\t${k}`)
        .join("\n"),
  );
  console.log(`${name.toLowerCase()} coverage ok — ${wanted.size} strings`);
}
