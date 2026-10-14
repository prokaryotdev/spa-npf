"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { useFormat, useT } from "../i18n/client";
import {
  addToReport,
  findReference,
  useStore,
  type Incident,
  type Media,
  type TrackedRequest,
} from "./store";
import { CheckIcon, SearchIcon } from "./icons";
import { MediaPicker } from "./media";
import { StatusPill } from "./ui";
import { RouteCard, line } from "./Where";
import { FieldNote } from "./Where";

/**
 * The public tracker: a reference in, where it is and what has happened to
 * it out. A crime report shows only what a reporter is entitled to: that it
 * was received, who has it, and whether officers are on it. Never the unit,
 * the officer's name or the desk's notes.
 */
export default function TrackForm() {
  const t = useT();
  const format = useFormat();
  const id = useId();
  const params = useSearchParams();
  const { loaded, requests, incidents } = useStore();
  const [ref, setRef] = useState("");
  const [asked, setAsked] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const q = params.get("ref");
    if (q) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRef(q);
      setAsked(q);
    }
  }, [params]);

  // Read on every render, so a status moved on the console shows here at once.
  void requests;
  void incidents;
  const found = loaded && asked ? findReference(asked) : null;

  return (
    <div className="mx-auto max-w-180 space-y-6">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const v = ref.trim();
          if (!/^NPF-[\dA-Z-]{4,}$/i.test(v)) {
            setError(t("A reference looks like NPF-4418 or NPF-2026-1234."));
            return;
          }
          setError("");
          setAsked(v);
        }}
        className="npf-panel"
      >
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start md:p-6">
          <div className="min-w-0 flex-1">
            <label htmlFor={`${id}-ref`} className="npf-field-label">
              {t("Reference number")}
            </label>
            <input
              id={`${id}-ref`}
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="NPF-4418"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-ref-error` : undefined}
              className="npf-field uppercase tabular-nums"
            />
            <FieldNote id={`${id}-ref`} error={error} />
          </div>
          <button type="submit" className="npf-btn npf-btn-primary hover:bg-npf-blue-mid sm:mt-7">
            <SearchIcon aria-hidden className="size-4.5" />
            {t("Find")}
          </button>
        </div>
      </form>

      <div aria-live="polite">
        {found && !found.request && !found.incident ? (
          <p className="npf-body rounded-card bg-npf-paper p-6 text-npf-body">
            {t(
              "Nothing matches {ref}. Check the number, or contact the command you reported to.",
              { ref: asked.toUpperCase() },
            )}
          </p>
        ) : null}
        {/* A crime report shows as a report even when the reporter's account
            holds a request under the same number: the report says more. */}
        {found?.incident ? (
          <ReportResult incident={found.incident} format={format} />
        ) : found?.request ? (
          <RequestResult request={found.request} />
        ) : null}
      </div>
    </div>
  );
}

function RequestResult({ request }: { request: TrackedRequest }) {
  const t = useT();
  const format = useFormat();
  return (
    <div className="space-y-4">
      <section className="npf-panel">
        <div className="npf-panel-head">
          <h2>{t(request.service)}</h2>
          <StatusPill status={request.status} />
        </div>
        <ol className="npf-rows">
          {request.timeline
            .slice()
            .reverse()
            .map((s) => (
              <li key={s.at + s.label} className="flex gap-4 px-5 py-3.5">
                <time dateTime={s.at} className="npf-small w-32 shrink-0 text-npf-steel tabular-nums">
                  {format.dateTime(s.at)}
                </time>
                <span className="npf-small text-npf-ink">
                  <span className="font-medium">{t(s.label)}</span>
                  {s.note ? <> — {line(t, s.note, s.vars, request.where)}</> : null}
                </span>
              </li>
            ))}
        </ol>
      </section>
      {request.where ? <RouteCard filed where={request.where} /> : null}
    </div>
  );
}

/**
 * A crime report, as its reporter is entitled to see it: where it has got
 * to, the crime reference once there is a case, what the investigator has
 * chosen to tell them, and a way to add what they remember later. Never the
 * unit, the officers' names, the suspects or the desk's log.
 */
function ReportResult({
  incident,
  format,
}: {
  incident: Incident;
  format: ReturnType<typeof useFormat>;
}) {
  const t = useT();
  const { cases } = useStore();
  const file = cases.find((c) => c.id === incident.caseId);

  // The public steps, in order, each with the time it was reached.
  const steps: { label: string; at: string | null }[] = [
    { label: "Received by the command", at: incident.reported },
    { label: "Officers assigned", at: incident.dispatched },
    { label: "Officers attending", at: incident.onScene },
    ...(file
      ? [
          { label: "Under investigation", at: file.opened },
          {
            label: "Charged to court",
            at: file.stage === "Charged to court" || (file.stage === "Closed" && file.result === "Convicted")
              ? file.log.find((l) => l.vars?.stage === "Charged to court")?.at ?? file.updated
              : null,
          },
          { label: "Case closed", at: file.stage === "Closed" ? file.updated : null },
        ]
      : [{ label: "Case closed", at: incident.closed }]),
  ];
  const reached = steps.filter((x) => x.at);
  const now = reached.at(-1)?.label ?? steps[0].label;
  const done = now === "Case closed";

  return (
    <div className="space-y-4">
      <section className="npf-panel">
        <div className="npf-panel-head">
          <h2>{t(incident.kind)}</h2>
          <span className={`npf-pill ${done ? "bg-npf-ok-soft text-npf-ok" : "bg-npf-review-wash text-npf-review"}`}>
            <span aria-hidden className="npf-pill-dot" />
            {t(now)}
          </span>
        </div>
        <ol className="grid gap-0 p-5">
          {steps.map((step, n) => {
            const hit = !!step.at;
            const last = n === steps.length - 1;
            return (
              <li key={step.label} className="relative flex gap-4 pb-4 last:pb-0">
                {!last ? (
                  <span aria-hidden className={`absolute start-[0.6875rem] top-6 bottom-0 w-px ${hit && steps[n + 1].at ? "bg-npf-blue" : "bg-npf-line"}`} />
                ) : null}
                <span
                  aria-hidden
                  className={`relative grid size-6 shrink-0 place-items-center rounded-full ${hit ? "bg-npf-blue text-white" : "bg-white ring-2 ring-npf-line ring-inset"}`}
                >
                  {hit ? <CheckIcon className="size-3.5" /> : null}
                </span>
                <span className="npf-small min-w-0 pt-0.5">
                  <span className={hit ? "font-medium text-npf-ink" : "text-npf-steel"}>{t(step.label)}</span>
                  {step.at ? (
                    <time dateTime={step.at} className="block text-npf-steel tabular-nums">
                      {format.dateTime(step.at)}
                    </time>
                  ) : null}
                  <span className="sr-only">{hit ? t("Done") : t("Not yet")}</span>
                </span>
              </li>
            );
          })}
        </ol>
        {file ? (
          <p className="npf-small border-t border-npf-hairline bg-npf-paper px-5 py-4 text-npf-body">
            {t("Crime reference")}{" "}
            <span className="font-mono font-semibold text-npf-ink">{file.id}</span>.{" "}
            {t("Quote it to your insurer or your bank if they ask for a police report.")}
          </p>
        ) : null}
      </section>

      {file?.updates.length ? (
        <section className="npf-panel">
          <div className="npf-panel-head">
            <h2>{t("Updates from the investigator")}</h2>
          </div>
          <ol className="npf-rows">
            {file.updates
              .slice()
              .reverse()
              .map((u) => (
                <li key={u.at} className="px-5 py-3.5">
                  <time dateTime={u.at} className="npf-small block text-npf-steel tabular-nums">
                    {format.dateTime(u.at)}
                  </time>
                  <p className="npf-small mt-1 text-npf-ink">{t(u.text)}</p>
                </li>
              ))}
          </ol>
        </section>
      ) : null}

      {!done ? <AddInformation key={incident.id} reference={incident.id} /> : null}
      <RouteCard filed where={incident.where} />
    </div>
  );
}

/**
 * Something remembered later, a photo found on a phone: added to the same
 * report, so it reaches the officers on the call and the investigator.
 */
function AddInformation({ reference }: { reference: string }) {
  const t = useT();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [media, setMedia] = useState<Media[]>([]);
  const [sent, setSent] = useState(false);
  if (sent)
    return (
      <p role="status" className="npf-small flex items-center gap-3 rounded-card bg-npf-ok-soft p-5 text-npf-ok">
        <CheckIcon aria-hidden className="size-5 shrink-0" />
        {t("Added to {ref}. The officers handling it can see it now.", { ref: reference })}
      </p>
    );
  return (
    <section className="npf-panel">
      <div className="npf-panel-head">
        <h2>{t("Add information to this report")}</h2>
        {!open ? (
          <button type="button" onClick={() => setOpen(true)} className="npf-btn npf-btn-secondary npf-btn-sm">
            {t("Add")}
          </button>
        ) : null}
      </div>
      {open ? (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim() && !media.length) return;
            if (addToReport(reference, text.trim(), media)) setSent(true);
          }}
          className="grid gap-5 p-5 md:p-6"
        >
          <div>
            <label htmlFor={`${id}-text`} className="npf-field-label">
              {t("What you want to add")}
            </label>
            <textarea
              id={`${id}-text`}
              rows={4}
              maxLength={2000}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="npf-field"
            />
            <p className="npf-hint">{t("Something you remembered, a name, a plate number, where they went.")}</p>
          </div>
          <MediaPicker id={`${id}-media`} optional label={t("Photos, video or documents")} media={media} onChange={setMedia} by="Reporter" />
          <div>
            <button type="submit" disabled={!text.trim() && !media.length} className="npf-btn npf-btn-primary disabled:opacity-50">
              {t("Add to the report")}
            </button>
          </div>
        </form>
      ) : (
        <p className="npf-small px-5 py-4 text-npf-body">
          {t("Remembered something, or found a photo? Add it here and it goes to the officers handling it.")}
        </p>
      )}
    </section>
  );
}
