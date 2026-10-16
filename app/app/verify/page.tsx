import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "../../components/PageShell";
import { VerifyLookup, VerifyResult } from "../../components/VerifyForm";
import { getT } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Verify a Police Document | Nigeria Police Force"),
    description: t(
      "Check that a police clearance certificate, report or permit you were given was issued by the Nigeria Police Force.",
    ),
  };
}

export default async function VerifyPage() {
  const t = await getT();
  return (
    <PageShell
      compact
      title={t("Verify a Police Document")}
      intro={t(
        "Check that a police clearance certificate, report or permit you were given was issued by the Nigeria Police Force.",
      )}
      lead={
        <Suspense fallback={<div aria-hidden className="mt-10 h-16 max-w-3xl rounded-full bg-npf-cloud" />}>
          <VerifyLookup />
        </Suspense>
      }
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          <Suspense fallback={null}>
            <VerifyResult />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
