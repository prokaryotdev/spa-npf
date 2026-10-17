import type { Metadata } from "next";
import RatingForm from "../../../components/RatingForm";
import { HelpCard, PageShell } from "../../../components/PageShell";
import { ClockIcon, InboxIcon, ShieldIcon } from "../../../components/icons";
import { serviceCategoryNames, services } from "../../../content-services";
import { getT } from "../../../i18n/server";

const INTRO =
  "Tell us how a police service worked for you. It takes a minute and no account is needed.";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Rate this service | Nigeria Police Force"),
    description: t(INTRO),
  };
}

export default async function RateServicePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const t = await getT();
  const { service = "" } = await searchParams;

  const pick = (list: typeof services) =>
    list
      .map((s) => ({ slug: s.slug, name: t(s.name) }))
      .sort((a, b) => a.name.localeCompare(b.name));
  const groups = [
    // The footer link sits on every page, so the site itself is a choice.
    { label: t("Around the site"), options: [{ slug: "website", name: t("This website") }] },
    ...serviceCategoryNames.map((name) => ({
      label: t(name),
      options: pick(services.filter((s) => s.category === name)),
    })),
    { label: t("Other services"), options: pick(services.filter((s) => !s.category)) },
  ].filter((g) => g.options.length);

  const known = groups.some((g) => g.options.some((o) => o.slug === service));

  return (
    <PageShell title={t("Rate this service")} intro={t(INTRO)} compact>
      <section aria-label={t("Rate this service")} className="bg-npf-cloud py-12 lg:py-16">
        <div className="npf-container grid gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:gap-x-12">
          <div className="min-w-0">
            <RatingForm groups={groups} initial={known ? service : ""} />
          </div>
          {/* A rating gets no reply. Anyone who needs one goes from here. */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <HelpCard
              title={t("Need an answer, not a rating?")}
              rows={[
                {
                  Icon: ShieldIcon,
                  label: t("Report a Police Officer"),
                  note: t("Complaint Response Unit"),
                  href: "/app/services/leaders-at-your-service",
                },
                {
                  Icon: ClockIcon,
                  label: t("Track a Reference"),
                  href: "/app/track",
                },
                {
                  Icon: InboxIcon,
                  label: t("Contact us"),
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
