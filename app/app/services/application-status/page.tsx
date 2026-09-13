import type { Metadata } from "next";
import { PageShell } from "../../../components/PageShell";
import { ArrowRight, UserCircle } from "../../../components/icons";
import { applicationStatus as svc } from "../../../content-pages";

export const metadata: Metadata = {
  title: "Application Status | Dubai Police",
  description: svc.body,
};

export default function ApplicationStatusPage() {
  return (
    <PageShell title={svc.title} intro={svc.body}>
      <section className="bg-white pb-24">
        <div className="dp-container grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="order-2 space-y-10 lg:order-1">
            <Panel heading="Beneficiaries">
              <ul className="flex flex-wrap gap-2">
                {svc.beneficiaries.map((b) => (
                  <li
                    key={b}
                    className="rounded-full bg-[#e7f6f1] px-4 py-2 text-sm font-medium text-dp-green-ink"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel heading="Service Channels">
              <ul className="grid gap-3 sm:grid-cols-3">
                {svc.channels.map((c) => (
                  <li
                    key={c}
                    className="rounded-2xl bg-[#F9F9F9] px-5 py-4 text-sm font-medium text-dp-ink"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel heading="Working Hours">
              <dl className="divide-y divide-black/10 rounded-2xl bg-[#F9F9F9] px-5">
                {svc.hours.map((h) => (
                  <div
                    key={h.label}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <dt className="text-sm text-dp-body">{h.label}</dt>
                    <dd className="font-secondary text-sm font-bold text-dp-ink tabular-nums">
                      {h.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>

            <Panel heading="Contact Details">
              <dl className="divide-y divide-black/10 rounded-2xl bg-[#F9F9F9] px-5">
                {svc.contact.map((c) => (
                  <div
                    key={c.label}
                    className="flex flex-wrap items-center justify-between gap-2 py-4"
                  >
                    <dt className="text-sm text-dp-body">{c.label}</dt>
                    <dd className="font-secondary text-sm font-bold text-dp-ink">
                      {c.href ? (
                        <a
                          href={c.href}
                          className="transition-colors hover:text-dp-green"
                        >
                          {c.value}
                        </a>
                      ) : (
                        c.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>
          </div>

          {/* Tracking an application needs an account, so the page's job is the
              sign-in handoff plus the service facts around it. */}
          <aside className="order-1 h-fit rounded-3xl bg-[#F4F8F6] p-6 lg:order-2 lg:sticky lg:top-28">
            <dl className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-dp-muted">Fees</dt>
                <dd className="font-secondary text-base font-bold text-dp-ink">
                  {svc.fees}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-dp-muted">Duration</dt>
                <dd className="font-secondary text-base font-bold text-dp-ink">
                  {svc.duration}
                </dd>
              </div>
            </dl>
            <a
              href="https://www.dubaipolice.gov.ae/app/services/application-status"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-dp-green px-6 py-3.5 font-medium text-white transition-colors hover:bg-dp-green-mid"
            >
              <UserCircle className="size-5" />
              {svc.signInLabel}
              <ArrowRight className="size-4" />
              <span className="sr-only"> (opens in a new window)</span>
            </a>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function Panel({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 font-secondary text-xl font-bold text-dp-green-deep md:text-2xl">
        {heading}
      </h2>
      {children}
    </section>
  );
}
