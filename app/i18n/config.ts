/**
 * Locale is the first path segment: /en/app/services, /yo/app/services.
 *
 * English is the official language of Nigeria and the language the Force
 * publishes in. Hausa, Yoruba and Igbo are the three most widely spoken
 * languages in the country, so a resident who reads one of them first should
 * be able to reach every page in it.
 *
 * All four are written in Latin letters, so there is no direction to switch:
 * one set of layout rules serves every language.
 */
export const LANGS = ["en", "ha", "yo", "ig"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "en";
export const LANG_COOKIE = "npf-lang";
/** A year: the choice is a preference, not a session. */
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const isLang = (value: unknown): value is Lang =>
  typeof value === "string" && (LANGS as readonly string[]).includes(value);

/** Each language names itself in its own words, never in the other's. */
export const LANG_LABEL: Record<Lang, string> = {
  en: "English",
  ha: "Hausa",
  yo: "Yorùbá",
  ig: "Igbo",
};

/**
 * Every language formats through `en-NG`, and the Hausa half of that is a
 * deliberate choice rather than an oversight.
 *
 * Node ships full ICU and knows `ha-NG`, so the server renders "5 Jan, 2026"
 * with Hausa month names. Browsers do not carry Hausa date data and quietly
 * fall back to `en-US`, which renders "Jan 5, 2026". Those are different
 * strings for the same instant, which React sees on hydration and throws
 * away the server's markup over — every date, every fine, every clock on the
 * console, on every Hausa page.
 *
 * `en-NG` resolves identically in both runtimes and is what a Nigerian
 * service prints anyway: day first, Western digits, comma thousands. It is
 * the same reason the Arabic build of this site pinned Western numerals —
 * the reader's numerals here are the ones on the plate and on the fine.
 */
export const INTL_LOCALE: Record<Lang, string> = {
  en: "en-NG",
  ha: "en-NG",
  yo: "en-NG",
  ig: "en-NG",
};
