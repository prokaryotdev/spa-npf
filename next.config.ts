import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // next/image answers 400 for SVG unless this is on, and the site's art is
    // mostly SVG. Every file is mirrored into public/ by scripts/fetch-assets,
    // so nothing untrusted goes through here; the CSP below keeps it inert.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
