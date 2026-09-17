import { translate } from "./i18n/translate";
import {
  footerColumns,
  legalLinks,
  navigation,
  quickServices,
} from "./content";
import { services } from "./content-services";

export type SearchHit = {
  title: string;
  body: string;
  href: string;
  section: string;
  external?: boolean;
  /** Service icon, shown by the suggestion list. */
  icon?: string | null;
  /**
   * Baseline rank. A service beats a page of the same name because a service
   * is what the search box on the homepage is for.
   */
  weight?: number;
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
    href: s.href,
    section: "Services",
  })),

  ...services.map((s) => ({
    title: s.name,
    body: s.description || s.category || "",
    href: `/app/services/${s.slug}`,
    section: "Services",
    icon: s.icon,
    // The five the CMS flags as most used surface first on an empty query and
    // tie-break above the rest on a partial one.
    weight: s.mostUsed ? 6 : 4,
  })),

];

export const searchIndex = entries.filter(
  (hit) => hit.title && (hit.external || internal(hit.href)),
);

/**
 * One spelling per word. Arabic readers type the alef, hamza, teh marbuta and
 * alef maksura interchangeably, and a police site cannot answer "no results"
 * because someone wrote مرور with a different hamza; Latin accents fold the
 * same way. Applied to both the query and the index, so they always meet.
 */
const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    // NFKD splits أ into alef plus a combining hamza, and é into e plus an
    // acute; dropping every non-spacing mark folds both, along with harakat
    // and shadda. Tatweel is a spacing character, so it goes separately.
    .replace(/\p{Mn}/gu, "")
    .replace(/ـ/g, "") // tatweel
    .replace(/[آأإٱ]/g, "ا") // alef forms NFKD leaves alone
    .replace(/ة/g, "ه") // teh marbuta -> heh
    .replace(/ى/g, "ي") // alef maksura -> yeh
    .replace(/ؤ/g, "و") // waw with hamza
    .replace(/ئ/g, "ي") // yeh with hamza
    .trim();

/**
 * Both languages are searched at once whichever one the site is showing. A
 * resident who types "مرور" and a visitor who types "traffic" are looking for
 * the same page, and neither should have to switch the interface first.
 */
type Indexed = {
  hit: SearchHit;
  titles: string[];
  haystack: string;
};

const indexed: Indexed[] = searchIndex.map((hit) => {
  const arTitle = translate("ar", hit.title);
  const titles = [fold(hit.title)];
  if (arTitle !== hit.title) titles.push(fold(arTitle));
  return {
    hit,
    titles,
    haystack: fold(
      [
        hit.title,
        hit.body,
        hit.section,
        arTitle,
        translate("ar", hit.body),
        translate("ar", hit.section),
      ].join(" "),
    ),
  };
});

const terms = (query: string) => fold(query).split(/\s+/).filter(Boolean);

/**
 * Where a term lands decides the rank: the front of the title, the front of a
 * word inside it, anywhere in the title, or only in the body. Without that,
 * "police" put "Dubai Police Museum Visit Permit" above "Police Clearance
 * Certificate" purely by list order, which is the wrong answer to the most
 * common query on the site.
 */
function score(entry: Indexed, words: string[]): number {
  if (!words.every((t) => entry.haystack.includes(t))) return 0;

  // Scored against whichever language's title matches better, so an Arabic
  // query still earns the front-of-title bonuses.
  let best = 0;
  for (const title of entry.titles) {
    let total = entry.hit.weight ?? 1;
    if (title.startsWith(words.join(" "))) total += 100;
    for (const word of words) {
      if (title.startsWith(word)) total += 50;
      else if (new RegExp(`\\b${escape(word)}`).test(title)) total += 30;
      else if (title.includes(word)) total += 12;
      else total += 3;
    }
    // A short title that matched is a tighter match than a long one.
    best = Math.max(best, total + Math.max(0, 24 - title.length / 4));
  }
  return best;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Every word in the query has to appear somewhere in the entry. */
export function search(query: string): SearchHit[] {
  const words = terms(query);
  if (!words.length) return [];

  const seen = new Set<string>();
  return indexed
    .map((entry) => ({ hit: entry.hit, rank: score(entry, words) }))
    .filter((r) => r.rank > 0)
    .sort((a, b) => b.rank - a.rank)
    .map((r) => r.hit)
    .filter((hit) => {
      const key = hit.title + hit.href;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

/** The five the CMS flags as most used — the empty-state suggestions. */
export const popularServices: SearchHit[] = searchIndex.filter(
  (hit) => hit.weight === 6,
);

export type SuggestionGroup = { section: string; hits: SearchHit[] };

/**
 * Results for the type-ahead. Services are drawn first and separately rather
 * than taken off the top of one ranked list: "permit" scores the footer link
 * "Permits and Certificates" above every actual permit service, which is the
 * right answer on the search page and the wrong one in a box labelled "Search
 * for a service". The rest of the site fills whatever room is left.
 */
export function suggest(query: string, limit = 8): SuggestionGroup[] {
  const ranked = search(query);
  const services = ranked.filter((hit) => hit.section === "Services");
  const rest = ranked.filter((hit) => hit.section !== "Services");

  const top = services.slice(0, limit - Math.min(rest.length, 3));
  const groups: SuggestionGroup[] = top.length
    ? [{ section: "Services", hits: top }]
    : [];

  for (const hit of rest.slice(0, limit - top.length)) {
    const group = groups.find((g) => g.section === hit.section);
    if (group) group.hits.push(hit);
    else groups.push({ section: hit.section, hits: [hit] });
  }
  return groups;
}
