import { DEFAULT_LANG, LANGS, isLang, type Lang } from "./config";

/**
 * Locale lives in the first path segment: /en/app/services, /ar/app/services.
 *
 * It used to live in a cookie, with every page at one address. That reads
 * well and indexes terribly: a search engine can only ever see one language
 * of a page it can only reach at one URL, so the Hausa half of a bilingual
 * public service was invisible to the people most likely to need it. These
 * two functions are the whole of the change — proxy.ts strips the prefix on
 * the way in, i18n/Link.tsx puts it back on every link on the way out.
 */

/**
 * Paths that are not pages and must never carry a locale: the API, the
 * framework's own routes, and anything whose last segment has an extension.
 *
 * That last clause is the one that matters. Listing filenames by hand missed
 * the whole of public/ — every /img and /cms asset was being redirected to
 * /en/img/…, which broke the logo masks in CSS and made the image optimiser
 * fetch a redirect instead of an SVG and answer 400. No page route on this
 * site has a dot in its final segment, and every static file does.
 */
const RESERVED = /^\/(?:api|_next)(?:\/|$)|\/[^/]*\.[^/]+$/;

export const isReserved = (pathname: string) => RESERVED.test(pathname);

/** Splits "/ar/app/services" into the language and "/app/services". */
export function stripLocale(pathname: string): {
  lang: Lang | null;
  rest: string;
} {
  const match = /^\/([^/]+)(\/.*)?$/.exec(pathname);
  if (!match || !isLang(match[1])) return { lang: null, rest: pathname };
  return { lang: match[1], rest: match[2] || "/" };
}

/**
 * Puts a language on an internal path, replacing one already there. Anything
 * that is not a same-site path — another origin, a mailto:, a bare #anchor —
 * comes back untouched, because prefixing those would break them.
 */
export function localePath(href: string, lang: Lang = DEFAULT_LANG): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (isReserved(href)) return href;

  // Keep the query and hash out of the segment arithmetic, then put them back.
  const cut = href.search(/[?#]/);
  const path = cut === -1 ? href : href.slice(0, cut);
  const tail = cut === -1 ? "" : href.slice(cut);

  const { rest } = stripLocale(path);
  return `/${lang}${rest === "/" ? "" : rest}${tail}` || `/${lang}`;
}

/**
 * Which language to serve a URL that names none. The visitor's own choice
 * wins; failing that, what their browser asks for; failing that, English.
 */
export function pickLang(
  cookieValue: string | undefined,
  acceptLanguage: string | null,
): Lang {
  if (isLang(cookieValue)) return cookieValue;
  for (const part of (acceptLanguage ?? "").split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase();
    const base = tag?.split("-")[0];
    if (base && LANGS.includes(base as Lang)) return base as Lang;
  }
  return DEFAULT_LANG;
}
