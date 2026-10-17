import type { Metadata } from "next";
import { PageShell } from "../../../components/PageShell";
import SiteIndex, { type SiteIndexData } from "../../../components/SiteIndex";
import { footerColumns, legalLinks, navigation } from "../../../content";
import { startHere } from "../../../content-pages";
import {
  serviceCategoryNames,
  services,
} from "../../../content-services";
import { getLang, getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Sitemap | Nigeria Police Force"),
    description: t("Every page on the Nigeria Police Force website, in one list."),
  };
}

export default async function SitemapPage() {
  const t = await getT();
  const lang = await getLang();
  const info = navigation.find((n) => n.href === "/app/home/information")!;

  // Each page appears once.
  const data: SiteIndexData = {
    start: startHere.map((l) => ({
      ...l,
      label: t(l.label),
      note: t(l.note),
    })),
    groups: [
      {
        heading: t("Information"),
        // The hub row would only repeat the heading, so it says what it is.
        links: [
          { label: t("Overview"), href: info.href },
          ...(info.children ?? []).map((l) => ({
            label: t(l.label),
            href: l.href,
          })),
        ],
      },
      {
        heading: t("Legal"),
        links: legalLinks
          .filter((l) => l.href !== "/app/home/sitemap")
          .map((l) => ({ label: t(l.label), href: l.href })),
      },
      {
        heading: t("Account"),
        links: [
          { label: t("Sign In"), href: "/app/signin" },
          { label: t("Create an account"), href: "/app/register" },
          { label: t("My Account"), href: "/app/portal" },
          { label: t("My Requests"), href: "/app/portal/requests" },
          { label: t("Fines"), href: "/app/portal/fines" },
          { label: t("Documents"), href: "/app/portal/documents" },
          { label: t("Profile"), href: "/app/portal/profile" },
        ],
      },
      {
        heading: t("Around the site"),
        links: [
          { label: t("Home"), href: "/app/home" },
          { label: t("Search"), href: "/app/search" },
          { label: t("Contact us"), href: "/app/home/contactUs" },
          { label: t("Rate this service"), href: "/app/home/rate-service" },
        ],
      },
      {
        heading: t("Friendly Websites"),
        links: footerColumns
          .flatMap((c) => c.links as { label: string; href: string; external?: boolean }[])
          .filter((l) => l.external)
          .map((l) => ({ label: t(l.label), href: l.href, external: true })),
      },
    ],
    // The catalogue compares ?package= against the English name.
    packages: serviceCategoryNames.map((name) => ({
      label: t(name),
      href: `/app/services?package=${encodeURIComponent(name)}`,
      count: services.filter((s) => s.category === name).length,
    })),
    services: services
      .map((s) => ({ label: t(s.name), href: `/app/services/${s.slug}` }))
      .sort((a, b) => a.label.localeCompare(b.label, lang)),
  };

  return (
    <PageShell
      title={t("Sitemap")}
      intro={t("Every page on the Nigeria Police Force website, in one list.")}
      compact
    >
      <SiteIndex data={data} />
    </PageShell>
  );
}
