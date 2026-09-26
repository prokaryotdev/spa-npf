import { cookies, headers } from "next/headers";
import { DEFAULT_LANG, LANG_COOKIE, isLang, type Lang } from "./config";
import { localize } from "./localize";
import { translator, type T } from "./translate";

/**
 * Read by the root layout, so `<html lang dir>` is correct in the first byte
 * of HTML rather than corrected by script after paint. Server components
 * below the layout call it again; it is a header read, not a fetch.
 *
 * The URL decides, via the x-lang header proxy.ts sets from the path prefix.
 * The cookie is only a fallback for a render that did not come through the
 * proxy, and the memory proxy.ts consults when a URL names no language.
 */
export async function getLang(): Promise<Lang> {
  const fromUrl = (await headers()).get("x-lang");
  if (isLang(fromUrl)) return fromUrl;
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(value) ? value : DEFAULT_LANG;
}

/** The address the visitor asked for, prefix and all. For canonical tags. */
export async function getPathname(): Promise<string> {
  return (await headers()).get("x-pathname") || "/";
}

export async function getT(): Promise<T> {
  return translator(await getLang());
}

/** Translate a whole content object. See i18n/localize.ts. */
export async function getLocalized<T>(value: T): Promise<T> {
  return localize(value, await getLang());
}
