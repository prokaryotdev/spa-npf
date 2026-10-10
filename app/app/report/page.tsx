import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "../../components/PageShell";
import ReportForm from "../../components/ReportForm";
import { getT } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Report a Crime | Nigeria Police Force"),
    description: t(
      "Report a crime to the State Command where it happened. Free, open all day, and you can report anonymously.",
    ),
  };
}

/**
 * Open to everyone, signed in or not: nobody should need an account to
 * report a crime. A signed-in reporter also gets the report in their account.
 */
export default async function ReportPage() {
  const t = await getT();
  return (
    <PageShell
      title={t("Report a Crime")}
      intro={t(
        "Report a crime to the State Command where it happened. Free, open all day, and you can report anonymously.",
      )}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          {/* ?kind= from the service pages needs a boundary for the page to
              stay static. */}
          <Suspense fallback={<div aria-hidden className="h-96 animate-pulse rounded-card bg-npf-cloud" />}>
            <ReportForm />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
