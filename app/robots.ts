import type { MetadataRoute } from "next";

const BASE = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://fct.npf.gov.ng"
).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    // /app/search is a query-driven view of pages already in the sitemap;
    // indexing it just fills results with duplicates. The portal and the
    // console sit behind a sign-in and have nothing to offer a crawler.
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/app/search", "/app/portal", "/app/police"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
