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

import { collectWanted } from "./wanted-strings.mjs";

const apply = process.argv.includes("--apply");
const APP = new URL("../app/", import.meta.url).href;

const wanted = new Set((await collectWanted()).keys());

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
