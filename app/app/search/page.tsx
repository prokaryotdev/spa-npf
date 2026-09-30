import type { Metadata } from "next";
import Link from "../../i18n/Link";
import { PageShell } from "../../components/PageShell";
import ServiceSearch from "../../components/ServiceSearch";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  FileIcon,
  GlobeIcon,
  SearchIcon,
  ServicesIcon,
  ShieldIcon,
} from "../../components/icons";
import { search } from "../../search-index";
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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const t = await getT();
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = await getLocalized(search(query));

  return (
    <PageShell
      title={t("Search")}
      intro={t("Find a service, a news story, an event or a page.")}
      lead={
        <div className="mt-8 max-w-3xl md:mt-10">
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
        <div className="npf-container">
          <div className="max-w-3xl">
            {query ? (
              <p aria-live="polite" className="npf-body text-npf-steel">
                <span className="font-semibold text-npf-blue-deep tabular-nums">
                  {t(
                    results.length === 1 ? "{n} result for" : "{n} results for",
                    { n: results.length },
                  )}
                </span>
                {" “"}
                {query}
                {"”"}
              </p>
            ) : null}

            {query && results.length === 0 ? (
              <div className="mt-6 flex flex-col items-center rounded-card bg-npf-paper px-6 py-14 text-center">
                <span className="grid size-14 place-items-center rounded-full bg-white shadow-card">
                  <SearchIcon className="size-6 text-npf-blue" />
                </span>
                <p className="npf-body mt-5 max-w-[46ch] text-npf-body">
                  {t("Nothing matched. Try a shorter term, or browse the")}{" "}
                  <Link
                    href="/app/home/sitemap"
                    className="font-medium text-npf-blue underline underline-offset-2"
                  >
                    {t("sitemap")}
                  </Link>
                  .
                </p>
                <Link
                  href="/app/services"
                  className="npf-btn npf-btn-secondary mt-6"
                >
                  {t("Browse services")}
                </Link>
              </div>
            ) : null}

            {results.length ? (
              <ul className="mt-5 divide-y divide-npf-hairline overflow-hidden rounded-card border border-npf-hairline bg-white">
                {results.map((hit) => {
                  const Icon = sectionIcon(hit.section);
                  return (
                    <li key={hit.section + hit.title + hit.href}>
                      <Link
                        href={hit.href}
                        target={hit.external ? "_blank" : undefined}
                        rel={hit.external ? "noopener noreferrer" : undefined}
                        className="npf-row-link group flex gap-4 px-5 py-5"
                      >
                        <span className="npf-disc rounded-chip">
                          {hit.icon ? (
                            <Image
                              src={hit.icon}
                              alt=""
                              width={22}
                              height={22}
                              className="size-5.5"
                            />
                          ) : (
                            <Icon className="size-5" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="npf-h5 block text-npf-ink transition-colors group-hover:text-npf-blue">
                            {hit.title}
                          </span>
                          {hit.body ? (
                            <span className="npf-small mt-1 line-clamp-2 text-npf-body">
                              {hit.body}
                            </span>
                          ) : null}
                          <span className="npf-small mt-2 inline-flex rounded-full bg-npf-cloud px-2.5 py-0.5 font-medium text-npf-steel">
                            {t(hit.section)}
                          </span>
                        </span>
                        {hit.external ? (
                          <>
                            <ArrowUpRight aria-hidden className="npf-go mt-1" />
                            <span className="sr-only">
                              {" "}
                              {t("(opens in a new window)")}
                            </span>
                          </>
                        ) : (
                          <ArrowRight aria-hidden className="npf-go mt-1" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/** A drawn glyph for each kind of result, when it has no icon of its own. */
function sectionIcon(section: string) {
  if (section === "Services") return ServicesIcon;
  if (section === "Legal") return ShieldIcon;
  if (/news|event/i.test(section)) return FileIcon;
  return GlobeIcon;
}
