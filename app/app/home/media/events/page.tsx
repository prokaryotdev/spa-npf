import type { Metadata } from "next";
import EventsList from "../../../../components/EventsList";
import { PageShell } from "../../../../components/PageShell";
import { events } from "../../../../content-events";

export const metadata: Metadata = {
  title: "Events | Dubai Police",
  description:
    "Exhibitions, summits and community events Dubai Police takes part in.",
};

// Filtering happens in the browser, so only the card fields cross over — the
// full descriptions stay here rather than bloating the page payload.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured to drop
const cards = events.map(({ body, ...card }) => card);

export default function EventsPage() {
  return (
    <PageShell
      title="Events"
      intro="Exhibitions, summits and community events Dubai Police takes part in across the year."
      trail={[{ label: "Media Hub", href: "/app/home/media" }]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container">
          <EventsList events={cards} />
        </div>
      </section>
    </PageShell>
  );
}
