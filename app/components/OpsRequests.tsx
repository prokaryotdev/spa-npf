"use client";

import { filterBy } from "../search-text";
import { useId, useMemo, useState } from "react";
import {
  OpsButton,
  OpsEmpty,
  OpsFigures,
  OpsHead,
  OpsPanel,
  OpsSearch,
  useNow,
  useScoped,
} from "./OpsPieces";
import Link from "../i18n/Link";
import { commandLabel, divisionLabel, line } from "./Where";
import {
  actor,
  advanceRequest,
  assignRequest,
  attachToRequest,
  type RequestStatus,
  type TrackedRequest,
} from "./store";
import { CheckIcon, CloseIcon } from "./icons";
import { useFormat, useT } from "../i18n/client";
import { MediaPicker } from "./media";

const QUEUE: RequestStatus[] = ["Submitted", "In Review", "Action Needed"];

const TONE: Record<RequestStatus, string> = {
  Submitted: "bg-ops-fill text-ops-dim",
  "In Review": "bg-ops-route-wash text-ops-route",
  "Action Needed": "bg-ops-p2-wash text-ops-p2",
  Completed: "bg-ops-ok-wash text-ops-ok",
  Rejected: "bg-ops-p1-wash text-ops-p1",
};

/** Sentence case, like every other pill in the console and the timeline
 *  steps under it; "In Review" sat right above "In review". */
const LABEL: Record<RequestStatus, string> = {
  Submitted: "Submitted",
  "In Review": "In review",
  "Action Needed": "Action needed",
  Completed: "Completed",
  Rejected: "Rejected",
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
  const { requests, viewing } = useScoped();
  const [query, setQuery] = useState("");
  const [openOnly, setOpenOnly] = useState(true);
  // Asking for more and refusing both need a sentence the applicant reads.
  const [asking, setAsking] = useState<{ id: string; reject: boolean } | null>(
    null,
  );
  const [reason, setReason] = useState("");

  const visible = useMemo(() => {
    return filterBy(
      requests.filter((r) => !openOnly || QUEUE.includes(r.status)),
      query,
      (r) =>
        [
          r.id,
          r.service,
          t(r.service),
          r.status,
          t(r.status),
          r.channel,
          r.where?.state ?? "",
          r.where?.lga ?? "",
        ].join(" "),
    );
  }, [requests, query, openOnly, t]);

  const now = useNow();
  const count = (s: RequestStatus) =>
    requests.filter((r) => r.status === s).length;

  function ask(request: TrackedRequest) {
    const note = reason.trim();
    if (!note) return;
    if (asking?.reject) advanceRequest(request.id, "Rejected", note);
    else advanceRequest(request.id, "Action Needed", note);
    setAsking(null);
    setReason("");
  }

  return (
    <div className="space-y-8">
      <OpsHead
        title={t("Service requests")}
        lead={t("What you decide here shows on the applicant’s screen at once.")}
        action={
          <OpsFigures
            figures={[
              { label: t("Submitted"), value: count("Submitted") },
              { label: t("In review"), value: count("In Review") },
              {
                label: t("Action needed"),
                value: count("Action Needed"),
                tone: count("Action Needed") ? "var(--ops-p2)" : "var(--ops-dim)",
              },
              {
                label: t("Completed"),
                value: count("Completed"),
                tone: "var(--ops-ok)",
              },
            ]}
          />
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <OpsSearch
          id={`${id}-q`}
          label={t("Filter requests")}
          placeholder={t("Reference or service")}
          value={query}
          onChange={setQuery}
          found={visible.length}
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
          className="ms-auto text-xs text-ops-dim tabular-nums"
        >
          {t("{shown} of {total} requests", {
            shown: visible.length,
            total: requests.length,
          })}
        </p>
      </div>

      {visible.length === 0 ? (
        <OpsPanel flush>
          {/* A search that found nothing is a miss even with "Open only"
              on; only an empty queue with no search is good news. */}
          {openOnly && !query.trim() ? (
            <OpsEmpty
              title={t("Queue clear")}
              hint={t(
                "Nothing is waiting on a decision. Turn off “Open only” to read the ones already settled.",
              )}
              action={
                <OpsButton onClick={() => setOpenOnly(false)}>
                  {t("Show settled requests")}
                </OpsButton>
              }
            />
          ) : (
            <OpsEmpty
              tone="none"
              title={t("No request matches that search")}
              hint={t(
                "Try the reference number, or the name of the service the applicant asked for.",
              )}
              action={
                <OpsButton onClick={() => setQuery("")}>
                  <CloseIcon aria-hidden className="size-3.5" />
                  {t("Clear search")}
                </OpsButton>
              }
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
                  <span className={`npf-pill ${TONE[request.status]}`}>
                    <span aria-hidden className="npf-pill-dot" />
                    {t(LABEL[request.status])}
                  </span>
                  {/* How long the applicant has been waiting on this desk:
                      the figure the request list is worked oldest-first by. */}
                  {now && QUEUE.includes(request.status) ? (
                    <span className="ms-auto text-xs font-medium text-npf-steel tabular-nums">
                      {t("Open {n} days", {
                        n: Math.floor(
                          (now - new Date(request.submitted).getTime()) /
                            86_400_000,
                        ),
                      })}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-ops-dim tabular-nums">
                  {t("{ref} · submitted {date} · {fee} · via {channel}", {
                    ref: request.id,
                    date: format.date(request.submitted),
                    fee: t(request.fee),
                    channel: t(request.channel),
                  })}
                </p>
                {request.where ? (
                  <p className="mt-1 text-xs">
                    <span className="font-medium">
                      {commandLabel(t, request.where.state)}
                    </span>
                    <span className="text-ops-dim">
                      {" · "}
                      {divisionLabel(t, request.where.lga, request.where.division)}
                    </span>
                  </p>
                ) : viewing ? null : (
                  <p className="mt-1 text-xs text-ops-dim">
                    {t("No command set: route it before deciding.")}
                  </p>
                )}
                {request.answers?.length || request.documents?.length ? (
                  <dl className="mt-3 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 rounded-chip bg-ops-fill p-3 text-xs">
                    {request.answers?.map((a) => (
                      <div key={a.label} className="contents">
                        <dt className="text-ops-dim">{t(a.label)}</dt>
                        <dd className="line-clamp-3 break-words">{t(a.value)}</dd>
                      </div>
                    ))}
                    {request.documents?.length ? (
                      <>
                        <dt className="text-ops-dim">{t("Documents")}</dt>
                        <dd className="break-words">
                          {request.documents.map((d) => d.file).join(", ")}
                        </dd>
                      </>
                    ) : null}
                  </dl>
                ) : null}
                {/* Who has it: a request nobody owns is one nobody chases. */}
                <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  {request.assignee ? (
                    <span>
                      <span className="text-ops-dim">{t("Handled by")}</span>{" "}
                      <span className="font-medium">{t(request.assignee)}</span>
                    </span>
                  ) : QUEUE.includes(request.status) ? (
                    <>
                      <span className="font-medium text-ops-p2">{t("Nobody has picked it up")}</span>
                      <button
                        type="button"
                        onClick={() => assignRequest(request.id, actor())}
                        className="font-medium text-ops-accent hover:underline"
                      >
                        {t("Take it")}
                      </button>
                    </>
                  ) : null}
                  {request.docNo ? (
                    <span>
                      <span className="text-ops-dim">{t("Document number")}</span>{" "}
                      <span className="font-mono font-medium">{request.docNo}</span>
                    </span>
                  ) : null}
                </p>
                {/* A scanned form or the signed certificate, added to the file
                    and to the applicant's timeline. */}
                <div className="mt-3">
                  <MediaPicker
                    id={`${id}-${request.id}-doc`}
                    tone="ops"
                    optional
                    max={3}
                    label={t("Add a document to the file")}
                    media={[]}
                    onChange={(m) => attachToRequest(request.id, m.map((f) => f.name))}
                    by={actor()}
                  />
                </div>
              </div>

              {/* The same dotted rail the applicant reads their request on,
                  newest step on top and the only one in the brand blue. */}
              <ol className="relative mt-4 space-y-2 border-t border-ops-line-soft pt-3 ps-5 text-xs">
                <span
                  aria-hidden
                  className="absolute top-5 bottom-1.5 start-[4px] w-px bg-ops-line"
                />
                {request.timeline
                  .slice()
                  .reverse()
                  .slice(0, 3)
                  .map((step, i) => (
                    <li key={step.at + step.label} className="relative flex gap-3">
                      <span
                        aria-hidden
                        className={`absolute top-1 -start-5 size-2.25 rounded-full ring-3 ring-ops-panel ${
                          i === 0 ? "bg-ops-accent" : "bg-ops-line"
                        }`}
                      />
                      <span className="w-24 shrink-0 text-ops-dim tabular-nums">
                        {format.dateTime(step.at)}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium">{t(step.label)}</span>
                        {/* The note on its own line under the step, not
                            hung off it by a dash: a long note then wraps
                            under itself instead of under the step name. */}
                        {step.note ? (
                          <span className="mt-0.5 block text-ops-dim">
                            {line(t, step.note, step.vars, request.where)}
                          </span>
                        ) : null}
                      </span>
                    </li>
                  ))}
              </ol>

              {asking?.id === request.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    ask(request);
                  }}
                  className="mt-auto border-t border-ops-line-soft pt-4"
                >
                  <label
                    htmlFor={`${id}-reason-${request.id}`}
                    className="block text-xs text-ops-dim"
                  >
                    {asking.reject
                      ? t("Why is it refused? The applicant reads this.")
                      : t("What does the applicant need to do?")}
                  </label>
                  <textarea
                    id={`${id}-reason-${request.id}`}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={2}
                    autoFocus
                    className="mt-2 w-full px-3 py-2 text-sm rounded-chip bg-white text-npf-ink ring-1 ring-npf-ink/15 ring-inset outline-none placeholder:text-npf-steel transition-[box-shadow] hover:ring-npf-ink/30 focus:ring-2 focus:ring-npf-blue-mid"
                    placeholder={
                      asking.reject
                        ? t("The applicant is not resident in this command.")
                        : t("Upload a clearer copy of the passport photo page.")
                    }
                  />
                  <div className="mt-3 flex gap-2">
                    <OpsButton
                      type="submit"
                      tone={asking.reject ? "danger" : "brand"}
                      disabled={!reason.trim()}
                    >
                      {asking.reject ? t("Refuse") : t("Send to applicant")}
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
                <div className="mt-auto flex flex-wrap gap-2 border-t border-ops-line-soft pt-4">
                  {/* A crime report is worked as a call, not decided here. */}
                  {request.incident ? (
                    <Link
                      href={`/app/police/incidents?call=${request.incident}`}
                      className="inline-flex min-h-10 items-center rounded-(--ops-control-radius) bg-white px-3.5 text-sm font-medium text-ops-accent shadow-[var(--ops-control-rim),var(--ops-control-lift)] transition-colors hover:bg-ops-hover"
                    >
                      {t("Open the call on the board")}
                    </Link>
                  ) : null}
                  {!request.incident && request.status === "Submitted" ? (
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
                  {!request.incident && QUEUE.includes(request.status) ? (
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
                      <OpsButton
                        onClick={() => setAsking({ id: request.id, reject: false })}
                      >
                        {t("Ask for more")}
                      </OpsButton>
                      <OpsButton
                        tone="danger"
                        onClick={() => setAsking({ id: request.id, reject: true })}
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
