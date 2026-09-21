"use client";

import { useId, useMemo, useState } from "react";
import {
  OpsButton,
  OpsEmpty,
  OpsHead,
  OpsPanel,
  OpsSearch,
  Readout,
  ReadoutStrip,
} from "./OpsPieces";
import {
  advanceRequest,
  useStore,
  type RequestStatus,
  type TrackedRequest,
} from "./store";
import { CheckIcon, CloseIcon } from "./icons";
import { useFormat, useT } from "../i18n/client";

const QUEUE: RequestStatus[] = ["Submitted", "In Review", "Action Needed"];

const TONE: Record<RequestStatus, string> = {
  Submitted: "bg-[var(--ops-raised)] text-[var(--ops-dim)]",
  "In Review": "bg-[#E7E9FC] text-[#36309B]",
  "Action Needed": "bg-[#FDF0DC] text-[#8A4B06]",
  Completed: "bg-[#DCF2E4] text-[#0E6437]",
  Rejected: "bg-[#FBE4E4] text-[#9B1C1C]",
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
      <OpsHead
        title={t("Service requests")}
        lead={t(
          "Applications waiting on a decision. Anything you do here appears on the applicant’s own screen within the second.",
        )}
      />

      <ReadoutStrip>
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
      </ReadoutStrip>

      <div className="flex flex-wrap items-center gap-2">
        <OpsSearch
          id={`${id}-q`}
          label={t("Filter requests")}
          placeholder={t("Reference or service")}
          value={query}
          onChange={setQuery}
        />
        <OpsButton
          tone={openOnly ? "brand" : "quiet"}
          aria-pressed={openOnly}
          onClick={() => setOpenOnly((v) => !v)}
        >
          {t("Open only")}
        </OpsButton>

        <p
          aria-live="polite"
          className="ms-auto text-xs text-[var(--ops-dim)] tabular-nums"
        >
          {t("{shown} of {total} requests", {
            shown: visible.length,
            total: requests.length,
          })}
        </p>
      </div>

      {visible.length === 0 ? (
        <OpsPanel>
          {openOnly ? (
            <OpsEmpty
              title={t("Queue clear")}
              hint={t(
                "Nothing is waiting on a decision. Turn off “Open only” to read the ones already settled.",
              )}
            />
          ) : (
            <OpsEmpty
              tone="none"
              title={t("No request matches that search")}
              hint={t(
                "Try the reference number, or the name of the service the applicant asked for.",
              )}
            />
          )}
        </OpsPanel>
      ) : null}

      {/* Stretch, not start-align: two cards side by side with different
          timelines used to end at different heights, so the pair of action
          rows an officer reaches for sat at two different depths. */}
      <ul className="grid gap-3 xl:grid-cols-2">
        {visible.map((request) => (
          <li key={request.id} className="flex">
            <OpsPanel className="w-full" bodyClassName="flex flex-1 flex-col">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <h2 className="font-secondary text-base font-bold">
                    {t(request.service)}
                  </h2>
                  <span
                    className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${TONE[request.status]}`}
                  >
                    {t(request.status)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--ops-dim)] tabular-nums">
                  {t("{ref} · submitted {date} · {fee} · via {channel}", {
                    ref: request.id,
                    date: format.date(request.submitted),
                    fee: t(request.fee),
                    channel: t(request.channel),
                  })}
                </p>
              </div>

              <ol className="mt-4 space-y-1.5 border-t border-[var(--ops-line-soft)] pt-3 text-xs">
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
                  className="mt-auto border-t border-[var(--ops-line-soft)] pt-4"
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
                    <OpsButton
                      type="submit"
                      tone="brand"
                      disabled={!reason.trim()}
                    >
                      {t("Send to applicant")}
                    </OpsButton>
                    <OpsButton
                      onClick={() => {
                        setAsking(null);
                        setReason("");
                      }}
                    >
                      <CloseIcon aria-hidden className="size-4" />
                      {t("Cancel")}
                    </OpsButton>
                  </div>
                </form>
              ) : (
                /* One button vocabulary across the console: these are the
                   same OpsButton the Calls board and the Units board use,
                   rather than a second set that looked almost but not quite
                   like them. */
                <div className="mt-auto flex flex-wrap gap-2 border-t border-[var(--ops-line-soft)] pt-4">
                  {request.status === "Submitted" ? (
                    <OpsButton
                      onClick={() =>
                        advanceRequest(
                          request.id,
                          "In Review",
                          "Picked up for review.",
                        )
                      }
                    >
                      {t("Start review")}
                    </OpsButton>
                  ) : null}
                  {QUEUE.includes(request.status) ? (
                    <>
                      <OpsButton
                        tone="brand"
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
                      </OpsButton>
                      <OpsButton onClick={() => setAsking(request.id)}>
                        {t("Ask for more")}
                      </OpsButton>
                      <OpsButton
                        tone="danger"
                        onClick={() =>
                          advanceRequest(
                            request.id,
                            "Rejected",
                            "Did not meet the service conditions.",
                          )
                        }
                      >
                        {t("Reject")}
                      </OpsButton>
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
