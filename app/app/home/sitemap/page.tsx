import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../../../components/PageShell";
import { ArrowUpRight } from "../../../components/icons";
import { footerColumns, legalLinks, navigation } from "../../../content";

export const metadata: Metadata = {
  title: "Sitemap | Dubai Police",
  description: "Every page on the Dubai Police website, in one list.",
};

type Entry = { label: string; href: string; external?: boolean };

/** The whole site is already described by the header and footer link data. */
const groups: { heading: string; links: Entry[] }[] = [
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
      { label: "Search", href: "/app/search" },
    ],
  },
  { heading: "Legal", links: legalLinks },
];

export default function SitemapPage() {
  return (
    <PageShell
      title="Sitemap"
      intro="Every page on the Dubai Police website, in one list."
    >
      <section className="bg-white pb-24">
        <div className="dp-container grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <div key={group.heading}>
              <h2 className="mb-4 border-b border-black/10 pb-3 font-secondary text-lg font-bold text-dp-green-deep">
                {group.heading}
              </h2>
              <ul className="space-y-2.5">
                {/* Sub-links repeat the parent label in a couple of places, so key on the href too. */}
                {group.links.map((link) => (
                  <li key={link.label + link.href}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 text-base text-dp-body transition-colors hover:text-dp-green"
                    >
                      {link.label}
                      {link.external ? (
                        <>
                          <ArrowUpRight aria-hidden className="size-4" />
                          <span className="sr-only">
                            (opens in a new window)
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
