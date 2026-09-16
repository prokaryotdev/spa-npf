"use client";

import Image from "next/image";
import Link from "next/link";
import type { EventItem } from "../content-events";

import { ArrowRight, PinIcon } from "./icons";
import { useT } from "../i18n/client";

/** The card never touches the body, so lists can hand it a trimmed record. */
export type EventCardItem = Omit<EventItem, "body">;

/** One clickable event teaser — used by the events list and the Media Hub. */
export default function EventCard({
  event,
  index = 0,
}: {
  event: EventCardItem;
  index?: number;
}) {
  const t = useT();
  return (
    <article
      data-reveal
      style={
        { "--reveal-delay": `${(index % 3) * 90}ms` } as React.CSSProperties
      }
      className="group/card flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 transition-transform duration-500 ease-[var(--ease-custom)] md:hover:-translate-y-1"
    >
      <Link
        href={`/app/home/media/events/${event.slug}`}
        className="flex flex-1 flex-col"
      >
        {event.image ? (
          <div className="relative aspect-[4/3] bg-[#F4F8F6]">
            <Image
              src={event.image}
              alt=""
              fill
              sizes="(max-width: 768px) 92vw, 31vw"
              className="object-contain p-4 transition-transform duration-700 ease-[var(--ease-custom)] group-hover/card:scale-105"
            />
          </div>
        ) : null}
        <div className="flex flex-1 flex-col gap-2 p-6">
          {event.type ? (
            <span className="self-start rounded-full bg-[#e7f6f1] px-3 py-1 text-xs font-medium text-dp-green-ink">
              {t(event.type)}
            </span>
          ) : null}
          <h2 className="font-secondary text-lg leading-snug font-bold text-dp-ink transition-colors group-hover/card:text-dp-green">
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
          <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-dp-green">
            {t("View details")}
            <ArrowRight className="size-4" />
          </span>
        </div>
      </Link>
    </article>
  );
}
