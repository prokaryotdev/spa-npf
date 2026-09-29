"use client";

import Link from "../i18n/Link";
import { markNoticesRead, useStore } from "./store";
import { Card, Empty, StatusPill } from "./ui";
import { ArrowRight, BellIcon, ChevronRight } from "./icons";
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
    <div className="space-y-8">
      {needsYou.length ? (
        <section className="rounded-tile bg-npf-gold-wash p-6">
          <h2 className="font-secondary text-lg font-bold text-npf-warn">
            {needsYou.length === 1
              ? t("One request needs something from you")
              : t("{n} requests need something from you", {
                  n: needsYou.length,
                })}
          </h2>
          <ul className="mt-4 space-y-3">
            {needsYou.map((request) => (
              <li key={request.id}>
                <Link
                  href="/app/portal/requests"
                  className="group/row flex items-start gap-3 rounded-card bg-white px-4 py-3 transition-colors hover:bg-white/70"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-npf-ink">
                      {t(request.service)}
                    </span>
                    <span className="mt-0.5 block text-sm text-npf-body">
                      {t(
                        request.note ??
                          "Open the request to see what is needed.",
                      )}
                    </span>
                  </span>
                  <ChevronRight
                    aria-hidden
                    className="mt-1 size-5 shrink-0 text-npf-muted transition-transform duration-(--dur-hover) ease-out group-hover/row:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat
          label={t("Open requests")}
          value={String(open.length)}
          href="/app/portal/requests"
        />
        <Stat
          label={t("Unpaid fines")}
          value={owed ? format.naira(owed) : t("None")}
          href="/app/portal/fines"
        />
        <Stat
          label={t("Unread notices")}
          value={String(unread.length)}
          href="#notices"
        />
      </dl>

      <Card
        title={t("Start a service")}
        action={
          <Link
            href="/app/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-npf-blue-ink transition-colors hover:text-npf-blue-deep"
          >
            {t("All {n} services", { n: serviceCount })}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        }
      >
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {shortcuts.map((service) => (
            <li key={service.slug}>
              <Link
                href={`/app/services/${service.slug}`}
                className="group/row flex items-center gap-3 rounded-card bg-npf-cloud px-4 py-3 transition-colors hover:bg-npf-cloud-deep"
              >
                {/*
                  A plain <img>, not next/image. These are 24px SVGs already
                  sitting in public/ — there is nothing for the optimiser to
                  resize or re-encode — and pulling next/image into this screen
                  stopped it hydrating at all: the account stayed on its
                  loading skeleton with no error to say why.
                */}
                {service.icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={service.icon}
                    alt=""
                    width={24}
                    height={24}
                    className="size-6 shrink-0"
                  />
                ) : null}
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-npf-ink">
                  {t(service.name)}
                </span>
                <ChevronRight
                  aria-hidden
                  className="size-4 shrink-0 text-npf-muted transition-transform duration-(--dur-hover) ease-out group-hover/row:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <Card
        title={t("Recent requests")}
        action={
          <Link
            href="/app/portal/requests"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-npf-blue-ink transition-colors hover:text-npf-blue-deep"
          >
            {t("See all")}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        }
      >
        {requests.length ? (
          <ul className="divide-y divide-npf-hairline">
            {requests.slice(0, 4).map((request) => (
              <li
                key={request.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-npf-ink">
                    {t(request.service)}
                  </p>
                  <p className="mt-0.5 text-sm text-npf-muted">
                    {request.id} · {format.date(request.submitted)}
                  </p>
                </div>
                <StatusPill status={request.status} />
              </li>
            ))}
          </ul>
        ) : (
          <Empty
            title={t("No requests yet")}
            body={t(
              "Anything you apply for shows up here with its reference number and status.",
            )}
            action={
              <Link
                href="/app/services"
                className="inline-flex items-center gap-2 rounded-full bg-npf-blue px-5 py-2.5 text-sm font-medium text-white transition-[background-color,color,scale] not-disabled:active:scale-[0.97] active:duration-(--dur-press) hover:bg-npf-blue-mid"
              >
                {t("Browse services")}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            }
          />
        )}
      </Card>

      <section
        id="notices"
        className="scroll-mt-32 rounded-tile p-6 ring-1 ring-npf-hairline"
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-secondary text-lg font-bold text-npf-blue-deep">
            <BellIcon aria-hidden className="size-5" />
            {t("Notices")}
          </h2>
          {unread.length ? (
            <button
              type="button"
              onClick={markNoticesRead}
              className="text-sm font-medium text-npf-blue underline underline-offset-2 transition-colors hover:text-npf-blue-deep"
            >
              {t("Mark all read")}
            </button>
          ) : null}
        </div>

        {notices.length ? (
          <ul className="space-y-3">
            {notices.map((notice) => (
              <li
                key={notice.id}
                className={`rounded-card px-4 py-3 ${
                  notice.read ? "bg-npf-paper" : "bg-npf-chip"
                }`}
              >
                <p className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium text-npf-ink">
                    {t(notice.title)}
                  </span>
                  <span className="text-xs text-npf-muted">
                    {format.date(notice.at)}
                  </span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-npf-body">
                  {t(notice.body)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <Empty
            title={t("Nothing to read")}
            body={t(
              "Updates about your requests, fines and documents land here.",
            )}
          />
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  /*
   * A <dl> may hold only <dt>/<dd> or a <div> of them, so the link cannot
   * wrap the pair. It sits in the term and stretches over the tile instead,
   * and the tile wears the link's focus ring.
   */
  return (
    <div className="relative rounded-tile bg-npf-cloud px-5 py-5 transition-colors hover:bg-npf-cloud-deep has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-npf-blue-mid">
      <dt className="text-sm text-npf-body">
        <Link
          href={href}
          className="outline-none after:absolute after:inset-0 after:rounded-tile"
        >
          {label}
        </Link>
      </dt>
      <dd className="mt-1 font-secondary text-2xl font-bold text-npf-blue-deep tabular-nums">
        {value}
      </dd>
    </div>
  );
}
