import type { Metadata } from "next";
import Link from "./i18n/Link";
import { HelpCard, PageShell } from "./components/PageShell";
import ServiceSearch from "./components/ServiceSearch";
import { StartRows } from "./components/SiteIndex";
import { ClosestPages, MissedAddress } from "./components/NotFoundHelp";
import {
  ArrowRight,
  GlobeIcon,
  PhoneCallIcon,
  SearchIcon,
} from "./components/icons";
import { startHere } from "./content-pages";
import { getT } from "./i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Page not found | Nigeria Police Force") };
}

/**
 * A wrong address is usually one slip away from a right one, so the page
 * leads with its best guess, then the tasks most people come for.
 */
export default async function NotFound() {
  const t = await getT();
  return (
    <PageShell
      title={t("Page not found")}
      intro={t("That page has moved or never existed. Here is the way back.")}
      compact
      lead={
        <>
          <MissedAddress />
          <div className="mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <ServiceSearch
                variant="panel"
                placeholder={t("Search for a service, news or page")}
              />
            </div>
            <Link href="/" className="npf-btn npf-btn-primary self-start sm:self-auto">
              {t("Back to home")}
              <span className="npf-btn-disc">
                <ArrowRight className="npf-arrow size-4 rtl:-scale-x-100" />
              </span>
            </Link>
          </div>
        </>
      }
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container grid items-start gap-x-(--npf-gap) gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ClosestPages />
            <h2 className="npf-h4 mt-12 text-npf-blue-deep">{t("Start here")}</h2>
            <StartRows
              wide={false}
              start={startHere.map((l) => ({
                ...l,
                label: t(l.label),
                note: t(l.note),
              }))}
            />
          </div>
          <HelpCard
            className="lg:col-span-4"
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
                Icon: SearchIcon,
                label: t("Search"),
                note: t("Services, news and every page"),
                href: "/app/search",
              },
              {
                Icon: PhoneCallIcon,
                label: t("Contact Us"),
                note: t("Phone lines, email and feedback."),
                href: "/app/home/contactUs",
              },
            ]}
          />
        </div>
      </section>
    </PageShell>
  );
}
