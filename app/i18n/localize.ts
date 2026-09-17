import type { Lang } from "./config";
import { translate } from "./translate";

/**
 * Almost every string on this site arrives as a field of a content object —
 * a service, a news item, a footer column. Wrapping each render site in t()
 * would mean a thousand call sites and a thousand chances to miss one, so
 * the object goes through here once instead and comes back translated.
 *
 * A miss is harmless: `translate` only replaces strings the dictionary knows,
 * so a slug, a hex colour or an ISO date passes through untouched even when
 * it is not on the skip list below.
 */

/**
 * Keys whose value is an identifier the code compares against, not copy the
 * reader sees. Translating one of these would silently break a lookup — an
 * Hausa `status` finds no row in the status-colour table. Where such a value
 * is also displayed, the display site calls t() on it explicitly.
 */
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

/**
 * One cache per language. Content objects are module constants, so after the
 * first render of a page the translated tree is handed back by reference and
 * the walk costs nothing.
 */
const caches = new Map<Lang, WeakMap<object, unknown>>();

function walk(
  value: unknown,
  lang: Lang,
  cache: WeakMap<object, unknown>,
): unknown {
  if (typeof value === "string") return translate(lang, value);
  if (value === null || typeof value !== "object") return value;

  const cached = cache.get(value);
  if (cached !== undefined) return cached;

  let out: unknown;
  if (Array.isArray(value)) {
    out = value.map((item) => walk(item, lang, cache));
  } else {
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value))
      result[key] = SKIP.has(key) ? item : walk(item, lang, cache);
    out = result;
  }
  cache.set(value, out);
  return out;
}

export function localize<T>(value: T, lang: Lang): T {
  if (lang === "en") return value;
  let cache = caches.get(lang);
  if (!cache) caches.set(lang, (cache = new WeakMap()));
  return walk(value, lang, cache) as T;
}
