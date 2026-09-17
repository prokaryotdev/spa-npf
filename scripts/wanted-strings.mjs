/**
 * What a reader actually sees, in English, anywhere on the site.
 *
 * One answer, imported by both scripts/test-i18n.mjs (which fails when one of
 * these has no Arabic) and scripts/prune-i18n.mjs (which deletes dictionary
 * entries that are not one of these). They used to each carry a copy, drifted
 * apart, and the drift was silent in the worst direction: the pruner's
 * narrower idea of "seen" would delete translations the coverage test had
 * just demanded, putting English back on Arabic pages with both scripts
 * reporting success.
 */
import fs from "node:fs";
import path from "node:path";

/**
 * Keys whose value no reader ever sees.
 *
 * Deliberately shorter than app/i18n/localize.ts's list, which answers a
 * different question. localize skips `category`, `kind`, `status` and the rest
 * because translating them would break a lookup — the code compares against
 * those values. But the display sites hand them to t() before printing, so a
 * reader does see them. Sharing localize's list meant Arabic pages printing
 * "Speed Violation" while coverage reported no gaps.
 */
export const SKIP = new Set([
  "slug", "id", "icon", "href", "src", "image", "img", "logo", "cover",
  "file", "url", "email", "website", "color", "theme", "background",
]);

/** A string a reader sees, rather than a path, a code or a date. */
export const isCopy = (s) => {
  const v = s.trim();
  if (v.length < 2 || !/\p{L}/u.test(v)) return false;
  if (/^[/#]/.test(v) || /^https?:|^mailto:|^tel:/.test(v)) return false;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return false; // email addresses
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return false; // ISO dates
  if (/^[a-z0-9]+([-_.][a-z0-9]+)*$/.test(v)) return false; // slugs, filenames
  if (/^[A-Z]{1,4}[-\d]*$/.test(v)) return false; // P1, PTL-14, AED, OCEC
  if (/^\p{Script=Arabic}/u.test(v)) return false; // already Arabic
  // Measurements read the same in both languages on this site: file sizes,
  // speeds and plate-style codes are numerals plus a unit, not copy.
  if (/^[\d.,]+\s*(KB|MB|GB|km\/h|km|m|cm|AED)$/i.test(v)) return false;
  return true;
};

/** t("…") written straight into a component. */
const DIRECT_T = /\bt\(\s*"((?:[^"\\]|\\.)*)"/g;

/**
 * The plural idiom, t(n === 1 ? "one" : "many"). The pattern above only sees a
 * literal sitting directly after t(, so both arms would be missed.
 */
const TERNARY_T = /\bt\(\s*[^)"]*\?\s*"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g;

/**
 * Props and object fields whose value the receiving component prints through
 * t() — DataTable's `caption` and column `label`, PageShell's `title`, the
 * sitemap page's `heading`. Written as a plain literal at the call site, so
 * neither t() pattern above ever sees them.
 */
const TRANSLATED_PROPS =
  /\b(?:caption|label|heading|intro)\s*[=:]\s*"((?:[^"\\]|\\.)*)"/g;

/**
 * Every English string the site can show, mapped to where it came from.
 * `root` is the repo root; both callers run from there.
 */
export async function collectWanted(root = ".") {
  const wanted = new Map();
  const add = (key, where) => {
    if (isCopy(key) && !wanted.has(key)) wanted.set(key, where);
  };

  function walkValue(value, where) {
    if (typeof value === "string") return add(value, where);
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) return value.forEach((v) => walkValue(v, where));
    for (const [key, v] of Object.entries(value))
      if (!SKIP.has(key)) walkValue(v, where);
  }

  const appDir = path.join(root, "app");
  const appUrl = new URL("../app/", import.meta.url).href;
  for (const file of fs.readdirSync(appDir).filter((f) => /^content.*\.ts$/.test(f))) {
    const loaded = await import(`${appUrl}${file}`);
    for (const [name, value] of Object.entries(loaded))
      if (typeof value !== "function") walkValue(value, `${file}:${name}`);
  }

  const sources = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "fonts" && entry.name !== "i18n") walk(p);
      } else if (/\.tsx?$/.test(entry.name)) sources.push(p);
    }
  })(appDir);

  for (const file of sources) {
    const src = fs.readFileSync(file, "utf8");
    for (const m of src.matchAll(DIRECT_T)) add(JSON.parse(`"${m[1]}"`), file);
    for (const m of src.matchAll(TERNARY_T))
      for (const raw of [m[1], m[2]]) add(JSON.parse(`"${raw}"`), file);
    for (const m of src.matchAll(TRANSLATED_PROPS))
      add(JSON.parse(`"${m[1]}"`), file);
  }

  return wanted;
}
