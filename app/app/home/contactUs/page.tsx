import type { Metadata } from "next";
import Link from "../../../i18n/Link";
import EmergencyLines from "../../../components/EmergencyLines";
import FeedbackForm from "../../../components/FeedbackForm";
import { PageShell } from "../../../components/PageShell";
import {
  AccessibilityIcon,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ClockIcon,
  InboxIcon,
  PhoneCallIcon,
  PinIcon,
  ShieldIcon,
} from "../../../components/icons";
import {
  contactUs as contactUsSource,
  forceHeadquarters,
} from "../../../content-footer";
import { complaintLines } from "../../../content-report";
import { getT, getLocalized } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Contact Us | Nigeria Police Force"),
    description: t(contactUsSource.intro),
  };
}

/** "0805 700 0001" → "+2348057000001", for tel: and wa.me links. */
const intl = (n: string) => "+234" + n.replace(/\s/g, "").replace(/^0/, "");

/**
 * Most people who open Contact Us want something another page does faster.
 * Each tile is one need and the door for it; the form is below.
 */
const DESKS = [
  {
    need: "Report a crime that is not happening now",
    desk: "Report a Crime",
    note: "No account needed",
    href: "/app/report",
  },
  {
    need: "Complain about how an officer behaved",
    desk: "Complaint Response Unit",
    href: "/app/services/leaders-at-your-service",
  },
  {
    need: "Follow up on a report or an application",
    desk: "Track a Reference",
    href: "/app/track",
  },
  {
    need: "Give information about a wanted or missing person",
    desk: "Appeals",
    href: "/app/appeals",
  },
  {
    need: "Check that a police document is genuine",
    desk: "Verify a Police Document",
    href: "/app/verify",
  },
  {
    need: "Visit a police command in person",
    desk: "Customer Centers",
    href: "/app/home/customer-centers",
  },
];

/** A row in the rail's cards: icon, the line itself, what it does. */
const row =
  "npf-row-link group flex items-center gap-4 px-5 py-3.5 hover:bg-npf-mist focus-visible:-outline-offset-2 md:px-6";

export default async function ContactUsPage() {
  const contactUs = await getLocalized(contactUsSource);
  const t = await getT();
  const sign = contactUs.reach.signLanguage;

  return (
    <PageShell
      title={t("Contact Us")}
      intro={contactUs.intro}
      // The numbers are the reason most people came: start them high.
      compact
      showEmergency={false}
      lead={
        // The site's own emergency block, moved from the foot of the page to
        // its head: here the numbers are the reason someone came.
        <div className="mt-8 md:mt-10">
          <h2 className="sr-only">{t("Emergency Numbers")}</h2>
          <EmergencyLines />

          {/* Someone who can't make a voice call needs a way in that isn't a
              number. The service names no channel of its own yet, so the row
              points at the two written doors that do exist. */}
          <section
            aria-labelledby="sign"
            className="mt-(--npf-gap) flex flex-wrap items-center gap-x-6 gap-y-4 rounded-tile bg-npf-mist px-5 py-5 md:px-6"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-npf-blue-ink ring-1 ring-npf-hairline ring-inset max-sm:hidden">
              <AccessibilityIcon className="size-5.5" />
            </span>
            <div className="min-w-0 flex-1 basis-[22rem]">
              <h2 id="sign" className="npf-h5 flex items-center gap-2.5 text-npf-ink">
                {/* On a phone the disc would sit alone on its own line. */}
                <AccessibilityIcon className="size-5 shrink-0 text-npf-blue-ink sm:hidden" />
                {sign.title}
              </h2>
              <p className="npf-small mt-1 text-npf-body">
                {sign.subTitle}{" "}
                <span className="font-medium text-npf-ink">
                  {t("Can't make a call? Write to us instead.")}
                </span>
              </p>
            </div>
            {/* The site's own buttons, not a lighter pill: these are the
                way in for someone who can't call. Writing here leads, as the
                page's own form is the nearest door. */}
            <div className="flex flex-wrap gap-3 max-sm:w-full max-sm:flex-col">
              <a href="#feedback" className="npf-btn npf-btn-primary group/b">
                {t("Write to us below")}
                <span className="npf-btn-disc">
                  <ArrowDown className="size-4 transition-transform duration-(--dur-hover) group-hover/b:translate-y-0.5" />
                </span>
              </a>
              <Link href="/app/report" className="npf-btn npf-btn-secondary">
                {t("Report a Crime")}
                <span className="npf-btn-disc">
                  <ArrowRight className="npf-arrow size-4 rtl:-scale-x-100" />
                </span>
              </Link>
            </div>
          </section>
        </div>
      }
    >
      {/* Not an emergency: six doors in one hairline frame. The need is what
          people scan for, so it leads; the desk is where it goes. */}
      <section aria-labelledby="desks" className="bg-white pb-16 lg:pb-20">
        <div className="npf-container">
          <h2 id="desks" className="npf-h3 text-npf-blue-deep">
            {t("Find the right desk")}
          </h2>
          <p className="npf-body mt-3 max-w-[62ch] text-npf-body">
            {t(
              "Most questions have a faster answer than a message. Pick what you need.",
            )}
          </p>

          <ul className="mt-8 grid gap-px overflow-hidden rounded-card border border-npf-line bg-npf-line sm:grid-cols-2 lg:grid-cols-3">
            {DESKS.map((d) => (
              <li key={d.href} className="bg-white">
                <Link
                  href={d.href}
                  className="npf-row-link group flex h-full flex-col justify-between gap-2 px-5 py-4 hover:bg-npf-mist focus-visible:-outline-offset-4 active:bg-npf-cloud sm:gap-5 md:p-6"
                >
                  <span className="font-secondary text-base leading-snug font-semibold text-pretty text-npf-ink sm:text-lg">
                    {t(d.need)}
                  </span>
                  {/* On a phone the six doors are a list: the rule would
                      double every row's height for no gain. */}
                  <span className="flex items-center justify-between gap-4 sm:border-t sm:border-npf-hairline sm:pt-4">
                    <span className="npf-body min-w-0 font-medium text-npf-blue transition-colors group-hover:text-npf-blue-deep">
                      {t(d.desk)}
                      {d.note ? (
                        <span className="npf-small ms-2 font-normal text-npf-steel">
                          {t(d.note)}
                        </span>
                      ) : null}
                    </span>
                    <ArrowRight className="npf-go" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="feedback-h"
        className="border-t border-npf-hairline bg-npf-cloud py-16 lg:py-20"
      >
        <div className="npf-container">
          <h2 id="feedback-h" className="npf-h3 text-npf-blue-deep">
            {contactUs.feedback.title}
          </h2>
          <p className="npf-body mt-3 max-w-[62ch] text-npf-body">
            {contactUs.feedback.subTitle}
          </p>

          <div className="grid gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:gap-x-12">
            <div id="feedback" className="min-w-0 scroll-mt-28 max-lg:order-2">
              <FeedbackForm
                kinds={contactUs.feedback.kinds}
                notice={contactUs.feedback.description}
              />
            </div>

            {/* Beside the form: the complaint unit's own lines, then where
                the Force is. On a phone they come first, ahead of a long form. */}
            <aside className="flex flex-col gap-6 max-lg:contents lg:top-28 lg:mt-6 lg:self-start lg:[@media(min-height:46rem)]:sticky">
              <section
                aria-labelledby="cru"
                className="npf-panel max-lg:order-1 max-lg:mt-6"
              >
                <div className="p-5 md:p-6">
                  <h3
                    id="cru"
                    className="npf-h5 flex items-center gap-2.5 text-npf-blue-deep"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-npf-blue text-npf-gold-soft">
                      <ShieldIcon className="size-4.5" />
                    </span>
                    {contactUs.leaders.titleMain}
                  </h3>
                  <p className="npf-small mt-3 text-npf-body">
                    {contactUs.leaders.description}
                  </p>
                </div>
                <ul className="divide-y divide-npf-hairline border-y border-npf-hairline">
                  {complaintLines.calls.map((n) => (
                    <li key={n}>
                      <a href={`tel:${intl(n)}`} className={row}>
                        <PhoneCallIcon className="size-5 shrink-0 text-npf-blue-ink" />
                        <span className="font-secondary flex-1 text-lg font-bold text-npf-ink tabular-nums transition-colors group-hover:text-npf-blue">
                          {n}
                        </span>
                        <span className="npf-small text-npf-steel">
                          {t("Call")}
                        </span>
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href={`https://wa.me/${intl(complaintLines.whatsapp).slice(1)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={row}
                    >
                      <InboxIcon className="size-5 shrink-0 text-npf-blue-ink" />
                      <span className="font-secondary flex-1 text-lg font-bold text-npf-ink tabular-nums transition-colors group-hover:text-npf-blue">
                        {complaintLines.whatsapp}
                      </span>
                      <span className="npf-small text-npf-steel">WhatsApp</span>
                      <span className="sr-only">
                        {t("(opens in a new window)")}
                      </span>
                    </a>
                  </li>
                </ul>
                <div className="p-5 md:p-6">
                  <Link
                    href="/app/services/leaders-at-your-service"
                    className="npf-btn npf-btn-primary w-full"
                  >
                    {t("Report a Police Officer")}
                    <span className="npf-btn-disc">
                      <ArrowRight className="npf-arrow size-4 rtl:-scale-x-100" />
                    </span>
                  </Link>
                </div>
              </section>

              {/* Where the Force is: the headquarters in full, never
                  truncated, and its mailbox. */}
              <section
                aria-labelledby="visit"
                className="npf-panel max-lg:order-3"
              >
                <h3
                  id="visit"
                  className="npf-h5 px-5 pt-5 text-npf-blue-deep md:px-6 md:pt-6"
                >
                  {t("Write or visit")}
                </h3>
                <address className="px-5 pt-3 pb-5 not-italic md:px-6">
                  <p className="npf-body text-npf-ink">
                    <span>
                      <span className="block font-semibold">
                        {t(forceHeadquarters.name)}
                      </span>
                      <span className="npf-small mt-0.5 block text-npf-body">
                        {forceHeadquarters.address}
                      </span>
                      <span className="npf-small mt-1 flex items-center gap-1.5 text-npf-steel">
                        <ClockIcon className="size-3.5 shrink-0" />
                        {t("Open: {hours}", { hours: t("24 hours") })}
                      </span>
                    </span>
                  </p>
                </address>
                <ul className="divide-y divide-npf-hairline border-t border-npf-hairline">
                  <li>
                    <a
                      href={forceHeadquarters.map}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={row}
                    >
                      <PinIcon className="size-5 shrink-0 text-npf-blue-ink" />
                      <span className="npf-body flex-1 font-semibold text-npf-ink transition-colors group-hover:text-npf-blue">
                        {t("Open in Maps")}
                      </span>
                      <ArrowUpRight className="npf-go" />
                      <span className="sr-only">
                        {t("(opens in a new window)")}
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href="mailto:mail@npf.gov.ng" className={row}>
                      <InboxIcon className="size-5 shrink-0 text-npf-blue-ink" />
                      <span className="npf-body min-w-0 flex-1 truncate font-semibold text-npf-ink transition-colors group-hover:text-npf-blue">
                        mail@npf.gov.ng
                      </span>
                      <span className="npf-small text-npf-steel">
                        {t("Email")}
                      </span>
                    </a>
                  </li>
                </ul>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
