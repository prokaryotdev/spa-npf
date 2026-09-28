import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "../../components/PageShell";
import ServiceCatalogue, {
  ServiceQuery,
  ServiceSearch,
} from "../../components/ServiceCatalogue";
import {
  services as servicesSource,
  serviceCategoryNames,
  serviceImportance,
} from "../../content-services";
import { getT } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Services | Nigeria Police Force"),
    description: t(
      "Every Nigeria Police Force service, with its fee, turnaround and who it is for.",
    ),
  };
}

export default async function ServicesPage() {
  const t = await getT();
  // Only the fields a row draws cross to the browser, and in English: the
  // package filter compares against English values, and the catalogue
  // translates at render.
  const rows = servicesSource.map((s) => ({
    slug: s.slug,
    name: s.name,
    category: s.category,
    icon: s.icon,
    description: s.description,
    mostUsed: s.mostUsed,
    feeSummary: s.feeSummary,
    turnaround: s.turnaround,
    // Unlisted services tie at the end and fall back to A to Z.
    importance: serviceImportance.includes(s.slug)
      ? serviceImportance.indexOf(s.slug)
      : serviceImportance.length,
  }));
  return (
    <ServiceQuery>
      <PageShell
        title={t("Services")}
        intro={t(
          "All {n} Nigeria Police Force services, with the fee, the turnaround and who each one is for.",
          { n: rows.length },
        )}
        lead={<ServiceSearch />}
      >
        {/* Reads ?package= from the homepage suite links. */}
        <Suspense fallback={null}>
          <ServiceCatalogue services={rows} categories={serviceCategoryNames} />
        </Suspense>
      </PageShell>
    </ServiceQuery>
  );
}
