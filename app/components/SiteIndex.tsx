"use client";

import { useDeferredValue, useId, useState } from "react";
import Link from "../i18n/Link";
import {
  AlertIcon,
  ArrowRight,
  ArrowUpRight,
  ClockIcon,
  PinIcon,
  PersonIcon,
  SearchIcon,
  ServicesIcon,
  ShieldIcon,
} from "./icons";
import { useT } from "../i18n/client";

const ICONS = {
  report: AlertIcon,
  track: ClockIcon,
  services: ServicesIcon,
  verify: ShieldIcon,
  appeals: PersonIcon,
  centers: PinIcon,
};

export type IndexLink = {
  label: string;
  href: string;
  note?: string;
  external?: boolean;
};

export type SiteIndexData = {
  start: (IndexLink & { icon: keyof typeof ICONS })[];
  groups: { heading: string; links: IndexLink[] }[];
  packages: (IndexLink & { count: number })[];
  services: IndexLink[];
};

// Accents and case off, so "Ìwé" is found by "iwe".
const fold = (s: string) =>
  s.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase();

/**
 * The sitemap's body. Every label arrives already translated, so the filter
 * matches what the reader sees. While nothing is typed it reads as a
 * directory: the tasks most people come for, the small groups, then every
 * service A to Z. A query narrows all of it at once.
 */
export default function SiteIndex({ data }: { data: SiteIndexData }) {
  const t = useT();
  const id = useId();
  const [query, setQuery] = useState("");
  const q = fold(useDeferredValue(query).trim());
  const hit = (l: IndexLink) => !q || fold(l.label).includes(q);

  const start = data.start.filter(hit);
  const groups = data.groups
    .map((g) => ({ ...g, links: g.links.filter(hit) }))
    .filter((g) => g.links.length);
  const services = data.services.filter(hit);
  const found =
    start.length +
    groups.reduce((n, g) => n + g.links.length, 0) +
    services.length;

  // Letters come from the names as the reader sees them, so a Hausa page
  // gets Hausa initials.
  const by = new Map<string, IndexLink[]>();
  for (const s of services) {
    const k = fold(s.label).charAt(0).toLocaleUpperCase();
    by.set(k, [...(by.get(k) ?? []), s]);
  }
  const letters = [...by];
  // Wide screens cut the run of names into three level columns. A letter's
  // heading weighs about two rows. A long letter may run on into the next
  // column, where its letter heads the column again, as in a dictionary.
  const flat = letters.flatMap(([letter, list]) =>
    list.map((link, i) => ({ letter, link, first: i === 0 })),
  );
  const columns = split3(
    flat.map((r) => (r.first ? 2.5 : 1)),
    flat.map((r) => (r.first ? 0 : 1.5)),
  ).map(([a, b]) => {
    const parts: { letter: string; links: IndexLink[]; opens: boolean; closes: boolean }[] = [];
    flat.slice(a, b).forEach((r, i, rows) => {
      const part = parts.at(-1);
      if (part?.letter === r.letter) part.links.push(r.link);
      else parts.push({ letter: r.letter, links: [r.link], opens: r.first, closes: true });
      parts.at(-1)!.closes = rows[i + 1] !== undefined || flat[b]?.first !== false;
    });
    return parts;
  });

  return (
    <section className="bg-white pb-(--npf-section-y)">
      <div className="npf-container">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <label htmlFor={`${id}-q`} className="sr-only">
            {t("Find a page")}
          </label>
          <div className="flex h-14 w-full max-w-xl items-center gap-3 rounded-full bg-white px-5 shadow-card ring-1 ring-npf-hairline transition-shadow ring-inset focus-within:ring-2 focus-within:ring-npf-blue-mid">
            <SearchIcon className="size-5 shrink-0 text-npf-blue" />
            <input
              id={`${id}-q`}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Find a page")}
              autoComplete="off"
              className="h-full min-w-0 flex-1 bg-transparent text-base text-npf-ink outline-none placeholder:text-npf-steel"
            />
          </div>
          <p aria-live="polite" className="npf-small text-npf-steel">
            {q && found ? (
              <>
                {t("Pages found: {n}", { n: found })}
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="-my-3 ms-4 inline-flex min-h-11 items-center font-medium text-npf-blue underline underline-offset-4 transition-colors hover:text-npf-blue-deep"
                >
                  {t("Clear search")}
                </button>
              </>
            ) : null}
          </p>
        </div>

        {found === 0 ? (
          <div className="mt-10 flex max-w-2xl items-start gap-4 rounded-card border border-npf-hairline px-6 py-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-npf-chip text-npf-blue">
              <SearchIcon className="size-5" />
            </span>
            <div>
              <p className="npf-h5 text-npf-ink">
                {t("No page is called “{q}”", { q: query.trim() })}
              </p>
              <p className="npf-small mt-1 text-npf-body">
                {t("The site search also looks inside services, news and events.")}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`/app/search?q=${encodeURIComponent(query.trim())}`}
                  className="npf-btn npf-btn-primary npf-btn-sm"
                >
                  {t("Search the whole site")}
                </Link>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="npf-btn npf-btn-secondary npf-btn-sm"
                >
                  {t("Clear search")}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {start.length ? (
          <section aria-labelledby={`${id}-start`} className="mt-12">
            <h2 id={`${id}-start`} className="npf-h4 text-npf-blue-deep">
              {t("Start here")}
            </h2>
            {/* Each cell's 1px shadow fills the 1px gap as the rule, so the
                rows stay ruled at any column count, and a search that
                leaves a short row leaves white, not a grey block. */}
            <ul
              className={`mt-5 grid gap-px overflow-hidden rounded-card border border-npf-hairline bg-white ${
                start.length === 1
                  ? "md:max-w-[calc(50%-var(--npf-gap)/2)]"
                  : start.length % 2 === 0 && start.length % 3
                    ? "md:grid-cols-2"
                    : "md:grid-cols-2 xl:grid-cols-3"
              }`}
            >
              {start.map((l, i) => {
                const Icon = ICONS[l.icon];
                // A short last row stretches its last cell, so a search
                // never leaves an empty block inside the box.
                const last = i === start.length - 1;
                const n = start.length;
                const span = !last || n < 3
                  ? ""
                  : `${n % 2 ? "md:col-span-2" : ""} ${n % 3 === 2 ? "xl:col-span-2" : "xl:col-span-1"}`;
                return (
                  <li
                    key={l.href}
                    className={`shadow-[0_0_0_1px_var(--color-npf-hairline)] ${span}`}
                  >
                    <Link
                      href={l.href}
                      className="npf-row-link group flex h-full items-start gap-4 px-5 py-5 focus-visible:-outline-offset-2 active:bg-npf-cloud"
                    >
                      <span className="npf-disc">
                        <Icon className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="npf-h5 block text-npf-ink transition-colors group-hover:text-npf-blue">
                          {l.label}
                        </span>
                        <span className="npf-small mt-1 line-clamp-3 text-npf-body">
                          {l.note}
                        </span>
                      </span>
                      <ArrowRight className="npf-go mt-1" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {groups.length ? (
          // Columns, not a grid: the groups differ in length and a grid
          // would leave a hole under every short one.
          <div className="mt-12 gap-(--npf-gap) md:columns-2 xl:columns-3">
            {groups.map((g, i) => (
              <section
                key={g.heading}
                aria-labelledby={`${id}-g${i}`}
                className="mb-(--npf-gap) break-inside-avoid overflow-hidden rounded-card border border-npf-hairline"
              >
                <h2
                  id={`${id}-g${i}`}
                  className="npf-h5 flex items-baseline justify-between gap-3 border-b border-npf-hairline bg-npf-mist px-5 py-3.5 text-npf-blue-deep"
                >
                  {g.heading}
                  <span className="npf-small font-medium text-npf-steel tabular-nums">
                    {g.links.length}
                  </span>
                </h2>
                <ul className="divide-y divide-npf-hairline">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Row link={l} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : null}

        {services.length ? (
          <section
            aria-labelledby={`${id}-az`}
            className="mt-12 border-t border-npf-hairline pt-12"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id={`${id}-az`} className="npf-h3 text-npf-blue-deep">
                {t("All services")}{" "}
                <span className="npf-h4 font-normal text-npf-steel tabular-nums">
                  {services.length}
                </span>
              </h2>
              <Link href="/app/services" className="npf-btn npf-btn-secondary npf-btn-sm">
                {t("Open the catalogue")}
                <span className="npf-btn-disc">
                  <ArrowRight className="npf-arrow size-4 rtl:-scale-x-100" />
                </span>
              </Link>
            </div>

            {q ? null : (
              <>
                <nav aria-label={t("Package")} className="mt-6">
                  <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
                    {data.packages.map((p) => (
                      <li key={p.href} className="shrink-0">
                        <Link
                          href={p.href}
                          className="flex min-h-11 items-center gap-2.5 rounded-full bg-white ps-4 pe-2 text-sm font-medium whitespace-nowrap text-npf-body ring-1 ring-npf-hairline transition-[color,box-shadow,scale] duration-(--dur-hover) ease-(--ease-out) ring-inset hover:text-npf-ink hover:ring-npf-ink/25 active:scale-[0.97] active:duration-(--dur-press)"
                        >
                          {p.label}
                          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-npf-cloud px-1.5 text-xs font-semibold text-npf-steel tabular-nums">
                            {p.count}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Pinned under the site header while the list scrolls past. */}
                <nav
                  aria-label={t("Jump to a letter")}
                  className="sticky top-[73px] z-10 -mx-4 mt-8 border-y border-npf-hairline bg-white/95 px-4 backdrop-blur lg:mx-0 lg:px-0"
                >
                  <ul className="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
                    {letters.map(([letter]) => (
                      <li key={letter} className="shrink-0">
                        <a
                          href={`#${id}-${letter}`}
                          className="grid size-10 place-items-center rounded-chip font-secondary text-base font-bold text-npf-blue-deep transition-colors hover:bg-npf-chip"
                        >
                          {letter}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </>
            )}

            {/* Below xl the column wrappers drop out, the letters flow
                through CSS columns, and a run-on letter reads as one. */}
            <div className="mt-8 gap-x-(--npf-gap) md:columns-2 xl:grid xl:columns-auto xl:grid-cols-3">
              {columns.map((parts, col) => (
              <div key={col} className="contents xl:block">
              {parts.map(({ letter, links, opens, closes }) => (
                <section
                  key={letter}
                  id={opens ? `${id}-${letter}` : undefined}
                  aria-label={opens ? letter : undefined}
                  className={`scroll-mt-40 break-inside-avoid ${closes ? "mb-8" : "xl:mb-8"}`}
                >
                  <p
                    aria-hidden
                    className={`font-secondary border-b-2 border-npf-blue-deep pb-1 text-2xl leading-none font-bold text-npf-blue-deep ${opens ? "" : "hidden xl:block"}`}
                  >
                    {letter}
                  </p>
                  <ul className="divide-y divide-npf-hairline">
                    {links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="npf-row-link group -mx-2 flex min-h-11 items-center justify-between gap-3 rounded-chip px-2 py-2 text-npf-ink focus-visible:-outline-offset-2"
                        >
                          <span className="npf-body transition-colors group-hover:text-npf-blue">
                            {l.label}
                          </span>
                          <ArrowRight className="npf-go opacity-0 transition-[opacity,translate] group-hover:opacity-100 group-focus-visible:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
              </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}

/**
 * Cuts a run of weights into three in order, keeping the tallest part as
 * short as possible. `lead[i]` is what a part pays for starting at i (a
 * repeated heading). Every pair of cuts is tried: a few thousand at most.
 */
function split3(w: number[], lead: number[]): [number, number][] {
  const sum = (a: number, b: number) =>
    a === b ? 0 : (lead[a] ?? 0) + w.slice(a, b).reduce((s, x) => s + x, 0);
  let best: [number, number] = [0, 0];
  let low = Infinity;
  for (let i = 0; i <= w.length; i++)
    for (let j = i; j <= w.length; j++) {
      const tall = Math.max(sum(0, i), sum(i, j), sum(j, w.length));
      if (tall < low) [low, best] = [tall, [i, j]];
    }
  return [
    [0, best[0]],
    [best[0], best[1]],
    [best[1], w.length],
  ];
}

/** One page in a group. Another website says so, and names its address. */
function Row({ link }: { link: IndexLink }) {
  const t = useT();
  const cls =
    "npf-row-link group flex min-h-12 items-center justify-between gap-3 px-5 py-3 focus-visible:-outline-offset-2 active:bg-npf-cloud";
  const label = (
    <span className="npf-body text-npf-ink transition-colors group-hover:text-npf-blue">
      {link.label}
    </span>
  );
  if (!link.external)
    return (
      <Link href={link.href} className={cls}>
        {label}
        <ArrowRight className="npf-go" />
      </Link>
    );
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
      <span className="min-w-0">
        {label}
        <span className="npf-small block truncate text-npf-steel">
          {new URL(link.href).hostname.replace(/^www\./, "")}
        </span>
      </span>
      <ArrowUpRight className="size-4.5 shrink-0 text-npf-steel transition-colors group-hover:text-npf-blue" />
      <span className="sr-only">{t("(opens in a new window)")}</span>
    </a>
  );
}
