import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireBackend } from "../../../../backend";
import ApplyForm from "../../../../components/ApplyForm";
import { PageShell } from "../../../../components/PageShell";
import { services } from "../../../../content-services";
import { getT } from "../../../../i18n/server";
import { reportSlug } from "../../../../content-report";

export function generateStaticParams() {
  return services
    .filter((s) => !reportSlug(s.slug))
    .map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getT();
  const service = services.find((s) => s.slug === slug);
  return {
    title: t("Apply: {name} | Nigeria Police Force", {
      name: t(service?.name ?? ""),
    }),
    robots: { index: false, follow: false },
  };
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  requireBackend();
  const { slug } = await params;
  const t = await getT();
  // The English record, not the localised one: what is stored is what an
  // officer reads, and the screens translate it on the way out.
  const service = services.find((s) => s.slug === slug);
  if (!service || reportSlug(service.slug)) notFound();

  return (
    <PageShell
      title={t(service.name)}
      intro={t("Apply online. It takes about five minutes.")}
      trail={[
        { label: t("Services"), href: "/app/services" },
        { label: t(service.name), href: `/app/services/${service.slug}` },
      ]}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          <ApplyForm service={service} />
        </div>
      </section>
    </PageShell>
  );
}
