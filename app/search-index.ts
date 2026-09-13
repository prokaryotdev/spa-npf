import { footerColumns, legalLinks, navigation, quickServices } from "./content";
import { news } from "./content-news";
import { serviceCategories } from "./content-footer";
import { events, magazines, photoAlbums, videos } from "./content-sub";

export type SearchHit = {
  title: string;
  body: string;
  href: string;
  section: string;
  external?: boolean;
};

const internal = (href: string) => href.startsWith("/");

/**
 * The site is small and entirely static, so search is a substring scan over a
 * list built from the same content the pages render. No index, no dependency.
 */
const entries: SearchHit[] = [
  ...navigation.flatMap((item) => [
    { title: item.label, body: "", href: item.href, section: "Pages" },
    ...("children" in item && item.children
      ? item.children.map((c) => ({
          title: c.label,
          body: "",
          href: c.href,
          section: "Pages",
        }))
      : []),
  ]),

  ...footerColumns.flatMap((col) =>
    col.links.map((link) => ({
      title: link.label,
      body: "",
      href: link.href,
      section: col.heading,
      external: "external" in link && link.external,
    })),
  ),

  ...legalLinks.map((l) => ({
    title: l.label,
    body: "",
    href: l.href,
    section: "Legal",
  })),

  ...quickServices.map((s) => ({
    title: s.title,
    body: s.body,
    href: "/app/services",
    section: "Services",
  })),

  ...serviceCategories.flatMap((cat) => [
    {
      title: cat.name,
      body: cat.description,
      href: "/app/services",
      section: "Services",
    },
    ...cat.services.map((s) => ({
      title: s.name.trim(),
      body: cat.name,
      href: "/app/services",
      section: "Services",
    })),
  ]),

  ...news.map((n) => ({
    title: n.title,
    body: n.summary,
    href: `/app/home/media/news/${n.slug}`,
    section: "News",
  })),

  ...events.map((e) => ({
    title: e.title,
    body: e.summary,
    href: "/app/home/media/events",
    section: "Events",
  })),

  ...photoAlbums.map((a) => ({
    title: a.title,
    body: `${a.count} photos`,
    href: "/app/home/media/photo-gallery",
    section: "Photo Gallery",
  })),

  ...videos.map((v) => ({
    title: v.title,
    body: "",
    href: "/app/home/media/video-gallery",
    section: "Video Gallery",
  })),

  ...magazines.map((m) => ({
    title: m.title,
    body: m.kind ?? "",
    href: "/app/home/media/magazine",
    section: "Magazine",
  })),
];

export const searchIndex = entries.filter(
  (hit) => hit.title && (hit.external || internal(hit.href)),
);

/** Every word in the query has to appear somewhere in the entry. */
export function search(query: string): SearchHit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  const seen = new Set<string>();
  return searchIndex
    .map((hit) => {
      const haystack = `${hit.title} ${hit.body} ${hit.section}`.toLowerCase();
      if (!terms.every((t) => haystack.includes(t))) return null;
      // A title match beats a match buried in the body.
      const title = hit.title.toLowerCase();
      const score = terms.filter((t) => title.includes(t)).length;
      return { hit, score };
    })
    .filter((r): r is { hit: SearchHit; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.hit)
    .filter((hit) => {
      const key = hit.title + hit.href;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}
