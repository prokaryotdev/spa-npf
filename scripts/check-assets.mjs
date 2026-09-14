/**
 * Fails if any /img or /cms path in app/content-*.ts has no file behind it.
 *
 * The generators copy asset paths straight out of the CMS, and some of those
 * files were never mirrored — three /img/contactus icons shipped as broken
 * images because nothing rendered them until a form did. Run from the repo
 * root, and after any generator:
 *   node scripts/check-assets.mjs
 */
import fs from "node:fs";
import path from "node:path";

const files = fs
  .readdirSync("app")
  .filter((f) => /^content.*\.ts$/.test(f))
  .map((f) => path.join("app", f));

const missing = new Map();
let checked = 0;

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const refs = new Set(
    [...source.matchAll(/"(\/(?:img|cms)\/[^"]+)"/g)].map((m) => m[1]),
  );
  checked += refs.size;
  for (const ref of refs) {
    // Some CMS paths arrive percent-encoded; the mirrored file is not.
    const onDisk =
      fs.existsSync("public" + ref) ||
      fs.existsSync("public" + decodeURIComponent(ref));
    if (!onDisk) missing.set(ref, (missing.get(ref) ?? []).concat(path.basename(file)));
  }
}

for (const [ref, where] of missing) {
  console.error(`missing: ${ref}  <- ${[...new Set(where)].join(", ")}`);
}

console.log(`${checked} asset refs checked, ${missing.size} missing`);
process.exit(missing.size ? 1 : 0);
