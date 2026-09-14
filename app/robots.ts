import type { MetadataRoute } from "next";

const BASE = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dubaipolice.gov.ae"
).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    // /app/search is a query-driven view of pages already in the sitemap;
    // indexing it just fills results with duplicates.
    rules: { userAgent: "*", allow: "/", disallow: "/app/search" },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
