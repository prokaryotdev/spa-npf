import type { Metadata } from "next";
import { LinkCard, PageShell } from "../../../components/PageShell";
import { openData } from "../../../content-pages";

export const metadata: Metadata = {
  title: "Open Data | Dubai Police",
  description:
    "Official city data and statistics published by Dubai Police and Digital Dubai.",
};

export default function OpenDataPage() {
  return (
    <PageShell title={openData.title}>
      <section className="bg-white pb-24">
        <div className="dp-container grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {openData.cards.map((card) => (
            <LinkCard key={card.title} card={card} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
