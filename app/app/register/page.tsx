import type { Metadata } from "next";
import { requireBackend } from "../../backend";
import { RegisterForm } from "../../components/AccountForms";
import { PageShell } from "../../components/PageShell";
import { getT } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Create an Account | Nigeria Police Force"),
    description: t("Create a Nigeria Police Force account with your NIN and mobile number, to follow your reports and applications."),
    robots: { index: false, follow: true },
  };
}

export default async function Page() {
  requireBackend();
  const t = await getT();
  return (
    <PageShell title={t("Create an Account")} intro={t("Create a Nigeria Police Force account with your NIN and mobile number, to follow your reports and applications.")}>
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          <RegisterForm />
        </div>
      </section>
    </PageShell>
  );
}
