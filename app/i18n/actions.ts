"use server";

import { cookies } from "next/headers";
import {
  DEFAULT_LANG,
  LANG_COOKIE,
  LANG_COOKIE_MAX_AGE,
  isLang,
} from "./config";

/**
 * Submitted by the header's language form. A server action rather than a
 * client-side cookie write so the switch works with JavaScript off, and so
 * the framework re-renders the route on the server afterwards — the whole
 * tree comes back in the new language and direction in one paint.
 */
export async function setLanguage(formData: FormData) {
  const value = formData.get("lang");
  const lang = isLang(value) ? value : DEFAULT_LANG;
  (await cookies()).set(LANG_COOKIE, lang, {
    path: "/",
    maxAge: LANG_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}
