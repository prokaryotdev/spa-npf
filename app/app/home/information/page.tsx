import type { Metadata } from "next";
import { LinkCard, PageShell } from "../../../components/PageShell";
import { reveal } from "../../../components/reveal";
import { information as informationSource } from "../../../content-pages";
import { getLocalized, getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Information | Nigeria Police Force"),
    description: t(
      "Laws and legislation, traffic penalty points, street speed limits, and sustainable development practices.",
    ),
  };
}

export default async function InformationPage() {
  const information = await getLocalized(informationSource);
  const t = await getT();
  return (
    <PageShell
      title={information.title}
      intro={t(
        "The laws the Force works under, what each traffic offence costs, and the speed limit on the roads of the Territory.",
      )}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container grid gap-(--npf-gap) md:grid-cols-2 xl:grid-cols-3">
          {information.cards.map((card, i) => (
            <div key={card.title} {...reveal(i)}>
              <LinkCard card={card} />
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
