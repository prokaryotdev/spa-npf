import type { Metadata } from "next";
import Link from "../../i18n/Link";
import { HelpCard, PageShell } from "../../components/PageShell";
import ServiceSearch from "../../components/ServiceSearch";
import { StartRows } from "../../components/SiteIndex";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  FileIcon,
  GlobeIcon,
  PhoneCallIcon,
  SearchIcon,
  ServicesIcon,
  ShieldIcon,
} from "../../components/icons";
import { startHere } from "../../content-pages";
import { escape, fold } from "../../search-text";
import { popularServices, search, type SearchHit } from "../../search-index";
import { getT, getLocalized } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Search | Nigeria Police Force"),
    description: t(
      "Search Nigeria Police Force services, news, events and information.",
    ),
  };
}

/** Rows a group shows before the rest fold away. */
const SHOWN = 6;

type T = Awaited<ReturnType<typeof getT>>;

/**
 * Results come grouped by kind, each kind where its best hit ranked, so
 * "police" reads as 35 services, then the pages, then the outside sites,
 * instead of one 40-row column with a tag on every row.
 */
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const t = await getT();
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = await getLocalized(search(query));
  const popular = await getLocalized(popularServices);

  const groups: { section: string; hits: SearchHit[] }[] = [];
  for (const hit of results) {
    const g = groups.find((g) => g.section === hit.section);
    if (g) g.hits.push(hit);
    else groups.push({ section: hit.section, hits: [hit] });
  }

  const start = (
    <>
      <h2 className="npf-h4 mt-12 text-npf-blue-deep">{t("Start here")}</h2>
      <StartRows
        wide={false}
        start={startHere.map((l) => ({
          ...l,
          label: t(l.label),
          note: t(l.note),
        }))}
      />
    </>
  );

  return (
    <PageShell
      title={t("Search")}
      intro={t("Find a service, a news story, an event or a page.")}
      compact
      lead={
        <div className="mt-8 max-w-3xl">
          <ServiceSearch
            key={query}
            variant="panel"
            initialQuery={query}
            placeholder={t("Search for a service, news or page")}
          />
        </div>
      }
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container grid items-start gap-x-(--npf-gap) gap-y-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            {results.length ? (
              <>
                <div aria-live="polite">
                  <p className="npf-h5 text-npf-ink">
                    <span className="tabular-nums">
                      {t(
                        results.length === 1
                          ? "{n} result for"
                          : "{n} results for",
                        { n: results.length },
                      )}
                    </span>{" "}
                    <span className="text-npf-blue-deep">“{query}”</span>
                  </p>
                  {groups.length > 1 ? (
                    <ul className="npf-small mt-3 flex flex-wrap gap-2">
                      {groups.map((g, i) => (
                        <li key={g.section}>
                          <a
                            href={`#group-${i}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-medium text-npf-ink ring-1 ring-npf-hairline transition-colors ring-inset hover:bg-npf-mist hover:text-npf-blue"
                          >
                            {t(g.section)}
                            <span className="text-npf-steel tabular-nums">
                              {g.hits.length}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className="mt-8 space-y-(--npf-gap)">
                  {groups.map((g, i) => (
                    <ResultGroup
                      key={g.section}
                      id={`group-${i}`}
                      title={t(g.section)}
                      hits={g.hits}
                      query={query}
                      t={t}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                {query ? (
                  <div
                    aria-live="polite"
                    className="mb-12 flex items-start gap-4 rounded-card border border-npf-hairline px-6 py-6"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-npf-chip text-npf-blue">
                      <SearchIcon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="npf-h5 text-npf-ink">
                        {t("Nothing matched")}{" "}
                        <span className="break-words text-npf-blue-deep">
                          “{query}”
                        </span>
                      </h2>
                      <p className="npf-small mt-1 text-npf-body">
                        {t(
                          "Check the spelling or use fewer words. Or start from the most used services below.",
                        )}
                      </p>
                    </div>
                  </div>
                ) : null}
                <ResultGroup
                  id="popular"
                  title={t("Most used services")}
                  hits={popular}
                  t={t}
                />
                {start}
              </>
            )}
          </div>

          <aside className="space-y-(--npf-gap) lg:col-span-4 lg:[@media(min-height:46rem)]:sticky lg:[@media(min-height:46rem)]:top-28">
            <section
              aria-labelledby="search-tips"
              className="rounded-card bg-npf-mist px-5 py-5 ring-1 ring-npf-line ring-inset"
            >
              <h2 id="search-tips" className="npf-h5 text-npf-blue-deep">
                {t("Search tips")}
              </h2>
              <dl className="npf-small mt-3 space-y-3 text-npf-body">
                {[
                  ['"police clearance"', t("Quotes find the words side by side.")],
                  ["permit -firearm", t("A minus leaves a word out.")],
                  ["takardar shaida", t("Search in English, Hausa, Yoruba or Igbo.")],
                ].map(([example, note]) => (
                  <div key={example}>
                    <dt>
                      <Link
                        href={`/app/search?q=${encodeURIComponent(example)}`}
                        className="rounded-chip bg-white px-2 py-0.5 font-medium text-npf-ink ring-1 ring-npf-line transition-colors ring-inset hover:text-npf-blue hover:ring-npf-blue-mid"
                      >
                        {example}
                      </Link>
                    </dt>
                    <dd className="mt-1">{note}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <HelpCard
              title={t("Still can't find it?")}
              intro={t("Every page is in the sitemap, or ask us.")}
              rows={[
                {
                  Icon: GlobeIcon,
                  label: t("Sitemap"),
                  note: t("Every page on the site, in one list."),
                  href: "/app/home/sitemap",
                },
                {
                  Icon: ServicesIcon,
                  label: t("Browse services"),
                  note: t("Every service, by package."),
                  href: "/app/services",
                },
                {
                  Icon: PhoneCallIcon,
                  label: t("Contact Us"),
                  note: t("Phone lines, email and feedback."),
                  href: "/app/home/contactUs",
                },
              ]}
            />
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

/** One kind of result: a ruled card, the first few rows, the rest folded. */
function ResultGroup({
  id,
  title,
  hits,
  query = "",
  t,
}: {
  id: string;
  title: string;
  hits: SearchHit[];
  query?: string;
  t: T;
}) {
  const rows = (list: SearchHit[]) => (
    <ul className="divide-y divide-npf-hairline">
      {list.map((hit) => (
        <li key={hit.title + hit.href}>
          <ResultRow hit={hit} query={query} t={t} />
        </li>
      ))}
    </ul>
  );
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      className="scroll-mt-28 overflow-hidden rounded-card border border-npf-hairline"
    >
      <h2
        id={`${id}-h`}
        className="npf-h5 flex items-baseline justify-between gap-3 border-b border-npf-hairline bg-npf-mist px-5 py-3.5 text-npf-blue-deep"
      >
        {title}
        <span className="npf-small font-medium text-npf-steel tabular-nums">
          {hits.length}
        </span>
      </h2>
      {rows(hits.slice(0, SHOWN))}
      {hits.length > SHOWN ? (
        <details className="group/more border-t border-npf-hairline">
          <summary className="npf-row-link flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-npf-blue [&::-webkit-details-marker]:hidden">
            <span className="group-open/more:hidden">
              {t("Show {count} more", { count: hits.length - SHOWN })}
            </span>
            <span className="hidden group-open/more:inline">
              {t("Show fewer")}
            </span>
            <ArrowDown className="size-4.5 shrink-0 transition-transform duration-(--dur-hover) group-open/more:rotate-180" />
          </summary>
          <div className="border-t border-npf-hairline">
            {rows(hits.slice(SHOWN))}
          </div>
        </details>
      ) : null}
    </section>
  );
}

function ResultRow({ hit, query, t }: { hit: SearchHit; query: string; t: T }) {
  const Icon = sectionIcon(hit.section);
  // An outside site with no summary says where it goes instead.
  const note =
    hit.body ||
    (hit.external ? new URL(hit.href).hostname.replace(/^www\./, "") : "");
  return (
    <Link
      href={hit.href}
      target={hit.external ? "_blank" : undefined}
      rel={hit.external ? "noopener noreferrer" : undefined}
      className={`npf-row-link group flex gap-4 px-5 py-4.5 focus-visible:-outline-offset-2 active:bg-npf-cloud ${note ? "items-start" : "items-center"}`}
    >
      <span className="npf-disc rounded-chip">
        {hit.icon ? (
          <Image src={hit.icon} alt="" width={22} height={22} className="size-5.5" />
        ) : (
          <Icon className="size-5" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="npf-h5 block text-npf-ink transition-colors group-hover:text-npf-blue">
          {mark(hit.title, query)}
        </span>
        {note ? (
          <span
            className={`npf-small mt-1 ${hit.body ? "line-clamp-2 text-npf-body" : "block truncate text-npf-steel"}`}
          >
            {note}
          </span>
        ) : null}
      </span>
      {hit.external ? (
        <>
          <ArrowUpRight aria-hidden className={`npf-go ${note ? "mt-1" : ""}`} />
          <span className="sr-only"> {t("(opens in a new window)")}</span>
        </>
      ) : (
        <ArrowRight aria-hidden className={`npf-go ${note ? "mt-1" : ""}`} />
      )}
    </Link>
  );
}

/**
 * Picks out where each typed word starts a word of the title, accents and
 * Hausa hooks folded, so "iwe" lights "Ìwé". A slip the search forgave
 * ("polce") lights nothing, which is honest: the title doesn't say it.
 */
function mark(title: string, query: string) {
  const words = fold(query)
    .split(/\s+/)
    .map((w) => w.replace(/^[-"“”]+|["“”]+$/g, ""))
    .filter((w) => w.length > 1);
  if (!words.length) return title;
  // One folded letter per letter of the title, so offsets line up.
  const chars = [...title];
  const flat = chars.map((c) => fold(c)[0] ?? c).join("");
  const lit = new Array(chars.length).fill(false);
  for (const w of words)
    for (const m of flat.matchAll(
      new RegExp(`(?<![\\p{L}\\p{N}])${escape(w)}`, "gu"),
    ))
      lit.fill(true, m.index, m.index + w.length);
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < chars.length) {
    let j = i;
    while (j < chars.length && lit[j] === lit[i]) j++;
    const run = chars.slice(i, j).join("");
    out.push(
      lit[i] ? (
        <mark key={i} className="rounded-[3px] bg-npf-chip text-inherit">
          {run}
        </mark>
      ) : (
        run
      ),
    );
    i = j;
  }
  return out;
}

/** A drawn glyph for each kind of result, when it has no icon of its own. */
function sectionIcon(section: string) {
  if (section === "Services") return ServicesIcon;
  if (section === "Legal") return ShieldIcon;
  if (/news|event/i.test(section)) return FileIcon;
  return GlobeIcon;
}
