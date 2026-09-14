"use client";

import Image from "next/image";
import Link from "next/link";
import { markNoticesRead, useStore } from "./store";
import { Card, Empty, StatusPill, aed, formatDate } from "./ui";
import { services } from "../content-services";
import { ArrowRight, BellIcon, ChevronRight } from "./icons";

/** The seven the CMS marks for the signed-in landing grid, in its own order. */
const shortcuts = services
  .filter((s) => s.dashboardOrder)
  .sort((a, b) => (a.dashboardOrder ?? 0) - (b.dashboardOrder ?? 0));

export default function PortalOverview() {
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
        <section className="rounded-3xl bg-[#FFF7E6] p-6">
          <h2 className="font-secondary text-lg font-bold text-[#6b4a00]">
            {needsYou.length === 1
              ? "One request needs something from you"
              : `${needsYou.length} requests need something from you`}
          </h2>
          <ul className="mt-4 space-y-3">
            {needsYou.map((request) => (
              <li key={request.id}>
                <Link
                  href="/app/portal/requests"
                  className="group/row flex items-start gap-3 rounded-2xl bg-white px-4 py-3 transition-colors hover:bg-white/70"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-dp-ink">
                      {request.service}
                    </span>
                    <span className="mt-0.5 block text-sm text-dp-body">
                      {request.note ?? "Open the request to see what is needed."}
                    </span>
                  </span>
                  <ChevronRight
                    aria-hidden
                    className="mt-1 size-5 shrink-0 text-dp-muted transition-transform duration-300 ease-[var(--ease-custom)] group-hover/row:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <dl className="grid gap-3 sm:grid-cols-3">
        <Stat label="Open requests" value={String(open.length)} href="/app/portal/requests" />
        <Stat
          label="Unpaid fines"
          value={owed ? aed(owed) : "None"}
          href="/app/portal/fines"
        />
        <Stat
          label="Unread notices"
          value={String(unread.length)}
          href="#notices"
        />
      </dl>

      <Card
        title="Start a service"
        action={
          <Link
            href="/app/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-dp-green transition-colors hover:text-dp-green-deep"
          >
            All {services.length} services
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        }
      >
        <ul className="grid gap-2 sm:grid-cols-2">
          {shortcuts.map((service) => (
            <li key={service.slug}>
              <Link
                href={`/app/services/${service.slug}`}
                className="group/row flex items-center gap-3 rounded-2xl bg-[#F4F8F6] px-4 py-3 transition-colors hover:bg-[#dcefe7]"
              >
                {service.icon ? (
                  <Image
                    src={service.icon}
                    alt=""
                    width={24}
                    height={24}
                    className="size-6 shrink-0"
                  />
                ) : null}
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-dp-ink">
                  {service.name}
                </span>
                <ChevronRight
                  aria-hidden
                  className="size-4 shrink-0 text-dp-muted transition-transform duration-300 ease-[var(--ease-custom)] group-hover/row:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <Card
        title="Recent requests"
        action={
          <Link
            href="/app/portal/requests"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-dp-green transition-colors hover:text-dp-green-deep"
          >
            See all
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        }
      >
        {requests.length ? (
          <ul className="divide-y divide-black/[0.07]">
            {requests.slice(0, 4).map((request) => (
              <li
                key={request.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-dp-ink">
                    {request.service}
                  </p>
                  <p className="mt-0.5 text-sm text-dp-muted">
                    {request.id} · {formatDate(request.submitted)}
                  </p>
                </div>
                <StatusPill status={request.status} />
              </li>
            ))}
          </ul>
        ) : (
          <Empty
            title="No requests yet"
            body="Anything you apply for shows up here with its reference number and status."
            action={
              <Link
                href="/app/services"
                className="inline-flex items-center gap-2 rounded-full bg-dp-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dp-green-mid"
              >
                Browse services
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            }
          />
        )}
      </Card>

      <section id="notices" className="scroll-mt-32 rounded-3xl p-6 ring-1 ring-black/[0.07]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-secondary text-lg font-bold text-dp-green-deep">
            <BellIcon aria-hidden className="size-5" />
            Notices
          </h2>
          {unread.length ? (
            <button
              type="button"
              onClick={markNoticesRead}
              className="text-sm font-medium text-dp-green underline underline-offset-2 transition-colors hover:text-dp-green-deep"
            >
              Mark all read
            </button>
          ) : null}
        </div>

        {notices.length ? (
          <ul className="space-y-3">
            {notices.map((notice) => (
              <li
                key={notice.id}
                className={`rounded-2xl px-4 py-3 ${
                  notice.read ? "bg-[#F9F9F9]" : "bg-[#e7f6f1]"
                }`}
              >
                <p className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium text-dp-ink">{notice.title}</span>
                  <span className="text-xs text-dp-muted">
                    {formatDate(notice.at)}
                  </span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-dp-body">
                  {notice.body}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <Empty
            title="Nothing to read"
            body="Updates about your requests, fines and documents land here."
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
  return (
    <Link
      href={href}
      className="rounded-3xl bg-[#F4F8F6] px-5 py-5 transition-colors hover:bg-[#dcefe7]"
    >
      <dt className="text-sm text-dp-body">{label}</dt>
      <dd className="mt-1 font-secondary text-2xl font-bold text-dp-green-deep tabular-nums">
        {value}
      </dd>
    </Link>
  );
}
