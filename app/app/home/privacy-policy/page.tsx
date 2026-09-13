import type { Metadata } from "next";
import { LegalSections, PageShell } from "../../../components/PageShell";
import { privacyPolicy } from "../../../content-footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Dubai Police",
  description:
    "How Dubai Police collects, uses, stores and protects the data you share on this website.",
};

export default function PrivacyPolicyPage() {
  return (
    <PageShell
      title={privacyPolicy.title}
      intro="How Dubai Police collects, uses, stores and protects the data you share on this website."
    >
      <LegalSections sections={privacyPolicy.sections} />
    </PageShell>
  );
}
