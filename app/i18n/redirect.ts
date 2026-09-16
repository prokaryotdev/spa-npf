import { NextResponse } from "next/server";
import { LANG_COOKIE, LANG_COOKIE_MAX_AGE, type Lang } from "./config";

/**
 * Backs /ar and /en: a shareable "open this site in Arabic" link. Sets the
 * preference and hands you on to a page. `?to=` is accepted so a deep link
 * can name its destination, but only as a same-site absolute path — an
 * open redirect on a police domain is a phishing gift.
 */
export function languageRedirect(request: Request, lang: Lang) {
  const to = new URL(request.url).searchParams.get("to");
  const safe = to && /^\/(?!\/)[\w\-./[\]%]*$/.test(to) ? to : "/";
  const response = NextResponse.redirect(new URL(safe, request.url));
  response.cookies.set(LANG_COOKIE, lang, {
    path: "/",
    maxAge: LANG_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}
