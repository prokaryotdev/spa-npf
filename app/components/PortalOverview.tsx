"use client";

import Link from "../i18n/Link";
import { markNoticesRead, useStore } from "./store";
import { Card, Empty, HeadLink, StatusPill } from "./ui";
import {
  AlertIcon,
  ArrowRight,
  BellIcon,
  CardIcon,
  FileIcon,
  InboxIcon,
  ServicesIcon,
} from "./icons";
import { useFormat, useT } from "../i18n/client";

/** Just enough of a service to draw a shortcut tile. */
export type Shortcut = { slug: string; name: string; icon: string | null };

/**
 * The shortcuts and the catalogue total arrive as props rather than from an
 * import of content-services.
 *
 * That file is the whole service catalogue — every service on the site, with
 * its copy. Importing it into a client component shipped all of it to the
 * browser so this grid could draw seven tiles. The page above is a server
 * component and already holds the catalogue, so it sends down the seven rows
 * and the count, and none of the rest crosses the wire.
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
  const { requests, fines, notices } = useStore();

  const open = requests.filter(
    (r) => r.status !== "Completed" && r.status !== "Rejected",
  );
  const needsYou = requests.filter((r) => r.status === "Action Needed");
  const unpaid = fines.filter((f) => !f.paid);
  const owed = unpaid.reduce((sum, f) => sum + f.amount, 0);
  const unread = notices.filter((n) => !n.read);

  return (
    <div className="space-y-6">
      {needsYou.length ? (
        <section className="overflow-hidden rounded-card bg-npf-gold-wash">
          <h2 className="npf-h5 flex items-center gap-2.5 px-5 pt-4 pb-3 text-npf-warn">
            <AlertIcon aria-hidden className="size-5 shrink-0" />
            {needsYou.length === 1
              ? t("One request needs something from you")
              : t("{n} requests need something from you", {
                  n: needsYou.length,
                })}
          </h2>
          <ul className="mx-2 mb-2 divide-y divide-npf-hairline overflow-hidden rounded-[0.625rem] bg-white">
            {needsYou.map((request) => (
              <li key={request.id}>
                <Link
                  href="/app/portal/requests"
                  className="npf-row-link flex items-center gap-4 px-4 py-3.5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="npf-body block font-medium text-npf-ink">
                      {t(request.service)}
                    </span>
                    <span className="npf-small mt-0.5 block text-npf-body">
                      {t(
                        request.note ??
                          "Open the request to see what is needed.",
                      )}
                    </span>
                  </span>
                  <ArrowRight aria-hidden className="npf-go" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <dl className="grid divide-y divide-npf-hairline overflow-hidden rounded-card border border-npf-hairline bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <Stat
          label={t("Open requests")}
          value={String(open.length)}
          href="/app/portal/requests"
          icon={<InboxIcon className="size-5" />}
        />
        <Stat
          label={t("Unpaid fines")}
          value={owed ? format.naira(owed) : t("None")}
          href="/app/portal/fines"
          icon={<CardIcon className="size-5" />}
        />
        <Stat
          label={t("Unread notices")}
          value={String(unread.length)}
          href="#notices"
          icon={<BellIcon className="size-5" />}
        />
      </dl>

      <Card
        title={t("Start a service")}
        action={
          <HeadAnchor href="/app/services">
            {t("All {n} services", { n: serviceCount })}
          </HeadAnchor>
        }
      >
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {shortcuts.map((service) => (
            <li key={service.slug}>
              <Link
                href={`/app/services/${service.slug}`}
                className="npf-link-card flex h-full items-center gap-3.5 p-3.5"
              >
                {/*
                  A plain <img>, not next/image. These are 24px SVGs already
                  sitting in public/ — there is nothing for the optimiser to
                  resize or re-encode — and pulling next/image into this screen
                  stopped it hydrating at all: the account stayed on its
                  loading skeleton with no error to say why.
                */}
                <span className="npf-disc rounded-chip">
                  {service.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={service.icon}
                      alt=""
                      width={22}
                      height={22}
                      className="size-5.5"
                    />
                  ) : (
                    <ServicesIcon className="size-5" />
                  )}
                </span>
                <span className="npf-small min-w-0 flex-1 font-medium text-npf-ink">
                  {t(service.name)}
                </span>
                <ArrowRight aria-hidden className="npf-go size-4" />
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <Card
        title={t("Recent requests")}
        flush={requests.length > 0}
        action={
          <HeadAnchor href="/app/portal/requests">{t("See all")}</HeadAnchor>
        }
      >
        {requests.length ? (
          <ul className="divide-y divide-npf-hairline">
            {requests.slice(0, 4).map((request) => (
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
              <Link href="/app/services" className="npf-btn npf-btn-primary">
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
        id="notices"
        title={t("Notices")}
        icon={<BellIcon aria-hidden className="size-5" />}
        flush={notices.length > 0}
        action={
          unread.length ? (
            <HeadLink onClick={markNoticesRead}>{t("Mark all read")}</HeadLink>
          ) : null
        }
      >
        {notices.length ? (
          <ul className="divide-y divide-npf-hairline">
            {notices.map((notice) => (
              <li key={notice.id} className="flex gap-3.5 px-5 py-4">
                <span
                  aria-hidden
                  className={`mt-2 size-2 shrink-0 rounded-full ${
                    notice.read ? "bg-npf-line" : "bg-npf-blue"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span
                      className={`npf-body text-npf-ink ${notice.read ? "" : "font-semibold"}`}
                    >
                      {t(notice.title)}
                    </span>
                    <span className="npf-small shrink-0 text-npf-steel tabular-nums">
                      {format.date(notice.at)}
                    </span>
                  </p>
                  <p className="npf-small mt-1 text-npf-body">
                    {t(notice.body)}
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

function Stat({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
}) {
  /*
   * A <dl> may hold only <dt>/<dd> or a <div> of them, so the link cannot
   * wrap the pair. It sits in the term and stretches over the cell instead,
   * and the cell wears the link's focus ring.
   */
  return (
    <div className="group relative min-w-0 py-4 ps-[4.625rem] pe-5 transition-colors hover:bg-npf-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-npf-blue-mid">
      {/* Only <dt> and <dd> may sit in a <dl> row: the icon rides in the term. */}
      <dt className="npf-small text-npf-steel">
        <span
          aria-hidden
          className="npf-disc absolute start-5 top-1/2 -translate-y-1/2 group-hover:bg-npf-chip"
        >
          {icon}
        </span>
        <Link href={href} className="outline-none after:absolute after:inset-0">
          {label}
        </Link>
      </dt>
      <dd className="npf-h4 text-npf-blue-deep tabular-nums">{value}</dd>
    </div>
  );
}
