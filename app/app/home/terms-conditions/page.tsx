import type { Metadata } from "next";
import { LegalSections, PageShell } from "../../../components/PageShell";
import { termsConditions } from "../../../content-footer";

export const metadata: Metadata = {
  title: "Terms & Conditions | Dubai Police",
  description:
    "The terms that govern your use of the Dubai Police website and its electronic services.",
};

export default function TermsConditionsPage() {
  return (
    <PageShell
      title={termsConditions.title}
      intro="The terms that govern your use of the Dubai Police website and its electronic services."
    >
      <LegalSections sections={termsConditions.sections} />
    </PageShell>
  );
}
