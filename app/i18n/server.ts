import { cookies } from "next/headers";
import { DEFAULT_LANG, LANG_COOKIE, isLang, type Lang } from "./config";
import { makeFormatters, type Formatters } from "./format";
import { localize } from "./localize";
import { translator, type T } from "./translate";

/**
 * Read by the root layout, so `<html lang dir>` is correct in the first byte
 * of HTML rather than corrected by script after paint. Server components
 * below the layout call it again; it is a header read, not a fetch.
 */
export async function getLang(): Promise<Lang> {
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(value) ? value : DEFAULT_LANG;
}

export async function getT(): Promise<T> {
  return translator(await getLang());
}

export async function getFormat(): Promise<Formatters> {
  return makeFormatters(await getLang());
}

/** Translate a whole content object. See i18n/localize.ts. */
export async function getLocalized<T>(value: T): Promise<T> {
  return localize(value, await getLang());
}
