import { LANGS } from "./i18n/config";
import { translate } from "./i18n/translate";
import { escape, fold, folded, matcher, type Folded } from "./search-text";
import {
  footerColumns,
  legalLinks,
  navigation,
  quickServices,
} from "./content";
import { services } from "./content-services";
import { lawsLegislation, penaltyPoints, speedLimits } from "./content-sub";
import { information, startHere } from "./content-pages";

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
  /**
   * The page filters its own table by ?q=, so a hit found in the table and
   * not in the title opens with the matching rows already picked out.
   */
  deep?: boolean;
};

const internal = (href: string) => href.startsWith("/");

/**
 * What people call a service when it isn't its official name: the word they
 * type for the thing the service is for. Searched, never shown, so none of
 * it is a claim the page makes.
 */
const ALIASES: Record<string, string> = {
  "police-clearance-certificate":
    "police character certificate pcc good conduct background check",
  "cid-clearance": "cid criminal investigation department",
  "firearm-licence": "gun license weapon rifle pistol",
  "tinted-glass-permit": "tint tinted window windows",
  "missing-person": "missing lost person child relative",
  "gender-based-violence":
    "rape sexual assault gbv domestic violence abuse harassment",
  "complaint-against-officer":
    "bribe bribery extortion misconduct brutality petition officer",
  "report-criminal-complaint": "crime theft stolen robbery burglary fraud",
  "open-criminal-case": "crime theft stolen robbery burglary fraud",
  ecrime: "online scam internet fraud hacking hacked",
  "ecrime-101364": "online scam internet fraud hacking hacked",
  "pay-traffic-fines": "ticket fine",
  "fine-payment": "ticket fine",
  "minor-traffic-accident-report": "crash collision",
  "traffic-accident-reports": "crash collision",
  "unknown-accident-report": "hit and run crash",
  "emergency-case-request-sos": "help urgent emergency 112 sos danger",
  "support-and-emergency-response": "help urgent emergency 112",
  "escort-and-guard": "bodyguard vip escort guard protection",
  "detainee-visit": "prison jail cell custody inmate detained",
  "central-motor-registry": "cmr car vehicle registration papers",
  "report-lost-item": "lost phone wallet bag card id",
  "lost-and-found": "lost found phone wallet bag card id",
  "report-found-item": "found phone wallet bag card",
  "reckless-driver": "dangerous driving speeding",
  "vehicle-obstruction": "blocked blocking parked parking",
  "apply-for-a-job": "recruitment job jobs career vacancy enlist",
  "close-road": "road closure street event",
  "document-inquiry": "verify verification check document",
  "application-status": "track status application",
};

/**
 * Each Information page is searched by the rows of its table too, so "seat
 * belt" and "Lagos–Ibadan" find the page that answers them.
 */
const rowText = (rows: readonly object[]) =>
  rows
    .map((r) =>
      Object.values(r)
        .filter((v) => typeof v === "string" && !/^https?:/.test(v))
        .join(" "),
    )
    .join(" ");
const TABLES: Record<string, string> = {
  "/app/home/information/laws-legislation": "act law " + rowText(lawsLegislation.rows),
  "/app/home/information/traffic-offences-and-penalties":
    "fine penalty points " + rowText(penaltyPoints.rows),
  "/app/home/information/road-speed-limits":
    "speed limit kmh " + rowText(speedLimits.rows),
};

/** A page's own intro, where the site already has one, as its summary line. */
const NOTES: Record<string, string> = Object.fromEntries([
  ...startHere.map((l) => [l.href, l.note]),
  ...information.cards.map((c) => [c.href, c.body]),
]);

/**
 * The site is small and entirely static, so search is a scan over a list
 * built from the same content the pages render. No index, no dependency.
 */
const page = (label: string, href: string, section = "Pages"): SearchHit => ({
  title: label,
  body: NOTES[href] ?? "",
  href,
  section,
  ...(TABLES[href] ? { tags: TABLES[href], deep: true } : {}),
});

const entries: SearchHit[] = [
  ...navigation.flatMap((item) => [
    page(item.label, item.href),
    ...("children" in item && item.children
      ? item.children.map((c) => page(c.label, c.href))
      : []),
  ]),

  ...footerColumns.flatMap((col) =>
    col.links.map((link) => ({
      ...page(link.label, link.href, col.heading),
      external: "external" in link && link.external,
    })),
  ),

  ...legalLinks.map((l) => page(l.label, l.href, "Legal")),

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
    tags: [s.category, ALIASES[s.slug]].filter(Boolean).join(" ") || undefined,
    // The five the CMS flags as most used surface first on an empty query and
    // tie-break above the rest on a partial one.
    weight: s.mostUsed ? 6 : 4,
  })),
];

const searchIndex = entries.filter(
  (hit) => hit.title && (hit.external || internal(hit.href)),
);

/**
 * All four languages are searched at once whichever one the site is showing.
 * A resident who types "takardar shaida" and a visitor who types
 * "certificate" are looking for the same page, and neither should have to
 * switch the interface first.
 */
type Indexed = { hit: SearchHit; titles: string[]; text: Folded };

const each = (s: string) => [...new Set(LANGS.map((l) => translate(l, s)))];

const indexed: Indexed[] = searchIndex.map((hit) => ({
  hit,
  titles: [...new Set(each(hit.title).map(fold))],
  text: folded(
    [hit.title, hit.body, hit.section, hit.tags ?? ""].flatMap(each).join(" "),
  ),
}));

/**
 * Where a word lands decides the rank: the front of the title, the front of
 * a word inside it, anywhere in the title, or only in the body. Without that,
 * "police" put "Nigeria Police Force Museum Visit Permit" above "Police
 * Clearance Certificate" purely by list order, which is the wrong answer to
 * the most common query on the site. Each word is scored by the form it was
 * found in, so "polce" ranks as "police" would.
 */
function score(entry: Indexed, forms: string[], phrases: string[]): number {
  let best = 0;
  const whole = forms.join(" ");
  for (const title of entry.titles) {
    let total = entry.hit.weight ?? 1;
    if (whole && title === whole) total += 160;
    else if (whole && title.startsWith(whole)) total += 100;
    for (const p of phrases) if (title.includes(p)) total += 60;
    for (const form of forms) {
      if (title.startsWith(form)) total += 50;
      else if (new RegExp(`\\b${escape(form)}`).test(title)) total += 30;
      else if (title.includes(form)) total += 12;
      else total += 3;
      // The whole word, not just its start: "act" is the Police Act, not
      // "activities".
      if (new RegExp(`\\b${escape(form)}\\b`).test(title)) total += 10;
      else if (entry.text.padded.includes(` ${form} `)) total += 6;
    }
    // The words side by side, as typed, somewhere in the entry.
    if (forms.length > 1 && entry.text.padded.includes(` ${whole} `)) total += 60;
    // A short title that matched is a tighter match than a long one.
    best = Math.max(best, total + Math.max(0, 24 - title.length / 4));
  }
  return best;
}

/** True when every form sits in one of the entry's titles. */
const inTitle = (entry: Indexed, forms: string[]) =>
  entry.titles.some((t) => forms.every((f) => t.includes(f)));

/**
 * Every plain word in the query has to appear somewhere in the entry; see
 * matcher() for quotes, minus words, question words and slips.
 */
export function search(query: string, loose = true): SearchHit[] {
  const m = matcher(
    indexed.map((e) => e.text),
    query,
  );
  if (!m.words.length && !m.phrases.length) return [];

  const seen = new Set<string>();
  const ranked: { hit: SearchHit; rank: number }[] = [];
  for (const entry of indexed) {
    const forms = m.match(entry.text);
    if (!forms) continue;
    const key = entry.hit.title + entry.hit.href;
    if (seen.has(key)) continue;
    seen.add(key);
    const hit =
      entry.hit.deep && !inTitle(entry, forms)
        ? { ...entry.hit, href: `${entry.hit.href}?q=${encodeURIComponent(query.trim())}` }
        : entry.hit;
    ranked.push({ hit, rank: score(entry, forms, m.phrases) });
  }
  if (loose && !ranked.length && m.words.length > 1) return closest(m.words);
  // Stable, so equal matches keep the order the site lists them in.
  return ranked.sort((a, b) => b.rank - a.rank).map((r) => r.hit);
}

/**
 * Nothing has every word: "stolen phone" is a theft report that never says
 * "phone". Rather than answer nothing, offer what holds the most of them,
 * and at least half.
 */
function closest(words: string[]): SearchHit[] {
  const counts = new Map<string, { hit: SearchHit; n: number }>();
  for (const w of words)
    for (const hit of search(w)) {
      const key = hit.title + hit.href;
      const c = counts.get(key) ?? { hit, n: 0 };
      c.n++;
      counts.set(key, c);
    }
  const need = Math.ceil(words.length / 2);
  return [...counts.values()]
    .filter((c) => c.n >= need)
    .sort((a, b) => b.n - a.n)
    .map((c) => c.hit);
}

/**
 * The pages a mistyped or outdated address was most likely after, for the
 * 404. A last segment that names a page wins outright ("/app/contactus" is
 * Contact Us, "/app/firearm-licence" is the service); then the segment's
 * words go through the search, slips forgiven; then the page one level up.
 */
export function nearest(path: string, limit = 3): SearchHit[] {
  const parts = path.split("/").filter(Boolean);
  let last = parts.at(-1) ?? "";
  try {
    last = decodeURIComponent(last);
  } catch {}
  const key = (s: string) => fold(s).replace(/[^\p{L}\p{N}]/gu, "");
  const pages = searchIndex.filter((hit) => !hit.external);
  const exact = key(last)
    ? pages.filter((hit) => key(hit.href.split("/").at(-1)!) === key(last))
    : [];
  // Strict: on a 404 a guess that misses a word is noise, not help.
  const words = last === "app" ? "" : last.replace(/[-_.+]/g, " ").trim();
  // "/app/services/old-slug" still lands near Services.
  const up = `/${parts.slice(0, -1).join("/")}`;
  const parent = pages.filter((hit) => up !== "/" && hit.href === up);
  const seen = new Set<string>();
  return [...exact, ...(words ? search(words, false) : []), ...parent]
    .map((hit) => ({ ...hit, href: hit.href.replace(/\?.*$/, "") }))
    .filter((hit) => hit.href !== path && !seen.has(hit.href) && seen.add(hit.href))
    .slice(0, limit);
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
