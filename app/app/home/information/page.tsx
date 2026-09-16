import type { Metadata } from "next";
import { LinkCard, PageShell } from "../../../components/PageShell";
import { information as informationSource } from "../../../content-pages";
import { getLocalized, getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Information | Dubai Police"),
    description: t(
      "Laws and legislation, traffic black points, street speed limits, and sustainable development practices.",
    ),
  };
}

export default async function InformationPage() {
  const information = await getLocalized(informationSource);
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
