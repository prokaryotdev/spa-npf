import type { Metadata } from "next";
import { PageShell } from "../../components/PageShell";
import VerifyForm from "../../components/VerifyForm";
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
      title={t("Verify a Police Document")}
      intro={t(
        "Check that a police clearance certificate, report or permit you were given was issued by the Nigeria Police Force.",
      )}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          <VerifyForm />
        </div>
      </section>
    </PageShell>
  );
}
