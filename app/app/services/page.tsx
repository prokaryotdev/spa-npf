import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "../../components/PageShell";
import ServiceCatalogue from "../../components/ServiceCatalogue";
import { services } from "../../content-services";

export const metadata: Metadata = {
  title: "Services | Dubai Police",
  description:
    "Every Dubai Police service, with its fee, turnaround and who it is for.",
};

export default function ServicesPage() {
  return (
    <PageShell
      title="Services"
      intro={`All ${services.length} Dubai Police services, with the fee, the turnaround and who each one is for.`}
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
