import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  if (!source) return { title: t("Service not found | Dubai Police") };
  const service = await getLocalized(source);
  return {
    title: t("{name} | Dubai Police", { name: service.name }),
    description:
      service.description ||
      t("{name} from Dubai Police.", { name: service.name }),
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
    <PageShell
      title={service.name}
      intro={service.description}
      titleSize="article"
      trail={[{ label: "Services", href: "/app/services" }]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
          <div className="order-2 space-y-10 lg:order-1">
            {service.documents.length ? (
              <Panel heading={t("What you need")}>
                <ul className="space-y-4">
                  {service.documents.map((doc) => (
                    <li
                      key={doc.label}
                      className="rounded-2xl bg-[#F9F9F9] px-5 py-4"
                    >
                      <p className="flex items-start gap-3 font-medium text-dp-ink">
                        <FileIcon
                          aria-hidden
                          className="mt-0.5 size-5 shrink-0 text-dp-green-ink"
                        />
                        {doc.label}
                      </p>
                      {doc.items.length ? (
                        <ul className="mt-3 ms-8 grid gap-1.5 sm:grid-cols-2">
                          {doc.items.map((item) => (
                            <li
                              key={item}
                              className="relative ps-5 text-sm text-dp-body before:absolute before:top-[0.55em] before:start-0 before:size-1.5 before:rounded-full before:bg-dp-green"
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
                      <dt className="text-sm text-dp-body">{fee.label}</dt>
                      <dd className="font-secondary text-sm font-bold text-dp-ink tabular-nums">
                        {fee.value}
                      </dd>
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-4 py-4">
                    <dt className="text-sm font-medium text-dp-ink">
                      {t("Total")}
                    </dt>
                    <dd className="font-secondary text-base font-bold text-dp-green-ink tabular-nums">
                      {service.feeSummary}
                    </dd>
                  </div>
                </dl>
                {service.payment.length ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {service.payment.map((method) => (
                      <li
                        key={method}
                        className="inline-flex items-center gap-2 rounded-full bg-[#e7f6f1] px-3.5 py-1.5 text-sm text-dp-green-ink"
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
                      className="flex items-start gap-3 text-base leading-relaxed text-dp-body"
                    >
                      <CheckIcon
                        aria-hidden
                        className="mt-1 size-4 shrink-0 text-dp-green"
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
                      className="text-base leading-relaxed text-dp-body"
                    >
                      {part.label ? (
                        <span className="font-medium text-dp-ink">
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
                      className="rounded-full bg-[#e7f6f1] px-4 py-2 text-sm font-medium text-dp-green-ink"
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
                      className="flex items-center gap-3 rounded-2xl bg-[#F9F9F9] px-5 py-4 text-sm font-medium text-dp-ink"
                    >
                      <ServicesIcon
                        aria-hidden
                        className="size-5 shrink-0 text-dp-green-ink"
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
                      <dt className="text-sm text-dp-body">{hour.label}</dt>
                      <dd className="font-secondary text-sm font-bold text-dp-ink">
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
                        className="block rounded-2xl bg-[#F4F8F6] px-5 py-4 text-sm font-medium text-dp-green-ink transition-colors hover:bg-[#dcefe7]"
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
            <div className="rounded-3xl bg-[#F4F8F6] p-6">
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
                  <dt className="text-xs text-dp-muted">{t("Fees")}</dt>
                  <dd className="font-secondary text-base font-bold text-dp-ink">
                    {service.feeSummary}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-dp-muted">{t("Duration")}</dt>
                  <dd className="font-secondary text-base font-bold text-dp-ink">
                    {service.turnaround}
                  </dd>
                </div>
              </dl>

              <ServiceAction service={service} />

              {service.uaePassOnly ? (
                <p className="mt-3 text-center text-xs text-dp-muted">
                  {t("UAE PASS sign-in required")}
                </p>
              ) : null}
            </div>

            {service.contacts.length ? (
              <div className="mt-6 rounded-3xl px-6 py-5 ring-1 ring-black/10">
                <h2 className="mb-3 flex items-center gap-2 font-secondary text-sm font-bold tracking-wide text-dp-muted uppercase">
                  <PhoneIcon aria-hidden className="size-4" />
                  {t("Need help")}
                </h2>
                <ul className="space-y-2 text-sm text-dp-body">
                  {service.contacts.map((contact) => (
                    <li key={contact}>{contact}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <p className="mt-6 flex items-center gap-2 px-1 text-xs text-dp-muted">
              <ClockIcon aria-hidden className="size-4 shrink-0" />
              {t("Processed in {turnaround}", {
                turnaround: t(service.turnaround).toLowerCase(),
              })}
            </p>
          </aside>
        </div>
      </section>
    </PageShell>
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
