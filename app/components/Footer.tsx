"use client";

import Image from "next/image";
import Link from "../i18n/Link";
import { useState } from "react";
import {
  emergencyNumbers as emergencyNumbersSource,
  footerColumns as footerColumnsSource,
  legalLinks as legalLinksSource,
  storeBadges as storeBadgesSource,
} from "../content";
import { ArrowUpRight, ChevronDown, PhoneCallIcon, SocialIcon } from "./icons";
import { PoliceWordmark } from "./Wordmark";
import { useT, useLocalized, useFormat } from "../i18n/client";

const socials = ["Facebook", "Youtube", "Twitter", "Instagram"] as const;

/*
 * The page closes on plain white, a clean break from the blue app band above,
 * with the Force's blue and the alarm red left to carry the brand. 112 leads
 * because it is the one thing on the page someone may need in a hurry; the
 * other lines sit beside it as a quieter directory. Then the site map, the
 * newsletter on a faint blue ground, and a sign-off with crest and legal.
 *
 * `showApps` drops the store badges where the page above already offers
 * them (the homepage's app band).
 */
export default function Footer({ showApps = true }: { showApps?: boolean }) {
  const [lead, ...others] = useLocalized(emergencyNumbersSource);
  const footerColumns = useLocalized(footerColumnsSource);
  const legalLinks = useLocalized(legalLinksSource);
  const format = useFormat();
  const storeBadges = useLocalized(storeBadgesSource);
  const t = useT();
  const [open, setOpen] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer id="staticFooter" className="w-full bg-white text-npf-body">
      {/* Emergency */}
      <section
        aria-labelledby="footer-emergency"
        className="npf-container pt-(--npf-section-y) pb-(--npf-head-gap)"
      >
        <h2 id="footer-emergency" className="npf-h3 mb-8 text-npf-ink">
          {t("Emergency Numbers")}
        </h2>
        <div className="grid gap-(--npf-gap) lg:grid-cols-12">
          {/* 112 is the one line someone may need in a hurry, so it gets the
              alarm red as a whole surface and the whole surface dials. A warm
              light in the top corner deepens to dark red at the foot. */}
          <a
            href={`tel:${lead.number}`}
            className="group flex flex-col justify-between gap-8 rounded-tile bg-npf-alert bg-[radial-gradient(90%_80%_at_100%_0%,rgb(255_120_90/0.35),transparent_60%),linear-gradient(135deg,var(--color-npf-alert)_40%,var(--color-npf-alert-deep)_100%)] p-(--npf-pad) text-white shadow-raised transition-[translate] hover:-translate-y-1 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-npf-alert lg:col-span-7"
          >
            <span className="flex flex-wrap items-center justify-between gap-3">
              <span className="npf-h4">{lead.label}</span>
              {lead.note ? (
                <span className="npf-caption rounded-full bg-white/12 px-3 py-1.5 ring-1 ring-white/20 ring-inset">
                  {lead.note}
                </span>
              ) : null}
            </span>
            <span className="flex flex-wrap items-end justify-between gap-x-6 gap-y-5">
              <span className="npf-display-xl tabular-nums">{lead.number}</span>
              {/* A real button shape, so nobody wonders whether the card
                  dials. The ring ripples out like a line ringing. */}
              <span className="npf-btn bg-white text-npf-alert">
                {t("Call")} {lead.number}
                <span className="npf-btn-disc relative bg-npf-alert text-white">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full ring-2 ring-npf-alert/50 motion-safe:animate-[npf-ring_2.4s_var(--ease-out)_infinite]"
                  />
                  <PhoneCallIcon className="size-[18px] transition-[rotate] group-hover:-rotate-12" />
                </span>
              </span>
            </span>
          </a>

          {/* The other lines are quieter white cards stacked to the red
              card's height, with the call button pinned to the end so they
              line up however long a translated label runs. */}
          <ul className="flex flex-col gap-3 lg:col-span-5">
            {others.map((item) => (
              <li key={item.number} className="flex flex-1">
                <a
                  href={`tel:${item.number}`}
                  className="npf-card group flex flex-1 items-center justify-between gap-4 px-5 py-4 md:px-6"
                >
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className="npf-h5 text-npf-ink">{item.label}</span>
                      {item.note ? (
                        <span className="npf-small text-npf-muted">
                          {item.note}
                        </span>
                      ) : null}
                    </span>
                    <span className="npf-h3 leading-none text-npf-ink tabular-nums transition-colors group-hover:text-npf-blue">
                      {item.number}
                    </span>
                  </span>
                  <span className="npf-btn npf-btn-primary">
                    {t("Call")}
                    <span className="npf-btn-disc">
                      <PhoneCallIcon className="size-[18px] transition-[rotate] group-hover:-rotate-12" />
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Link columns */}
      <nav
        aria-label={t("Site Map")}
        className="npf-container grid border-t border-npf-ink/10 py-6 md:grid-cols-3 md:gap-x-10 md:gap-y-12 md:py-16 xl:grid-cols-[1.35fr_1fr_0.85fr_1.15fr_1.15fr]"
      >
        {footerColumns.map((col) => {
          const isOpen = open === col.heading;
          return (
            <div
              key={col.heading}
              className="border-b border-npf-ink/10 py-2 last:border-none md:border-none md:py-0"
            >
              <h2 className="npf-h5 text-npf-ink md:mb-5">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : col.heading)}
                  aria-expanded={isOpen}
                  className="flex min-h-11 w-full items-center justify-between text-start md:pointer-events-none md:min-h-0"
                >
                  {col.heading}
                  <ChevronDown
                    className={`size-5 transition-[rotate] md:hidden ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </h2>
              {/* Closed lists are display:none on phones, which also takes
                  them out of the tab order; from md up the links always
                  show. Opening fades in rather than animating height. */}
              <ul
                className={`space-y-3 pt-2 pb-3 md:block md:py-0 ${
                  isOpen
                    ? "block animate-[reveal-up_var(--dur-hover)_var(--ease-out)]"
                    : "hidden"
                }`}
              >
                {col.links.map((link) => {
                  const external = "external" in link && link.external;
                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="group inline-flex items-center gap-1.5 decoration-npf-gold underline-offset-4 transition-colors hover:text-npf-blue hover:underline"
                      >
                        {link.label}
                        {external ? (
                          <ArrowUpRight className="size-4 shrink-0 transition-[translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" />
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Newsletter */}
      <div className="npf-container">
        <div className="grid gap-6 rounded-tile bg-npf-mist p-(--npf-pad) lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <h2 id="footer-newsletter" className="npf-h4 mb-2 text-npf-ink">
              {t("Get news from the Command")}
            </h2>
            <p className="npf-body">
              {t("Announcements, safety advice and events, sent to your inbox.")}
            </p>
          </div>
          {/* ponytail: no mailing-list backend, so this confirms and stops. */}
          <form
            aria-labelledby="footer-newsletter"
            onSubmit={(e) => {
              e.preventDefault();
              setSubscribed(true);
              e.currentTarget.reset();
            }}
          >
            <div className="relative">
              <label htmlFor="subscribeEmail" className="sr-only">
                {t("Email address")}
              </label>
              <input
                id="subscribeEmail"
                type="email"
                required
                autoComplete="email"
                placeholder={t("Email address")}
                className="h-15 w-full rounded-full border border-npf-ink/15 bg-white ps-6 pe-40 text-npf-ink caret-npf-blue transition-[border-color,box-shadow] placeholder:text-npf-muted hover:border-npf-ink/30 focus:border-npf-blue focus:shadow-[0_0_0_4px_rgb(27_63_122/0.12)] focus:outline-none"
              />
              <button
                type="submit"
                className="npf-btn npf-btn-primary absolute end-1.5 top-1.5"
              >
                {t("Subscribe")}
              </button>
            </div>
            <p
              aria-live="polite"
              className="npf-small mt-2 min-h-5 ps-6 text-npf-ok"
            >
              {subscribed ? t("Thanks, you are on the list.") : ""}
            </p>
          </form>
        </div>
      </div>

      {/* Sign-off: the crest, where to follow us, where to get the app */}
      <div className="npf-container flex flex-col gap-8 pt-14 pb-10 md:flex-row md:items-center md:justify-between">
        <span
          role="img"
          aria-label={t("Nigeria Police Force")}
          className="text-npf-blue"
        >
          <PoliceWordmark className="h-14 w-auto md:h-16" />
        </span>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
          <div className="flex gap-2">
            {socials.map((name) => (
              <a
                key={name}
                href="https://fct.npf.gov.ng/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="npf-icon-btn"
              >
                <SocialIcon name={name} className="size-5" />
              </a>
            ))}
          </div>
          {showApps ? (
            <div className="flex flex-wrap gap-2.5">
              {storeBadges.map((badge) => (
                <a
                  key={badge.label}
                  href="https://fct.npf.gov.ng/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-chip transition-[translate] hover:-translate-y-0.5"
                >
                  <Image
                    src={badge.src}
                    alt={badge.label}
                    width={badge.width}
                    height={40}
                  />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Legal */}
      <div className="npf-small npf-container flex flex-col gap-6 border-t border-npf-ink/10 pt-8 pb-12 text-npf-muted lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <div className="space-y-2">
          <p className="font-medium text-npf-ink">
            {t(
              "© {year} FCT Police Command Headquarters. All Rights Reserved",
              {
                year: process.env.NEXT_PUBLIC_BUILD_YEAR ?? "",
              },
            )}
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <span>
              {t(
                "This site is monitored and maintained by Nigeria Police Force.",
              )}
            </span>
            {/* The line this replaces named IE11 first. Microsoft retired it
                in 2022, and this site uses CSS it could never have rendered,
                so the advice was both stale and wrong. */}
            <span>
              {t(
                "The site is best viewed in a current version of Chrome, Safari, Edge or Firefox",
              )}
            </span>
            <span>
              {t("Last modified Date: {date}", {
                date: format.date(process.env.NEXT_PUBLIC_BUILD_DATE ?? ""),
              })}
            </span>
          </p>
        </div>
        <ul className="flex shrink-0 flex-wrap gap-x-6 gap-y-2">
          {legalLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-npf-body decoration-npf-gold underline-offset-4 transition-colors hover:text-npf-blue hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
