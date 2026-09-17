"use client";

import Link from "./i18n/Link";
import { useEffect } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { ArrowRight } from "./components/icons";
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
      <main id="main-content" tabIndex={-1} className="outline-none">
        <div className="relative overflow-hidden bg-white pt-40 pb-24 md:pt-48">
          <div className="pointer-events-none absolute top-0 right-0 h-80 w-56 translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(#3c78bd66_7%,#22599e33_40%,#22599e00_70%)] opacity-70 md:size-[1000px] md:opacity-60" />

          <div className="npf-container relative">
            <h1 className="font-secondary text-4xl leading-[1.15] font-bold text-npf-blue-deep lg:text-7xl">
              {t("Something went wrong")}
            </h1>
            <p className="mt-5 max-w-[70ch] text-base text-neutral-700 md:text-xl">
              {t("This page failed to load. Trying again often clears it.")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => retry()}
                className="inline-flex items-center gap-2 rounded-full bg-npf-blue px-6 py-3 font-medium text-white transition-colors hover:bg-npf-blue-mid"
              >
                {t("Try again")}
                <ArrowRight className="size-4" />
              </button>
              <Link
                href="/"
                className="inline-flex items-center rounded-full bg-[#F4F6FA] px-6 py-3 font-medium text-npf-blue-ink ring-1 ring-black/5 transition-colors hover:bg-[#E8EEF8]"
              >
                {t("Back to home")}
              </Link>
            </div>

            {/* The only thing support can match against a server-side log. */}
            {error.digest ? (
              <p className="mt-8 text-sm text-npf-muted">
                {t("Reference:")}{" "}
                <span className="font-mono">{error.digest}</span>
              </p>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
