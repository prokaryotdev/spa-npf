import type { Metadata } from "next";
import { LegalSections } from "../../../components/Legal";
import { PageShell } from "../../../components/PageShell";
import { privacyPolicy as privacyPolicySource } from "../../../content-footer";
import { getT, getLocalized } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Privacy Policy | Nigeria Police Force"),
    description: t(
      "How Nigeria Police Force collects, uses, stores and protects the data you share on this website.",
    ),
  };
}

export default async function PrivacyPolicyPage() {
  const privacyPolicy = await getLocalized(privacyPolicySource);
  const t = await getT();
  return (
    <PageShell
      title={privacyPolicy.title}
      intro={t(
        "How Nigeria Police Force collects, uses, stores and protects the data you share on this website.",
      )}
    >
      <LegalSections
        current="/app/home/privacy-policy"
        sections={privacyPolicy.sections}
      />
    </PageShell>
  );
}
