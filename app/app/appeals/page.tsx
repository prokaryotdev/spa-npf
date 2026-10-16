import type { Metadata } from "next";
import Appeals from "../../components/Appeals";
import { PageShell } from "../../components/PageShell";
import { getT } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Appeals | Nigeria Police Force"),
    description: t(
      "Missing people, wanted people and stolen vehicles the Force is asking about. Send what you know, anonymously if you prefer.",
    ),
  };
}

export default async function AppealsPage() {
  const t = await getT();
  return (
    <PageShell
      compact
      title={t("Appeals")}
      intro={t(
        "Missing people, wanted people and stolen vehicles the Force is asking about. Send what you know, anonymously if you prefer.",
      )}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          <Appeals />
        </div>
      </section>
    </PageShell>
  );
}
