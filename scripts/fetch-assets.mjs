/**
 * Mirrors site assets, paced and verified.
 *
 * Two traps this works around: the server answers with the SPA's index.html for
 * image requests that do not send an image Accept header, and it starts doing
 * the same when requests arrive too fast. So every response is checked for an
 * HTML body and retried after a wait.
 *
 * Usage: node scripts/fetch-assets.mjs <map-file>
 *   map file lines: "<remote path>\t<local path under public/>"
 */
import fs from "node:fs";
import path from "node:path";

const mapFile = process.argv[2];
if (!mapFile) throw new Error("pass a tab-separated map file");

const BASE = "https://fct.npf.gov.ng";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const isHtml = (buf) =>
  buf.subarray(0, 400).toString("latin1").trimStart().toLowerCase().startsWith("<!doctype") ||
  buf.subarray(0, 400).toString("latin1").includes("<html");

async function grab(remote) {
  const url =
    BASE + remote.split("/").map(encodeURIComponent).join("/").replace(/%2F/g, "/");
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/141 Safari/537.36",
      accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      referer: BASE + "/app/home",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

const entries = fs
  .readFileSync(mapFile, "utf8")
  .split("\n")
  .map((l) => l.split("\t"))
  .filter((p) => p.length === 2 && p[0]);

let ok = 0;
const failed = [];

for (const [remote, local] of entries) {
  const out = path.join("public", local);
  if (fs.existsSync(out) && fs.statSync(out).size > 0) {
    const existing = fs.readFileSync(out);
    if (!isHtml(existing)) {
      ok++;
      continue;
    }
  }

  let saved = false;
  for (let attempt = 1; attempt <= 4 && !saved; attempt++) {
    try {
      const buf = await grab(remote);
      if (isHtml(buf)) throw new Error("got the SPA shell");
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, buf);
      saved = true;
      ok++;
    } catch (err) {
      if (attempt === 4) failed.push(`${remote} — ${err.message}`);
      else await wait(attempt * 1500);
    }
  }
  await wait(400);
}

console.log(`saved/verified: ${ok}/${entries.length}`);
if (failed.length) {
  console.log("failed:\n" + failed.join("\n"));
  process.exitCode = 1;
}
