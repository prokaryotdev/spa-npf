"use client";

import "./globals.css";
import { useEffect, useRef } from "react";
import { useOnline } from "./components/OfflineNotice";
import { PoliceWordmark } from "./components/Wordmark";
import { display, sans } from "./font-faces";
import { ArrowRight, PhoneCallIcon } from "./components/icons";
import { emergencyNumbers } from "./content";
import { useT } from "./i18n/client";
import { reportError } from "./report-error";

/**
 * Replaces the root layout when the layout itself throws, so it owns its own
 * document and cannot reuse Header or Footer. The body keeps inline colours
 * and fonts as a floor in case the stylesheet is what failed; the rest uses
 * the site's own classes, so on a normal day it reads as the same site.
 *
 * Offline it says so and reloads when the signal returns, like error.tsx.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useT();
  const offline = !useOnline();

  // The layout itself threw, so this is the more serious of the two.
  useEffect(() => {
    console.error(error);
    if (navigator.onLine) reportError(error, "global-error-boundary");
  }, [error]);

  const wasOffline = useRef(offline);
  useEffect(() => {
    if (offline) wasOffline.current = true;
    else if (wasOffline.current) retry();
  }, [offline, retry]);

  return (
    <html
      lang="en"
      dir="ltr"
      className={`${sans.variable} ${display.variable}`}
    >
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#fff",
          color: "#1a2338",
          fontFamily: "var(--font-primary, system-ui, sans-serif)",
        }}
      >
        <title>{t("Something went wrong | Nigeria Police Force")}</title>
        <header className="border-b border-npf-hairline">
          <div className="npf-container flex h-18 items-center">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              aria-label={t("Nigeria Police Force home")}
              className="h-9 text-npf-blue-deep"
            >
              <PoliceWordmark className="h-full w-auto" />
            </a>
          </div>
        </header>

        <main className="npf-container npf-page-in py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="font-secondary text-4xl leading-display font-bold text-balance text-npf-blue-deep lg:text-6xl">
              {offline ? t("You are offline") : t("Something went wrong")}
            </h1>
            <p className="mt-5 max-w-[70ch] text-base text-npf-body md:text-xl">
              {offline
                ? t("This page needs the internet to load. It will open by itself when the signal comes back.")
                : t("The site failed to load. Trying again often clears it.")}
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
              {/* A plain link on purpose: the root layout is what failed, so a
                  full page load is the recovery, not a client-side route. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/" className="npf-btn npf-btn-secondary">
                {t("Back to home")}
              </a>
            </div>

            {/* A broken site must never stand between someone and help. */}
            <section
              aria-label={t("Need help now?")}
              className="mt-12 overflow-hidden rounded-card border border-npf-hairline"
            >
              <div className="px-5 pt-5 pb-4">
                <h2 className="npf-h5 text-npf-blue-deep">{t("Need help now?")}</h2>
                <p className="npf-small mt-1 text-npf-body">
                  {t("A phone call needs no internet.")}
                </p>
              </div>
              <ul className="divide-y divide-npf-hairline border-t border-npf-hairline">
                {emergencyNumbers.slice(0, 3).map((line) => (
                  <li key={line.number}>
                    <a
                      href={`tel:${line.number}`}
                      className="npf-row-link group flex items-center gap-4 px-5 py-4 focus-visible:-outline-offset-2 active:bg-npf-cloud"
                    >
                      <span className="npf-disc">
                        <PhoneCallIcon className="size-5" />
                      </span>
                      <span className="npf-body min-w-0 flex-1 font-medium text-npf-ink tabular-nums transition-colors group-hover:text-npf-blue">
                        {t(line.label)} · {line.number}
                      </span>
                      <ArrowRight className="npf-go" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            {!offline && error.digest ? (
              <p className="npf-small mt-8 text-npf-steel">
                {t("Error reference")}{" "}
                <span className="rounded-chip bg-npf-cloud px-2 py-0.5 font-mono text-npf-ink select-all">
                  {error.digest}
                </span>
              </p>
            ) : null}
          </div>
        </main>
      </body>
    </html>
  );
}
