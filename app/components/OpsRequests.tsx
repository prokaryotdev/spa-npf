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
import { RequestsGlyph } from "./ops-glyphs";
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

const daysOpen = (r: TrackedRequest, now: number) =>
  Math.floor((now - new Date(r.submitted).getTime()) / 86_400_000);

function StatusPill({ status }: { status: RequestStatus }) {
  const t = useT();
  return (
    <span className={`npf-pill whitespace-nowrap ${TONE[status]}`}>
      <span aria-hidden className="npf-pill-dot" />
      {t(LABEL[status])}
    </span>
  );
}

/**
 * Service requests as work, rather than as the citizen's receipt: the same
 * list-and-record layout as Calls and Case files. Deciding one here writes
 * straight through to the portal screen the applicant is looking at — same
 * store, same timeline.
 *
 * (Was a grid of cards, each a loose stack of title, pill, a run-on meta
 * line, an upload box, a timeline and three buttons. User, 2026-10-16:
 * "very very poor and not professional".)
 */
export default function OpsRequests() {
  const t = useT();
  const id = useId();
  const { requests, viewing } = useScoped();
  const [query, setQuery] = useState("");
  const [openOnly, setOpenOnly] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const now = useNow();

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

  const count = (s: RequestStatus) =>
    requests.filter((r) => r.status === s).length;
  const current = requests.find((r) => r.id === selected) ?? null;

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
        {/* A view switch, not an action: the segmented control the shift
            report uses for its period, so it never reads as the board's one
            filled button. */}
        <div
          role="radiogroup"
          aria-label={t("Filter requests")}
          className="inline-flex gap-1 rounded-[0.625rem] bg-white p-1 shadow-[var(--ops-control-rim),var(--ops-control-lift)]"
        >
          {[
            { on: true, label: t("To decide"), n: requests.filter((r) => QUEUE.includes(r.status)).length },
            { on: false, label: t("All requests"), n: requests.length },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              role="radio"
              aria-checked={openOnly === o.on}
              onClick={() => setOpenOnly(o.on)}
              className={`inline-flex h-8 items-center gap-2 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-colors ${
                openOnly === o.on
                  ? "bg-ops-brand text-white"
                  : "text-ops-dim hover:bg-ops-hover hover:text-ops-text"
              }`}
            >
              {o.label}
              <span className={`font-mono text-xs tabular-nums ${openOnly === o.on ? "text-white/75" : ""}`}>{o.n}</span>
            </button>
          ))}
        </div>

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

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px] 2xl:grid-cols-[minmax(0,1fr)_460px]">
        <div className="min-w-0">
          <OpsPanel flush>
            {visible.length ? (
              <table className="w-full text-start text-sm">
                <caption className="sr-only">
                  {t("Service requests, with service, status, command, days open and officer")}
                </caption>
                <thead className="npf-ops-thead text-xs text-ops-dim">
                  <tr className="whitespace-nowrap">
                    <th scope="col" className="w-full py-3 ps-5 pe-4 font-medium">{t("Service")}</th>
                    <th scope="col" className="hidden py-3 pe-4 font-medium md:table-cell">{t("Status")}</th>
                    <th scope="col" className="hidden py-3 pe-4 font-medium xl:table-cell">{t("Command")}</th>
                    <th scope="col" className="hidden py-3 pe-4 font-medium sm:table-cell">{t("Handled by")}</th>
                    <th scope="col" className="py-3 pe-5 text-end font-medium">{t("Waiting")}</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r) => {
                    const active = selected === r.id;
                    const open = QUEUE.includes(r.status);
                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelected(r.id)}
                        aria-selected={active}
                        className={`cursor-pointer border-b border-ops-line-soft last:border-0 ${active ? "bg-npf-mist" : "hover:bg-ops-hover"}`}
                      >
                        <th scope="row" className="py-3.5 ps-5 pe-4 text-start align-top font-normal">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(r.id);
                            }}
                            className="text-start font-medium text-ops-text underline-offset-4 hover:underline"
                          >
                            {t(r.service)}
                          </button>
                          <span className="mt-0.5 block font-mono text-xs text-ops-dim tabular-nums">{r.id}</span>
                          <span className="mt-1.5 block md:hidden"><StatusPill status={r.status} /></span>
                        </th>
                        <td className="hidden py-3.5 pe-4 align-top md:table-cell"><StatusPill status={r.status} /></td>
                        <td className="hidden py-3.5 pe-4 align-top text-xs whitespace-nowrap xl:table-cell">
                          {r.where ? (
                            <>
                              <span className="font-medium">{commandLabel(t, r.where.state)}</span>
                              <span className="mt-0.5 block text-ops-dim">{divisionLabel(t, r.where.lga, r.where.division)}</span>
                            </>
                          ) : (
                            <span className="text-ops-dim">—</span>
                          )}
                        </td>
                        <td className="hidden py-3.5 pe-4 align-top text-xs whitespace-nowrap sm:table-cell">
                          {r.assignee ? (
                            <span className="font-medium">{t(r.assignee)}</span>
                          ) : open ? (
                            <span className="font-semibold text-ops-p2">{t("Nobody yet")}</span>
                          ) : (
                            <span className="text-ops-dim">—</span>
                          )}
                        </td>
                        <td className="py-3.5 pe-5 text-end align-top font-mono text-sm font-medium whitespace-nowrap tabular-nums">
                          {open && now ? t("{n} d", { n: daysOpen(r, now) }) : <span className="text-ops-dim">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : openOnly && !query.trim() ? (
              /* A search that found nothing is a miss even with "To decide"
                 on; only an empty queue with no search is good news. */
              <OpsEmpty
                title={t("Queue clear")}
                hint={t("Nothing is waiting on a decision.")}
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
        </div>

        <div className="lg:sticky lg:top-[calc(var(--ops-top)+1.25rem)] lg:self-start">
          {current ? (
            <RequestDetail
              key={current.id}
              request={current}
              routed={!!current.where || !!viewing}
              onClose={() => setSelected(null)}
            />
          ) : (
            <OpsPanel title={t("Service request")} className="max-lg:hidden" flush>
              <OpsEmpty
                tone="idle"
                icon={<RequestsGlyph className="size-6" />}
                hint={t("Pick a request to read it, take it and decide it.")}
              />
            </OpsPanel>
          )}
        </div>
      </div>
    </div>
  );
}

/** A small heading over one part of the record. */
function Part({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mt-5 mb-2 border-t border-ops-line-soft pt-4 text-xs font-semibold text-npf-steel">
      {children}
    </h4>
  );
}

/**
 * One request as a record: what was asked for and its state, then labelled
 * fields, the applicant's answers, its history and the decision. Every fact
 * sits beside its label instead of in a sentence of dots.
 */
function RequestDetail({
  request,
  routed,
  onClose,
}: {
  request: TrackedRequest;
  routed: boolean;
  onClose: () => void;
}) {
  const t = useT();
  const format = useFormat();
  const id = useId();
  const now = useNow();
  const open = QUEUE.includes(request.status);
  // Asking for more and refusing both need a sentence the applicant reads.
  const [asking, setAsking] = useState<"more" | "refuse" | null>(null);
  const [reason, setReason] = useState("");

  function send() {
    const note = reason.trim();
    if (!note) return;
    advanceRequest(request.id, asking === "refuse" ? "Rejected" : "Action Needed", note);
    setAsking(null);
    setReason("");
  }

  return (
    <OpsPanel
      title={request.id}
      action={
        <button
          type="button"
          onClick={onClose}
          aria-label={t("Close request")}
          className="grid size-8 place-items-center rounded-(--ops-control-radius) text-ops-dim ring-1 ring-ops-line-soft ring-inset hover:bg-ops-hover hover:text-ops-text"
        >
          <CloseIcon className="size-4" />
        </button>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill status={request.status} />
        {open && now ? (
          <span className="text-xs text-ops-dim tabular-nums">
            {t("Open {n} days", { n: daysOpen(request, now) })}
          </span>
        ) : null}
      </div>
      <h3 className="mt-3 font-secondary text-lg leading-snug font-bold text-npf-ink">
        {t(request.service)}
      </h3>

      <dl className="mt-4 grid grid-cols-[7rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-[0.8125rem]">
        <dt className="text-ops-dim">{t("Submitted")}</dt>
        <dd className="tabular-nums">{format.date(request.submitted)}</dd>
        <dt className="text-ops-dim">{t("Fee")}</dt>
        <dd>{t(request.fee)}</dd>
        <dt className="text-ops-dim">{t("Channel")}</dt>
        <dd>{t(request.channel)}</dd>
        <dt className="text-ops-dim">{t("Command")}</dt>
        <dd>
          {request.where ? (
            <>
              <span className="font-medium">{commandLabel(t, request.where.state)}</span>
              <span className="block text-xs text-ops-dim">
                {divisionLabel(t, request.where.lga, request.where.division)}
              </span>
            </>
          ) : routed ? (
            "—"
          ) : (
            <span className="text-ops-p2">{t("No command set: route it before deciding.")}</span>
          )}
        </dd>
        {/* Who has it: a request nobody owns is one nobody chases. */}
        <dt className="self-center text-ops-dim">{t("Handled by")}</dt>
        <dd className="flex flex-wrap items-center gap-2">
          {request.assignee ? (
            <span className="font-medium">{t(request.assignee)}</span>
          ) : open ? (
            <>
              <span className="font-semibold text-ops-p2">{t("Nobody yet")}</span>
              <OpsButton tone="ghost" onClick={() => assignRequest(request.id, actor())} className="h-7 !px-2.5 !text-xs">
                {t("Take it")}
              </OpsButton>
            </>
          ) : (
            "—"
          )}
        </dd>
        {request.appointment ? (
          <>
            <dt className="text-ops-dim">{t("Biometrics appointment")}</dt>
            <dd className="tabular-nums">{format.dateTime(request.appointment)}</dd>
          </>
        ) : null}
        {request.docNo ? (
          <>
            <dt className="text-ops-dim">{t("Document number")}</dt>
            <dd className="font-mono font-medium">{request.docNo}</dd>
          </>
        ) : null}
      </dl>

      {request.answers?.length || request.documents?.length ? (
        <>
          <Part>{t("Details")}</Part>
          <dl className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-[0.8125rem]">
            {request.answers?.map((a) => (
              <div key={a.label} className="contents">
                <dt className="text-ops-dim">{t(a.label)}</dt>
                <dd className="break-words">{t(a.value)}</dd>
              </div>
            ))}
            {request.documents?.length ? (
              <>
                <dt className="text-ops-dim">{t("Documents")}</dt>
                <dd className="break-words">{request.documents.map((d) => d.file).join(", ")}</dd>
              </>
            ) : null}
          </dl>
        </>
      ) : null}

      {/* The same dotted rail the applicant reads their request on, newest
          step on top and the only one in the brand blue. */}
      <Part>{t("History")}</Part>
      <ol className="relative space-y-3 ps-5 text-[0.8125rem]">
        <span aria-hidden className="absolute top-2 bottom-2 start-[4px] w-px bg-ops-line" />
        {request.timeline
          .slice()
          .reverse()
          .map((step, i) => (
            <li key={step.at + step.label} className="relative">
              <span
                aria-hidden
                className={`absolute top-1.5 -start-5 size-2.25 rounded-full ring-3 ring-ops-panel ${
                  i === 0 ? "bg-ops-accent" : "bg-ops-line"
                }`}
              />
              <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="font-medium">{t(step.label)}</span>
                <span className="text-xs text-ops-dim tabular-nums">{format.dateTime(step.at)}</span>
              </span>
              {step.note ? (
                <span className="mt-0.5 block text-xs text-ops-dim">
                  {line(t, step.note, step.vars, request.where)}
                </span>
              ) : null}
            </li>
          ))}
      </ol>

      {/* A scanned form or the signed certificate, added to the file and to
          the applicant's timeline. */}
      <details className="mt-5 border-t border-ops-line-soft pt-4 text-xs">
        <summary className="w-fit rounded font-medium text-ops-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-npf-blue-mid">
          {t("Attach a document")}
        </summary>
        <div className="mt-3">
          <MediaPicker
            id={`${id}-doc`}
            tone="ops"
            optional
            max={3}
            label={t("Add a document to the file")}
            media={[]}
            onChange={(m) => attachToRequest(request.id, m.map((f) => f.name))}
            by={actor()}
          />
        </div>
      </details>

      {asking ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="mt-5 border-t border-ops-line-soft pt-4"
        >
          <label htmlFor={`${id}-reason`} className="block text-xs text-ops-dim">
            {asking === "refuse"
              ? t("Why is it refused? The applicant reads this.")
              : t("What does the applicant need to do?")}
          </label>
          <textarea
            id={`${id}-reason`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            autoFocus
            className="mt-2 w-full rounded-chip bg-white px-3 py-2 text-sm text-npf-ink ring-1 ring-npf-ink/15 outline-none ring-inset transition-[box-shadow] placeholder:text-npf-steel hover:ring-npf-ink/30 focus:ring-2 focus:ring-npf-blue-mid"
            placeholder={
              asking === "refuse"
                ? t("The applicant is not resident in this command.")
                : t("Upload a clearer copy of the passport photo page.")
            }
          />
          <div className="mt-3 flex gap-2">
            <OpsButton type="submit" tone={asking === "refuse" ? "danger" : "brand"} disabled={!reason.trim()}>
              {asking === "refuse" ? t("Refuse") : t("Send to applicant")}
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
      ) : request.incident || open ? (
        /* One button vocabulary across the console: the same OpsButton the
           Calls and Units boards use. */
        <div className="mt-5 flex flex-wrap gap-2 border-t border-ops-line-soft pt-4">
          {/* A crime report is worked as a call, not decided here. */}
          {request.incident ? (
            <Link
              href={`/app/police/incidents?call=${request.incident}`}
              className="inline-flex min-h-10 items-center rounded-(--ops-control-radius) bg-white px-3.5 text-sm font-medium text-ops-accent shadow-[var(--ops-control-rim),var(--ops-control-lift)] transition-colors hover:bg-ops-hover"
            >
              {t("Open the call on the board")}
            </Link>
          ) : (
            <>
              <OpsButton
                tone="brand"
                onClick={() => advanceRequest(request.id, "Completed", "Approved and issued.")}
              >
                <CheckIcon aria-hidden className="size-4" />
                {t("Approve")}
              </OpsButton>
              {request.status === "Submitted" ? (
                <OpsButton onClick={() => advanceRequest(request.id, "In Review", "Picked up for review.")}>
                  {t("Start review")}
                </OpsButton>
              ) : null}
              <OpsButton onClick={() => setAsking("more")}>{t("Ask for more")}</OpsButton>
              <OpsButton tone="danger" onClick={() => setAsking("refuse")} className="ms-auto">
                {t("Reject")}
              </OpsButton>
            </>
          )}
        </div>
      ) : null}
    </OpsPanel>
  );
}
