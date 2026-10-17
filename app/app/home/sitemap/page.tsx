import type { Metadata } from "next";
import { PageShell } from "../../../components/PageShell";
import SiteIndex, { type SiteIndexData } from "../../../components/SiteIndex";
import { footerColumns, legalLinks, navigation } from "../../../content";
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

  // Each page appears once. The notes are the pages' own intros, so they
  // say what the page says about itself.
  const data: SiteIndexData = {
    start: [
      {
        icon: "report",
        label: t("Report a Crime"),
        href: "/app/report",
        note: t(
          "Report a crime to the State Command where it happened. Free, open all day, and you can report anonymously.",
        ),
      },
      {
        icon: "track",
        label: t("Track a Reference"),
        href: "/app/track",
        note: t(
          "Follow a crime report or an application with its reference number. No account needed.",
        ),
      },
      {
        icon: "services",
        label: t("Services"),
        href: "/app/services",
        note: t(
          "Every Nigeria Police Force service, with its fee, turnaround and who it is for.",
        ),
      },
      {
        icon: "verify",
        label: t("Verify a Police Document"),
        href: "/app/verify",
        note: t(
          "Check that a police clearance certificate, report or permit you were given was issued by the Nigeria Police Force.",
        ),
      },
      {
        icon: "appeals",
        label: t("Appeals"),
        href: "/app/appeals",
        note: t(
          "Missing people, wanted people and stolen vehicles the Force is asking about. Send what you know, anonymously if you prefer.",
        ),
      },
      {
        icon: "centers",
        label: t("Customer Centers"),
        href: "/app/home/customer-centers",
        note: t(
          "Force Headquarters and the Police Command of every state and the FCT, with where to find each one.",
        ),
      },
    ],
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
