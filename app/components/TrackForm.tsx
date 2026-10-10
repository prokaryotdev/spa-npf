"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { useFormat, useT } from "../i18n/client";
import { findReference, useStore, type Incident, type TrackedRequest } from "./store";
import { SearchIcon } from "./icons";
import { StatusPill } from "./ui";
import { RouteCard, line } from "./Where";
import { FieldNote } from "./Where";

/** What a reporter sees of a call: no unit names, no officers, no log. */
const PUBLIC_STEP: Record<Incident["status"], string> = {
  New: "Received by the command",
  Dispatched: "Officers assigned",
  "On Scene": "Officers attending",
  Closed: "Case closed",
};

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
        {found?.request ? <RequestResult request={found.request} /> : null}
        {found && !found.request && found.incident ? (
          <ReportResult incident={found.incident} format={format} />
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
                  {s.note ? <> — {line(t, s.note, undefined, request.where)}</> : null}
                </span>
              </li>
            ))}
        </ol>
      </section>
      {request.where ? <RouteCard filed where={request.where} /> : null}
    </div>
  );
}

function ReportResult({
  incident,
  format,
}: {
  incident: Incident;
  format: ReturnType<typeof useFormat>;
}) {
  const t = useT();
  const done = incident.status === "Closed";
  return (
    <div className="space-y-4">
      <section className="npf-panel">
        <div className="npf-panel-head">
          <h2>{t(incident.kind)}</h2>
          <span className={`npf-pill ${done ? "bg-npf-ok-soft text-npf-ok" : "bg-npf-review-wash text-npf-review"}`}>
            <span aria-hidden className="npf-pill-dot" />
            {t(PUBLIC_STEP[incident.status])}
          </span>
        </div>
        <dl className="npf-small grid gap-x-6 gap-y-2 p-5 sm:grid-cols-[10rem_minmax(0,1fr)]">
          <dt className="text-npf-steel">{t("Reported")}</dt>
          <dd className="text-npf-ink tabular-nums">{format.dateTime(incident.reported)}</dd>
          {incident.dispatched ? (
            <>
              <dt className="text-npf-steel">{t("Officers assigned")}</dt>
              <dd className="text-npf-ink tabular-nums">{format.dateTime(incident.dispatched)}</dd>
            </>
          ) : null}
          {incident.closed ? (
            <>
              <dt className="text-npf-steel">{t("Case closed")}</dt>
              <dd className="text-npf-ink tabular-nums">{format.dateTime(incident.closed)}</dd>
            </>
          ) : null}
        </dl>
      </section>
      <RouteCard filed where={incident.where} />
    </div>
  );
}
