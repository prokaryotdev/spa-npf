import type { Metadata } from "next";
import Image from "next/image";
import Link from "../../../i18n/Link";
import { notFound } from "next/navigation";
import { BreadcrumbLd, ServiceLd } from "../../../components/StructuredData";
import { PageShell } from "../../../components/PageShell";
import ServiceAction from "../../../components/ServiceAction";
import {
  ArrowRight,
  CardIcon,
  CheckIcon,
  ClockIcon,
  FileIcon,
  GlobeIcon,
  InboxIcon,
  PhoneCallIcon,
  PhoneIcon,
  PinIcon,
  SearchIcon,
  ServicesIcon,
  UserCircle,
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

  const related = (
    service.related.length
      ? service.related.map((r) => r.slug)
      : services
          .filter(
            (s) =>
              s.slug !== service.slug &&
              s.category &&
              s.category === service.category,
          )
          .slice(0, 4)
          .map((s) => s.slug)
  )
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s) => s !== undefined);

  // Documents with their own sub-list stand as groups; bare ones ("CV",
  // "passport") read better as one checklist than as twelve headed boxes.
  const docGroups = service.documents.filter((d) => d.items.length);
  const docList = service.documents.filter((d) => !d.items.length);
  const delivery = splitDelivery(service.delivery);

  // The page's sections, in reading order. Only the ones with content are
  // drawn, and the same list feeds the "On this page" jumps.
  const sections = [
    service.documents.length && { id: "need", title: t("What you need") },
    service.fees.length && { id: "fees", title: t("Fees") },
    delivery.length && { id: "receive", title: t("How you receive it") },
    service.terms.length && { id: "terms", title: t("Terms and conditions") },
    (service.channels.length || service.hours.length) && {
      id: "where",
      title: t("Where to use it"),
    },
  ].filter((s) => !!s);

  const facts = [
    { label: t("Fees"), value: service.feeSummary, icon: CardIcon },
    { label: t("Duration"), value: service.turnaround, icon: ClockIcon },
    service.beneficiaries.length && {
      label: t("Who it is for"),
      value: service.beneficiaries.join(", "),
      icon: UserCircle,
    },
  ].filter((f) => !!f);

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
        lead={
          // The three answers a visitor came for, before any reading.
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 md:mt-10 md:flex md:flex-wrap md:gap-x-10">
            {facts.map((fact) => (
              <li
                key={fact.label}
                className="flex items-center gap-3.5 max-md:last:odd:col-span-2 md:not-first:border-s md:not-first:border-npf-ink/10 md:not-first:ps-10"
              >
                <span className="hidden size-11 sm:grid shrink-0 place-items-center rounded-chip bg-npf-cloud text-npf-blue-ink">
                  <fact.icon className="size-5" />
                </span>
                <div>
                  <span className="npf-small block text-npf-steel">
                    {fact.label}
                  </span>
                  <span className="npf-h5 block text-npf-blue-deep tabular-nums">
                    {fact.value}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        }
      >
        <section className="bg-white pb-(--npf-section-y)">
          <div className="npf-container grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* On a phone the aside dissolves into the column: the action
                sits first, help sits last. On a desktop it is one sticky
                rail beside the reading. */}
            <aside className="max-lg:contents lg:col-start-2 lg:row-start-1 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-card bg-white p-6 shadow-card ring-1 ring-npf-ink/[0.06] ring-inset">
                <div className="flex items-center gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-chip bg-npf-cloud">
                    {service.icon ? (
                      <Image
                        src={service.icon}
                        alt=""
                        width={26}
                        height={26}
                        className="size-[26px]"
                      />
                    ) : (
                      <ServicesIcon className="size-6 text-npf-blue-ink" />
                    )}
                  </span>
                  <p className="npf-h5 text-npf-ink">{service.name}</p>
                </div>
                <div className="mt-6">
                  <ServiceAction service={service} />
                </div>
                {service.ninAuthOnly ? (
                  <p className="npf-small mt-4 flex items-center justify-center gap-2 border-t border-npf-ink/[0.08] pt-4 text-npf-steel">
                    <UserCircle className="size-4 shrink-0" />
                    {t("NINAuth sign-in required")}
                  </p>
                ) : null}
              </div>

              {sections.length > 1 ? (
                <nav
                  aria-label={t("On this page")}
                  className="hidden lg:mt-10 lg:block"
                >
                  <h2 className="npf-small font-medium text-npf-steel">
                    {t("On this page")}
                  </h2>
                  <ol className="mt-3 border-s border-npf-ink/10">
                    {sections.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className="npf-small -ms-px block border-s-2 border-transparent py-1.5 ps-4 text-npf-body transition-colors hover:border-npf-blue hover:text-npf-blue-deep"
                        >
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : null}

              {service.contacts.length ? (
                <div className="order-last rounded-card bg-npf-paper p-6 lg:mt-10">
                  <h2 className="npf-h5 flex items-center gap-2.5 text-npf-blue-deep">
                    <PhoneIcon className="size-5 text-npf-blue" />
                    {t("Need help")}
                  </h2>
                  <ul className="npf-small mt-3 flex flex-wrap gap-2">
                    {service.contacts.map((contact) => (
                      <li
                        key={contact}
                        className="rounded-full bg-white px-3 py-1 text-npf-body ring-1 ring-npf-ink/[0.08] ring-inset"
                      >
                        {contact}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/app/home/contactUs"
                    className="npf-small group mt-4 inline-flex min-h-11 items-center gap-1.5 font-medium text-npf-blue underline underline-offset-4 transition-colors hover:text-npf-blue-deep"
                  >
                    {t("Contact us")}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-[3px] rtl:-scale-x-100 rtl:group-hover:-translate-x-[3px]" />
                  </Link>
                </div>
              ) : null}
            </aside>

            <div className="min-w-0 space-y-16 lg:col-start-1 lg:row-start-1 lg:max-w-[46rem]">
              {service.documents.length ? (
                <Section id="need" title={t("What you need")}>
                  {docGroups.map((doc) => (
                    <div
                      key={doc.label}
                      className="border-t border-npf-ink/10 py-5 first-of-type:border-t-0 first-of-type:pt-0"
                    >
                      <p className="npf-body flex items-center gap-3 font-medium text-npf-ink">
                        <FileIcon className="size-5 shrink-0 text-npf-blue" />
                        {doc.label}
                      </p>
                      <Checklist items={doc.items} indent />
                    </div>
                  ))}
                  {docList.length ? (
                    <Checklist
                      items={docList.map((d) => d.label)}
                      bordered={docGroups.length > 0}
                    />
                  ) : null}
                </Section>
              ) : null}

              {service.fees.length ? (
                <Section id="fees" title={t("Fees")}>
                  <dl className="overflow-hidden rounded-card ring-1 ring-npf-ink/10 ring-inset">
                    {service.fees.map((fee) => (
                      <div
                        key={fee.label}
                        className="flex items-baseline justify-between gap-6 px-5 py-3.5 not-first:border-t not-first:border-npf-ink/[0.07]"
                      >
                        <dt className="npf-small text-npf-body first-letter:uppercase">
                          {fee.label}
                        </dt>
                        <dd className="npf-small shrink-0 font-semibold text-npf-ink tabular-nums">
                          {fee.value}
                        </dd>
                      </div>
                    ))}
                    {/* Not "Total": where the rows above are tiers or carry an
                        "if", the summary is the cheapest real price, not their
                        sum, and a total that reads "From ₦48,000" is a
                        contradiction. */}
                    <div className="flex items-baseline justify-between gap-6 bg-npf-mist px-5 py-4">
                      <dt className="npf-body font-medium text-npf-blue-deep">
                        {t("Payable")}
                      </dt>
                      <dd className="npf-h5 text-npf-blue-deep tabular-nums">
                        {service.feeSummary}
                      </dd>
                    </div>
                  </dl>
                  {service.payment.length ? (
                    <ul
                      aria-label={t("Payment methods")}
                      className="mt-4 flex flex-wrap items-center gap-2"
                    >
                      {service.payment.map((method) => (
                        <li
                          key={method}
                          className="npf-small inline-flex items-center gap-2 rounded-full bg-npf-cloud px-3 py-1.5 text-npf-ink"
                        >
                          <CardIcon className="size-4 text-npf-steel" />
                          {method}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </Section>
              ) : null}

              {delivery.length ? (
                <Section id="receive" title={t("How you receive it")}>
                  <ul className="grid gap-3">
                    {delivery.map((part) => {
                      const Icon = deliveryIcon(part.label);
                      return (
                        <li
                          key={part.label + part.text}
                          className="flex gap-4 rounded-card bg-npf-paper p-5"
                        >
                          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-npf-blue shadow-card">
                            <Icon className="size-5" />
                          </span>
                          <div className="min-w-0 pt-0.5">
                            {part.label ? (
                              <p className="npf-body font-medium text-npf-ink">
                                {part.label}
                              </p>
                            ) : null}
                            <p className="npf-small mt-0.5 text-npf-body">
                              {part.text}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Section>
              ) : null}

              {service.terms.length ? (
                <Section id="terms" title={t("Terms and conditions")}>
                  <ul className="space-y-3.5">
                    {service.terms.map((term) => (
                      <li
                        key={term}
                        className="npf-body flex items-start gap-3.5 text-npf-body"
                      >
                        <span className="mt-[0.3em] grid size-5 shrink-0 place-items-center rounded-full bg-npf-chip text-npf-blue">
                          <CheckIcon className="size-3" />
                        </span>
                        {term}
                      </li>
                    ))}
                  </ul>
                </Section>
              ) : null}

              {service.channels.length || service.hours.length ? (
                <Section id="where" title={t("Where to use it")}>
                  {service.channels.length ? (
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {service.channels.map((channel) => {
                        const Icon = channelIcon(channel);
                        return (
                          <li
                            key={channel}
                            className="npf-small flex min-h-14 items-center gap-3 rounded-card px-4 py-3 font-medium text-npf-ink ring-1 ring-npf-ink/10 ring-inset"
                          >
                            <Icon className="size-5 shrink-0 text-npf-blue" />
                            {channel}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                  {service.hours.length ? (
                    <div className={service.channels.length ? "mt-8" : ""}>
                      <h3 className="npf-body flex items-center gap-2 font-medium text-npf-ink">
                        <ClockIcon className="size-5 text-npf-steel" />
                        {t("Working hours")}
                      </h3>
                      <dl className="mt-3 max-w-md">
                        {service.hours.map((hour) => (
                          <div
                            key={hour.label}
                            className="flex items-baseline justify-between gap-4 border-b border-npf-ink/[0.07] py-3"
                          >
                            <dt className="npf-small text-npf-body">
                              {hour.label}
                            </dt>
                            <dd className="npf-small shrink-0 font-semibold text-npf-ink tabular-nums">
                              {hour.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ) : null}
                </Section>
              ) : null}

              {related.length ? (
                <section aria-labelledby="related">
                  <h2 id="related" className="npf-h4 text-npf-blue-deep">
                    {t("Related services")}
                  </h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {related.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/app/services/${item.slug}`}
                          className="group flex h-full items-center gap-4 rounded-card p-4 ring-1 ring-npf-ink/[0.08] transition-[box-shadow,translate,scale] duration-(--dur-hover) ease-(--ease-out) ring-inset hover:-translate-y-0.5 hover:shadow-card hover:ring-transparent active:scale-[0.99] active:duration-(--dur-press) motion-reduce:hover:translate-y-0"
                        >
                          <span className="grid size-10 shrink-0 place-items-center rounded-chip bg-npf-cloud transition-colors group-hover:bg-npf-chip">
                            {item.icon ? (
                              <Image
                                src={item.icon}
                                alt=""
                                width={22}
                                height={22}
                                className="size-[22px]"
                              />
                            ) : (
                              <ServicesIcon className="size-5 text-npf-blue-ink" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="npf-small block font-medium text-npf-ink transition-colors group-hover:text-npf-blue">
                              {item.name}
                            </span>
                            <span className="npf-small block text-npf-steel tabular-nums">
                              {item.feeSummary} · {item.turnaround}
                            </span>
                          </span>
                          <ArrowRight className="size-[18px] shrink-0 text-npf-blue transition-transform group-hover:translate-x-[3px] rtl:-scale-x-100 rtl:group-hover:-translate-x-[3px]" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </div>
        </section>
      </PageShell>
    </>
  );
}

/** A headed block of the page, and a target for the "On this page" jumps. */
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28">
      <h2 id={`${id}-h`} className="npf-h4 mb-5 text-npf-blue-deep">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Checklist({
  items,
  indent = false,
  bordered = false,
}: {
  items: string[];
  indent?: boolean;
  bordered?: boolean;
}) {
  return (
    <ul
      className={`grid gap-x-8 gap-y-2.5 sm:grid-cols-2 ${indent ? "mt-3 ps-8" : ""} ${bordered ? "border-t border-npf-ink/10 pt-5" : ""}`}
    >
      {items.map((item) => (
        <li
          key={item}
          className="npf-small flex items-start gap-2.5 text-npf-body"
        >
          <CheckIcon className="mt-[0.2em] size-4 shrink-0 text-npf-blue" />
          <span className="first-letter:uppercase">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** The CMS names channels in prose; pick the drawn icon by what they are. */
function channelIcon(channel: string) {
  const c = channel.toLowerCase();
  if (c.includes("website")) return GlobeIcon;
  if (c.includes("call")) return PhoneCallIcon;
  if (c.includes("station") || c.includes("cent")) return PinIcon;
  if (c.includes("app")) return PhoneIcon;
  return ServicesIcon;
}

function deliveryIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes("mail")) return InboxIcon;
  if (l.includes("dashboard")) return UserCircle;
  if (l.includes("inquiry") || l.includes("status")) return SearchIcon;
  return FileIcon;
}

/**
 * The CMS writes delivery channels as one blob with `**Label**:` markers, and
 * sometimes a `•` before each. Only that one pattern is handled — this is not
 * a markdown renderer, and pulling one in for a single bolded lead-in would be
 * the expensive way to do it.
 */
function splitDelivery(text: string) {
  const clean = (s: string) => s.replace(/(^[\s•]+|[\s•]+$)/g, "");
  return text
    .split(/\*\*(.+?)\*\*:\s*/)
    .reduce<{ label: string; text: string }[]>((parts, chunk, i, all) => {
      if (i === 0) {
        if (clean(chunk)) parts.push({ label: "", text: clean(chunk) });
      } else if (i % 2 === 1) {
        parts.push({ label: chunk.trim(), text: clean(all[i + 1] ?? "") });
      }
      return parts;
    }, [])
    .filter((part) => part.text);
}
