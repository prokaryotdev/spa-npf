import type { Metadata } from "next";
import Link from "../../../i18n/Link";
import { PageShell } from "../../../components/PageShell";
import { ArrowRight, ArrowUpRight } from "../../../components/icons";
import { footerColumns, legalLinks, navigation } from "../../../content";
import { services } from "../../../content-services";
import { getLocalized, getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Sitemap | Nigeria Police Force"),
    description: t("Every page on the Nigeria Police Force website, in one list."),
  };
}

type Entry = { label: string; href: string; external?: boolean };

/** The whole site is already described by the header and footer link data. */
const groupsSource: { heading: string; count?: number; links: Entry[] }[] = [
  {
    heading: "Main navigation",
    links: navigation.flatMap((item) => [
      { label: item.label, href: item.href },
      ...("children" in item && item.children ? item.children : []),
    ]),
  },
  ...footerColumns.map((col) => ({
    heading: col.heading,
    links: col.links as Entry[],
  })),
  {
    heading: "Account",
    links: [
      { label: "Sign In", href: "/app/signin" },
      { label: "My Nigeria Police Force", href: "/app/portal" },
      { label: "Search", href: "/app/search" },
    ],
  },
  {
    heading: "Services",
    count: services.length,
    links: [
      { label: "All services", href: "/app/services" },
      ...services.map((s) => ({
        label: s.name,
        href: `/app/services/${s.slug}`,
      })),
    ],
  },
  { heading: "Legal", links: legalLinks },
];

export default async function SitemapPage() {
  const t = await getT();
  const groups = await getLocalized(groupsSource);
  return (
    <PageShell
      title={t("Sitemap")}
      intro={t("Every page on the Nigeria Police Force website, in one list.")}
    >
      <section className="bg-white pb-(--npf-section-y)">
        {/* Masonry by columns: the groups differ in length, and a grid would
            leave a hole under every short one. */}
        <div className="npf-container gap-(--npf-gap) md:columns-2 xl:columns-3">
          {[...groups]
            .sort((a, b) => Number(a.links.length > 20) - Number(b.links.length > 20))
            .map((group, i) => {
            // The service list is the long one: it takes the full row and
            // flows into columns, so it reads as an index, not a scroll.
            const wide = group.links.length > 20;
            return (
              <section
                key={i}
                aria-labelledby={`sitemap-${i}`}
                className={`mb-(--npf-gap) break-inside-avoid overflow-hidden rounded-card border border-npf-hairline bg-white ${wide ? "[column-span:all]" : ""}`}
              >
                <h2
                  id={`sitemap-${i}`}
                  className="npf-h5 flex items-baseline justify-between gap-3 border-b border-npf-hairline bg-npf-mist px-5 py-3.5 text-npf-blue-deep"
                >
                  {t(group.heading)}
                  <span className="npf-small font-medium text-npf-steel tabular-nums">
                    {group.count ?? group.links.length}
                  </span>
                </h2>
                <ul
                  className={
                    wide
                      ? "gap-x-8 px-2 py-2 md:columns-2 xl:columns-3"
                      : "px-2 py-2"
                  }
                >
                  {/* Sub-links repeat the parent label in a couple of places, so key on the href too. */}
                  {group.links.map((link) => (
                    <li key={link.label + link.href} className="break-inside-avoid">
                      <Link
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="npf-small group flex min-h-10 items-center justify-between gap-3 rounded-chip px-3 py-2 text-npf-ink transition-colors hover:bg-npf-paper hover:text-npf-blue"
                      >
                        {link.label}
                        {link.external ? (
                          <>
                            <ArrowUpRight
                              aria-hidden
                              className="size-4 shrink-0 text-npf-steel transition-colors group-hover:text-npf-blue"
                            />
                            <span className="sr-only">
                              {t("(opens in a new window)")}
                            </span>
                          </>
                        ) : (
                          <ArrowRight
                            aria-hidden
                            className="size-4 shrink-0 text-npf-blue opacity-0 transition-[opacity,translate] duration-(--dur-hover) group-hover:translate-x-[3px] group-hover:opacity-100 rtl:-scale-x-100 rtl:group-hover:-translate-x-[3px]"
                          />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
