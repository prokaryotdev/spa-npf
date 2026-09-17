import type { NextConfig } from "next";

/**
 * The headers that are the same on every response. The Content-Security-Policy
 * is not here: it carries a per-request nonce, so it is set in proxy.ts.
 */
const securityHeaders = [
  // Two years, and submitted to the preload list, is what a .gov.ae host is
  // expected to carry. Harmless behind a TLS-terminating proxy that adds it too.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Belt and braces with the CSP's frame-ancestors, for browsers that predate it.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site asks for none of these, and a police portal should not be able to
  // start asking without someone changing this line.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

/**
 * The footer used to carry a copyright year and a "last modified" date typed
 * in by hand, which are wrong the moment they are not re-typed. Both are
 * stamped here instead: "last modified" for a site with no CMS behind it means
 * the last time it was deployed, which is exactly what a build is.
 */
const built = new Date();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_DATE: built.toISOString().slice(0, 10),
    NEXT_PUBLIC_BUILD_YEAR: String(built.getUTCFullYear()),
  },
  images: {
    // next/image answers 400 for SVG unless this is on, and the site's art is
    // mostly SVG. Every file is mirrored into public/ by scripts/fetch-assets,
    // so nothing untrusted goes through here; the CSP below keeps it inert.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
