import type { Metadata } from "next";
import Link from "../../../i18n/Link";
import { PageShell } from "../../../components/PageShell";
import { ArrowUpRight } from "../../../components/icons";
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
      <section className="bg-white pb-24">
        <div className="npf-container grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group, i) => (
            <div key={i}>
              <h2 className="mb-4 border-b border-black/10 pb-3 font-secondary text-lg font-bold text-npf-blue-deep">
                {t(group.heading)}
                {group.count ? ` (${group.count})` : null}
              </h2>
              <ul className="space-y-2.5">
                {/* Sub-links repeat the parent label in a couple of places, so key on the href too. */}
                {group.links.map((link) => (
                  <li key={link.label + link.href}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 text-base text-npf-body transition-colors hover:text-npf-blue"
                    >
                      {link.label}
                      {link.external ? (
                        <>
                          <ArrowUpRight aria-hidden className="size-4" />
                          <span className="sr-only">
                            {t("(opens in a new window)")}
                          </span>
                        </>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
