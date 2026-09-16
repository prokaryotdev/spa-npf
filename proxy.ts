import { NextResponse, type NextRequest } from "next/server";
import { LANG_COOKIE, LANG_COOKIE_MAX_AGE } from "./app/i18n/config";
import { isReserved, localePath, pickLang, stripLocale } from "./app/i18n/path";

/**
 * Two jobs on every request: the language the URL asks for, and the nonce the
 * page's Content-Security-Policy trusts.
 *
 * Named `proxy` because the `middleware` convention was renamed in Next 16 —
 * see node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
 *
 * Locale is the first path segment. /ar/app/services is rewritten to
 * /app/services with an x-lang header, so the twenty-four page files stay
 * where they are and only i18n/server.ts has to know. A URL naming no
 * language is redirected to the one it should have, which leaves exactly one
 * address per page per language for a crawler to find.
 */
function cspFor(nonce: string, secure: boolean) {
  const isDev = process.env.NODE_ENV === "development";
  return [
    "default-src 'self'",
    // 'strict-dynamic' lets the nonced Next runtime pull in its own chunks and
    // nothing else. React needs eval in development for server stack traces.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self'${isDev ? " 'unsafe-inline'" : ` 'nonce-${nonce}'`}`,
    // A nonce cannot cover a style="" attribute, and components set one for a
    // colour or an animation delay. Style attributes cannot run script, so
    // this stays narrower than putting 'unsafe-inline' on style-src itself.
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(secure ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  // upgrade-insecure-requests rewrites every http subresource to https. On a
  // real deployment that is what you want; over plain http it turns the CSS
  // logo masks into SSL errors, so it is emitted only when the request that
  // arrived was itself secure.
  const secure =
    request.nextUrl.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https";

  // The API, the sitemap and the static files are not pages and have no
  // language; they skip the locale work and take the headers as they are.
  if (!isReserved(pathname)) {
    const { lang, rest } = stripLocale(pathname);

    if (!lang) {
      // No language in the URL. Send the visitor to the one address this page
      // has in the language they should get, so every page is reachable at a
      // single, indexable URL per language.
      const to = request.nextUrl.clone();
      to.pathname = localePath(
        pathname,
        pickLang(
          request.cookies.get(LANG_COOKIE)?.value,
          request.headers.get("accept-language"),
        ),
      );
      return NextResponse.redirect(to);
    }

    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const csp = cspFor(nonce, secure);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("x-lang", lang);
    // The canonical and hreflang tags need the address the visitor typed, not
    // the rewritten one the page is rendered from.
    requestHeaders.set("x-pathname", rest);
    requestHeaders.set("Content-Security-Policy", csp);

    const rewritten = request.nextUrl.clone();
    rewritten.pathname = rest;
    rewritten.search = search;

    const response = NextResponse.rewrite(rewritten, {
      request: { headers: requestHeaders },
    });
    response.headers.set("Content-Security-Policy", csp);
    // Remember the choice, so a later visit to a bare URL lands in the same
    // language rather than being re-guessed from the browser's headers.
    response.cookies.set(LANG_COOKIE, lang, {
      path: "/",
      maxAge: LANG_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    return response;
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = cspFor(nonce, secure);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    // Static assets and the image optimiser serve no HTML and need no policy.
    //
    // Prefetches are NOT excluded here, though the Next CSP guide excludes
    // them. That guide's proxy only mints nonces; this one also routes, and a
    // prefetch of /ar/app/services needs the same rewrite a navigation does —
    // excluded, every <Link> prefetch 404s and the console fills up.
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
