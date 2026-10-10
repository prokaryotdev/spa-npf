import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "../../components/PageShell";
import TrackForm from "../../components/TrackForm";
import { getT } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Track a Reference | Nigeria Police Force"),
    description: t(
      "Follow a crime report or an application with its reference number. No account needed.",
    ),
  };
}

export default async function TrackPage() {
  const t = await getT();
  return (
    <PageShell
      title={t("Track a Reference")}
      intro={t(
        "Follow a crime report or an application with its reference number. No account needed.",
      )}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          <Suspense fallback={<div aria-hidden className="mx-auto h-40 max-w-180 animate-pulse rounded-card bg-npf-cloud" />}>
            <TrackForm />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
