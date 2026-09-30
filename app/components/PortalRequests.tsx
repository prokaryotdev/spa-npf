"use client";

import Link from "../i18n/Link";
import { useId, useMemo, useState } from "react";
import {
  advanceRequest,
  useStore,
  type RequestStatus,
  type TrackedRequest,
} from "./store";
import { Empty, StatusPill } from "./ui";
import {
  AlertIcon,
  ArrowRight,
  ChevronDown,
  FileIcon,
  InboxIcon,
  SearchIcon,
} from "./icons";
import { useFormat, useT } from "../i18n/client";

const FILTERS: (RequestStatus | "All")[] = [
  "All",
  "Action Needed",
  "In Review",
  "Submitted",
  "Completed",
];

export default function PortalRequests() {
  const t = useT();
  const format = useFormat();
  const id = useId();
  const { requests } = useStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<RequestStatus | "All">("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((r) => {
      if (status !== "All" && r.status !== status) return false;
      if (!q) return true;
      return [r.service, t(r.service), r.id]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [requests, query, status, t]);

  return (
    <div>
      <h2 className="npf-h3 text-npf-blue-deep">{t("My Requests")}</h2>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label htmlFor={`${id}-q`} className="sr-only">
          {t("Find a request")}
        </label>
        <div className="npf-field npf-field-icon min-w-60 flex-1 rounded-full ps-5">
          <SearchIcon aria-hidden className="size-5 shrink-0 text-npf-blue" />
          <input
            id={`${id}-q`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Service name or reference")}
          />
        </div>
        <label htmlFor={`${id}-s`} className="sr-only">
          {t("Status")}
        </label>
        <span className="npf-select-wrap">
          <select
            id={`${id}-s`}
            value={status}
            data-active={status !== "All" ? "" : undefined}
            onChange={(e) => setStatus(e.target.value as RequestStatus | "All")}
            className="npf-select h-12"
          >
            {FILTERS.map((f) => (
              <option key={f} value={f}>
                {f === "All" ? t("All statuses") : t(f)}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden className="npf-select-arrow" />
        </span>
      </div>

      <p aria-live="polite" className="npf-small mt-5 mb-4 text-npf-steel">
        {t("Showing {shown} of {total} requests", {
          shown: visible.length,
          total: requests.length,
        })}
      </p>

      {visible.length === 0 ? (
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
      ) : null}

      <ul className="space-y-3">
        {visible.map((request) => {
          const open = openId === request.id;
          return (
            <li
              key={request.id}
              className={`overflow-hidden rounded-card border bg-white transition-[border-color,box-shadow] duration-(--dur-hover) ${open ? "border-transparent shadow-card ring-1 ring-npf-hairline" : "border-npf-hairline"}`}
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`${id}-${request.id}`}
                  onClick={() => setOpenId(open ? null : request.id)}
                  className="npf-row-link flex w-full items-center gap-4 px-5 py-4 text-start"
                >
                  <span className="npf-disc max-sm:hidden">
                    <FileIcon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="npf-h5 block text-npf-ink">
                      {t(request.service)}
                    </span>
                    <span className="npf-small mt-0.5 block text-npf-steel tabular-nums">
                      {t("{ref} · submitted {date} · {fee}", {
                        ref: request.id,
                        date: format.date(request.submitted),
                        fee: t(request.fee),
                      })}
                    </span>
                  </span>
                  <StatusPill status={request.status} />
                  <ChevronDown
                    aria-hidden
                    className={`size-5 shrink-0 text-npf-blue transition-transform duration-(--dur-hover) ease-out ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </h3>

              {open ? (
                <div
                  id={`${id}-${request.id}`}
                  className="border-t border-npf-hairline px-5 py-6 sm:ps-19"
                >
                  {request.note ? (
                    <p className="npf-small mb-5 flex items-start gap-2.5 rounded-chip bg-npf-gold-wash px-4 py-3 text-npf-warn">
                      <AlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
                      {t(request.note)}
                    </p>
                  ) : null}

                  {request.status === "Action Needed" ? (
                    <Reply request={request} />
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
                          {step.note ? (
                            <p className="npf-small mt-1 text-npf-body">
                              {t(step.note)}
                            </p>
                          ) : null}
                        </li>
                      ))}
                  </ol>

                  <div className="mt-6 flex flex-wrap gap-3 border-t border-npf-hairline pt-5">
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
                    <Link
                      href="/app/home/contactUs"
                      className="npf-btn npf-btn-ghost npf-btn-sm text-npf-blue"
                    >
                      {t("Ask about it")}
                    </Link>
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
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
