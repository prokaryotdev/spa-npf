import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "../../components/PageShell";
import ServiceCatalogue from "../../components/ServiceCatalogue";
import { services as servicesSource } from "../../content-services";
import { getT, getLocalized } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Services | Dubai Police"),
    description: t(
      "Every Dubai Police service, with its fee, turnaround and who it is for.",
    ),
  };
}

export default async function ServicesPage() {
  const services = await getLocalized(servicesSource);
  const t = await getT();
  return (
    <PageShell
      title={t("Services")}
      intro={t(
        "All {n} Dubai Police services, with the fee, the turnaround and who each one is for.",
        { n: services.length },
      )}
    >
      <section className="bg-white pb-24">
        <div className="dp-container">
          {/* Reads ?package= from the homepage suite links. */}
          <Suspense fallback={null}>
            <ServiceCatalogue />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
