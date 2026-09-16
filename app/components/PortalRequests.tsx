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
import { ArrowRight, ChevronDown, SearchIcon } from "./icons";
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
      <h2 className="mb-6 font-secondary text-2xl font-bold text-dp-green-deep">
        {t("My Requests")}
      </h2>

      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div className="min-w-[220px] flex-1">
          <label
            htmlFor={`${id}-q`}
            className="mb-1.5 block text-sm font-medium text-dp-ink"
          >
            {t("Find a request")}
          </label>
          <div className="flex items-center gap-3 rounded-xl bg-[#F4F8F6] px-4 ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-dp-green">
            <SearchIcon
              aria-hidden
              className="size-5 shrink-0 text-dp-green-ink"
            />
            <input
              id={`${id}-q`}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Service name or reference")}
              className="w-full bg-transparent py-3 text-base text-dp-ink outline-none placeholder:text-dp-muted"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor={`${id}-s`}
            className="mb-1.5 block text-sm font-medium text-dp-ink"
          >
            {t("Status")}
          </label>
          <select
            id={`${id}-s`}
            value={status}
            onChange={(e) => setStatus(e.target.value as RequestStatus | "All")}
            className="rounded-xl bg-[#F4F8F6] px-4 py-3 text-base text-dp-ink ring-1 ring-black/5 outline-none focus:ring-2 focus:ring-dp-green"
          >
            {FILTERS.map((f) => (
              <option key={f} value={f}>
                {t(f)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p aria-live="polite" className="mb-4 text-sm text-dp-muted">
        {t("Showing {shown} of {total} requests", {
          shown: visible.length,
          total: requests.length,
        })}
      </p>

      {visible.length === 0 ? (
        <Empty
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
              <Link
                href="/app/services"
                className="inline-flex items-center gap-2 rounded-full bg-dp-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dp-green-mid"
              >
                {t("Browse services")}
                <ArrowRight aria-hidden className="size-4" />
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
              className="overflow-hidden rounded-2xl ring-1 ring-black/[0.07]"
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`${id}-${request.id}`}
                  onClick={() => setOpenId(open ? null : request.id)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-start transition-colors hover:bg-[#F9F9F9]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-secondary text-base font-bold text-dp-ink">
                      {t(request.service)}
                    </span>
                    <span className="mt-0.5 block text-sm text-dp-muted">
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
                    className={`size-5 shrink-0 text-dp-muted transition-transform duration-300 ease-[var(--ease-custom)] ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </h3>

              {open ? (
                <div
                  id={`${id}-${request.id}`}
                  className="border-t border-black/[0.07] px-5 py-5"
                >
                  {request.note ? (
                    <p className="mb-4 rounded-xl bg-[#FFF7E6] px-4 py-3 text-sm leading-relaxed text-[#6b4a00]">
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
                      className="absolute top-2 bottom-2 start-[5px] w-px bg-black/20"
                    />
                    {request.timeline
                      .slice()
                      .reverse()
                      .map((step, i) => (
                        <li key={step.at + step.label} className="relative">
                          <span
                            aria-hidden
                            className={`absolute top-1.5 -start-6 size-[11px] rounded-full ring-4 ring-white ${
                              i === 0 ? "bg-dp-green" : "bg-black/20"
                            }`}
                          />
                          <p className="font-medium text-dp-ink">
                            {t(step.label)}
                          </p>
                          <p className="mt-0.5 text-xs text-dp-muted tabular-nums">
                            {format.dateTime(step.at)}
                          </p>
                          {step.note ? (
                            <p className="mt-1 text-sm leading-relaxed text-dp-body">
                              {t(step.note)}
                            </p>
                          ) : null}
                        </li>
                      ))}
                  </ol>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/app/services/${request.slug}`}
                      className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-dp-ink ring-1 ring-black/10 transition-colors hover:bg-black/[0.04]"
                    >
                      {t("About this service")}
                      <ArrowRight aria-hidden className="size-4" />
                    </Link>
                    <Link
                      href="/app/home/contactUs"
                      className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-dp-ink ring-1 ring-black/10 transition-colors hover:bg-black/[0.04]"
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
 * The other half of "Action Needed". Dubai Police asks the applicant for
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
        className="mb-1.5 block text-sm font-medium text-dp-ink"
      >
        {t("Your reply")}
      </label>
      <textarea
        id={`${id}-reply`}
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("Tell us what you have done, or what you are sending.")}
        className="w-full rounded-xl border border-[#E4E2E6] bg-white px-4 py-3 text-base leading-relaxed text-dp-ink outline-none placeholder:text-dp-muted focus:ring-2 focus:ring-dp-green"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-dp-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dp-green-mid disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t("Send reply")}
        <ArrowRight aria-hidden className="size-4" />
      </button>
    </form>
  );
}
