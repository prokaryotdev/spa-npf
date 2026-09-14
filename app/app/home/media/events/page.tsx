import type { Metadata } from "next";
import EventCard from "../../../../components/EventCard";
import { PageShell } from "../../../../components/PageShell";
import { events } from "../../../../content-events";

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
            <EventCard key={event.slug} event={event} index={i} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
