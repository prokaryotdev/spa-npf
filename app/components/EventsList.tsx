"use client";

import { useMemo, useState } from "react";
import EventCard, { type EventCardItem } from "./EventCard";
import ListControls, { compare, type Sort } from "./ListControls";
import { useT } from "../i18n/client";

export default function EventsList({ events }: { events: EventCardItem[] }) {
  const t = useT();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [type, setType] = useState("");

  const types = useMemo(
    () => [...new Set(events.map((e) => e.type).filter(Boolean))].sort(),
    [events],
  );

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events
      .filter((e) => !type || e.type === type)
      .filter(
        (e) =>
          !q ||
          `${e.title} ${e.summary} ${e.location}`.toLowerCase().includes(q),
      )
      .sort(compare(sort, (e) => e.from));
  }, [events, query, sort, type]);

  return (
    <>
      <ListControls
        noun="events"
        query={query}
        onQuery={setQuery}
        sort={sort}
        onSort={setSort}
        categories={types}
        category={type}
        onCategory={setType}
        shown={shown.length}
        total={events.length}
      />

      {shown.length ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((event, i) => (
            <EventCard key={event.slug} event={event} index={i} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-[#F4F8F6] p-8 text-base text-dp-body">
          {t(
            "No events match that. Try a shorter search, or clear the type filter.",
          )}
        </p>
      )}
    </>
  );
}
