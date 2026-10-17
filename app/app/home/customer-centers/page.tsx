import type { Metadata } from "next";
import { PageShell } from "../../../components/PageShell";
import { CommandFinder } from "../../../components/CommandFinder";
import { getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Customer Centers | Nigeria Police Force"),
    description: t(
      "Force Headquarters and the Police Command of every state and the FCT, with where to find each one.",
    ),
  };
}

export default async function CustomerCentersPage() {
  const t = await getT();
  return (
    <PageShell
      compact
      title={t("Customer Centers")}
      intro={t(
        "Force Headquarters and the Police Command of every state and the FCT, with where to find each one.",
      )}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          <CommandFinder />
        </div>
      </section>
    </PageShell>
  );
}
