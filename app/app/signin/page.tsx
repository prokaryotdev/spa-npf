import type { Metadata } from "next";
import { Suspense } from "react";
import { requireBackend } from "../../backend";
import { PageShell } from "../../components/PageShell";
import SignInForm from "../../components/SignInForm";
import { getT } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Sign In | Nigeria Police Force"),
    description: t(
      "Sign in with NINAuth or your Nigeria Police Force account to track applications and use personalised services.",
    ),
  };
}

export default async function SignInPage() {
  requireBackend();
  const t = await getT();
  return (
    <PageShell
      title={t("Sign In")}
      intro={t(
        "Sign in to track your requests, settle fines and reach personalised services.",
      )}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          {/* The form reads ?next= to send you back where you came from, and
 useSearchParams needs a boundary for the page to stay static. */}
          <Suspense fallback={<FormSkeleton />}>
            <SignInForm />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}

function FormSkeleton() {
  return (
    <div aria-hidden className="max-w-260 animate-pulse">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-96 rounded-card bg-npf-cloud" />
        <div className="h-96 rounded-card bg-npf-cloud" />
      </div>
      <div className="mt-6 h-22 rounded-card bg-npf-cloud" />
    </div>
  );
}
