"use client";

import Link from "../i18n/Link";
import { markNoticesRead, useStore } from "./store";
import { Card, Empty, HeadLink, StatusPill } from "./ui";
import {
  AlertIcon,
  ArrowRight,
  BellIcon,
  CardIcon,
  CheckCircle,
  FileIcon,
  InboxIcon,
  PlusIcon,
  ServicesIcon,
} from "./icons";
import { useFormat, useT } from "../i18n/client";
import { line } from "./Where";
import { payable } from "./PortalFines";

/** Just enough of a service to draw a shortcut row. */
export type Shortcut = { slug: string; name: string; icon: string | null };

/**
 * The shortcuts and the catalogue total arrive as props rather than from an
 * import of content-services.
 *
 * That file is the whole service catalogue — every service on the site, with
 * its copy. Importing it into a client component shipped all of it to the
 * browser so this list could draw a handful of rows. The page above is a
 * server component and already holds the catalogue, so it sends down the rows
 * and the count, and none of the rest crosses the wire.
 *
 * The screen reads in the order a person needs it: what is waiting on them
 * (with the button that clears it), then their requests, then what changed
 * and where to start something new. The counts the old stat strip showed
 * already ride on the tabs beside it.
 */
export default function PortalOverview({
  shortcuts,
  serviceCount,
}: {
  shortcuts: Shortcut[];
  serviceCount: number;
}) {
  const t = useT();
  const format = useFormat();
  const { session, requests, fines, notices } = useStore();

  const needsYou = requests.filter((r) => r.status === "Action Needed");
  const unpaid = fines.filter((f) => !f.paid);
  const owed = unpaid.reduce((sum, f) => sum + payable(f), 0);
  const face = unpaid.reduce((sum, f) => sum + f.amount, 0);
  const unread = notices.filter((n) => !n.read);
  const waiting = needsYou.length + (unpaid.length ? 1 : 0);
  const first = session?.name.split(" ")[0] ?? "";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="npf-h3 text-npf-blue-deep">
          {first ? t("Hello, {name}", { name: first }) : t("Overview")}
        </h1>
        <Link href="/app/services" className="npf-btn npf-btn-primary">
          <PlusIcon aria-hidden className="size-4.5" />
          {t("New request")}
        </Link>
      </div>

      {/* The one panel in navy: it is the only thing on the screen that gets
          worse while nobody looks. */}
      <section
        aria-labelledby="waiting"
        className="overflow-hidden rounded-card border border-npf-blue-deep bg-white"
      >
        <div className="flex min-h-13 items-center gap-3 bg-npf-blue-deep px-5 py-3 text-white">
          <h2
            id="waiting"
            className="font-secondary text-[1.0625rem] font-bold"
          >
            {t("Waiting on you")}
          </h2>
          {waiting ? (
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-1.5 text-xs font-semibold text-npf-blue-deep tabular-nums">
              {waiting}
            </span>
          ) : null}
        </div>
        {waiting ? (
          <ul className="divide-y divide-npf-hairline">
            {needsYou.map((request) => (
              <ToDo
                key={request.id}
                icon={<AlertIcon className="size-5" />}
                tone="bg-npf-gold-wash text-npf-warn"
                title={t(request.service)}
                body={t(
                  request.note ?? "Open the request to see what is needed.",
                )}
                meta={request.id}
                href="/app/portal/requests"
                action={t("Open request")}
              />
            ))}
            {unpaid.length ? (
              <ToDo
                icon={<CardIcon className="size-5" />}
                tone="bg-npf-error-wash text-npf-error"
                title={
                  unpaid.length === 1
                    ? t("One unpaid fine")
                    : t("{n} unpaid fines", { n: unpaid.length })
                }
                body={
                  owed < face
                    ? t("{amount} payable today. Pay now and save {saved}.", {
                        amount: format.naira(owed),
                        saved: format.naira(face - owed),
                      })
                    : t("{amount} payable today.", {
                        amount: format.naira(owed),
                      })
                }
                href="/app/portal/fines"
                action={t("Pay fines")}
                primary
              />
            ) : null}
          </ul>
        ) : (
          <p className="flex items-start gap-3.5 px-5 py-5">
            <span className="npf-disc bg-npf-ok-soft text-npf-ok">
              <CheckCircle className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="npf-body block font-medium text-npf-ink">
                {t("Nothing is waiting on you")}
              </span>
              <span className="npf-small mt-0.5 block text-npf-body">
                {t(
                  "A request that needs a document from you, or a fine to pay, shows up here first.",
                )}
              </span>
            </span>
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card
            title={t("Recent requests")}
            flush={requests.length > 0}
            action={
              <HeadAnchor href="/app/portal/requests">
                {t("See all")}
              </HeadAnchor>
            }
          >
            {requests.length ? (
              <ul className="divide-y divide-npf-hairline">
                {requests.slice(0, 5).map((request) => (
                  <li key={request.id}>
                    <Link
                      href="/app/portal/requests"
                      className="npf-row-link flex items-center gap-4 px-5 py-4"
                    >
                      <span className="npf-disc max-sm:hidden">
                        <FileIcon className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="npf-body block truncate font-medium text-npf-ink">
                          {t(request.service)}
                        </span>
                        <span className="npf-small mt-0.5 block text-npf-steel tabular-nums">
                          {request.id} · {format.date(request.submitted)}
                        </span>
                      </span>
                      <StatusPill status={request.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty
                icon={<InboxIcon className="size-6" />}
                title={t("No requests yet")}
                body={t(
                  "Anything you apply for shows up here with its reference number and status.",
                )}
                action={
                  <Link
                    href="/app/services"
                    className="npf-btn npf-btn-primary"
                  >
                    {t("Browse services")}
                    <span className="npf-btn-disc">
                      <ArrowRight
                        aria-hidden
                        className="npf-arrow size-4 rtl:-scale-x-100"
                      />
                    </span>
                  </Link>
                }
              />
            )}
          </Card>

          <Card
            title={t("Start a service")}
            flush
            action={
              <HeadAnchor href="/app/services">
                {t("All {n} services", { n: serviceCount })}
              </HeadAnchor>
            }
          >
            <ul className="grid gap-px bg-npf-hairline sm:grid-cols-2">
              {shortcuts.map((service) => (
                <li key={service.slug} className="bg-white">
                  <Link
                    href={`/app/services/${service.slug}`}
                    className="npf-row-link flex h-full items-center gap-3.5 px-5 py-3.5"
                  >
                    {/*
                    A plain <img>, not next/image. These are 24px SVGs
                    already sitting in public/ — there is nothing for the
                    optimiser to resize or re-encode — and pulling
                    next/image into this screen stopped it hydrating at all:
                    the account stayed on its loading skeleton with no error
                    to say why.
                  */}
                    <span className="npf-disc">
                      {service.icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={service.icon}
                          alt=""
                          width={20}
                          height={20}
                          className="size-5"
                        />
                      ) : (
                        <ServicesIcon className="size-5" />
                      )}
                    </span>
                    <span className="npf-small min-w-0 flex-1 font-medium text-npf-ink">
                      {t(service.name)}
                    </span>
                    <ArrowRight aria-hidden className="npf-go" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="xl:[@media(min-height:46rem)]:sticky xl:top-28">
          <Card
            id="notices"
            title={t("Notices")}
            icon={<BellIcon aria-hidden className="size-5" />}
            flush={notices.length > 0}
            action={
              unread.length ? (
                <HeadLink onClick={markNoticesRead}>
                  {t("Mark all read")}
                </HeadLink>
              ) : null
            }
          >
            {notices.length ? (
              <ul className="divide-y divide-npf-hairline">
                {notices.map((notice) => (
                  <li key={notice.id} className="flex gap-3 px-5 py-4">
                    <span
                      aria-hidden
                      className={`mt-[0.4rem] size-2 shrink-0 rounded-full ${
                        notice.read ? "bg-npf-line" : "bg-npf-blue"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`npf-body text-npf-ink ${notice.read ? "" : "font-semibold"}`}
                      >
                        {notice.read ? null : (
                          <span className="sr-only">{t("Unread")}: </span>
                        )}
                        {line(t, notice.title, notice.vars)}
                      </p>
                      <p className="npf-small mt-1 text-npf-body">
                        {line(t, notice.body, notice.vars)}
                      </p>
                      <p className="npf-small mt-1.5 text-npf-steel tabular-nums">
                        {format.date(notice.at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty
                icon={<BellIcon className="size-6" />}
                title={t("Nothing to read")}
                body={t(
                  "Updates about your requests, fines and documents land here.",
                )}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

/** One thing waiting on the citizen, with the button that clears it. */
function ToDo({
  icon,
  tone,
  title,
  body,
  meta,
  href,
  action,
  primary = false,
}: {
  icon: React.ReactNode;
  tone: string;
  title: string;
  body: string;
  meta?: string;
  href: string;
  action: string;
  primary?: boolean;
}) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4">
      <span aria-hidden className={`npf-disc ${tone}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1 basis-56">
        <span className="npf-body block font-semibold text-npf-ink">
          {title}
        </span>
        <span className="npf-small mt-0.5 block text-npf-body">{body}</span>
        {meta ? (
          <span className="npf-small mt-1 block text-npf-steel tabular-nums">
            {meta}
          </span>
        ) : null}
      </span>
      <Link
        href={href}
        className={`npf-btn npf-btn-sm max-sm:ms-14 ${primary ? "npf-btn-primary" : "npf-btn-secondary"}`}
      >
        {action}
        <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
      </Link>
    </li>
  );
}

/** A panel head's link: "See all", "All 91 services". */
function HeadAnchor({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="npf-small group -my-2 inline-flex min-h-10 items-center gap-1.5 font-medium text-npf-blue transition-colors hover:text-npf-blue-deep"
    >
      {children}
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform group-hover:translate-x-[3px] rtl:-scale-x-100 rtl:group-hover:-translate-x-[3px]"
      />
    </Link>
  );
}
