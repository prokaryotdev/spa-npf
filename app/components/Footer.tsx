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
 */
export default function Footer() {
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
        className="npf-container pt-16 pb-14 md:pt-24 md:pb-20"
      >
        <h2
          id="footer-emergency"
          className="mb-8 font-secondary text-3xl font-bold tracking-[-0.02em] text-balance text-npf-ink md:mb-10 md:text-4xl"
        >
          {t("Emergency Numbers")}
        </h2>
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
          {/* 112 is the one line someone may need in a hurry, so it gets the
              alarm red as a whole surface and the whole surface dials. */}
          <a
            href={`tel:${lead.number}`}
            className="group relative isolate flex flex-col justify-between gap-10 overflow-hidden rounded-2xl bg-[#b30900] p-6 text-white shadow-[0_24px_48px_-24px_rgba(179,9,0,0.6)] transition-[box-shadow,translate] duration-300 ease-[var(--ease-custom)] hover:-translate-y-0.5 hover:shadow-[0_32px_56px_-24px_rgba(179,9,0,0.7)] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#b30900] active:translate-y-0 md:p-9 lg:col-span-7"
          >
            {/* Light falls from the top corner so the red reads as a surface,
                not a flat swatch. */}
            <span
              aria-hidden
              className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_100%_0%,rgba(255,255,255,0.16),transparent_55%),linear-gradient(180deg,transparent_40%,rgba(80,0,0,0.28))]"
            />
            <span className="flex flex-col gap-1">
              <span className="font-secondary text-xl font-bold md:text-2xl">
                {lead.label}
              </span>
              {lead.note ? (
                <span className="text-sm text-white/80 md:text-base">
                  {lead.note}
                </span>
              ) : null}
            </span>
            <span className="flex flex-wrap items-end justify-between gap-x-6 gap-y-5">
              <span className="font-secondary text-[clamp(5.5rem,3.5rem+7vw,9rem)] leading-[0.78] font-bold tracking-[-0.035em] tabular-nums">
                {lead.number}
              </span>
              {/* A real button shape, so nobody wonders whether the card
                  dials. The ring ripples out like a line ringing. */}
              <span className="inline-flex items-center gap-3 rounded-full bg-white py-1.5 ps-1.5 pe-5 font-secondary font-bold text-[#b30900] shadow-[0_10px_24px_-10px_rgba(60,0,0,0.7)] transition-transform duration-300 ease-[var(--ease-custom)] group-hover:scale-[1.04] group-active:scale-95 md:text-lg">
                <span className="relative grid size-10 place-items-center rounded-full bg-[#b30900] text-white md:size-11">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full ring-2 ring-[#b30900]/50 motion-safe:animate-[npf-ring_2.4s_cubic-bezier(0.16,1,0.3,1)_infinite]"
                  />
                  <PhoneCallIcon className="size-5 transition-transform duration-300 group-hover:rotate-[-12deg]" />
                </span>
                {t("Call")} {lead.number}
              </span>
            </span>
          </a>

          {/* The other lines read as a directory: name on the left, number on
              the right, so they line up however long a translated label runs. */}
          <ul className="flex flex-col rounded-2xl bg-npf-blue/[0.045] p-2 lg:col-span-5">
            {others.map((item) => (
              <li
                key={item.number}
                className="flex flex-1 border-b border-npf-ink/[0.08] last:border-none"
              >
                <a
                  href={`tel:${item.number}`}
                  className="group flex flex-1 items-center justify-between gap-4 rounded-xl px-4 py-5 transition-colors duration-200 hover:bg-white focus-visible:bg-white focus-visible:outline-2 focus-visible:outline-npf-blue md:px-5"
                >
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-secondary font-bold text-npf-ink md:text-lg">
                      {item.label}
                    </span>
                    {item.note ? (
                      <span className="text-sm text-npf-muted">{item.note}</span>
                    ) : null}
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="font-secondary text-3xl font-bold tracking-[-0.02em] text-npf-ink tabular-nums md:text-4xl">
                      {item.number}
                    </span>
                    <span className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-white px-3.5 font-secondary text-sm font-bold text-npf-blue ring-1 ring-npf-ink/10 transition-[background-color,color,box-shadow,scale] duration-200 ring-inset group-hover:bg-npf-blue group-hover:text-white group-hover:ring-npf-blue group-active:scale-95">
                      <PhoneCallIcon className="size-4" />
                      {t("Call")}
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
              className="border-b border-npf-ink/10 py-4 last:border-none md:border-none md:py-0"
            >
              <h2 className="font-secondary font-bold text-npf-ink md:mb-5">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : col.heading)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between text-start md:pointer-events-none"
                >
                  {col.heading}
                  <ChevronDown
                    className={`size-5 transition-transform duration-300 md:hidden ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </h2>
              {/* `invisible` takes a closed list out of the tab order on
                  phones; from md up the links always show. */}
              <ul
                className={`space-y-3 overflow-hidden transition-all duration-300 md:visible md:max-h-none md:pt-0 md:opacity-100 ${
                  isOpen
                    ? "max-h-[420px] pt-4 opacity-100"
                    : "invisible max-h-0 opacity-0"
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
                          <ArrowUpRight className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
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
        <div className="grid gap-6 rounded-2xl bg-npf-blue/[0.045] p-6 md:p-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <h2
              id="footer-newsletter"
              className="mb-2 font-secondary text-2xl font-bold tracking-[-0.01em] text-balance text-npf-ink"
            >
              {t("Subscribe to our Newsletter")}
            </h2>
            <p className="text-pretty">
              {t("Stay updated with the latest news and announcements.")}
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
                className="h-14 w-full rounded-full border border-npf-ink/15 bg-white ps-6 pe-36 text-npf-ink caret-npf-blue transition-[border-color,box-shadow] placeholder:text-npf-muted hover:border-npf-ink/30 focus:border-npf-blue focus:shadow-[0_0_0_4px_rgba(27,63,122,0.12)] focus:outline-none"
              />
              <button
                type="submit"
                className="absolute inset-y-1.5 end-1.5 rounded-full bg-npf-blue px-6 font-secondary font-bold text-white transition-[background-color,scale] duration-200 hover:bg-npf-blue-deep active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-npf-blue"
              >
                {t("Subscribe")}
              </button>
            </div>
            <p
              aria-live="polite"
              className="mt-2 min-h-5 ps-6 text-sm text-npf-ok"
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
                className="grid size-11 place-items-center rounded-full text-npf-ink ring-1 ring-npf-ink/12 ring-inset transition-[background-color,color,box-shadow] duration-200 hover:bg-npf-blue hover:text-white hover:ring-npf-blue"
              >
                <SocialIcon name={name} className="size-5" />
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {storeBadges.map((badge) => (
              <a
                key={badge.label}
                href="https://fct.npf.gov.ng/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg transition-[opacity,translate] duration-200 hover:-translate-y-0.5 hover:opacity-90"
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
        </div>
      </div>

      {/* Legal */}
      <div className="npf-container flex flex-col gap-6 border-t border-npf-ink/10 pt-8 pb-12 text-sm text-npf-muted lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <div className="space-y-2">
          <p className="font-medium text-npf-ink">
            {t("© {year} FCT Police Command Headquarters. All Rights Reserved", {
              year: process.env.NEXT_PUBLIC_BUILD_YEAR ?? "",
            })}
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <span>
              {t("This site is monitored and maintained by Nigeria Police Force.")}
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
