/**
 * Turns the captured dpcms API payloads into app/content-sub.ts and a list of
 * images to mirror. Run from the repo root:
 *   node scripts/gen-sub-content.mjs <api-dir>
 */
import fs from "node:fs";
import path from "node:path";

const apiDir = process.argv[2];
if (!apiDir) throw new Error("pass the directory holding the captured JSON");

const read = (f) => JSON.parse(fs.readFileSync(path.join(apiDir, f), "utf8")).data;
const images = new Set();

/**
 * Images are mirrored under /cms so they are served locally. Documents keep
 * pointing at the source — the 79 legislation PDFs are not ours to re-host.
 */
function asset(url) {
  if (!url) return null;
  if (!/\.(jpe?g|png|webp|gif|avif|svg)$/i.test(url)) {
    return "https://www.dubaipolice.gov.ae/dpcms" + url;
  }
  const clean = url.replace(/^\/cmsUploads\//, "");
  images.add(clean);
  return "/cms/" + clean;
}

/** Location arrives as a JSON blob; only the address is worth showing. */
const address = (value) => {
  if (!value) return "";
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return (parsed?.address ?? "").toString().trim();
  } catch {
    return typeof value === "string" ? value.trim() : "";
  }
};

/** Turns CMS enum values like safety_And_Security into readable labels. */
const label = (value) =>
  String(value ?? "")
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/ +/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

const trim = (s, n = 260) => {
  if (!s) return "";
  const flat = String(s).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return flat.length > n ? flat.slice(0, n).replace(/\s+\S*$/, "") + "…" : flat;
};

/** The four Information datasets share one envelope with a typed row list. */
function openData(file) {
  const rec = read(file)[0];
  const rows = (Array.isArray(rec.data) ? rec.data : []).map((row) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured to drop
    const { __component, id, file: doc, ...rest } = row;
    const out = {};
    for (const [k, v] of Object.entries(rest)) {
      if (v == null || typeof v === "object") continue;
      out[k] = typeof v === "string" ? trim(v, 300) : v;
    }
    if (doc?.url) {
      out.file = asset(doc.url);
      if (doc.size) out.size = `${Math.round(doc.size)} KB`;
    }
    return out;
  });
  const keys = [...new Set(rows.flatMap(Object.keys))];
  for (const row of rows) for (const k of keys) if (!(k in row)) row[k] = "";
  return {
    title: rec.title,
    description: trim(rec.description, 400),
    cover: asset(rec.coverImg?.url) ?? asset(rec.img?.url),
    updatedAt: (rec.updatedAt || "").slice(0, 10),
    rows,
  };
}

/**
 * Org-chart art ships with spaces in its filenames; next/image answers 400 for
 * those, so the files are slugified on disk and the paths rewritten to match.
 */
function slugPaths(node) {
  if (Array.isArray(node)) return node.map(slugPaths);
  if (!node || typeof node !== "object") return node;
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    out[k] =
      typeof v === "string" && v.startsWith("/img/organization/")
        ? v.replace(/[^/]+$/, (file) => {
            const i = file.lastIndexOf(".");
            const base = file.slice(0, i).normalize("NFKD");
            return (
              base.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase() +
              file.slice(i).toLowerCase()
            );
          })
        : slugPaths(v);
  }
  return out;
}

const content = {
  lawsLegislation: openData("laws.json"),
  blackPoints: openData("blackpoints.json"),
  speedLimits: openData("speedlimits.json"),
  sustainability: openData("sustainability.json"),

  news: read("news.json").map((n) => ({
    title: n.title,
    summary: trim(n.description, 200),
    date: (n.date || "").slice(0, 10),
    image: asset(n.image?.url),
  })),

  events: read("events.json").map((e) => ({
    title: e.title,
    summary: trim(e.shortDescription, 180),
    from: (e.fromDate || "").slice(0, 10),
    to: (e.toDate || "").slice(0, 10),
    type: label(e.eventType),
    location: trim(address(e.location), 90),
    image: asset(e.image?.url),
  })),

  photoAlbums: read("photos.json").map((a) => ({
    title: a.title,
    date: (a.date || "").slice(0, 10),
    count: Array.isArray(a.media) ? a.media.length : 0,
    cover: asset(a.media?.[0]?.url ?? a.thumb?.url),
  })),

  videos: read("videos.json").map((v) => ({
    title: v.title,
    date: (v.date || "").slice(0, 10),
    youtube: v.youtubeLink || "",
    id: (v.youtubeLink || "").split(/[?&]v=/)[1]?.split("&")[0] ?? "",
  })),

  magazines: read("magazines.json").map((m) => ({
    title: m.title,
    issue: m.issueNumber ? String(m.issueNumber) : "",
    kind: [m.type, m.subType].filter(Boolean).map(label).join(" · "),
    date: (m.date || "").slice(0, 10),
    summary: trim(m.description, 180),
    cover: asset(m.thumb?.url ?? m.media?.[0]?.url),
    file: m.media?.[0]?.url ? asset(m.media[0].url) : null,
  })),

  orgStructure: slugPaths(read("orgstructure.json")[0].data),
};

const banner = `/**
 * Generated by scripts/gen-sub-content.mjs from the site's own dpcms payloads.
 * Edit the generator, not this file.
 */\n\n`;

const body = Object.entries(content)
  // No `as const`: pinning every string to a literal type makes ordinary
  // expressions like `a || b` narrow to never at the call sites.
  .map(([k, v]) => `export const ${k} = ${JSON.stringify(v, null, 2)};\n`)
  .join("\n");

fs.writeFileSync("app/content-sub.ts", banner + body);
fs.writeFileSync(
  path.join(apiDir, "images.txt"),
  [...images].join("\n") + "\n",
);

console.log("rows:", Object.entries(content)
  .map(([k, v]) => `${k}=${Array.isArray(v) ? v.length : v.rows?.length ?? "obj"}`)
  .join(" "));
console.log("images to mirror:", images.size);
