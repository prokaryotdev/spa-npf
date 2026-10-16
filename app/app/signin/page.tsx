import type { Metadata } from "next";
import { Suspense } from "react";
import { requireBackend } from "../../backend";
import { HelpCard, PageShell } from "../../components/PageShell";
import SignInForm from "../../components/SignInForm";
import { AlertIcon, PhoneCallIcon, SearchIcon } from "../../components/icons";
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
      compact
      title={t("Sign In")}
      intro={t(
        "Sign in to track your requests, settle fines and reach personalised services.",
      )}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container grid items-start gap-6 lg:grid-cols-[minmax(0,40rem)_minmax(0,22rem)] lg:gap-12">
          {/* The form reads ?next= to send you back where you came from, and
              useSearchParams needs a boundary for the page to stay static. */}
          <Suspense fallback={<div aria-hidden className="h-160 animate-pulse rounded-card bg-npf-cloud" />}>
            <SignInForm />
          </Suspense>
          {/* Most of what brings people to the police needs no account:
              the ways in that skip this form, in plain sight. */}
          <HelpCard
            className="lg:[@media(min-height:46rem)]:sticky lg:[@media(min-height:46rem)]:top-28"
            title={t("Need help?")}
            intro={t("In an emergency, call 112.")}
            rows={[
              { Icon: PhoneCallIcon, label: t("Call 112"), href: "tel:112" },
              { Icon: AlertIcon, label: t("Report a Crime"), href: "/app/report" },
              { Icon: SearchIcon, label: t("Track a Reference"), href: "/app/track" },
            ]}
          />
        </div>
      </section>
    </PageShell>
  );
}
