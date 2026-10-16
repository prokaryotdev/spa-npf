import type { Metadata } from "next";
import { Suspense } from "react";
import { requireBackend } from "../../backend";
import { PageShell } from "../../components/PageShell";
import { OfficerSignInForm } from "../../components/SignInForm";
import { getT } from "../../i18n/server";

/**
 * The console's sign-in. Unlisted: no public page links here and search
 * engines are told to stay out; the console's guard is the way in.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Operations Console | Nigeria Police Force"),
    robots: { index: false, follow: false },
  };
}

export default async function OfficerSignInPage() {
  requireBackend();
  const t = await getT();
  return (
    <PageShell
      compact
      title={t("Nigeria Police Force personnel")}
      intro={t("Officers reach the operations console with their force credentials.")}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          <div className="max-w-160">
            <Suspense fallback={<div aria-hidden className="h-160 animate-pulse rounded-card bg-npf-cloud" />}>
              <OfficerSignInForm />
            </Suspense>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
