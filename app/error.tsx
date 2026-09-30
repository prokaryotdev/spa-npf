"use client";

import Link from "./i18n/Link";
import { useEffect } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AlertIcon, ArrowRight, PhoneCallIcon } from "./components/icons";
import { useT } from "./i18n/client";
import { reportError } from "./report-error";

/**
 * Catches runtime errors below the root layout. Deliberately not built on
 * PageShell: if the thing that broke was a shared component, the fallback
 * should not go through it again.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useT();
  useEffect(() => {
    console.error(error);
    reportError(error, "error-boundary");
  }, [error]);

  return (
    <>
      <Header solid />
      <main
        id="main-content"
        tabIndex={-1}
        className="border-b border-npf-hairline outline-none"
      >
        <div className="relative overflow-hidden bg-white pt-40 pb-(--npf-section-y) md:pt-48">
          <div className="pointer-events-none absolute top-0 end-0 h-80 w-56 translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(#3c78bd66_7%,#22599e33_40%,#22599e00_70%)] opacity-70 [mask-image:linear-gradient(to_bottom,#000_65%,transparent_90%)] md:size-250 md:opacity-60" />

          <div className="npf-container npf-page-in relative">
            <span className="grid size-14 place-items-center rounded-full bg-npf-error-wash text-npf-error">
              <AlertIcon className="size-7" />
            </span>
            <h1 className="mt-8 font-secondary text-4xl leading-display font-bold text-npf-blue-deep lg:text-7xl">
              {t("Something went wrong")}
            </h1>
            <p className="mt-5 max-w-[70ch] text-base text-npf-body md:text-xl">
              {t("This page failed to load. Trying again often clears it.")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => retry()}
                className="npf-btn npf-btn-primary"
              >
                {t("Try again")}
                <span className="npf-btn-disc">
                  <ArrowRight className="npf-arrow size-4 rtl:-scale-x-100" />
                </span>
              </button>
              <Link href="/" className="npf-btn npf-btn-secondary">
                {t("Back to home")}
              </Link>
            </div>

            {/* A broken page must never stand between someone and help. */}
            <div className="mt-12 flex max-w-2xl flex-wrap items-center gap-x-5 gap-y-4 rounded-card border border-npf-hairline px-5 py-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-npf-alert text-white">
                <PhoneCallIcon className="size-5" />
              </span>
              <p className="npf-body min-w-0 flex-1 basis-56 text-npf-ink">
                {t("In an emergency, call 112.")}
              </p>
              <a href="tel:112" className="npf-btn npf-btn-alert npf-btn-sm">
                {t("Call 112")}
              </a>
            </div>

            {/* The only thing support can match against a server-side log. */}
            {error.digest ? (
              <p className="npf-small mt-8 text-npf-steel">
                {t("Reference:")}{" "}
                <span className="rounded-chip bg-npf-cloud px-2 py-0.5 font-mono text-npf-ink">
                  {error.digest}
                </span>
              </p>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
