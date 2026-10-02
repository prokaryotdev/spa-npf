import type { Metadata } from "next";
import Image from "next/image";
import Link from "../../../i18n/Link";
import { notFound } from "next/navigation";
import { BreadcrumbLd, ServiceLd } from "../../../components/StructuredData";
import { Facts, HelpCard, PageShell, Tick } from "../../../components/PageShell";
import ServiceAction from "../../../components/ServiceAction";
import ServiceBar from "../../../components/ServiceBar";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  CreditCardIcon,
  DebitCardIcon,
  CashIcon,
  CheckIcon,
  ClockIcon,
  FileIcon,
  GlobeIcon,
  InboxIcon,
  PhoneCallIcon,
  PhoneIcon,
  PinIcon,
  SearchIcon,
  TapPayIcon,
  ServicesIcon,
  UserCircle,
} from "../../../components/icons";
import { services as servicesSource } from "../../../content-services";
import { getT, getLocalized } from "../../../i18n/server";
import type { T } from "../../../i18n/translate";

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
  // Hours for a place the CMS doesn't list as a channel ("Police Stations")
  // still say where; only "Other" is just a time.
  const places = [
    ...channels,
    ...otherHours.map((hour) => ({
      name: hour.label,
      en: source.hours[hour.i]?.label ?? "",
      hours: hour.value,
    })),
  ].map((place) => {
    const Icon = place.en === "Other" ? ClockIcon : channelIcon(place.en);
    return { ...place, Icon, station: Icon === PinIcon };
  });

  // The CMS numbers a rule's own list by hand ("1. Availability of …") as
  // terms of their own; numbering those again printed "3  1. …". They fold
  // under the rule they belong to.
  const terms = service.terms.reduce<{ text: string; items: string[] }[]>(
    (all, term) => {
      const sub = term.match(/^\d+[.)]\s+(.+)/);
      if (sub && all.length) all[all.length - 1].items.push(sub[1]);
      else all.push({ text: term, items: [] });
      return all;
    },
    [],
  );
  // Four rules read at a glance; past that the first three stand for them.
  const termsShown = terms.length > 4 ? 3 : terms.length;

  const facts = [
    { label: t("Fees"), value: service.feeSummary },
    { label: t("Duration"), value: service.turnaround },
    service.beneficiaries.length && {
      label: t("Who it is for"),
      // A list, so it reads as one, but not as pills: a pill reads as a
      // filter to press. Each audience is ticked like the checklist below,
      // in the same weight as the fee and duration beside it.
      value: (
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {service.beneficiaries.map((b) => (
            <li key={b} className="flex items-center gap-2">
              <span
                aria-hidden
                className="grid size-4.5 shrink-0 place-items-center rounded-full bg-npf-blue text-white"
              >
                <CheckIcon className="size-2.5" />
              </span>
              {b}
            </li>
          ))}
        </ul>
      ),
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
          <Facts facts={facts} />
        }
      >
        <section className="bg-white pb-(--npf-section-y)">
          <div className="npf-container grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* On a phone the aside dissolves into the column: the action
                sits first, help sits last. On a desktop help sits right under
                the action and both ride along beside the reading. They only
                pin on a screen tall enough to hold both, so help never hides
                below the fold. */}
            <aside className="max-lg:contents lg:col-start-2 lg:row-start-1">
              <div className="max-lg:contents lg:top-28 lg:space-y-6 lg:[@media(min-height:46rem)]:sticky">
                <div
                  id="action"
                  className="scroll-mt-28 rounded-card bg-white p-6 shadow-card ring-1 ring-npf-hairline ring-inset"
                >
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
                  <HelpCard
                    className="order-last"
                    title={t("Need help?")}
                    intro={t("Call or email us about this service.")}
                    rows={source.contacts.flatMap((name) => {
                      const c = contactFor(name, t);
                      return c ? [c] : [];
                    })}
                  />
                ) : null}
              </div>
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
                  <div className="overflow-hidden rounded-card border border-npf-hairline">
                  <dl>
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
                  {/* The receipt's footer, not a row of buttons: each method is
                      a bare icon beside its name, with nothing around it to
                      press. */}
                  {service.payment.length ? (
                    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-npf-hairline px-5 py-4">
                      <h3 className="npf-body text-npf-body">
                        {t("Pay with")}
                      </h3>
                      <ul
                        aria-label={t("Payment methods")}
                        className="flex flex-wrap items-center gap-x-4 gap-y-2.5"
                      >
                        {service.payment.map((method, i) => {
                          const Icon = paymentIcon(source.payment[i] ?? "");
                          return (
                            <li
                              key={method}
                              className="npf-small inline-flex items-center gap-1.5 font-medium not-first:border-s not-first:border-npf-hairline not-first:ps-4 text-npf-ink"
                            >
                              <Icon className="size-5 shrink-0 text-npf-blue-ink" />
                              {method}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}
                  </div>
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
                      // The tile echoes the action card's, so each way reads
                      // as a thing you have rather than a bullet. The arrow
                      // sits in a disc of its own: where a row goes somewhere
                      // it says so before the pointer finds it.
                      const body = (
                        <>
                          <span className={tile}>
                            <Icon className="size-5.5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            {part.label ? (
                              <span className="npf-body block font-semibold text-npf-ink transition-colors group-hover:text-npf-blue">
                                {part.label}
                              </span>
                            ) : null}
                            <span className="npf-body mt-1 block max-w-[60ch] text-npf-body">
                              <Named text={part.text} />
                            </span>
                          </span>
                          {href ? (
                            <span
                              aria-hidden
                              className={`${go} self-center`}
                            >
                              <ArrowRight className="npf-go size-4 text-current" />
                            </span>
                          ) : null}
                        </>
                      );
                      const row = "flex items-start gap-4 px-5 py-5";
                      return (
                        <li key={part.label + part.text}>
                          {href ? (
                            <Link
                              href={href}
                              className={`npf-row-link group ${row}`}
                            >
                              {body}
                            </Link>
                          ) : (
                            <div className={row}>{body}</div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </Section>
              ) : null}

              {service.channels.length || service.hours.length ? (
                <Section id="where" title={t("Where to use it")}>
                  {/* Read like the fees: the place on the left, when it is
                      open on the right, so the eye runs down one column for
                      "can I go now?". Stations lead on to the finder. */}
                  <ul className="divide-y divide-npf-hairline overflow-hidden rounded-card border border-npf-hairline">
                    {places.map(({ Icon, station, ...place }) => (
                      <Place
                        key={place.en}
                        icon={<Icon className="size-5.5" />}
                        name={place.name}
                        note={station ? t("Find a station near you") : null}
                        href={station ? "/app/home/customer-centers" : null}
                        hours={place.hours}
                        gutter={places.some((p) => p.station)}
                        t={t}
                      />
                    ))}
                  </ul>
                </Section>
              ) : null}

              {terms.length ? (
                <Section id="terms" title={t("Terms and conditions")}>
                  {/* Rules, not a checklist: numbered so one can be quoted
                      back ("term 4") at a counter or on a call. They are
                      skimmed more than read, so the number is plain and a
                      long list shows its first rules and folds the rest. */}
                  <div className="overflow-hidden rounded-card border border-npf-hairline">
                    <ol className="divide-y divide-npf-hairline">
                      {terms.slice(0, termsShown).map((term, i) => (
                        <Term key={term.text} n={i + 1} {...term} />
                      ))}
                    </ol>
                    {terms.length > termsShown ? (
                      <details className="group/more border-t border-npf-hairline">
                        <summary className="npf-row-link flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-npf-blue [&::-webkit-details-marker]:hidden">
                          <span className="group-open/more:hidden">
                            {t("Show {count} more terms", {
                              count: terms.length - termsShown,
                            })}
                          </span>
                          <span className="hidden group-open/more:inline">
                            {t("Show fewer terms")}
                          </span>
                          <ChevronDown className="size-4.5 shrink-0 transition-transform duration-(--dur-hover) group-open/more:rotate-180" />
                        </summary>
                        <ol
                          start={termsShown + 1}
                          className="divide-y divide-npf-hairline border-t border-npf-hairline"
                        >
                          {terms.slice(termsShown).map((term, i) => (
                            <Term
                              key={term.text}
                              n={termsShown + i + 1}
                              {...term}
                            />
                          ))}
                        </ol>
                      </details>
                    ) : null}
                  </div>
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
      <ServiceBar
        target="action"
        fee={service.feeSummary}
        caption={t("Payable")}
        label={service.action}
      />
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

/**
 * The marker a row leads with where the row is a thing you have or a place
 * you go: a delivery way, a channel. Ticks and rule numbers stay smaller.
 */
const tile =
  "grid size-10.5 shrink-0 place-items-center rounded-full bg-npf-cloud text-npf-blue-ink transition-colors duration-(--dur-hover) group-hover:bg-npf-chip";

/** The arrow of a row that goes somewhere: a ring that fills on hover. */
const go =
  "grid size-9 shrink-0 place-items-center rounded-full text-npf-blue ring-1 ring-npf-hairline transition-colors duration-(--dur-hover) ring-inset group-hover:bg-npf-blue group-hover:text-white group-hover:ring-transparent";

/** The CMS quotes the screens it names ("My Requests"); set them as names. */
function Named({ text }: { text: string }) {
  return text.split(/"([^"]+)"/).map((chunk, i) =>
    i % 2 ? (
      <span key={i} className="font-medium text-npf-ink">
        {chunk}
      </span>
    ) : (
      chunk
    ),
  );
}

/**
 * A document to bring. The tick is small: a list of twelve papers with a
 * big disc on each reads as twelve headings, and the papers are the point.
 */
function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="divide-y divide-npf-hairline">
      {items.map((item) => (
        <li
          key={item}
          className="npf-body flex items-start gap-3 px-5 py-3.5 text-npf-ink"
        >
          <Tick />
          <span className="first-letter:uppercase">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** One rule: a plain number to quote it by, then the rule. */
function Term({ n, text, items }: { n: number; text: string; items: string[] }) {
  return (
    <li className="npf-body flex items-start gap-4 px-5 py-4 text-npf-ink">
      <span
        aria-hidden
        className="w-6 shrink-0 text-end font-semibold text-npf-steel tabular-nums"
      >
        {n}
      </span>
      <div className="min-w-0 flex-1">
        {/^https?:\/\//.test(text) ? (
          <a
            href={text}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-npf-blue underline decoration-npf-line underline-offset-4 transition-colors hover:decoration-current"
          >
            {new URL(text).hostname}
            <ArrowUpRight aria-hidden className="size-4" />
          </a>
        ) : (
          <p className="max-w-[62ch]">{text}</p>
        )}
        {items.length ? (
          <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-npf-body">
                <span
                  aria-hidden
                  className="mt-[0.3em] grid size-4.5 shrink-0 place-items-center rounded-full bg-npf-chip text-npf-blue"
                >
                  <CheckIcon className="size-2.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

/**
 * One row of "Where to use it": a place, and when it is open. A short time
 * sits at the row's end like a fee; a long one ("Monday to Thursday …,
 * Friday …") is a sentence and reads under the name instead.
 */
function Place({
  icon,
  name,
  note = null,
  href = null,
  hours,
  gutter = false,
  t,
}: {
  icon: React.ReactNode;
  name: string;
  note?: string | null;
  href?: string | null;
  hours: string | null;
  /** Another row in the list has an arrow; keep its room. */
  gutter?: boolean;
  t: T;
}) {
  const always = hours?.trim() === "24/7";
  const long = !!hours && hours.length > 32;
  // A short time is a tag at the row's end, so the eye runs down one column
  // of them for "can I go now?"; always-open gets the green of "yes".
  const chip =
    "npf-small inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 font-medium tabular-nums";
  const time = hours ? (
    always ? (
      <span className={`${chip} bg-npf-ok-soft text-npf-ok`}>
        <span aria-hidden className="size-1.5 rounded-full bg-npf-ok-fill" />
        {t("Open 24/7")}
      </span>
    ) : long ? (
      <span className="npf-body mt-1 block max-w-[60ch] text-npf-body tabular-nums">
        {hours}
      </span>
    ) : (
      <span className={`${chip} bg-npf-cloud text-npf-ink`}>
        <ClockIcon aria-hidden className="size-3.5 shrink-0 text-npf-steel" />
        {/* "7:30 - 22:00" is a range; an en dash says so. */}
        {hours.replace(/\s*-\s*/g, "–")}
      </span>
    )
  ) : null;

  const body = (
    <>
      <span className={tile}>{icon}</span>
      <span
        className={`flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-6 gap-y-2 ${long ? "pt-[9px]" : ""}`}
      >
        <span className="min-w-0">
          <span className="npf-body block font-semibold text-npf-ink transition-colors group-hover:text-npf-blue">
            {name}
          </span>
          {note ? (
            <span className="npf-body mt-0.5 block text-npf-body">{note}</span>
          ) : null}
          {long ? time : null}
        </span>
        {long ? null : time}
      </span>
      {/* Rows without an arrow keep its room, so the times stay one
          column. */}
      {href ? (
        <span aria-hidden className={go}>
          <ArrowRight className="npf-go size-4 text-current" />
        </span>
      ) : gutter ? (
        <span aria-hidden className="w-9 shrink-0" />
      ) : null}
    </>
  );
  const row = `flex gap-4 px-5 py-5 ${long ? "items-start" : "items-center"}`;
  return (
    <li>
      {href ? (
        <Link href={href} className={`npf-row-link group ${row}`}>
          {body}
        </Link>
      ) : (
        <div className={row}>{body}</div>
      )}
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

function paymentIcon(method: string) {
  const m = method.toLowerCase();
  if (m.includes("cash")) return CashIcon;
  if (m.includes("pay")) return TapPayIcon;
  if (m.includes("credit")) return CreditCardIcon;
  return DebitCardIcon;
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
 * the ones the privacy policy gives for the Complaint Response Unit. Live
 * Chat and the P.O. Box have no details anywhere in the content, so they
 * stay off the card until the CMS supplies them.
 */
function contactFor(name: string, t: T) {
  if (name === "Complaint Response Unit")
    return {
      Icon: PhoneCallIcon,
      label: t("Call {number}", { number: "0805 700 0001" }),
      note: t("Complaint Response Unit"),
      href: "tel:+2348057000001",
    };
  if (name === "Email")
    return {
      Icon: InboxIcon,
      label: t("Email us"),
      note: "mail@npf.gov.ng",
      href: "mailto:mail@npf.gov.ng",
    };
  return null;
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
