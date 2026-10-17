"use client";

import Link from "./i18n/Link";
import { useEffect, useRef } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { HelpCard } from "./components/HelpCard";
import { MissedAddress } from "./components/NotFoundHelp";
import { useOnline } from "./components/OfflineNotice";
import { StartRows } from "./components/SiteIndex";
import {
  ArrowRight,
  CheckIcon,
  FileIcon,
  PhoneCallIcon,
  WifiOffIcon,
} from "./components/icons";
import { emergencyNumbers } from "./content";
import { startHere } from "./content-pages";
import { useT } from "./i18n/client";
import { reportError } from "./report-error";

/**
 * Catches runtime errors below the root layout. Deliberately not built on
 * PageShell: if the thing that broke was a shared component, the fallback
 * should not go through it again.
 *
 * Two pages in one. With no signal, the failure is the connection, not the
 * site, so it says that, keeps the visitor's work safe in plain words and
 * reloads itself the moment the signal is back. Otherwise it is a real fault:
 * try again, or go somewhere that works, with the reference support needs.
 * Either way the emergency lines sit beside it, because a phone call needs
 * no data at all.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useT();
  const online = useOnline();
  const offline = !online;

  useEffect(() => {
    console.error(error);
    // A dropped signal is not a fault in the site; there is nothing to send.
    if (navigator.onLine) reportError(error, "error-boundary");
  }, [error]);

  // Back from offline: load the page again without anyone pressing.
  const wasOffline = useRef(offline);
  useEffect(() => {
    if (offline) wasOffline.current = true;
    else if (wasOffline.current) retry();
  }, [offline, retry]);

  const lines = emergencyNumbers.slice(0, 3).map((line) => ({
    Icon: PhoneCallIcon,
    label: `${t(line.label)} · ${line.number}`,
    note: line.note ? t(line.note) : undefined,
    href: `tel:${line.number}`,
  }));

  return (
    <>
      <Header solid />
      <main
        id="main-content"
        tabIndex={-1}
        data-offline-page={offline ? "" : undefined}
        className="border-b border-npf-hairline outline-none"
      >
        <div className="relative bg-white pt-36 pb-10 md:pt-40 md:pb-12">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-0 end-0 h-80 w-56 translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(#3c78bd66_7%,#22599e33_40%,#22599e00_70%)] opacity-70 [mask-image:linear-gradient(to_bottom,#000_65%,transparent_90%)] md:size-250 md:opacity-60" />
          </div>

          <div className="npf-container npf-page-in relative">
            <h1 className="font-secondary text-4xl leading-display font-bold text-balance text-npf-blue-deep lg:text-6xl">
              {offline ? t("You are offline") : t("Something went wrong")}
            </h1>
            <p className="mt-5 max-w-[70ch] text-base text-npf-body md:text-xl">
              {offline
                ? t("This page needs the internet to load. It will open by itself when the signal comes back.")
                : t("This page failed to load. Trying again often clears it.")}
            </p>

            {offline ? (
              <p
                role="status"
                className="npf-small mt-6 inline-flex items-center gap-2.5 rounded-chip bg-npf-gold-wash px-3 py-1.5 font-medium text-npf-warn ring-1 ring-npf-gold/25 ring-inset"
              >
                <span className="npf-wait-dot size-2 rounded-full bg-npf-gold" />
                {t("Waiting for the signal")}
              </p>
            ) : (
              <MissedAddress label="This page" />
            )}

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
          </div>
        </div>

        <section className="bg-white pb-(--npf-section-y)">
          <div className="npf-container grid items-start gap-x-(--npf-gap) gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {offline ? (
                <>
                  <h2 className="npf-h4 text-npf-blue-deep">
                    {t("While you wait")}
                  </h2>
                  <ul className="mt-5 divide-y divide-npf-hairline overflow-hidden rounded-card border border-npf-hairline">
                    {[
                      {
                        Icon: WifiOffIcon,
                        title: t("Check your data or Wi-Fi"),
                        note: t("Turn mobile data or Wi-Fi on, or move to where the signal is stronger."),
                      },
                      {
                        Icon: FileIcon,
                        title: t("What you typed is kept"),
                        note: t("Report and application drafts stay in this tab. Keep it open and send when the signal is back."),
                      },
                      {
                        Icon: CheckIcon,
                        title: t("No need to press anything"),
                        note: t("The page loads again as soon as the connection returns."),
                      },
                    ].map((row) => (
                      <li key={row.title} className="flex items-start gap-4 px-5 py-5">
                        <span className="npf-disc">
                          <row.Icon className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="npf-h5 block text-npf-ink">
                            {row.title}
                          </span>
                          <span className="npf-small mt-1 block text-npf-body">
                            {row.note}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h2 className="npf-h4 text-npf-blue-deep">
                    {t("Other pages are working")}
                  </h2>
                  <StartRows
                    wide={false}
                    start={startHere.map((l) => ({
                      ...l,
                      label: t(l.label),
                      note: t(l.note),
                    }))}
                  />
                </>
              )}
            </div>

            <div className="space-y-6 lg:col-span-4">
              {/* A broken page must never stand between someone and help. */}
              <HelpCard
                title={t("Need help now?")}
                intro={t("A phone call needs no internet.")}
                rows={lines}
              />

              {/* The only thing support can match against a server-side log. */}
              {!offline && error.digest ? (
                <div className="rounded-card border border-npf-hairline px-5 py-4">
                  <p className="npf-small font-medium text-npf-steel">
                    {t("Error reference")}
                  </p>
                  <p className="mt-1.5 font-mono text-sm break-all text-npf-ink select-all">
                    {error.digest}
                  </p>
                  <p className="npf-small mt-2 text-npf-body">
                    {t("Give this to support if it keeps happening.")}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      {/* The help card already lists the lines; once is enough. */}
      <Footer showEmergency={false} />
    </>
  );
}
