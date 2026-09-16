/**
 * Translation coverage. Fails when a string a reader can see has no Arabic
 * entry, which is the only way to keep a 1,700-string dictionary honest as
 * the content files grow:
 *   node --import ./scripts/ts-resolve.mjs scripts/test-i18n.mjs
 *
 * Pass --list to print what is missing instead of failing on the count.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { dictionary } from "../app/i18n/ar.ts";
import { arChrome } from "../app/i18n/ar-chrome.ts";
import { arHome } from "../app/i18n/ar-home.ts";
import { arServices } from "../app/i18n/ar-services.ts";
import { arPages } from "../app/i18n/ar-pages.ts";
import { arLegal } from "../app/i18n/ar-legal.ts";
import { arAccount } from "../app/i18n/ar-account.ts";
import { arOps } from "../app/i18n/ar-ops.ts";

const CONTENT = [
  "content.ts",
  "content-account.ts",
  "content-footer.ts",
  "content-ops.ts",
  "content-pages.ts",
  "content-services.ts",
  "content-sub.ts",
];

/** Mirrors app/i18n/localize.ts. Keep the two lists in step. */
const SKIP = new Set([
  "slug",
  "id",
  "icon",
  "href",
  "src",
  "image",
  "img",
  "logo",
  "cover",
  "file",
  "url",
  "email",
  "website",
  "color",
  "theme",
  "background",
  "status",
  "priority",
  "kind",
  "type",
  "category",
  "section",
  "role",
  "callsign",
]);

/** A string a reader sees, rather than a path, a code or a date. */
const isCopy = (s) => {
  const v = s.trim();
  if (v.length < 2 || !/\p{L}/u.test(v)) return false;
  if (/^[/#]/.test(v) || /^https?:|^mailto:|^tel:/.test(v)) return false;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return false; // email addresses
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return false; // ISO dates
  if (/^[a-z0-9]+([-_.][a-z0-9]+)*$/.test(v)) return false; // slugs, filenames
  if (/^[A-Z]{1,4}[-\d]*$/.test(v)) return false; // P1, PTL-14, AED
  if (/^\p{Script=Arabic}/u.test(v)) return false; // already Arabic
  // Measurements read the same in both languages on this site: file sizes,
  // speeds and plate-style codes are numerals plus a unit, not copy.
  if (/^[\d.,]+\s*(KB|MB|GB|km\/h|km|m|cm|AED)$/i.test(v)) return false;
  return true;
};

const wanted = new Map(); // string -> where it came from

function collect(value, where) {
  if (typeof value === "string") {
    if (isCopy(value) && !wanted.has(value)) wanted.set(value, where);
    return;
  }
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) return value.forEach((v) => collect(v, where));
  for (const [key, v] of Object.entries(value))
    if (!SKIP.has(key)) collect(v, where);
}

for (const file of CONTENT) {
  const loaded = await import(`../app/${file}`);
  for (const [name, value] of Object.entries(loaded)) {
    if (typeof value === "function") continue;
    collect(value, `${file}:${name}`);
  }
}

// t("…") keys written straight into the components.
const tsx = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "fonts" && entry.name !== "i18n") walk(p);
    } else if (/\.tsx?$/.test(entry.name)) tsx.push(p);
  }
})("app");

for (const file of tsx) {
  const src = fs.readFileSync(file, "utf8");
  for (const m of src.matchAll(/\bt\(\s*"((?:[^"\\]|\\.)*)"/g)) {
    const key = JSON.parse(`"${m[1]}"`);
    if (isCopy(key) && !wanted.has(key)) wanted.set(key, file);
  }
}

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
