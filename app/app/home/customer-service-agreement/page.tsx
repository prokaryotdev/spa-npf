import type { Metadata } from "next";
import { LegalSections, PageShell } from "../../../components/PageShell";
import { customerServiceAgreement as customerServiceAgreementSource } from "../../../content-footer";
import { getT, getLocalized } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Customer Service Agreement | Dubai Police"),
    description: t(
      "What you can expect from Dubai Police at every counter, and what we ask of you in return.",
    ),
  };
}

export default async function CustomerServiceAgreementPage() {
  const customerServiceAgreement = await getLocalized(
    customerServiceAgreementSource,
  );
  const t = await getT();
  return (
    <PageShell
      title={customerServiceAgreement.title}
      intro={t(
        "What you can expect from Dubai Police at every counter, and what we ask of you in return.",
      )}
    >
      <LegalSections sections={customerServiceAgreement.sections} />
    </PageShell>
  );
}
