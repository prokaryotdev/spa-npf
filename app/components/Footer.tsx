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
import { ArrowUpRight, ChevronDown, PhoneIcon, SocialIcon } from "./icons";
import { PoliceWordmark } from "./Wordmark";
import { useT, useLocalized, useFormat } from "../i18n/client";

const socials = ["Facebook", "Youtube", "Twitter", "Instagram"] as const;

/*
 * The page closes on plain white, a clean break from the blue app band above,
 * with the Force's blue and the alarm red left to carry the brand. 112 leads because it is the one
 * thing on the page someone may need in a hurry; the other lines sit beside
 * it at a quieter size.
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
    <footer
      id="staticFooter"
      className="w-full bg-white pb-12 text-npf-body"
    >
      {/* Emergency */}
      <section
        aria-labelledby="footer-emergency"
        className="npf-container grid gap-10 border-b border-npf-ink/10 pt-16 pb-14 md:pt-24 lg:grid-cols-12 lg:items-end lg:gap-12"
      >
        <div className="lg:col-span-6">
          <h2
            id="footer-emergency"
            className="mb-8 font-secondary text-3xl font-bold tracking-[-0.02em] text-npf-ink md:text-4xl"
          >
            {t("Emergency Numbers")}
          </h2>
          <a
            href={`tel:${lead.number}`}
            className="group flex items-center gap-5 rounded-[28px] md:gap-7"
          >
            <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#b30900] text-white transition-transform duration-300 ease-[var(--ease-custom)] group-hover:scale-105 group-active:scale-95 md:size-20">
              <PhoneIcon className="size-7 md:size-9" />
            </span>
            <span className="font-secondary text-[clamp(4.5rem,3rem+6vw,8rem)] leading-[0.9] font-bold tracking-[-0.03em] text-[#b30900] tabular-nums">
              {lead.number}
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-secondary text-lg font-bold text-npf-ink">
                {lead.label}
              </span>
              {lead.note ? (
                <span className="text-sm text-npf-muted">{lead.note}</span>
              ) : null}
            </span>
          </a>
        </div>

        <ul className="grid grid-cols-3 divide-x divide-npf-ink/10 border-t border-npf-ink/10 pt-6 lg:col-span-6 lg:border-t-0 lg:pt-0 rtl:divide-x-reverse">
          {others.map((item) => (
            <li key={item.number} className="px-3 first:ps-0 md:px-6">
              <a
                href={`tel:${item.number}`}
                className="group flex flex-col gap-1"
              >
                <span className="font-secondary text-[13px] font-bold whitespace-nowrap text-npf-muted transition-colors group-hover:text-npf-blue md:text-sm">
                  {item.label}
                </span>
                <span className="font-secondary text-4xl font-bold tracking-[-0.02em] text-npf-ink tabular-nums transition-colors group-hover:text-npf-blue md:text-5xl">
                  {item.number}
                </span>
                <span className="min-h-5 text-sm text-npf-muted">
                  {item.note}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Brand and newsletter */}
      <div className="npf-container grid gap-8 border-b border-npf-ink/10 py-12 md:py-14 lg:grid-cols-12 lg:items-center lg:gap-12">
        <span
          role="img"
          aria-label={t("Nigeria Police Force")}
          className="text-npf-blue lg:col-span-4"
        >
          <PoliceWordmark className="h-14 w-auto md:h-16" />
        </span>
        <div className="lg:col-span-3">
          <h2
            id="footer-newsletter"
            className="mb-1 font-secondary text-lg font-bold text-npf-ink"
          >
            {t("Subscribe to our Newsletter")}
          </h2>
          <p className="text-sm">
            {t("Stay updated with the latest news and announcements.")}
          </p>
        </div>
        {/* ponytail: no mailing-list backend, so this confirms and stops. */}
        <form
          className="lg:col-span-5"
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
              className="h-14 w-full rounded-full border border-npf-ink/15 bg-npf-blue/[0.03] ps-6 pe-40 text-npf-ink caret-npf-blue transition-colors placeholder:text-npf-muted hover:border-npf-ink/30 focus:border-npf-blue focus:outline-none"
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

      {/* Link columns */}
      <nav
        aria-label={t("Site Map")}
        className="npf-container grid py-6 md:grid-cols-3 md:gap-x-10 md:gap-y-12 md:py-16 xl:grid-cols-[1.35fr_1fr_0.85fr_1.15fr_1.15fr]"
      >
        {footerColumns.map((col) => {
          const isOpen = open === col.heading;
          return (
            <div
              key={col.heading}
              className="border-b border-npf-ink/10 py-4 md:border-none md:py-0"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : col.heading)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between text-start md:pointer-events-none"
              >
                <h2 className="font-secondary font-bold text-npf-ink md:mb-5">
                  {col.heading}
                </h2>
                <ChevronDown
                  className={`size-5 transition-transform duration-300 md:hidden ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <ul
                className={`space-y-3 overflow-hidden transition-all duration-300 md:max-h-none md:pt-0 md:opacity-100 ${
                  isOpen
                    ? "max-h-[420px] pt-4 opacity-100"
                    : "max-h-0 opacity-0"
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
                        className="group inline-flex items-center gap-1.5 underline-offset-4 transition-colors hover:text-npf-blue hover:underline decoration-npf-gold"
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

      {/* Legal */}
      <div className="npf-container grid gap-8 border-t border-npf-ink/10 pt-8 text-sm text-npf-muted lg:grid-cols-2">
        <div className="space-y-1">
          <p className="text-npf-body">
            {t("© {year} FCT Police Command Headquarters. All Rights Reserved", {
              year: process.env.NEXT_PUBLIC_BUILD_YEAR ?? "",
            })}
          </p>
          <p>
            {t("This site is monitored and maintained by Nigeria Police Force.")}
          </p>
          {/* The line this replaces named IE11 first. Microsoft retired it
              in 2022, and this site uses CSS it could never have rendered,
              so the advice was both stale and wrong. */}
          <p>
            {t(
              "The site is best viewed in a current version of Chrome, Safari, Edge or Firefox",
            )}
          </p>
          <p>
            {t("Last modified Date: {date}", {
              date: format.date(process.env.NEXT_PUBLIC_BUILD_DATE ?? ""),
            })}
          </p>
        </div>
        <div className="flex flex-col gap-6 lg:items-end">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="underline-offset-4 transition-colors hover:text-npf-blue hover:underline decoration-npf-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5 lg:justify-end">
            <div className="flex gap-2">
              {socials.map((name) => (
                <a
                  key={name}
                  href="https://fct.npf.gov.ng/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="grid size-10 place-items-center rounded-full text-npf-muted transition-colors hover:bg-npf-blue/[0.06] hover:text-npf-blue"
                >
                  <SocialIcon name={name} className="size-5" />
                </a>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {storeBadges.map((badge) => (
                <a
                  key={badge.label}
                  href="https://fct.npf.gov.ng/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg transition-opacity hover:opacity-80"
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
      </div>
    </footer>
  );
}
