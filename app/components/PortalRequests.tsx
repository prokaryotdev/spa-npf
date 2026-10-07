"use client";

import { filterBy } from "../search-text";
import Link from "../i18n/Link";
import { useId, useMemo, useState } from "react";
import {
  advanceRequest,
  useStore,
  type RequestStatus,
  type TrackedRequest,
} from "./store";
import { Empty } from "./ui";
import { PackageTabs } from "./ServiceCatalogue";
import {
  AlertIcon,
  ArrowRight,
  InboxIcon,
  PlusIcon,
  SearchIcon,
} from "./icons";
import { useFormat, useT } from "../i18n/client";

/** What needs the applicant first, then what is moving, then what is done. */
const ORDER: RequestStatus[] = [
  "Action Needed",
  "In Review",
  "Submitted",
  "Completed",
  "Rejected",
];

export default function PortalRequests() {
  const t = useT();
  const format = useFormat();
  const id = useId();
  const { requests } = useStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  // The shell mounts this only once the store is read, so the request that
  // is waiting on the applicant can open itself.
  const [openId, setOpenId] = useState<string | null>(
    () => requests.find((r) => r.status === "Action Needed")?.id ?? null,
  );

  const sorted = useMemo(
    () =>
      requests
        .slice()
        .sort(
          (a, b) =>
            ORDER.indexOf(a.status) - ORDER.indexOf(b.status) ||
            b.updated.localeCompare(a.updated),
        ),
    [requests],
  );

  const visible = useMemo(() => {
    return filterBy(
      sorted.filter((r) => !status || r.status === status),
      query,
      (r) => [r.service, t(r.service), r.id].join(" "),
    );
  }, [sorted, query, status, t]);

  const chips = [
    { value: "", label: t("All statuses"), count: requests.length },
    ...ORDER.flatMap((s) => {
      const count = requests.filter((r) => r.status === s).length;
      // Same sentence case as the progress stops under each request.
      const label =
        s === "Action Needed" ? "Action needed" : s === "In Review" ? "In review" : s;
      return count ? [{ value: s, label: t(label), count }] : [];
    }),
  ];
  const filtered = Boolean(status || query.trim());

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="npf-h3 text-npf-blue-deep">{t("My Requests")}</h1>
        <Link href="/app/services" className="npf-btn npf-btn-primary">
          <PlusIcon aria-hidden className="size-4.5" />
          {t("New request")}
        </Link>
      </div>

      {/* Search, then the statuses: side by side on a wide screen, the
          chips a swipe row under it on a phone. */}
      <div className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-center">
        <label htmlFor={`${id}-q`} className="sr-only">
          {t("Find a request")}
        </label>
        <div className="npf-field npf-field-icon rounded-full ps-5 xl:w-72 xl:shrink-0">
          <SearchIcon aria-hidden className="size-5 shrink-0 text-npf-blue" />
          <input
            id={`${id}-q`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Service name or reference")}
          />
        </div>
        {requests.length ? (
          <div className="min-w-0 flex-1">
            <PackageTabs
              label={t("Status")}
              chips={chips}
              value={status}
              onChange={setStatus}
            />
          </div>
        ) : null}
      </div>

      {/* Once anything is filtered, the count; until then it is noise. */}
      <p
        aria-live="polite"
        className="npf-small text-npf-steel not-empty:mt-5"
      >
        {filtered
          ? t("Showing {shown} of {total} requests", {
              shown: visible.length,
              total: requests.length,
            })
          : null}
      </p>

      {visible.length === 0 ? (
        <div className="mt-5">
        <Empty
          icon={<InboxIcon className="size-6" />}
          title={requests.length ? t("Nothing matches") : t("No requests yet")}
          body={
            requests.length
              ? t(
                  "Try clearing the status filter or searching for the reference number instead.",
                )
              : t(
                  "Anything you apply for shows up here with its reference number and its full history.",
                )
          }
          action={
            requests.length ? null : (
              <Link href="/app/services" className="npf-btn npf-btn-primary">
                {t("Browse services")}
                <span className="npf-btn-disc">
                  <ArrowRight
                    aria-hidden
                    className="npf-arrow size-4 rtl:-scale-x-100"
                  />
                </span>
              </Link>
            )
          }
        />
        </div>
      ) : null}

      {visible.length ? (
        <ul className="mt-5 divide-y divide-npf-hairline overflow-hidden rounded-card border border-npf-hairline bg-white">
          {visible.map((request) => {
            const open = openId === request.id;
            return (
              <li key={request.id}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`${id}-${request.id}`}
                    onClick={() => setOpenId(open ? null : request.id)}
                    className="npf-row-link grid w-full grid-cols-[minmax(0,1fr)_auto] gap-x-4 px-5 py-5 text-start sm:px-6"
                  >
                    <span className="min-w-0">
                      <span className="npf-h5 block text-npf-ink">
                        {t(request.service)}
                      </span>
                      <span className="npf-small mt-0.5 block text-npf-steel tabular-nums">
                        {t("{ref} · submitted {date}", {
                          ref: request.id,
                          date: format.date(request.submitted),
                        })}
                      </span>
                    </span>
                    {/* Points on along the reading line, turns down once open. */}
                    <ArrowRight
                      aria-hidden
                      className={`mt-1 size-5 shrink-0 text-npf-blue transition-[rotate] duration-(--dur-hover) ease-out rtl:-scale-x-100 ${
                        open ? "rotate-90 rtl:-rotate-90" : ""
                      }`}
                    />
                    <Progress status={request.status} />
                    {/* What is being asked, readable without opening. */}
                    {request.note && !open ? (
                      <span className="npf-small col-span-2 mt-3 flex items-start gap-2 font-medium text-npf-warn">
                        <AlertIcon
                          aria-hidden
                          className="mt-0.5 size-4 shrink-0"
                        />
                        {t(request.note)}
                      </span>
                    ) : null}
                  </button>
                </h3>

                {open ? (
                  <div
                    id={`${id}-${request.id}`}
                    className="px-5 pb-6 sm:px-6"
                  >
                    {request.status === "Action Needed" ? (
                      <div className="mb-6 border-b border-npf-hairline pb-6">
                        {request.note ? (
                          <p className="npf-body mb-4 flex items-start gap-2.5 font-medium text-npf-warn">
                            <AlertIcon
                              aria-hidden
                              className="mt-1 size-4.5 shrink-0"
                            />
                            {t(request.note)}
                          </p>
                        ) : null}
                        <Reply request={request} />
                      </div>
                    ) : null}

                    <ol className="relative space-y-5 ps-6">
                      {/* The rail is drawn once behind the dots, not per row. */}
                      <span
                        aria-hidden
                        className="absolute top-2 bottom-2 start-[5px] w-px bg-npf-line"
                      />
                      {request.timeline
                        .slice()
                        .reverse()
                        .map((step, i) => (
                          <li key={step.at + step.label} className="relative">
                            <span
                              aria-hidden
                              className={`absolute top-1.5 -start-6 size-2.75 rounded-full ring-4 ring-white ${
                                i === 0 ? "bg-npf-blue" : "bg-npf-line"
                              }`}
                            />
                            <p className="npf-body font-medium text-npf-ink">
                              {t(step.label)}
                            </p>
                            <p className="npf-small mt-0.5 text-npf-steel tabular-nums">
                              {format.dateTime(step.at)}
                            </p>
                            {/* The open ask already sits above, in amber. */}
                            {step.note && step.note !== request.note ? (
                              <p className="npf-small mt-1 text-npf-body">
                                {t(step.note)}
                              </p>
                            ) : null}
                          </li>
                        ))}
                    </ol>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-npf-hairline pt-5">
                      <p className="npf-small text-npf-body">
                        <span className="font-semibold text-npf-ink">
                          {t("Fees")}
                        </span>{" "}
                        {t(request.fee)}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href="/app/home/contactUs"
                          className="npf-btn npf-btn-ghost npf-btn-sm text-npf-blue"
                        >
                          {t("Ask about it")}
                        </Link>
                        <Link
                          href={`/app/services/${request.slug}`}
                          className="npf-btn npf-btn-secondary npf-btn-sm"
                        >
                          {t("About this service")}
                          <ArrowRight
                            aria-hidden
                            className="size-4 rtl:-scale-x-100"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * Where a request stands, as the three stops every one of them passes:
 * filled up to the current stop in the colour its status means. The middle
 * stop names the ask when there is one, the last names a refusal.
 */
function Progress({ status }: { status: RequestStatus }) {
  const t = useT();
  const at =
    status === "Submitted"
      ? 0
      : status === "Completed" || status === "Rejected"
        ? 2
        : 1;
  const [fill, ink] =
    status === "Action Needed"
      ? ["bg-npf-warn-fill", "text-npf-warn"]
      : status === "Completed"
        ? ["bg-npf-ok-fill/45", "text-npf-ok"]
        : status === "Rejected"
          ? ["bg-npf-error", "text-npf-error"]
          : ["bg-npf-blue", "text-npf-blue-deep"];
  const stops = [
    "Submitted",
    status === "Action Needed" ? "Action needed" : "In review",
    status === "Rejected" ? "Rejected" : "Completed",
  ];

  return (
    <span className="col-span-2 mt-4 block">
      <span className="sr-only">{t(status)}</span>
      <span aria-hidden className="grid grid-cols-3 gap-1.5">
        {stops.map((label, i) => (
          <span key={label} className="min-w-0">
            <span
              className={`block h-1.5 rounded-full ${i <= at ? fill : "bg-npf-cloud-deep"}`}
            />
            <span
              className={`npf-small mt-2 block truncate ${
                i === at
                  ? `font-semibold ${ink}`
                  : i < at
                    ? "text-npf-body"
                    : "text-npf-steel"
              }`}
            >
              {t(label)}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * The other half of "Action Needed". Nigeria Police Force asks the applicant for
 * something; without this the applicant reads the request and has nowhere to
 * put the answer, so the request sits in the officer's queue for good.
 *
 * Sending it moves the request back to "In Review" — which is what answering
 * means — and the reply lands on the officer's own feed as it is typed.
 */
function Reply({ request }: { request: TrackedRequest }) {
  const t = useT();
  const id = useId();
  const [text, setText] = useState("");

  return (
    <form
      className="mb-5"
      onSubmit={(e) => {
        e.preventDefault();
        const reply = text.trim();
        if (!reply) return;
        advanceRequest(request.id, "In Review", reply, "Reply sent");
        setText("");
      }}
    >
      <label
        htmlFor={`${id}-reply`}
        className="npf-field-label"
      >
        {t("Your reply")}
      </label>
      <textarea
        id={`${id}-reply`}
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("Tell us what you have done, or what you are sending.")}
        className="npf-field min-h-28"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="npf-btn npf-btn-primary npf-btn-sm mt-3"
      >
        {t("Send reply")}
        <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
      </button>
    </form>
  );
}
