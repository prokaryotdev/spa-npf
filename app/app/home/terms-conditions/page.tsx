import type { Metadata } from "next";
import { LegalSections, PageShell } from "../../../components/PageShell";
import { termsConditions as termsConditionsSource } from "../../../content-footer";
import { getT, getLocalized } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Terms & Conditions | Nigeria Police Force"),
    description: t(
      "The terms that govern your use of the Nigeria Police Force website and its electronic services.",
    ),
  };
}

export default async function TermsConditionsPage() {
  const termsConditions = await getLocalized(termsConditionsSource);
  const t = await getT();
  return (
    <PageShell
      title={termsConditions.title}
      intro={t(
        "The terms that govern your use of the Nigeria Police Force website and its electronic services.",
      )}
    >
      <LegalSections sections={termsConditions.sections} />
    </PageShell>
  );
}
