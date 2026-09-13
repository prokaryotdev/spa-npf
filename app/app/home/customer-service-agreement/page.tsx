import type { Metadata } from "next";
import { LegalSections, PageShell } from "../../../components/PageShell";
import { customerServiceAgreement } from "../../../content-footer";

export const metadata: Metadata = {
  title: "Customer Service Agreement | Dubai Police",
  description:
    "What you can expect from Dubai Police at every counter, and what we ask of you in return.",
};

export default function CustomerServiceAgreementPage() {
  return (
    <PageShell
      title={customerServiceAgreement.title}
      intro="What you can expect from Dubai Police at every counter, and what we ask of you in return."
    >
      <LegalSections sections={customerServiceAgreement.sections} />
    </PageShell>
  );
}
