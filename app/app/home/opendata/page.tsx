import type { Metadata } from "next";
import { LinkCard, PageShell } from "../../../components/PageShell";
import { openData as openDataSource } from "../../../content-pages";
import { getLocalized, getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Open Data | Dubai Police"),
    description: t(
      "Official city data and statistics published by Dubai Police and Digital Dubai.",
    ),
  };
}

export default async function OpenDataPage() {
  const openData = await getLocalized(openDataSource);
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
