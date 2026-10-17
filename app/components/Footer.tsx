"use client";

import Image from "next/image";
import Link from "../i18n/Link";
import { useState } from "react";
import {
  footerColumns as footerColumnsSource,
  legalLinks as legalLinksSource,
  storeBadges as storeBadgesSource,
} from "../content";
import {
  ArrowRight,
  ArrowUpRight,
  CheckIcon,
  ArrowDown,
  InboxIcon,
  SocialIcon,
} from "./icons";
import EmergencyLines from "./EmergencyLines";
import { PoliceWordmark } from "./Wordmark";
import { useT, useLocalized } from "../i18n/client";

const socials = ["Facebook", "Youtube", "Twitter", "Instagram"] as const;

// Module-level so React sees one stable ref and focuses only on mount.
const focusOnMount = (el: HTMLElement | null) => el?.focus();

/*
 * The page closes on plain white, a clean break from the blue app band above,
 * with the Force's blue and the alarm red left to carry the brand. 112 leads
 * because it is the one thing on the page someone may need in a hurry; the
 * other lines sit beside it as a quieter directory. Then the site map, the
 * newsletter on a faint blue ground, and a sign-off with crest and legal.
 *
 * `showApps` drops the store badges where the page above already offers
 * them (the homepage's app band); `showEmergency` drops the numbers where the
 * page above is the directory itself (Contact Us).
 */
export default function Footer({
  showApps = true,
  showEmergency = true,
}: {
  showApps?: boolean;
  showEmergency?: boolean;
}) {
  const footerColumns = useLocalized(footerColumnsSource);
  const legalLinks = useLocalized(legalLinksSource);
  const storeBadges = useLocalized(storeBadgesSource);
  const t = useT();
  const [open, setOpen] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer id="staticFooter" className="w-full bg-white text-npf-body print:hidden">
      {/* Emergency. Nearly every page ends on white, so the numbers get
          their own full-width band on the homepage community chapter's sand,
          ruled in gold top and bottom: the page plainly ends here, and the
          white cards and the red 112 card stand off the warm ground. */}
      {showEmergency ? (
      <section
        aria-labelledby="footer-emergency"
        className="border-y border-npf-gold/20 bg-npf-sand py-16 lg:py-20"
      >
        <div className="npf-container">
          <h2 id="footer-emergency" className="npf-h3 mb-8 text-npf-ink">
            {t("Emergency Numbers")}
          </h2>
          <EmergencyLines />
        </div>
      </section>
      ) : null}

      {/* Link columns. Under the band the change of ground is the break;
          without it, a hairline. */}
      <nav
        aria-label={t("Site Map")}
        className={`npf-container grid py-6 md:grid-cols-3 md:gap-x-10 md:gap-y-12 md:py-16 xl:grid-cols-[1.35fr_1fr_0.85fr_1.15fr_1.15fr] ${
          showEmergency ? "" : "border-t border-npf-hairline"
        }`}
      >
        {footerColumns.map((col) => {
          const isOpen = open === col.heading;
          return (
            <div
              key={col.heading}
              className="border-b border-npf-hairline py-2 last:border-none md:border-none md:py-0"
            >
              <h2 className="npf-h5 text-npf-ink md:mb-5">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : col.heading)}
                  aria-expanded={isOpen}
                  className="flex min-h-11 w-full items-center justify-between text-start md:pointer-events-none md:min-h-0"
                >
                  {col.heading}
                  <ArrowDown
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
                  // Inline, not flex, with the last word and the arrow in one
                  // nowrap span: a label that wraps keeps its arrow after the
                  // last word instead of out at the column's edge.
                  const cut = external ? link.label.lastIndexOf(" ") + 1 : 0;
                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="group decoration-npf-gold underline-offset-4 transition-colors hover:text-npf-blue hover:underline"
                      >
                        {external ? link.label.slice(0, cut) : link.label}
                        {external ? (
                          <span className="whitespace-nowrap">
                            {link.label.slice(cut)}
                            <ArrowUpRight className="ms-1.5 inline size-4 align-[-0.15em] transition-[translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" />
                          </span>
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

      {/* Newsletter on a faint blue ground, a soft white light in the far
          corner so the mist has some depth instead of lying flat. */}
      <div className="npf-container">
        <div className="grid gap-7 rounded-tile bg-npf-mist bg-[radial-gradient(55%_130%_at_100%_0%,rgb(255_255_255/0.85),transparent_70%)] p-(--npf-pad) ring-1 ring-npf-blue/8 ring-inset lg:grid-cols-[1fr_minmax(0,30rem)] lg:items-center lg:gap-16">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-npf-blue shadow-card">
              <InboxIcon className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="footer-newsletter" className="npf-h4 mb-1.5 text-npf-ink">
                {t("Get news from the Force")}
              </h2>
              <p className="npf-body">
                {t(
                  "Announcements, safety advice and events, sent to your inbox.",
                )}
              </p>
            </div>
          </div>
          {/* ponytail: no mailing-list backend, so this confirms and stops.
              The confirmation takes the form's place and takes focus, so
              the button vanishing never drops keyboard users on <body>. */}
          {subscribed ? (
            <p
              ref={focusOnMount}
              tabIndex={-1}
              role="status"
              className="npf-h5 flex min-h-15 items-center gap-3 rounded-full bg-npf-ok-soft py-2 ps-2 pe-6 text-npf-ok ring-1 ring-npf-ok/15 ring-inset outline-none motion-safe:animate-[reveal-up_var(--dur-reveal)_var(--ease-out)]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-npf-ok text-white">
                <CheckIcon className="size-5" />
              </span>
              {t("Thanks, you are on the list.")}
            </p>
          ) : (
            <form
              aria-labelledby="footer-newsletter"
              className="flex flex-col gap-3 sm:relative"
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
            >
              <label htmlFor="subscribeEmail" className="sr-only">
                {t("Email address")}
              </label>
              <input
                id="subscribeEmail"
                type="email"
                required
                autoComplete="email"
                placeholder={t("Email address")}
                className="h-15 w-full rounded-full border border-npf-ink/15 bg-white px-6 text-npf-ink caret-npf-blue transition-[border-color,box-shadow] placeholder:text-npf-muted hover:border-npf-ink/30 focus:border-npf-blue focus:ring-4 focus:ring-npf-blue/12 focus:outline-none user-invalid:border-npf-alert user-invalid:ring-4 user-invalid:ring-npf-alert/10 sm:pe-48"
              />
              <button
                type="submit"
                className="npf-btn npf-btn-primary sm:absolute sm:end-1.5 sm:top-1.5"
              >
                {t("Subscribe")}
                <span className="npf-btn-disc">
                  <ArrowRight className="npf-arrow size-4.5 rtl:-scale-x-100" />
                </span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Sign-off: the crest with its builder's credit, and where to follow
          us. Wraps rather than squeezes: when a long translation leaves no
          room, the socials drop under the crest. */}
      <div className="npf-container flex flex-wrap items-center justify-between gap-x-12 gap-y-8 pt-14 pb-10">
        {/* The credit sits beside the crest, split off by a short hairline,
            and is built the same way at a smaller size: the builder's mark,
            then two lines. Smaller, so the Force's crest still leads. */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <span
            role="img"
            aria-label={t("Nigeria Police Force")}
            className="text-npf-blue"
          >
            <PoliceWordmark className="h-14 w-auto md:h-16" />
          </span>
          {/* On a phone the credit wraps under the crest, so the rule goes. */}
          <span aria-hidden className="hidden h-10 w-px bg-npf-hairline sm:block" />
          <a
            href="https://www.cloudbrella.ng/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex shrink-0 items-center gap-3"
          >
            <Image
              src="/brand/cloudbrella-mark.png"
              alt=""
              width={173}
              height={160}
              className="h-10 w-auto"
            />
            <span className="flex flex-col">
              <span className="npf-small text-npf-muted">{t("Built by")}</span>
              <span className="inline-flex items-center gap-1 font-secondary text-base leading-tight font-bold text-npf-blue-deep decoration-npf-gold underline-offset-4 transition-colors group-hover:text-npf-blue group-hover:underline">
                Cloudbrella
                <ArrowUpRight className="size-3.5 shrink-0 transition-[translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" />
              </span>
            </span>
            <span className="sr-only"> {t("(opens in a new window)")}</span>
          </a>
        </div>
        {/* Where to follow us, on its own at the far edge. */}
        <div className="flex gap-2">
          {socials.map((name) => (
            // ponytail: home until the real profiles are known.
            <Link
              key={name}
              href="/"
              aria-label={name}
              className="npf-icon-btn"
            >
              <SocialIcon name={name} className="size-5" />
            </Link>
          ))}
        </div>
      </div>

      {/* Legal: the copyright over its links on one edge, the store badges
          closing the page on the other. */}
      <div className="npf-small npf-container flex flex-wrap items-center justify-between gap-x-12 gap-y-6 border-t border-npf-hairline pt-8 pb-12 text-npf-muted">
        <div className="flex flex-col gap-3">
          <p className="font-medium text-npf-ink">
            {t("© {year} Nigeria Police Force. All Rights Reserved", {
              year: process.env.NEXT_PUBLIC_BUILD_YEAR ?? "",
            })}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
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
        {showApps ? (
          <div className="flex flex-wrap gap-2.5">
            {storeBadges.map((badge) => (
              // ponytail: home until the store listings exist.
              <Link
                key={badge.label}
                href="/"
                className="rounded-chip transition-[translate] hover:-translate-y-0.5"
              >
                <Image
                  src={badge.src}
                  alt={badge.label}
                  width={badge.width}
                  height={40}
                />
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
