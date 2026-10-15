import type { Metadata } from "next";
import { requireBackend } from "../../backend";
import { ResetForm } from "../../components/AccountForms";
import { PageShell } from "../../components/PageShell";
import { getT } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Reset Your Password | Nigeria Police Force"),
    description: t("Get a code on your phone and choose a new password for your Nigeria Police Force account."),
    robots: { index: false, follow: true },
  };
}

export default async function Page() {
  requireBackend();
  const t = await getT();
  return (
    <PageShell title={t("Reset Your Password")} intro={t("Get a code on your phone and choose a new password for your Nigeria Police Force account.")}>
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          <ResetForm />
        </div>
      </section>
    </PageShell>
  );
}
