import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventCard from "../../../../../components/EventCard";
import { PageShell } from "../../../../../components/PageShell";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarIcon,
  PinIcon,
} from "../../../../../components/icons";
import { events } from "../../../../../content-events";

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);
  if (!event) return { title: "Events | Dubai Police" };
  return {
    title: `${event.title} | Dubai Police`,
    description: event.summary,
    openGraph: {
      title: event.title,
      description: event.summary,
      images: event.image ? [event.image] : undefined,
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);
  if (!event) notFound();

  const dates =
    event.to && event.to !== event.from
      ? `${event.from} – ${event.to}`
      : event.from;

  /** Only the rows the CMS actually filled in are worth a line. */
  const facts = [
    { label: "Dates", value: dates },
    { label: "Type", value: event.type },
    { label: "Location", value: event.location },
    { label: "Price", value: event.price },
    { label: "Contact", value: event.contact },
  ].filter((f) => f.value);

  const more = events.filter((e) => e.slug !== slug).slice(0, 3);

  return (
    <PageShell
      title={event.title}
      titleSize="article"
      intro={event.summary || undefined}
      trail={[
        { label: "Media Hub", href: "/app/home/media" },
        { label: "Events", href: "/app/home/media/events" },
      ]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="order-2 lg:order-1">
            {event.image ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-[#F4F8F6]">
                <Image
                  src={event.image}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 760px"
                  className="object-contain p-6"
                />
              </div>
            ) : null}

            <div className="mt-8 max-w-[75ch]">
              {event.body.length ? (
                event.body.map((paragraph, i) => (
                  <p
                    key={i}
                    className={`mb-5 leading-relaxed text-dp-body ${
                      i === 0 ? "text-lg md:text-xl" : "text-base"
                    }`}
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-base leading-relaxed text-dp-body">
                  No further description has been published for this event yet.
                </p>
              )}
            </div>

            <Link
              href="/app/home/media/events"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-dp-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dp-green-mid"
            >
              All events
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <aside className="order-1 h-fit rounded-3xl bg-[#F4F8F6] p-6 lg:order-2 lg:sticky lg:top-28">
            <h2 className="mb-4 flex items-center gap-2 font-secondary text-lg font-bold text-dp-green-deep">
              <CalendarIcon aria-hidden className="size-5" />
              Event details
            </h2>
            <dl className="divide-y divide-black/10">
              {facts.map((fact) => (
                <div key={fact.label} className="py-3">
                  <dt className="text-xs text-dp-muted">{fact.label}</dt>
                  <dd className="mt-0.5 flex items-start gap-1.5 text-sm font-medium text-dp-ink">
                    {fact.label === "Location" ? (
                      <PinIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
                    ) : null}
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            {event.website ? (
              <a
                href={event.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-dp-green px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-dp-green-mid"
              >
                Event website
                <ArrowUpRight aria-hidden className="size-4" />
                <span className="sr-only"> (opens in a new window)</span>
              </a>
            ) : null}
            {event.email ? (
              <a
                href={`mailto:${event.email}`}
                className="mt-3 block text-center text-sm font-medium text-dp-green underline underline-offset-2"
              >
                {event.email}
              </a>
            ) : null}
          </aside>
        </div>
      </section>

      {more.length ? (
        <section aria-labelledby="more-events" className="bg-[#F4F8F6] py-20">
          <div className="dp-container">
            <h2
              id="more-events"
              className="mb-8 font-secondary text-2xl font-bold text-dp-green-deep md:text-4xl"
            >
              More events
            </h2>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {more.map((e, i) => (
                <EventCard key={e.slug} event={e} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
