"use client";

import { useId, useMemo, useState } from "react";
import { OpsButton, OpsPanel, Readout } from "./OpsPieces";
import {
  advanceRequest,
  useStore,
  type RequestStatus,
  type TrackedRequest,
} from "./store";
import { CheckIcon, CloseIcon, SearchIcon } from "./icons";
import { useFormat, useT } from "../i18n/client";

const QUEUE: RequestStatus[] = ["Submitted", "In Review", "Action Needed"];

const TONE: Record<RequestStatus, string> = {
  Submitted: "bg-[var(--ops-raised)] text-[var(--ops-dim)]",
  "In Review": "bg-[#2A1B4D] text-[#C3B0F5]",
  "Action Needed": "bg-[#3b2c0b] text-[#f8d79a]",
  Completed: "bg-[#0b3b2a] text-[#7fe7bb]",
  Rejected: "bg-[#3d1616] text-[#f5a8a8]",
};

/**
 * Service requests as work, rather than as the citizen's receipt. Deciding one
 * here writes straight through to the portal screen the applicant is looking
 * at — same store, same timeline.
 */
export default function OpsRequests() {
  const t = useT();
  const format = useFormat();
  const id = useId();
  const { requests } = useStore();
  const [query, setQuery] = useState("");
  const [openOnly, setOpenOnly] = useState(true);
  const [asking, setAsking] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((r) => {
      if (openOnly && !QUEUE.includes(r.status)) return false;
      if (!q) return true;
      return [r.id, r.service, t(r.service)]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [requests, query, openOnly, t]);

  function ask(request: TrackedRequest) {
    const note = reason.trim();
    if (!note) return;
    advanceRequest(request.id, "Action Needed", note);
    setAsking(null);
    setReason("");
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-secondary text-2xl font-bold">
          {t("Service requests")}
        </h1>
        <p className="mt-1 text-sm text-[var(--ops-dim)]">
          {t(
            "Applications waiting on a decision. Anything you do here appears on the applicant’s own screen within the second.",
          )}
        </p>
      </header>

      <dl className="flex flex-wrap divide-x divide-[var(--ops-line)] rounded-xl border border-[var(--ops-line)] bg-[var(--ops-panel)] px-4 py-1">
        <Readout
          label={t("In the queue")}
          value={requests.filter((r) => QUEUE.includes(r.status)).length}
          note={t("awaiting a decision")}
        />
        <Readout
          label={t("With the applicant")}
          value={requests.filter((r) => r.status === "Action Needed").length}
          tone={
            requests.some((r) => r.status === "Action Needed")
              ? "var(--ops-p2)"
              : undefined
          }
          note={t("we asked for more")}
        />
        <Readout
          label={t("Completed")}
          value={requests.filter((r) => r.status === "Completed").length}
          note={t("issued")}
        />
        <Readout
          label={t("Rejected")}
          value={requests.filter((r) => r.status === "Rejected").length}
          note={t("conditions not met")}
        />
      </dl>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-[var(--ops-line)] bg-[var(--ops-panel)] px-3 focus-within:border-[var(--ops-accent)]">
          <SearchIcon
            aria-hidden
            className="size-4 shrink-0 text-[var(--ops-dim)]"
          />
          <label htmlFor={`${id}-q`} className="sr-only">
            {t("Filter requests")}
          </label>
          <input
            id={`${id}-q`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Reference or service")}
            className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-[var(--ops-dim)]"
          />
        </div>
        <OpsButton
          tone={openOnly ? "brand" : "quiet"}
          aria-pressed={openOnly}
          onClick={() => setOpenOnly((v) => !v)}
        >
          {t("Open only")}
        </OpsButton>
      </div>

      <p aria-live="polite" className="text-xs text-[var(--ops-dim)]">
        {t("{shown} of {total} requests", {
          shown: visible.length,
          total: requests.length,
        })}
      </p>

      {visible.length === 0 ? (
        <OpsPanel>
          <p className="py-10 text-center text-sm text-[var(--ops-dim)]">
            {openOnly
              ? t("Queue clear. Nothing is waiting on a decision.")
              : t("No request matches that search.")}
          </p>
        </OpsPanel>
      ) : null}

      <ul className="space-y-3">
        {visible.map((request) => (
          <li key={request.id}>
            <OpsPanel>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-secondary text-base font-bold">
                    {t(request.service)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--ops-dim)] tabular-nums">
                    {t("{ref} · submitted {date} · {fee} · via {channel}", {
                      ref: request.id,
                      date: format.date(request.submitted),
                      fee: t(request.fee),
                      channel: t(request.channel),
                    })}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${TONE[request.status]}`}
                >
                  {t(request.status)}
                </span>
              </div>

              <ol className="mt-4 space-y-1.5 border-t border-[var(--ops-line)] pt-3 text-xs">
                {request.timeline
                  .slice()
                  .reverse()
                  .slice(0, 3)
                  .map((step) => (
                    <li key={step.at + step.label} className="flex gap-3">
                      <span className="w-24 shrink-0 text-[var(--ops-dim)] tabular-nums">
                        {format.dateTime(step.at)}
                      </span>
                      <span className="min-w-0">
                        <span className="font-medium">{t(step.label)}</span>
                        {step.note ? (
                          <span className="text-[var(--ops-dim)]">
                            {" "}
                            — {t(step.note)}
                          </span>
                        ) : null}
                      </span>
                    </li>
                  ))}
              </ol>

              {asking === request.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    ask(request);
                  }}
                  className="mt-4 border-t border-[var(--ops-line)] pt-4"
                >
                  <label
                    htmlFor={`${id}-reason-${request.id}`}
                    className="block text-xs text-[var(--ops-dim)]"
                  >
                    {t("What does the applicant need to do?")}
                  </label>
                  <textarea
                    id={`${id}-reason-${request.id}`}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={2}
                    autoFocus
                    className="mt-2 w-full rounded-lg border border-[var(--ops-line)] bg-[var(--ops-raised)] px-3 py-2 text-sm outline-none focus:border-[var(--ops-accent)]"
                    placeholder={t(
                      "Upload a clearer copy of the passport photo page.",
                    )}
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      type="submit"
                      disabled={!reason.trim()}
                      className="rounded-lg bg-[var(--ops-brand)] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--ops-brand-lift)] disabled:opacity-40"
                    >
                      {t("Send to applicant")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAsking(null);
                        setReason("");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ops-line)] px-3 py-2 text-sm text-[var(--ops-dim)] transition-colors hover:text-[var(--ops-text)]"
                    >
                      <CloseIcon aria-hidden className="size-4" />
                      {t("Cancel")}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--ops-line)] pt-4">
                  {request.status === "Submitted" ? (
                    <Action
                      onClick={() =>
                        advanceRequest(
                          request.id,
                          "In Review",
                          "Picked up for review.",
                        )
                      }
                    >
                      {t("Start review")}
                    </Action>
                  ) : null}
                  {request.status !== "Completed" ? (
                    <Action
                      primary
                      onClick={() =>
                        advanceRequest(
                          request.id,
                          "Completed",
                          "Approved and issued.",
                        )
                      }
                    >
                      <CheckIcon aria-hidden className="size-4" />
                      {t("Approve")}
                    </Action>
                  ) : null}
                  {QUEUE.includes(request.status) ? (
                    <>
                      <Action onClick={() => setAsking(request.id)}>
                        {t("Ask for more")}
                      </Action>
                      <Action
                        onClick={() =>
                          advanceRequest(
                            request.id,
                            "Rejected",
                            "Did not meet the service conditions.",
                          )
                        }
                      >
                        {t("Reject")}
                      </Action>
                    </>
                  ) : null}
                </div>
              )}
            </OpsPanel>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Action({
  primary,
  children,
  onClick,
}: {
  primary?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        primary
          ? "bg-[var(--ops-brand)] text-white hover:bg-[var(--ops-brand-lift)]"
          : "border border-[var(--ops-line)] text-[var(--ops-dim)] hover:bg-[var(--ops-raised)] hover:text-[var(--ops-text)]"
      }`}
    >
      {children}
    </button>
  );
}
