import type { Metadata } from "next";
import Link from "../../../i18n/Link";
import FeedbackForm from "../../../components/FeedbackForm";
import { PageShell } from "../../../components/PageShell";
import { ArrowRight, PhoneIcon } from "../../../components/icons";
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
      <section className="bg-white pb-16">
        <div className="npf-container">
          <h2 className="font-secondary text-2xl font-bold text-npf-blue-deep md:text-3xl">
            {contactUs.reach.title}
          </h2>
          <p className="mt-3 max-w-[70ch] text-base text-npf-body">
            {contactUs.reach.description}
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {contactUs.reach.lines.map((line) => (
              <div
                key={line.number}
                className="flex items-center gap-5 rounded-3xl bg-[#F4F6FA] p-6"
              >
                <span className="rounded-2xl bg-white p-4 text-npf-blue-ink">
                  <PhoneIcon className="size-8" />
                </span>
                <div className="min-w-0">
                  <p className="font-secondary text-sm font-bold text-npf-ink">
                    {line.title}
                  </p>
                  <a
                    href={`tel:${line.number}`}
                    className="font-secondary text-4xl font-bold tabular-nums text-npf-blue-deep transition-opacity hover:opacity-80"
                  >
                    {line.number}
                  </a>
                  <p className="mt-1 text-sm text-npf-body">
                    {line.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-black/5">
            <h3 className="font-secondary text-lg font-bold text-npf-blue-deep">
              {contactUs.reach.signLanguage.title}
            </h3>
            <p className="mt-2 max-w-[70ch] text-base text-npf-body">
              {contactUs.reach.signLanguage.subTitle}
            </p>
            <p className="mt-1 max-w-[70ch] text-sm text-npf-muted">
              {contactUs.reach.signLanguage.description}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white pb-16">
        <div className="npf-container">
          <h2 className="font-secondary text-2xl font-bold text-npf-blue-deep md:text-3xl">
            {contactUs.feedback.title}
          </h2>
          <p className="mt-3 max-w-[70ch] text-base text-npf-body">
            {contactUs.feedback.subTitle}
          </p>

          <FeedbackForm
            kinds={contactUs.feedback.kinds}
            notice={contactUs.feedback.description}
          />
        </div>
      </section>

      <section className="bg-white pb-24">
        <div className="npf-container rounded-3xl bg-[#F4F6FA] p-8 md:p-12">
          <p className="font-secondary text-sm font-bold tracking-wide text-npf-blue-ink uppercase">
            {contactUs.leaders.title}
          </p>
          <h2 className="mt-2 font-secondary text-2xl font-bold text-npf-blue-deep md:text-3xl">
            {contactUs.leaders.titleMain}
          </h2>
          <p className="mt-3 max-w-[70ch] text-base text-npf-body">
            {contactUs.leaders.description}
          </p>
          <Link
            href="/app/services/leaders-at-your-service"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-npf-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-npf-blue-mid"
          >
            {t("Leaders at Your Service")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
