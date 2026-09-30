import type { Metadata } from "next";
import Link from "../../../i18n/Link";
import FeedbackForm from "../../../components/FeedbackForm";
import { PageShell } from "../../../components/PageShell";
import {
  AccessibilityIcon,
  ArrowRight,
  InboxIcon,
  PhoneCallIcon,
  PinIcon,
  ShieldIcon,
} from "../../../components/icons";
import { contactUs as contactUsSource } from "../../../content-footer";
import { getT, getLocalized } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Contact Us | Nigeria Police Force"),
    description: t(contactUsSource.intro),
  };
}

export default async function ContactUsPage() {
  const contactUs = await getLocalized(contactUsSource);
  const t = await getT();
  return (
    <PageShell title={t("Contact Us")} intro={contactUs.intro}>
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 lg:max-w-[46rem]">
            <section aria-labelledby="reach">
              <h2 id="reach" className="npf-h3 text-npf-blue-deep">
                {contactUs.reach.title}
              </h2>
              <p className="npf-body mt-3 max-w-[62ch] text-npf-body">
                {contactUs.reach.description}
              </p>

              {/* The lines, one ruled card: each number is the link. The
                  first is 112, and wears its red. */}
              <ul className="mt-6 divide-y divide-npf-hairline overflow-hidden rounded-card border border-npf-hairline bg-white">
                {contactUs.reach.lines.map((line, i) => {
                  const alarm = i === 0;
                  return (
                    <li key={line.number}>
                      <a
                        href={`tel:${line.number}`}
                        className="npf-row-link group flex items-center gap-4 px-5 py-5"
                      >
                        <span
                          className={`grid size-12 shrink-0 place-items-center rounded-full ${
                            alarm
                              ? "bg-npf-alert text-white"
                              : "bg-npf-cloud text-npf-blue-ink"
                          }`}
                        >
                          <PhoneCallIcon className="size-5.5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="npf-small block font-medium text-npf-steel">
                            {line.title}
                          </span>
                          <span
                            className={`npf-h3 block tabular-nums ${
                              alarm ? "text-npf-alert" : "text-npf-blue-deep"
                            }`}
                          >
                            {line.number}
                          </span>
                          <span className="npf-small mt-1 block text-npf-body">
                            {line.description}
                          </span>
                        </span>
                        <span
                          className={`npf-btn npf-btn-sm max-sm:hidden ${
                            alarm ? "npf-btn-alert" : "npf-btn-secondary"
                          }`}
                        >
                          {t("Call {n}", { n: line.number })}
                        </span>
                      </a>
                    </li>
                  );
                })}
                <li className="flex items-start gap-4 bg-npf-paper px-5 py-5">
                  <span className="npf-disc size-12 bg-white">
                    <AccessibilityIcon className="size-5.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="npf-h5 block text-npf-ink">
                      {contactUs.reach.signLanguage.title}
                    </span>
                    <span className="npf-body mt-1 block text-npf-body">
                      {contactUs.reach.signLanguage.subTitle}
                    </span>
                    <span className="npf-small mt-1 block text-npf-steel">
                      {contactUs.reach.signLanguage.description}
                    </span>
                  </span>
                </li>
              </ul>
            </section>

            <section
              aria-labelledby="feedback"
              className="mt-12 border-t border-npf-hairline pt-12"
            >
              <h2 id="feedback" className="npf-h3 text-npf-blue-deep">
                {contactUs.feedback.title}
              </h2>
              <p className="npf-body mt-3 max-w-[62ch] text-npf-body">
                {contactUs.feedback.subTitle}
              </p>
              <FeedbackForm
                kinds={contactUs.feedback.kinds}
                notice={contactUs.feedback.description}
              />
            </section>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            {/* The leadership line, raised like the service page's action. */}
            <div className="rounded-card bg-white p-6 shadow-card ring-1 ring-npf-hairline ring-inset">
              <span className="grid size-12 place-items-center rounded-full bg-npf-blue text-npf-gold-soft">
                <ShieldIcon className="size-6" />
              </span>
              <h2 className="npf-h4 mt-5 text-npf-blue-deep">
                {contactUs.leaders.titleMain}
              </h2>
              <p className="npf-small mt-2 text-npf-body">
                {contactUs.leaders.description}
              </p>
              <Link
                href="/app/services/leaders-at-your-service"
                className="npf-btn npf-btn-primary mt-6 w-full"
              >
                {t("Leaders at Your Service")}
                <span className="npf-btn-disc">
                  <ArrowRight className="npf-arrow size-4 rtl:-scale-x-100" />
                </span>
              </Link>
            </div>

            <div className="overflow-hidden rounded-card border border-npf-hairline">
              <h2 className="npf-h5 border-b border-npf-hairline bg-npf-mist px-5 py-3.5 text-npf-blue-deep">
                {t("Other ways to reach us")}
              </h2>
              <ul className="divide-y divide-npf-hairline">
                <li>
                  <a
                    href="tel:+2348057000001"
                    className="npf-row-link flex min-h-14 items-center gap-3.5 px-5 py-3"
                  >
                    <span className="npf-disc size-9">
                      <PhoneCallIcon className="size-4.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="npf-small block font-medium text-npf-ink">
                        {t("Complaint Response Unit")}
                      </span>
                      <span className="npf-small block text-npf-blue tabular-nums">
                        0805 700 0001
                      </span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:mail@npf.gov.ng"
                    className="npf-row-link flex min-h-14 items-center gap-3.5 px-5 py-3"
                  >
                    <span className="npf-disc size-9">
                      <InboxIcon className="size-4.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="npf-small block font-medium text-npf-ink">
                        {t("Email")}
                      </span>
                      <span className="npf-small block truncate text-npf-blue">
                        mail@npf.gov.ng
                      </span>
                    </span>
                  </a>
                </li>
                <li>
                  <Link
                    href="/app/home/customer-centers"
                    className="npf-row-link flex min-h-14 items-center gap-3.5 px-5 py-3"
                  >
                    <span className="npf-disc size-9">
                      <PinIcon className="size-4.5" />
                    </span>
                    <span className="npf-small min-w-0 flex-1 font-medium text-npf-ink">
                      {t("Customer Centers")}
                    </span>
                    <ArrowRight className="npf-go size-4" />
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
