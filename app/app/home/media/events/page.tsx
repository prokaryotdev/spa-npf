import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "../../../../components/PageShell";
import { PinIcon } from "../../../../components/icons";
import { events } from "../../../../content-sub";

export const metadata: Metadata = {
  title: "Events | Dubai Police",
  description:
    "Exhibitions, summits and community events Dubai Police takes part in.",
};

export default function EventsPage() {
  return (
    <PageShell
      title="Events"
      intro="Exhibitions, summits and community events Dubai Police takes part in across the year."
      trail={[{ label: "Media Hub", href: "/app/home/media" }]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event, i) => (
            <article
              key={event.title}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}
              className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/5"
            >
              {event.image ? (
                <div className="relative aspect-[4/3] bg-[#F4F8F6]">
                  <Image
                    src={event.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 92vw, 31vw"
                    className="object-contain p-4"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-2 p-6">
                {event.type ? (
                  <span className="self-start rounded-full bg-[#e7f6f1] px-3 py-1 text-xs font-medium text-dp-green-ink">
                    {event.type}
                  </span>
                ) : null}
                <h2 className="font-secondary text-lg leading-snug font-bold text-dp-ink">
                  {event.title}
                </h2>
                <p className="text-sm leading-relaxed text-dp-body">
                  {event.summary}
                </p>
                <p className="mt-auto pt-3 text-sm text-dp-muted">
                  <time>{event.from}</time>
                  {event.to && event.to !== event.from ? (
                    <>
                      {" – "}
                      <time>{event.to}</time>
                    </>
                  ) : null}
                </p>
                {event.location ? (
                  <p className="flex items-start gap-1.5 text-sm text-dp-muted">
                    <PinIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
                    {event.location}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
