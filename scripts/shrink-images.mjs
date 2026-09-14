/**
 * Downscales mirrored images in place. The gallery endpoint hands back camera
 * originals — 3 MB a piece, 114 MB for one folder — and nothing on the site is
 * shown wider than about 1600px. Photos the CMS happens to store as PNG are
 * re-encoded as JPEG, which is where most of the weight is; those get renamed,
 * so any /cms path naming them is rewritten in app/content-*.ts.
 *
 * Uses the sharp that next already depends on.
 *
 *   node scripts/shrink-images.mjs public/cms/gallery [maxWidth]
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = process.argv[2];
const maxWidth = Number(process.argv[3] ?? 1600);
if (!dir) throw new Error("pass a directory");

const mb = (n) => (n / 1024 / 1024).toFixed(1) + " MB";
const renames = new Map();
let before = 0;
let after = 0;
let touched = 0;

for (const name of fs.readdirSync(dir)) {
  const file = path.join(dir, name);
  const size = fs.statSync(file).size;
  before += size;

  // Read the bytes up front: sharp holds the file open otherwise, and Windows
  // refuses to overwrite a file that still has a handle on it.
  const input = fs.readFileSync(file);
  const meta = await sharp(input, { failOn: "none" }).metadata();
  // Transparency is the one thing JPEG cannot carry, so leave those alone.
  const toJpeg = meta.format !== "jpeg" && !meta.hasAlpha;
  const tooWide = (meta.width ?? 0) > maxWidth;
  if (!toJpeg && !tooWide) {
    after += size;
    continue;
  }

  let target = toJpeg ? file.replace(/\.[^.]+$/, ".jpg") : file;
  // Windows paths are case-insensitive, so a .JPG -> .jpg rename is a no-op
  // that errors out. Keep the name we already have.
  if (target.toLowerCase() === file.toLowerCase()) target = file;

  const output = await sharp(input, { failOn: "none" })
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  if (output.length >= size && target === file) {
    after += size;
    continue;
  }

  fs.writeFileSync(target, output);
  if (target !== file) {
    fs.unlinkSync(file);
    const web = (p) => `/${path.relative("public", p).split(path.sep).join("/")}`;
    renames.set(web(file), web(target));
  }
  after += output.length;
  touched += 1;
}

if (renames.size) {
  for (const content of fs.readdirSync("app").filter((f) => /^content-.*\.ts$/.test(f))) {
    const file = path.join("app", content);
    const text = fs.readFileSync(file, "utf8");
    let next = text;
    for (const [from, to] of renames) next = next.split(from).join(to);
    if (next !== text) fs.writeFileSync(file, next);
  }
}

console.log(
  `${touched} rewritten (${renames.size} re-encoded to jpeg) — ${mb(before)} → ${mb(after)}`,
);
