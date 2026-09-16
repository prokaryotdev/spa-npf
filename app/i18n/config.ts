/**
 * Locale is held in a cookie rather than a URL segment. Every page on this
 * site lives at one address in both languages; the switcher sets the cookie
 * and refreshes, so the server re-renders the whole tree — heading, direction
 * and font together — with no flash of the wrong language.
 *
 * /ar and /en are thin route handlers that set the cookie and redirect, which
 * keeps a shareable "open this site in Arabic" link without duplicating the
 * forty page files a [lang] segment would need.
 */
export const LANGS = ["en", "ar"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "en";
export const LANG_COOKIE = "dp-lang";
/** A year: the choice is a preference, not a session. */
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const isLang = (value: unknown): value is Lang =>
  typeof value === "string" && (LANGS as readonly string[]).includes(value);

export const dirOf = (lang: Lang) => (lang === "ar" ? "rtl" : "ltr");

/** Each language names itself in its own script, never in the other's. */
export const LANG_LABEL: Record<Lang, string> = {
  en: "English",
  ar: "العربية",
};

/** What the switcher says: the language it will take you to. */
export const LANG_SWITCH_LABEL: Record<Lang, string> = {
  en: "العربية",
  ar: "English",
};

/**
 * Arabic-Indic digits are correct Arabic but wrong for this audience: UAE
 * government services, plate numbers, fine amounts and radar readings are all
 * read in Western digits here, and a control room cannot afford a second
 * numeral system. `-u-nu-latn` keeps Arabic month names with Western numbers.
 */
export const INTL_LOCALE: Record<Lang, string> = {
  en: "en-GB",
  ar: "ar-AE-u-nu-latn",
};
