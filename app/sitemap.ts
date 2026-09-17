import type { MetadataRoute } from "next";
import { footerColumns, legalLinks, navigation } from "./content";
import { LANGS } from "./i18n/config";
import { localePath } from "./i18n/path";
import { services } from "./content-services";

const BASE = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dubaipolice.gov.ae"
).replace(/\/$/, "");

/**
 * Every static route the header and footer already describe, plus the
 * generated service catalogue. Built from the same data the pages render, so
 * it cannot drift out of sync with them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // /app/search is deliberately absent — robots.ts disallows it, since it is
  // a query-driven view of pages already listed here.
  const paths = new Set<string>(["/", "/app/signin", "/app/services"]);
  // The portal and the console are behind a sign-in and marked noindex.
  for (const service of services) paths.add(`/app/services/${service.slug}`);

  for (const item of navigation) {
    paths.add(item.href);
    if ("children" in item && item.children)
      for (const child of item.children) paths.add(child.href);
  }
  for (const column of footerColumns)
    for (const link of column.links)
      if (!("external" in link && link.external)) paths.add(link.href);
  for (const link of legalLinks) paths.add(link.href);

  // Both languages, each entry naming the other, because a page a crawler
  // cannot reach in Arabic is a page Arabic readers cannot find.
  return [...paths]
    .filter((p) => p.startsWith("/"))
    .flatMap((path) =>
      LANGS.map((lang) => ({
        url: BASE + localePath(path, lang),
        changeFrequency: "weekly" as const,
        priority: path === "/" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            LANGS.map((l) => [l, BASE + localePath(path, l)]),
          ),
        },
      })),
    );
}
