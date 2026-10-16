import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "../../components/PageShell";
import { TrackLookup, TrackResult } from "../../components/TrackForm";
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
      compact
      title={t("Track a Reference")}
      intro={t(
        "Follow a crime report or an application with its reference number. No account needed.",
      )}
      lead={
        <Suspense fallback={<div aria-hidden className="mt-10 h-16 max-w-3xl rounded-full bg-npf-cloud" />}>
          <TrackLookup />
        </Suspense>
      }
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          <Suspense fallback={null}>
            <TrackResult />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
