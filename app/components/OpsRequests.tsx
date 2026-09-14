"use client";

import { useId, useMemo, useState } from "react";
import { OpsPanel } from "./OpsPieces";
import {
  advanceRequest,
  useStore,
  type RequestStatus,
  type TrackedRequest,
} from "./store";
import { formatDate, formatDateTime } from "./ui";
import { CheckIcon, CloseIcon, SearchIcon } from "./icons";

const QUEUE: RequestStatus[] = ["Submitted", "In Review", "Action Needed"];

const TONE: Record<RequestStatus, string> = {
  Submitted: "bg-[var(--ops-raised)] text-[var(--ops-dim)]",
  "In Review": "bg-[#0f2f45] text-[#a8d8f5]",
  "Action Needed": "bg-[#3a2c0a] text-[#f0d79a]",
  Completed: "bg-[#10392b] text-[#7cf0bd]",
  Rejected: "bg-[#3d1616] text-[#f5a8a8]",
};

/**
 * Service requests as work, rather than as the citizen's receipt. Deciding one
 * here writes straight through to the portal screen the applicant is looking
 * at — same store, same timeline.
 */
export default function OpsRequests() {
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
      return `${r.id} ${r.service}`.toLowerCase().includes(q);
    });
  }, [requests, query, openOnly]);

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
        <h1 className="font-secondary text-2xl font-bold">Service requests</h1>
        <p className="mt-1 text-sm text-[var(--ops-dim)]">
          Applications waiting on a decision. Anything you do here appears on
          the applicant&rsquo;s own screen.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-[var(--ops-line)] bg-[var(--ops-panel)] px-3 focus-within:border-[var(--ops-accent)]">
          <SearchIcon aria-hidden className="size-4 shrink-0 text-[var(--ops-dim)]" />
          <label htmlFor={`${id}-q`} className="sr-only">
            Filter requests
          </label>
          <input
            id={`${id}-q`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Reference or service"
            className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-[var(--ops-dim)]"
          />
        </div>
        <button
          type="button"
          aria-pressed={openOnly}
          onClick={() => setOpenOnly((v) => !v)}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            openOnly
              ? "bg-[var(--ops-accent)] text-[#062018]"
              : "border border-[var(--ops-line)] bg-[var(--ops-panel)] text-[var(--ops-dim)] hover:text-[var(--ops-text)]"
          }`}
        >
          Open only
        </button>
      </div>

      <p aria-live="polite" className="text-xs text-[var(--ops-dim)]">
        {visible.length} of {requests.length} requests
      </p>

      {visible.length === 0 ? (
        <OpsPanel>
          <p className="py-10 text-center text-sm text-[var(--ops-dim)]">
            {openOnly
              ? "Queue clear. Nothing is waiting on a decision."
              : "No request matches that search."}
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
                    {request.service}
                  </p>
                  <p className="mt-1 text-xs text-[var(--ops-dim)] tabular-nums">
                    {request.id} · submitted {formatDate(request.submitted)} ·{" "}
                    {request.fee} · via {request.channel}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${TONE[request.status]}`}
                >
                  {request.status}
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
                        {formatDateTime(step.at)}
                      </span>
                      <span className="min-w-0">
                        <span className="font-medium">{step.label}</span>
                        {step.note ? (
                          <span className="text-[var(--ops-dim)]">
                            {" "}
                            — {step.note}
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
                    What does the applicant need to do?
                  </label>
                  <textarea
                    id={`${id}-reason-${request.id}`}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={2}
                    autoFocus
                    className="mt-2 w-full rounded-lg border border-[var(--ops-line)] bg-[var(--ops-raised)] px-3 py-2 text-sm outline-none focus:border-[var(--ops-accent)]"
                    placeholder="Upload a clearer copy of the passport photo page."
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      type="submit"
                      disabled={!reason.trim()}
                      className="rounded-lg bg-[var(--ops-accent)] px-3 py-2 text-sm font-medium text-[#062018] transition-opacity hover:opacity-90 disabled:opacity-40"
                    >
                      Send to applicant
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
                      Cancel
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
                      Start review
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
                      Approve
                    </Action>
                  ) : null}
                  {QUEUE.includes(request.status) ? (
                    <>
                      <Action onClick={() => setAsking(request.id)}>
                        Ask for more
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
                        Reject
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
          ? "bg-[var(--ops-accent)] text-[#062018] hover:opacity-90"
          : "border border-[var(--ops-line)] text-[var(--ops-dim)] hover:bg-[var(--ops-raised)] hover:text-[var(--ops-text)]"
      }`}
    >
      {children}
    </button>
  );
}
