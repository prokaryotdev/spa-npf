import type { Metadata } from "next";
import { Suspense } from "react";
import { requireBackend } from "../../backend";
import { PageShell } from "../../components/PageShell";
import SignInForm from "../../components/SignInForm";
import { StartRows } from "../../components/SiteIndex";
import { startHere } from "../../content-pages";
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

/** What people often think needs an account and does not. */
const OPEN = ["/app/report", "/app/track", "/app/verify"];

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
        <div className="npf-container grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16 xl:grid-cols-[minmax(0,40rem)_minmax(0,26rem)] xl:justify-between">
          {/* The form reads ?next= to send you back where you came from, and
              useSearchParams needs a boundary for the page to stay static. */}
          <Suspense fallback={<div aria-hidden className="h-160 animate-pulse rounded-card bg-npf-cloud" />}>
            <SignInForm />
          </Suspense>
          {/* Many arrive here thinking a report or a check needs an account.
              112 is already in the header and the footer band. */}
          <section aria-labelledby="open-title" className="lg:pt-2">
            <h2 id="open-title" className="npf-h4 text-npf-blue-deep">
              {t("No account needed")}
            </h2>
            <p className="npf-body mt-2 text-npf-body">{t("These work without signing in.")}</p>
            <StartRows
              wide={false}
              rail
              start={startHere
                .filter((l) => OPEN.includes(l.href))
                .map((l) => ({ ...l, label: t(l.label), note: t(l.note) }))}
            />
          </section>
        </div>
      </section>
    </PageShell>
  );
}
