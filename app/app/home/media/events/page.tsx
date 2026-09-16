import type { Metadata } from "next";
import EventsList from "../../../../components/EventsList";
import { PageShell } from "../../../../components/PageShell";
import { events as eventsSource } from "../../../../content-events";
import { getT, getLocalized } from "../../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Events | Dubai Police"),
    description: t(
      "Exhibitions, summits and community events Dubai Police takes part in.",
    ),
  };
}

// Filtering happens in the browser, so only the card fields cross over — the
// full descriptions stay here rather than bloating the page payload.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured to drop
const cards = eventsSource.map(({ body, ...card }) => card);

export default async function EventsPage() {
  const t = await getT();
  const events = await getLocalized(cards);
  return (
    <PageShell
      title={t("Events")}
      intro={t(
        "Exhibitions, summits and community events Dubai Police takes part in across the year.",
      )}
      trail={[{ label: "Media Hub", href: "/app/home/media" }]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container">
          <EventsList events={events} />
        </div>
      </section>
    </PageShell>
  );
}
