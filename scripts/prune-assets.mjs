/**
 * Deletes every file under public/ that no source file
 * references any more. Run after removing pages or content:
 *   node scripts/prune-assets.mjs --apply
 *
 * Without --apply it only reports. The mirrored CMS assets are 60MB of the
 * repo, and the generators copy in far more than the pages ever render.
 */
import fs from "node:fs";
import path from "node:path";

const apply = process.argv.includes("--apply");

const sources = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "fonts") walk(p);
    } else if (/\.(tsx?|mjs|css|txt|json)$/.test(entry.name)) sources.push(p);
  }
})("app");
for (const f of fs.readdirSync("scripts"))
  if (/\.(mjs|txt)$/.test(f)) sources.push(path.join("scripts", f));

/**
 * Every root-relative file path in the sources. Not only /img and /cms: the
 * logo, the crest and everything under /npf live elsewhere in public/.
 */
const referenced = new Set();
for (const file of sources) {
  const src = fs.readFileSync(file, "utf8");
  for (const m of src.matchAll(/\/[^"'`)\s]+\.\w+/g)) {
    referenced.add(m[0]);
    referenced.add(decodeURIComponent(m[0]));
  }
}

const orphans = [];
let kept = 0;
let freed = 0;
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p);
      continue;
    }
    const ref = "/" + path.relative("public", p).split(path.sep).join("/");
    if (referenced.has(ref) || referenced.has(decodeURIComponent(ref))) {
      kept++;
      continue;
    }
    orphans.push(p);
    freed += fs.statSync(p).size;
  }
})("public");

for (const p of orphans) if (apply) fs.rmSync(p);
if (apply)
  // directories the sweep emptied
  (function prune(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }))
      if (entry.isDirectory()) prune(path.join(dir, entry.name));
    if (dir !== "public" && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
  })("public");

console.log(
  `${kept} referenced, ${orphans.length} orphaned ` +
    `(${(freed / 1048576).toFixed(1)} MB)${apply ? " — deleted" : " — dry run, pass --apply"}`,
);
