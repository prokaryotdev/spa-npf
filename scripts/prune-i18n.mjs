/**
 * Deletes dictionary entries no surviving page can show. Run after removing
 * pages or content, alongside scripts/prune-assets.mjs:
 *   node --import ./scripts/ts-resolve.mjs scripts/prune-i18n.mjs --apply
 *
 * "A string a reader sees" is decided exactly as scripts/test-i18n.mjs decides
 * it, so a pruned dictionary still passes coverage. Without --apply it reports.
 */
import fs from "node:fs";
import path from "node:path";

const apply = process.argv.includes("--apply");
const APP = new URL("../app/", import.meta.url).href;

/** Mirrors app/i18n/localize.ts and scripts/test-i18n.mjs. Keep them in step. */
const SKIP = new Set([
  "slug", "id", "icon", "href", "src", "image", "img", "logo", "cover",
  "file", "url", "email", "website", "color", "theme", "background",
  "status", "priority", "kind", "type", "category", "section", "role",
  "callsign",
]);

const isCopy = (s) => {
  const v = s.trim();
  if (v.length < 2 || !/\p{L}/u.test(v)) return false;
  if (/^[/#]/.test(v) || /^https?:|^mailto:|^tel:/.test(v)) return false;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return false;
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return false;
  if (/^[a-z0-9]+([-_.][a-z0-9]+)*$/.test(v)) return false;
  if (/^[A-Z]{1,4}[-\d]*$/.test(v)) return false;
  if (/^\p{Script=Arabic}/u.test(v)) return false;
  if (/^[\d.,]+\s*(KB|MB|GB|km\/h|km|m|cm|AED)$/i.test(v)) return false;
  return true;
};

const wanted = new Set();
function collect(value) {
  if (typeof value === "string") {
    if (isCopy(value)) wanted.add(value);
    return;
  }
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) return value.forEach(collect);
  for (const [key, v] of Object.entries(value)) if (!SKIP.has(key)) collect(v);
}

for (const file of fs.readdirSync("app").filter((f) => /^content.*\.ts$/.test(f))) {
  const loaded = await import(`${APP}${file}`);
  for (const value of Object.values(loaded))
    if (typeof value !== "function") collect(value);
}

// t("…") keys written straight into the components.
const sources = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "fonts" && entry.name !== "i18n") walk(p);
    } else if (/\.tsx?$/.test(entry.name)) sources.push(p);
  }
})("app");
for (const file of sources)
  for (const m of fs.readFileSync(file, "utf8").matchAll(/\bt\(\s*"((?:[^"\\]|\\.)*)"/g)) {
    const key = JSON.parse(`"${m[1]}"`);
    if (isCopy(key)) wanted.add(key);
  }

/** One `"key": "value",` entry, in either quote style, value possibly wrapped. */
const ENTRY =
  /^  (?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|([A-Za-z_$][\w$]*)):\s*(?:\n\s*)?"(?:[^"\\]|\\.)*",[ \t]*\n/gm;

let total = 0;
let removed = 0;
for (const f of fs.readdirSync("app/i18n").filter((f) => /^ar-.*\.ts$/.test(f))) {
  const p = path.join("app/i18n", f);
  const src = fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
  const hits = [...src.matchAll(ENTRY)];
  const keys = hits.map((m) =>
    m[1] !== undefined
      ? JSON.parse(`"${m[1]}"`)
      : m[2] !== undefined
        ? m[2].replace(/\\(.)/g, "$1")
        : m[3],
  );
  const real = Object.keys(Object.values(await import(`${APP}i18n/${f}`))[0]);
  total += real.length;
  if (keys.length !== real.length) {
    console.error(`SKIP ${f}: matched ${keys.length} of ${real.length} entries`);
    continue;
  }
  let out = "";
  let i = 0;
  let cut = 0;
  hits.forEach((m, n) => {
    if (wanted.has(keys[n])) return;
    out += src.slice(i, m.index);
    i = m.index + m[0].length;
    cut++;
  });
  out += src.slice(i);
  // section comments the sweep left with nothing under them
  let prev;
  do {
    prev = out;
    out = out.replace(/^  \/\/ ---[^\n]*\n\n*(?=  \/\/ ---|\};)/gm, "");
  } while (out !== prev);
  out = out.replace(/\n{3,}/g, "\n\n");
  if (apply) fs.writeFileSync(p, out);
  removed += cut;
  if (cut) console.log(`${f}: -${cut} of ${real.length}`);
}

console.log(
  `\n${total} entries, ${wanted.size} still shown, ${removed} unused` +
    (apply ? " — removed" : " — dry run, pass --apply"),
);
