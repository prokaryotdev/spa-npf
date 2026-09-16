import type { Metadata } from "next";
import { LinkCard, PageShell } from "../../../components/PageShell";
import { information } from "../../../content-pages";

export const metadata: Metadata = {
  title: "Information | Dubai Police",
  description:
    "Laws and legislation, traffic black points, street speed limits, and sustainable development practices.",
};

export default function InformationPage() {
  return (
    <PageShell title={information.title}>
      <section className="bg-white pb-24">
        <div className="dp-container grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {information.cards.map((card) => (
            <LinkCard key={card.title} card={card} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
