import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "../../components/PageShell";
import SignInForm from "../../components/SignInForm";

export const metadata: Metadata = {
  title: "Sign In | Dubai Police",
  description:
    "Sign in with UAE PASS or your Dubai Police account to track applications and use personalised services.",
};

export default function SignInPage() {
  return (
    <PageShell
      title="Sign In"
      intro="Sign in to track your requests, settle fines and reach personalised services."
    >
      <section className="bg-white pb-24">
        <div className="dp-container">
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
    <div aria-hidden className="max-w-[900px] animate-pulse">
      <div className="h-20 rounded-2xl bg-black/[0.05]" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="h-64 rounded-2xl bg-black/[0.04]" />
        <div className="h-64 rounded-2xl bg-black/[0.04]" />
      </div>
    </div>
  );
}
