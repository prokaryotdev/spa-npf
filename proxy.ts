import { NextResponse, type NextRequest } from "next/server";

/**
 * A per-request nonce and the Content-Security-Policy that trusts it. Named
 * `proxy` because the `middleware` convention was renamed in Next 16 — see
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
 *
 * Next reads the nonce back out of this header during the render and stamps it
 * on the framework runtime, the page bundles and its own inline tags, so no
 * component has to pass it around. Every route here is already dynamic, so the
 * usual cost of nonces — losing static generation — is not a cost we pay.
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const csp = [
    "default-src 'self'",
    // 'strict-dynamic' lets the nonced Next runtime pull in its own chunks and
    // nothing else. React needs eval in development for server stack traces.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self'${isDev ? " 'unsafe-inline'" : ` 'nonce-${nonce}'`}`,
    // A nonce cannot cover a style="" attribute, and 32 components set one for
    // a colour or an animation delay. Style attributes cannot run script, so
    // this stays narrower than putting 'unsafe-inline' on style-src itself.
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      // Static assets and the image optimiser serve no HTML, so they need no
      // policy; a prefetch reuses the document's own nonce rather than minting
      // one that the eventual render would not match.
      source: "/((?!_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
