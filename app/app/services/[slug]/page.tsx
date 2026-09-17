import type { Metadata } from "next";
import Image from "next/image";
import Link from "../../../i18n/Link";
import { notFound } from "next/navigation";
import { BreadcrumbLd, ServiceLd } from "../../../components/StructuredData";
import { PageShell, Panel } from "../../../components/PageShell";
import ServiceAction from "../../../components/ServiceAction";
import {
  CardIcon,
  CheckIcon,
  ClockIcon,
  FileIcon,
  PhoneIcon,
  ServicesIcon,
} from "../../../components/icons";
import { services as servicesSource } from "../../../content-services";
import { getT, getLocalized } from "../../../i18n/server";

export function generateStaticParams() {
  return servicesSource.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getT();
  const source = servicesSource.find((s) => s.slug === slug);
  if (!source) return { title: t("Service not found | Nigeria Police Force") };
  const service = await getLocalized(source);
  return {
    title: t("{name} | Nigeria Police Force", { name: service.name }),
    description:
      service.description ||
      t("{name} from Nigeria Police Force.", { name: service.name }),
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const services = await getLocalized(servicesSource);
  const t = await getT();
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const related = service.related.length
    ? service.related
    : services
        .filter(
          (s) =>
            s.slug !== service.slug &&
            s.category &&
            s.category === service.category,
        )
        .slice(0, 4)
        .map((s) => ({ name: s.name, slug: s.slug }));

  return (
    <>
      {/* Data, not markup: these tell a search engine this page is a
          government service with a provider, an audience and a fee, which is
          what turns a blue link into an answer. */}
      <ServiceLd service={service} />
      <BreadcrumbLd
        trail={[
          { name: "Nigeria Police Force", href: "/" },
          { name: "Services", href: "/app/services" },
          { name: service.name, href: "/app/services/" + service.slug },
        ]}
      />
      <PageShell
        title={service.name}
        intro={service.description}
        titleSize="article"
        trail={[{ label: "Services", href: "/app/services" }]}
      >
        <section className="bg-white pb-24">
          <div className="npf-container grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
            <div className="order-2 space-y-10 lg:order-1">
              {service.documents.length ? (
                <Panel heading={t("What you need")}>
                  <ul className="space-y-4">
                    {service.documents.map((doc) => (
                      <li
                        key={doc.label}
                        className="rounded-2xl bg-[#F9F9F9] px-5 py-4"
                      >
                        <p className="flex items-start gap-3 font-medium text-npf-ink">
                          <FileIcon
                            aria-hidden
                            className="mt-0.5 size-5 shrink-0 text-npf-blue-ink"
                          />
                          {doc.label}
                        </p>
                        {doc.items.length ? (
                          <ul className="mt-3 ms-8 grid gap-1.5 sm:grid-cols-2">
                            {doc.items.map((item) => (
                              <li
                                key={item}
                                className="relative ps-5 text-sm text-npf-body before:absolute before:top-[0.55em] before:start-0 before:size-1.5 before:rounded-full before:bg-npf-blue"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </Panel>
              ) : null}

              {service.fees.length ? (
                <Panel heading={t("Fees")}>
                  <dl className="divide-y divide-black/10 rounded-2xl bg-[#F9F9F9] px-5">
                    {service.fees.map((fee) => (
                      <div
                        key={fee.label}
                        className="flex items-center justify-between gap-4 py-4"
                      >
                        <dt className="text-sm text-npf-body">{fee.label}</dt>
                        <dd className="font-secondary text-sm font-bold text-npf-ink tabular-nums">
                          {fee.value}
                        </dd>
                      </div>
                    ))}
                    <div className="flex items-center justify-between gap-4 py-4">
                      {/* Not "Total": where the rows above are tiers or carry an
                        "if", the summary is the cheapest real price, not their
                        sum, and a total that reads "From ₦48,000" is a
                        contradiction. */}
                      <dt className="text-sm font-medium text-npf-ink">
                        {t("Payable")}
                      </dt>
                      <dd className="font-secondary text-base font-bold text-npf-blue-ink tabular-nums">
                        {service.feeSummary}
                      </dd>
                    </div>
                  </dl>
                  {service.payment.length ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {service.payment.map((method) => (
                        <li
                          key={method}
                          className="inline-flex items-center gap-2 rounded-full bg-[#E8EEF8] px-3.5 py-1.5 text-sm text-npf-blue-ink"
                        >
                          <CardIcon aria-hidden className="size-4" />
                          {method}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </Panel>
              ) : null}

              {service.terms.length ? (
                <Panel heading={t("Terms and conditions")}>
                  <ul className="space-y-3">
                    {service.terms.map((term) => (
                      <li
                        key={term}
                        className="flex items-start gap-3 text-base leading-relaxed text-npf-body"
                      >
                        <CheckIcon
                          aria-hidden
                          className="mt-1 size-4 shrink-0 text-npf-blue"
                        />
                        {term}
                      </li>
                    ))}
                  </ul>
                </Panel>
              ) : null}

              {service.delivery ? (
                <Panel heading={t("How you receive it")}>
                  <div className="space-y-3 rounded-2xl bg-[#F9F9F9] px-5 py-4">
                    {splitDelivery(service.delivery).map((part) => (
                      <p
                        key={part.label + part.text}
                        className="text-base leading-relaxed text-npf-body"
                      >
                        {part.label ? (
                          <span className="font-medium text-npf-ink">
                            {part.label}:{" "}
                          </span>
                        ) : null}
                        {part.text}
                      </p>
                    ))}
                  </div>
                </Panel>
              ) : null}

              {service.beneficiaries.length ? (
                <Panel heading={t("Who it is for")}>
                  <ul className="flex flex-wrap gap-2">
                    {service.beneficiaries.map((who) => (
                      <li
                        key={who}
                        className="rounded-full bg-[#E8EEF8] px-4 py-2 text-sm font-medium text-npf-blue-ink"
                      >
                        {who}
                      </li>
                    ))}
                  </ul>
                </Panel>
              ) : null}

              {service.channels.length ? (
                <Panel heading={t("Where to use it")}>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {service.channels.map((channel) => (
                      <li
                        key={channel}
                        className="flex items-center gap-3 rounded-2xl bg-[#F9F9F9] px-5 py-4 text-sm font-medium text-npf-ink"
                      >
                        <ServicesIcon
                          aria-hidden
                          className="size-5 shrink-0 text-npf-blue-ink"
                        />
                        {channel}
                      </li>
                    ))}
                  </ul>
                </Panel>
              ) : null}

              {service.hours.length ? (
                <Panel heading={t("Working hours")}>
                  <dl className="divide-y divide-black/10 rounded-2xl bg-[#F9F9F9] px-5">
                    {service.hours.map((hour) => (
                      <div
                        key={hour.label}
                        className="flex flex-wrap items-center justify-between gap-3 py-4"
                      >
                        <dt className="text-sm text-npf-body">{hour.label}</dt>
                        <dd className="font-secondary text-sm font-bold text-npf-ink">
                          {hour.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Panel>
              ) : null}

              {related.length ? (
                <Panel heading={t("Related services")}>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {related.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/app/services/${item.slug}`}
                          className="block rounded-2xl bg-[#F4F6FA] px-5 py-4 text-sm font-medium text-npf-blue-ink transition-colors hover:bg-[#DDE6F4]"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Panel>
              ) : null}
            </div>

            <aside className="order-1 h-fit lg:order-2 lg:sticky lg:top-28">
              <div className="rounded-3xl bg-[#F4F6FA] p-6">
                {service.icon ? (
                  <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-white">
                    <Image
                      src={service.icon}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8"
                    />
                  </span>
                ) : null}

                <dl className="mb-6 grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs text-npf-muted">{t("Fees")}</dt>
                    <dd className="font-secondary text-base font-bold text-npf-ink">
                      {service.feeSummary}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-npf-muted">{t("Duration")}</dt>
                    <dd className="font-secondary text-base font-bold text-npf-ink">
                      {service.turnaround}
                    </dd>
                  </div>
                </dl>

                <ServiceAction service={service} />

                {service.ninAuthOnly ? (
                  <p className="mt-3 text-center text-xs text-npf-muted">
                    {t("NINAuth sign-in required")}
                  </p>
                ) : null}
              </div>

              {service.contacts.length ? (
                <div className="mt-6 rounded-3xl px-6 py-5 ring-1 ring-black/10">
                  <h2 className="mb-3 flex items-center gap-2 font-secondary text-sm font-bold tracking-wide text-npf-muted uppercase">
                    <PhoneIcon aria-hidden className="size-4" />
                    {t("Need help")}
                  </h2>
                  <ul className="space-y-2 text-sm text-npf-body">
                    {service.contacts.map((contact) => (
                      <li key={contact}>{contact}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <p className="mt-6 flex items-center gap-2 px-1 text-xs text-npf-muted">
                <ClockIcon aria-hidden className="size-4 shrink-0" />
                {t("Processed in {turnaround}", {
                  turnaround: t(service.turnaround).toLowerCase(),
                })}
              </p>
            </aside>
          </div>
        </section>
      </PageShell>
    </>
  );
}

/**
 * The CMS writes delivery channels as one blob with `**Label**:` markers. Only
 * that one pattern is handled — this is not a markdown renderer, and pulling
 * one in for a single bolded lead-in would be the expensive way to do it.
 */
function splitDelivery(text: string) {
  return text
    .split(/\*\*(.+?)\*\*:\s*/)
    .reduce<{ label: string; text: string }[]>((parts, chunk, i, all) => {
      if (i === 0) {
        if (chunk.trim()) parts.push({ label: "", text: chunk.trim() });
      } else if (i % 2 === 1) {
        parts.push({ label: chunk.trim(), text: (all[i + 1] ?? "").trim() });
      }
      return parts;
    }, [])
    .filter((part) => part.text);
}
