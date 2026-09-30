import { translate } from "./i18n/translate";
import { escape, fold, near, split, terms } from "./search-text";
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
  /** Searched but not shown, e.g. a service's category. */
  tags?: string;
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
    tags: s.category ?? undefined,
    // The five the CMS flags as most used surface first on an empty query and
    // tie-break above the rest on a partial one.
    weight: s.mostUsed ? 6 : 4,
  })),

];

const searchIndex = entries.filter(
  (hit) => hit.title && (hit.external || internal(hit.href)),
);


/**
 * Both languages are searched at once whichever one the site is showing. A
 * resident who types "takardar shaida" and a visitor who types "certificate"
 * are looking for the same page, and neither should have to switch the
 * interface first.
 */
type Indexed = {
  hit: SearchHit;
  titles: string[];
  haystack: string;
  words: string[];
};


const indexed: Indexed[] = searchIndex.map((hit) => {
  const haTitle = translate("ha", hit.title);
  const titles = [fold(hit.title)];
  if (haTitle !== hit.title) titles.push(fold(haTitle));
  const haystack = fold(
    [
      hit.title,
      hit.body,
      hit.section,
      hit.tags ?? "",
      haTitle,
      translate("ha", hit.body),
      translate("ha", hit.section),
      translate("ha", hit.tags ?? ""),
    ].join(" "),
  );
  return { hit, titles, haystack, words: split(haystack) };
});



/**
 * Exact anywhere, or a typo of some word's start. Typos are only guessed for
 * a term the index has nowhere, so "fine" never drags in "line". Under four
 * letters a slip matches half the index, so short terms must be exact.
 */
const known = (term: string) => indexed.some((e) => e.haystack.includes(term));

const found = (entry: Indexed, term: string, typo: boolean) =>
  entry.haystack.includes(term) ||
  (typo &&
    term.length >= 4 &&
    entry.words.some(
      (w) =>
        near(w.slice(0, term.length), term) ||
        near(w.slice(0, term.length + 1), term),
    ));

/**
 * Where a term lands decides the rank: the front of the title, the front of a
 * word inside it, anywhere in the title, or only in the body. Without that,
 * "police" put "Nigeria Police Force Museum Visit Permit" above "Police Clearance
 * Certificate" purely by list order, which is the wrong answer to the most
 * common query on the site.
 */
function score(entry: Indexed, words: string[], typo: boolean[]): number {
  if (!words.every((t, i) => found(entry, t, typo[i]))) return 0;

  // Scored against whichever language's title matches better, so an Hausa
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


/** Every word in the query has to appear somewhere in the entry. */
export function search(query: string): SearchHit[] {
  const words = terms(query);
  if (!words.length) return [];
  const typo = words.map((t) => !known(t));

  const seen = new Set<string>();
  return indexed
    .map((entry) => ({ hit: entry.hit, rank: score(entry, words, typo) }))
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
