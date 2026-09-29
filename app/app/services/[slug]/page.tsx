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
  ChatIcon,
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
  // The CMS lists some permits twice; one tick per thing is enough.
  const docList = [
    ...new Set(
      service.documents.filter((d) => !d.items.length).map((d) => d.label),
    ),
  ];
  // Icons, links and hours are matched on the English source, so they hold
  // on the Hausa page too; the localized copy only supplies the words.
  const source = servicesSource.find((s) => s.slug === slug)!;
  const deliverySource = splitDelivery(source.delivery);
  const delivery = splitDelivery(service.delivery).map((part, i) => ({
    ...part,
    key: deliverySource[i]?.label ?? "",
  }));

  // The CMS keeps channels and working hours apart, but the hours are the
  // channels' own ("Digital Channels" covers the app and the website), so
  // each hour goes beside the channel it belongs to. Hours that name no
  // channel ("Other") stay as rows of their own.
  const usedHours = new Set<number>();
  const channels = service.channels.map((name, i) => {
    const en = source.channels[i] ?? "";
    const h = source.hours.findIndex(
      (hour) =>
        hour.label === en ||
        (hour.label === "Digital Channels" && /app|website/i.test(en)),
    );
    if (h >= 0) usedHours.add(h);
    return { name, en, hours: h >= 0 ? service.hours[h].value : null };
  });
  const otherHours = service.hours
    .map((hour, i) => ({
      label:
        source.hours[i]?.label === "Other" ? t("Working hours") : hour.label,
      value: hour.value,
      i,
    }))
    .filter((hour) => !usedHours.has(hour.i));

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
          // One card across the page: the short facts take only their own
          // width and the audience gets the rest, so it reads on one line.
          <dl className="mt-8 grid divide-y divide-npf-hairline overflow-hidden rounded-card border border-npf-hairline bg-white md:mt-10 md:flex md:divide-x md:divide-y-0">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex items-center gap-3.5 px-5 py-4 md:flex-none md:py-5 md:last:flex-1"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-npf-cloud text-npf-blue-ink">
                  <fact.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <dt className="npf-small text-npf-steel">{fact.label}</dt>
                  <dd className="npf-h5 text-npf-blue-deep tabular-nums">
                    {fact.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        }
      >
        <section className="bg-white pb-(--npf-section-y)">
          <div className="npf-container grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* On a phone the aside dissolves into the column: the action
                sits first, help sits last. On a desktop action and help
                stack as one rail that rides along beside the reading, but
                only on screens tall enough to hold all of it; on a short
                laptop a pinned rail would cut help off, so it scrolls. */}
            <aside className="max-lg:contents lg:col-start-2 lg:row-start-1 lg:self-start lg:[@media(min-height:50rem)]:sticky lg:[@media(min-height:50rem)]:top-28">
              <div className="rounded-card bg-white p-6 shadow-card ring-1 ring-npf-hairline ring-inset">
                <div className="flex items-center gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-chip bg-npf-cloud">
                    {service.icon ? (
                      <Image
                        src={service.icon}
                        alt=""
                        width={26}
                        height={26}
                        className="size-6.5"
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
                  <p className="npf-small mt-4 flex items-center justify-center gap-2 border-t border-npf-hairline pt-4 text-npf-steel">
                    <UserCircle className="size-4 shrink-0" />
                    {t("NINAuth sign-in required")}
                  </p>
                ) : null}
              </div>

              {service.contacts.length ? (
                <div className="order-last overflow-hidden rounded-card border border-npf-hairline lg:mt-6">
                  <h2 className="npf-h5 border-b border-npf-hairline bg-npf-mist px-5 py-3.5 text-npf-blue-deep">
                    {t("Need help")}
                  </h2>
                  <ul className="divide-y divide-npf-hairline">
                    {service.contacts.map((name, i) => {
                      const c = contactFor(source.contacts[i] ?? "");
                      const body = (
                        <>
                          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-npf-cloud text-npf-blue-ink transition-colors group-hover:bg-npf-chip">
                            <c.Icon className="size-4.5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="npf-small block font-medium text-npf-ink">
                              {name}
                            </span>
                            {c.value ? (
                              <span className="npf-small block truncate text-npf-blue tabular-nums group-hover:underline group-hover:underline-offset-2">
                                {c.value}
                              </span>
                            ) : null}
                          </span>
                        </>
                      );
                      return (
                        <li key={name}>
                          {c.href ? (
                            <a
                              href={c.href}
                              className="group flex min-h-14 items-center gap-3.5 px-5 py-3 transition-colors duration-(--dur-hover) hover:bg-npf-paper"
                            >
                              {body}
                            </a>
                          ) : (
                            <div className="flex min-h-14 items-center gap-3.5 px-5 py-3">
                              {body}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <Link
                    href="/app/home/contactUs"
                    className="npf-small group flex min-h-12 items-center justify-between gap-2 border-t border-npf-hairline px-5 font-medium text-npf-blue transition-colors hover:bg-npf-paper hover:text-npf-blue-deep"
                  >
                    {t("Contact us")}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-[3px] rtl:-scale-x-100 rtl:group-hover:-translate-x-[3px]" />
                  </Link>
                </div>
              ) : null}
            </aside>

            <div className="min-w-0 lg:col-start-1 lg:row-start-1 lg:max-w-[46rem] [&>section+section]:mt-12 [&>section+section]:border-t [&>section+section]:border-npf-hairline [&>section+section]:pt-12">
              {service.documents.length ? (
                <Section id="need" title={t("What you need")}>
                  {/* A group's label is usually a condition ("From outside
                      Nigeria"), so it heads its own card: the items plainly
                      belong to it, and a reader it doesn't apply to can skip
                      the whole card at once. */}
                  <div className="space-y-4">
                    {docGroups.map((doc) => (
                      <div
                        key={doc.label}
                        className="overflow-hidden rounded-card border border-npf-hairline"
                      >
                        <h3 className="npf-body border-b border-npf-hairline bg-npf-mist px-5 py-3 font-medium text-npf-blue-deep">
                          {doc.label}
                        </h3>
                        <Checklist items={doc.items} />
                      </div>
                    ))}
                    {docList.length ? (
                      <div className="rounded-card border border-npf-hairline">
                        <Checklist items={docList} />
                      </div>
                    ) : null}
                  </div>
                </Section>
              ) : null}

              {service.fees.length ? (
                <Section id="fees" title={t("Fees")}>
                  <dl className="overflow-hidden rounded-card border border-npf-hairline">
                    {service.fees.map((fee) => (
                      <div
                        key={fee.label}
                        className="flex items-baseline justify-between gap-6 px-5 py-4 not-first:border-t not-first:border-npf-hairline"
                      >
                        <dt className="npf-body text-npf-body first-letter:uppercase">
                          {fee.label}
                        </dt>
                        <dd className="npf-body shrink-0 font-semibold text-npf-ink tabular-nums">
                          {fee.value}
                        </dd>
                      </div>
                    ))}
                    {/* Not "Total": where the rows above are tiers or carry an
                        "if", the summary is the cheapest real price, not their
                        sum, and a total that reads "From ₦48,000" is a
                        contradiction. */}
                    <div className="flex items-baseline justify-between gap-6 border-t border-npf-hairline bg-npf-mist px-5 py-4">
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
                  {/* Any one of these will do, so they read as options in one
                      card; the ones that point somewhere on this site go
                      there. */}
                  <ul className="divide-y divide-npf-hairline overflow-hidden rounded-card border border-npf-hairline">
                    {delivery.map((part) => {
                      const Icon = deliveryIcon(part.key);
                      const href = deliveryHref(part.key);
                      const body = (
                        <>
                          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-npf-cloud text-npf-blue-ink transition-colors group-hover:bg-npf-chip">
                            <Icon className="size-5" />
                          </span>
                          <span className="min-w-0 flex-1 pt-1.5">
                            {part.label ? (
                              <span className="npf-body block font-medium text-npf-ink transition-colors group-hover:text-npf-blue">
                                {part.label}
                              </span>
                            ) : null}
                            <span className="npf-small mt-1 block text-npf-body">
                              {part.text}
                            </span>
                          </span>
                          {href ? (
                            <ArrowRight className="mt-2.5 size-4.5 shrink-0 text-npf-blue transition-transform group-hover:translate-x-[3px] rtl:-scale-x-100 rtl:group-hover:-translate-x-[3px]" />
                          ) : null}
                        </>
                      );
                      return (
                        <li key={part.label + part.text}>
                          {href ? (
                            <Link
                              href={href}
                              className="group flex gap-4 px-5 py-4 transition-colors duration-(--dur-hover) hover:bg-npf-paper"
                            >
                              {body}
                            </Link>
                          ) : (
                            <div className="flex gap-4 px-5 py-4">{body}</div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </Section>
              ) : null}

              {service.terms.length ? (
                <Section id="terms" title={t("Terms and conditions")}>
                  {/* Rules, not a checklist: numbered so one can be quoted
                      back ("term 4") at a counter or on a call. */}
                  <ol className="divide-y divide-npf-hairline rounded-card border border-npf-hairline">
                    {service.terms.map((term, i) => (
                      <li
                        key={term}
                        className="npf-body flex items-start gap-4 px-5 py-4 text-npf-ink"
                      >
                        <span className="npf-caption mt-px grid size-6 shrink-0 place-items-center rounded-full bg-npf-cloud text-npf-blue-ink tabular-nums">
                          {i + 1}
                        </span>
                        {term}
                      </li>
                    ))}
                  </ol>
                </Section>
              ) : null}

              {service.channels.length || service.hours.length ? (
                <Section id="where" title={t("Where to use it")}>
                  <ul className="divide-y divide-npf-hairline rounded-card border border-npf-hairline">
                    {channels.map((channel) => {
                      const Icon = channelIcon(channel.en);
                      return (
                        <Place
                          key={channel.en}
                          icon={<Icon className="size-5" />}
                          name={channel.name}
                          hours={channel.hours}
                        />
                      );
                    })}
                    {otherHours.map((hour) => (
                      <Place
                        key={hour.i}
                        icon={<ClockIcon className="size-5" />}
                        name={hour.label}
                        hours={hour.value}
                        bare
                      />
                    ))}
                  </ul>
                </Section>
              ) : null}

              {related.length ? (
                <section aria-labelledby="related">
                  <h2 id="related" className="npf-h3 text-npf-blue-deep">
                    {t("Related services")}
                  </h2>
                  <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {related.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/app/services/${item.slug}`}
                          className="group flex h-full items-center gap-4 rounded-card p-4 ring-1 ring-npf-hairline transition-[box-shadow,translate,scale] duration-(--dur-hover) ease-(--ease-out) ring-inset hover:-translate-y-0.5 hover:shadow-card hover:ring-transparent active:scale-[0.99] active:duration-(--dur-press) motion-reduce:hover:translate-y-0"
                        >
                          <span className="grid size-10 shrink-0 place-items-center rounded-chip bg-npf-cloud transition-colors group-hover:bg-npf-chip">
                            {item.icon ? (
                              <Image
                                src={item.icon}
                                alt=""
                                width={22}
                                height={22}
                                className="size-5.5"
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
                          <ArrowRight className="size-4.5 shrink-0 text-npf-blue transition-transform group-hover:translate-x-[3px] rtl:-scale-x-100 rtl:group-hover:-translate-x-[3px]" />
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

/** A headed block of the page. */
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
      <h2 id={`${id}-h`} className="npf-h3 mb-6 text-npf-blue-deep">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="divide-y divide-npf-hairline">
      {items.map((item) => (
        <li
          key={item}
          className="npf-body flex items-start gap-3 px-5 py-3.5 text-npf-ink"
        >
          <span className="mt-[0.2em] grid size-5 shrink-0 place-items-center rounded-full bg-npf-blue text-white">
            <CheckIcon className="size-3" />
          </span>
          <span className="first-letter:uppercase">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** One row of "Where to use it": a channel, and when it is open. */
function Place({
  icon,
  name,
  hours,
  bare = false,
}: {
  icon: React.ReactNode;
  name: string;
  hours: string | null;
  /** The row is itself about hours; no second clock beside them. */
  bare?: boolean;
}) {
  return (
    <li className="flex items-start gap-4 px-5 py-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-npf-cloud text-npf-blue-ink">
        {icon}
      </span>
      <span className={`min-w-0 flex-1 ${hours ? "pt-0.5" : "pt-2"}`}>
        <span className="npf-body block font-medium text-npf-ink">{name}</span>
        {hours ? (
          <span className="npf-small mt-0.5 flex items-start gap-1.5 text-npf-body tabular-nums">
            {bare ? null : (
              <ClockIcon className="mt-[0.2em] size-3.5 shrink-0 text-npf-steel" />
            )}
            {hours}
          </span>
        ) : null}
      </span>
    </li>
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
 * How to reach each help channel the CMS names. The number and address are
 * the ones the privacy policy gives for the Complaint Response Unit; Live
 * Chat and the P.O. Box have no details anywhere in the content, so they
 * show as names only until the CMS supplies them.
 */
function contactFor(name: string) {
  if (name === "Complaint Response Unit")
    return {
      Icon: PhoneCallIcon,
      value: "0805 700 0001",
      href: "tel:+2348057000001",
    };
  if (name === "Email")
    return {
      Icon: InboxIcon,
      value: "mail@npf.gov.ng",
      href: "mailto:mail@npf.gov.ng",
    };
  if (name === "Live Chat") return { Icon: ChatIcon, value: null, href: null };
  if (name === "P.O. Box") return { Icon: PinIcon, value: null, href: null };
  return { Icon: PhoneIcon, value: null, href: null };
}

/** Where a delivery channel lives on this site, when it does. */
function deliveryHref(label: string) {
  const l = label.toLowerCase();
  if (l.includes("dashboard")) return "/app/portal/requests";
  if (l.includes("inquiry") || l.includes("status"))
    return "/app/services/application-status";
  return null;
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
