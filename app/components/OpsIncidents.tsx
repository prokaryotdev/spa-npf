"use client";

import { useId, useMemo, useState } from "react";
import { callSources, callTypes, dispatchTarget } from "../content-ops";
import { useFormat, useT } from "../i18n/client";
import type { T } from "../i18n/translate";
import {
  Elapsed,
  OPS_SELECT,
  OpsButton,
  OpsEmpty,
  OpsHead,
  OpsPanel,
  OpsSearch,
  OpsStatus,
  PRIORITY,
  PriorityTag,
  duration,
  isOverdue,
  useNow,
} from "./OpsPieces";
import {
  logIncident,
  updateIncident,
  useStore,
  type Incident,
  type IncidentStatus,
  type Priority,
  type Unit,
} from "./store";
import { CloseIcon, PlusIcon, RadioIcon } from "./icons";

const STATUSES: IncidentStatus[] = ["New", "Dispatched", "On Scene", "Closed"];
const STATUS_LABEL: Record<IncidentStatus, string> = {
  New: "Pending",
  Dispatched: "En route",
  "On Scene": "On scene",
  Closed: "Closed",
};
const PRIORITIES: Priority[] = ["P1", "P2", "P3", "P4"];

/**
 * A log line the system wrote is a pattern plus its values; one an operator
 * typed is stored as typed and has neither, so it comes back untouched.
 */
const logLine = (
  t: T,
  entry: { text: string; vars?: Record<string, string> },
) =>
  t(
    entry.text,
    entry.vars &&
      Object.fromEntries(Object.entries(entry.vars).map(([k, v]) => [k, t(v)])),
  );

/**
 * The calls board: every call of the shift, and the panel where one is worked.
 *
 * The table leads with the grade and the clock rather than the reference
 * number, because nobody scans a board looking for FCT-4417 — they scan it
 * looking for the oldest P1 with nobody on it.
 */
export default function OpsIncidents() {
  const t = useT();
  const id = useId();
  const { incidents, units } = useStore();
  const now = useNow();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [unassigned, setUnassigned] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [taking, setTaking] = useState(false);

  /**
   * Both languages are searched: the board holds English reference data but
   * an Hausa-speaking operator types the call type in Hausa.
   */
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return incidents.filter((i) => {
      if (status && i.status !== status) return false;
      if (priority && i.priority !== priority) return false;
      if (unassigned && i.unit) return false;
      if (!q) return true;
      return [
        i.id,
        i.kind,
        t(i.kind),
        i.area,
        t(i.area),
        i.assignee ?? "",
        t(i.assignee ?? ""),
        i.unit ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [incidents, query, status, priority, unassigned, t]);

  const open = incidents.find((i) => i.id === selected) ?? null;

  return (
    <div className="space-y-5">
      <OpsHead
        title={t("Calls")}
        lead={t(
          "Every call of the shift, newest first. Pick a row to dispatch it, move it on, or write the log.",
        )}
        action={
          <OpsButton tone="brand" onClick={() => setTaking((v) => !v)}>
            <PlusIcon aria-hidden className="size-4" />
            {taking ? t("Cancel") : t("Take a call")}
          </OpsButton>
        }
      />

      {taking ? (
        <TakeCall
          onDone={(created) => {
            setTaking(false);
            setSelected(created.id);
          }}
        />
      ) : null}

      {/* Search, filters and the tally on one line. The count used to sit on
          a line of its own between the controls and the board — a whole band
          of vertical space spent on six words that belong beside the filters
          that change them. */}
      <div className="flex flex-wrap items-center gap-2">
        <OpsSearch
          id={`${id}-q`}
          label={t("Filter calls")}
          placeholder={t("Reference, type, area, officer or callsign")}
          value={query}
          onChange={setQuery}
        />

        <Filter
          id={`${id}-status`}
          label={t("Status")}
          value={status}
          onChange={setStatus}
          options={STATUSES.map((s) => [s, t(STATUS_LABEL[s])])}
          all={t("Any status")}
        />
        <Filter
          id={`${id}-priority`}
          label={t("Grade")}
          value={priority}
          onChange={setPriority}
          options={PRIORITIES.map((p) => [p, `${p} ${t(PRIORITY[p].label)}`])}
          all={t("Any grade")}
        />
        <OpsButton
          tone={unassigned ? "brand" : "quiet"}
          aria-pressed={unassigned}
          onClick={() => setUnassigned((v) => !v)}
        >
          {t("No unit")}
        </OpsButton>

        <p
          aria-live="polite"
          className="ms-auto text-xs text-[var(--ops-dim)] tabular-nums"
        >
          {t("{shown} of {total} calls", {
            shown: visible.length,
            total: incidents.length,
          })}
        </p>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_336px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* min-w-0: without it the table's min-content width shoves the
 detail panel off the page. */}
        <div className="min-w-0">
          <OpsPanel flush>
            {/*
              No horizontal scroller and no min-width. The board used to force
              660px and let a phone swipe sideways through it, which hides the
              elapsed clock — the one column the whole screen is about — off
              the right edge by default. Below `md` the three supporting
              columns fold into the call's own cell instead, so every row
              still shows its grade, what it is, who is on it and how long it
              has been running, in the width there actually is.
            */}
            <table className="w-full text-start text-sm">
              <caption className="sr-only">
                {t(
                  "Calls, with grade, type, area, status, assigned unit and elapsed time",
                )}
              </caption>
              <thead className="npf-ops-thead text-[11px] font-medium tracking-[0.08em] text-[var(--ops-dim)] uppercase">
                <tr className="whitespace-nowrap">
                  <th scope="col" className="py-2.5 pe-3 ps-4 font-medium">
                    {t("Grade")}
                  </th>
                  <th
                    scope="col"
                    className="hidden py-2.5 pe-3 font-medium sm:table-cell"
                  >
                    {t("Ref")}
                  </th>
                  <th scope="col" className="w-full py-2.5 pe-3 font-medium">
                    {t("Type / area")}
                  </th>
                  <th
                    scope="col"
                    className="hidden py-2.5 pe-3 font-medium md:table-cell"
                  >
                    {t("Status")}
                  </th>
                  <th
                    scope="col"
                    className="hidden py-2.5 pe-3 font-medium md:table-cell"
                  >
                    {t("Unit")}
                  </th>
                  <th scope="col" className="py-2.5 pe-4 text-end font-medium">
                    {t("Elapsed")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((incident) => {
                  const late = isOverdue(incident, now);
                  const active = selected === incident.id;
                  return (
                    <tr
                      key={incident.id}
                      onClick={() => setSelected(incident.id)}
                      aria-selected={active}
                      className={`npf-ops-pick cursor-pointer border-b border-[var(--ops-line-soft)] last:border-0 ${
                        active
                          ? "bg-[var(--ops-raised)]"
                          : "hover:bg-[var(--ops-raised)]/55"
                      } ${late ? "npf-ops-overdue" : ""}`}
                    >
                      <td className="py-3 pe-3 ps-4 align-top">
                        <PriorityTag priority={incident.priority} />
                      </td>
                      <th
                        scope="row"
                        className="hidden py-3 pe-3 align-top font-normal whitespace-nowrap sm:table-cell"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(incident.id);
                          }}
                          className="font-secondary font-bold tabular-nums underline-offset-4 hover:underline"
                        >
                          {incident.id}
                        </button>
                      </th>
                      <td className="py-3 pe-3 align-top">
                        <span className="sm:hidden">
                          <span className="font-secondary text-xs font-bold tabular-nums text-[var(--ops-dim)]">
                            {incident.id}
                          </span>{" "}
                        </span>
                        {t(incident.kind)}
                        <span className="block text-xs text-[var(--ops-dim)]">
                          {t(incident.area)}
                        </span>
                        <span className="mt-1.5 flex flex-wrap items-center gap-2 md:hidden">
                          <OpsStatus status={incident.status} />
                          <span className="text-[11px] text-[var(--ops-dim)]">
                            {incident.unit ? t(incident.unit) : t("No unit")}
                          </span>
                        </span>
                      </td>
                      <td className="hidden py-3 pe-3 align-top md:table-cell">
                        <OpsStatus status={incident.status} />
                      </td>
                      <td className="hidden py-3 pe-3 align-top text-xs whitespace-nowrap md:table-cell">
                        {incident.unit ? (
                          <>
                            <span className="font-secondary font-bold">
                              {t(incident.unit)}
                            </span>
                            <span className="block text-[var(--ops-dim)]">
                              {t(incident.assignee ?? "")}
                            </span>
                          </>
                        ) : (
                          <span
                            style={{ color: "var(--ops-p2)" }}
                            className="font-medium"
                          >
                            {t("No unit")}
                          </span>
                        )}
                      </td>
                      <td
                        className="py-3 pe-4 text-end align-top font-medium whitespace-nowrap"
                        style={late ? { color: "var(--ops-p1)" } : undefined}
                      >
                        <Elapsed
                          from={incident.reported}
                          to={incident.closed}
                        />
                        <span className="block text-[11px] font-normal text-[var(--ops-dim)]">
                          {incident.closed
                            ? t("total")
                            : incident.status === "New"
                              ? t("of {n}m", {
                                  n: dispatchTarget[incident.priority],
                                })
                              : t("since call")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {visible.length === 0 ? (
              <OpsEmpty
                tone="none"
                title={t("No call matches those filters")}
                hint={t(
                  "Widen the grade or status filter, or clear the search box, to see the rest of the shift.",
                )}
              />
            ) : null}
          </OpsPanel>
        </div>

        {/* The detail panel pins under the console chrome rather than to the
            top of the viewport — the page is the scroller now, so `top: 0`
            would slide it up behind the navy bar. */}
        <div className="lg:sticky lg:top-[calc(var(--ops-top)+1.25rem)] lg:self-start">
          {open ? (
            <Detail
              incident={open}
              units={units}
              onClose={() => setSelected(null)}
            />
          ) : (
            <OpsPanel title={t("Call detail")}>
              <div className="flex flex-col items-center gap-3 px-2 py-8 text-center">
                <span
                  aria-hidden
                  className="grid size-10 place-items-center rounded-full bg-[var(--ops-raised)] text-[var(--ops-accent)]"
                >
                  <RadioIcon className="size-5" />
                </span>
                <p className="max-w-[34ch] text-xs leading-relaxed text-[var(--ops-dim)]">
                  {t("Pick a row to dispatch it, move it on, or read the log.")}
                </p>
              </div>
            </OpsPanel>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

/** The next thing that happens to a call, and what the button says. */
const NEXT: Partial<Record<IncidentStatus, [IncidentStatus, string]>> = {
  Dispatched: ["On Scene", "Mark on scene"],
  "On Scene": ["Closed", "Close call"],
};

function Detail({
  incident,
  units,
  onClose,
}: {
  incident: Incident;
  units: Unit[];
  onClose: () => void;
}) {
  const t = useT();
  const format = useFormat();
  const id = useId();
  const [note, setNote] = useState("");
  const free = units.filter(
    (u) => u.status === "Available" || u.callsign === incident.unit,
  );
  const next = NEXT[incident.status];

  return (
    <OpsPanel
      title={incident.id}
      action={
        <button
          type="button"
          onClick={onClose}
          aria-label={t("Close call detail")}
          className="grid size-7 place-items-center rounded text-[var(--ops-dim)] transition-colors hover:bg-[var(--ops-raised)] hover:text-[var(--ops-text)]"
        >
          <CloseIcon className="size-4" />
        </button>
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <PriorityTag priority={incident.priority} withLabel />
        <OpsStatus status={incident.status} />
      </div>

      <h3 className="mt-3 font-secondary text-base font-bold">
        {t(incident.kind)}
      </h3>
      <p className="mt-0.5 text-sm text-[var(--ops-dim)]">{t(incident.area)}</p>
      <p className="mt-3 text-sm leading-relaxed">{t(incident.summary)}</p>

      {/*
        The four stamps of a call, as a run of times with the gap between
        them. The gaps are the point: "received 11:52, dispatched 11:56" is
        two facts, "4m to dispatch" is the one an inspector asks about.
      */}
      <Stamps incident={incident} />

      <div className="mt-4 space-y-2.5 border-t border-[var(--ops-line-soft)] pt-4">
        <Assign
          id={`${id}-unit`}
          label={t("Unit")}
          value={incident.unit ?? ""}
          options={free.map((u) => [
            u.callsign,
            `${t(u.callsign)} · ${t(u.officer)}`,
          ])}
          placeholder={free.length ? t("Not dispatched") : t("No unit free")}
          onChange={(callsign) => {
            const unit = units.find((u) => u.callsign === callsign);
            updateIncident(incident.id, {
              unit: callsign || null,
              assignee: unit?.officer ?? null,
              status:
                callsign && incident.status === "New"
                  ? "Dispatched"
                  : !callsign && incident.status === "Dispatched"
                    ? "New"
                    : incident.status,
            });
          }}
        />
        <Assign
          id={`${id}-status`}
          label={t("Status")}
          value={incident.status}
          options={STATUSES.map((s) => [s, t(STATUS_LABEL[s])])}
          onChange={(s) =>
            updateIncident(incident.id, { status: s as IncidentStatus })
          }
        />
        <Assign
          id={`${id}-grade`}
          label={t("Grade")}
          value={incident.priority}
          options={PRIORITIES.map((p) => [p, `${p} — ${t(PRIORITY[p].label)}`])}
          onChange={(p) =>
            updateIncident(incident.id, { priority: p as Priority })
          }
        />
      </div>

      {next ? (
        <OpsButton
          tone="brand"
          onClick={() => updateIncident(incident.id, { status: next[0] })}
          className="mt-4 w-full justify-center"
        >
          {t(next[1])}
        </OpsButton>
      ) : null}
      {incident.status === "Closed" ? (
        <OpsButton
          onClick={() => updateIncident(incident.id, { status: "New" })}
          className="mt-4 w-full justify-center"
        >
          {t("Reopen call")}
        </OpsButton>
      ) : null}

      <div className="mt-5 border-t border-[var(--ops-line-soft)] pt-4">
        <p className="mb-3 text-[11px] tracking-[0.12em] text-[var(--ops-dim)] uppercase">
          {t("Log")}
        </p>
        <ol className="space-y-2 text-xs">
          {incident.log
            .slice()
            .reverse()
            .map((entry, i) => (
              <li key={entry.at + i} className="flex gap-3">
                <time
                  dateTime={entry.at}
                  className="w-10 shrink-0 text-[var(--ops-dim)] tabular-nums"
                >
                  {format.time(entry.at)}
                </time>
                <span className="min-w-0 leading-relaxed">
                  {logLine(t, entry)}
                </span>
              </li>
            ))}
        </ol>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const text = note.trim();
            if (!text) return;
            updateIncident(incident.id, {
              log: [...incident.log, { at: new Date().toISOString(), text }],
            });
            setNote("");
          }}
          className="mt-3 flex gap-2"
        >
          <label htmlFor={`${id}-note`} className="sr-only">
            {t("Add a line to the log for {ref}", { ref: incident.id })}
          </label>
          <input
            id={`${id}-note`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("Add to the log")}
            className="min-w-0 flex-1 rounded-lg border border-[var(--ops-line)] bg-[var(--ops-raised)] px-3 py-2 text-xs outline-none placeholder:text-[var(--ops-dim)] focus:border-[var(--ops-accent)]"
          />
          <OpsButton
            type="submit"
            tone="brand"
            disabled={!note.trim()}
            className="!px-3 !py-2 !text-xs"
          >
            {t("Add")}
          </OpsButton>
        </form>
      </div>
    </OpsPanel>
  );
}

/** Received → dispatched → on scene → closed, with the gap between each. */
function Stamps({ incident }: { incident: Incident }) {
  const t = useT();
  const format = useFormat();
  const rows: [string, string | null, string | null][] = [
    ["Received", incident.reported, null],
    ["Dispatched", incident.dispatched, incident.reported],
    ["On scene", incident.onScene, incident.dispatched],
    ["Closed", incident.closed, incident.onScene ?? incident.dispatched],
  ];

  return (
    <ol className="mt-4 border-t border-[var(--ops-line-soft)] pt-3 text-xs">
      {rows.map(([label, at, from]) => (
        <li
          key={label}
          className="flex items-baseline justify-between gap-3 py-1"
        >
          <span className={at ? "" : "text-[var(--ops-dim)]"}>{t(label)}</span>
          {at ? (
            <span className="flex items-baseline gap-2.5 tabular-nums">
              {from ? (
                <span className="text-[var(--ops-accent)]" dir="ltr">
                  +{duration(new Date(at).getTime() - new Date(from).getTime())}
                </span>
              ) : null}
              <time dateTime={at} className="text-[var(--ops-dim)]">
                {format.time(at)}
              </time>
            </span>
          ) : (
            <span className="text-[var(--ops-dim)]">—</span>
          )}
        </li>
      ))}
    </ol>
  );
}

/** The call-taking form. What the desk fills in while the caller is talking. */
function TakeCall({ onDone }: { onDone: (created: Incident) => void }) {
  const t = useT();
  const id = useId();
  // State holds the English value the store records; only the option text is
  // translated, so a call logged in Hausa still reads back in English.
  const [kind, setKind] = useState(callTypes[0]);
  const [priority, setPriority] = useState<Priority>("P3");
  const [area, setArea] = useState("");
  const [summary, setSummary] = useState("");
  const [source, setSource] = useState(callSources[0]);

  const ready = area.trim() && summary.trim();

  return (
    <OpsPanel title={t("Take a call")}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!ready) return;
          onDone(
            logIncident({
              kind,
              priority,
              area: area.trim(),
              summary: summary.trim(),
              source,
            }),
          );
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        <Field id={`${id}-kind`} label={t("Call type")}>
          <select
            id={`${id}-kind`}
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className={SELECT}
          >
            {callTypes.map((type) => (
              <option key={type} value={type}>
                {t(type)}
              </option>
            ))}
          </select>
        </Field>

        <Field id={`${id}-grade`} label={t("Grade")}>
          <select
            id={`${id}-grade`}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className={SELECT}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p} — {t(PRIORITY[p].label)} ·{" "}
                {t("dispatch within {n}m", { n: dispatchTarget[p] })}
              </option>
            ))}
          </select>
        </Field>

        <Field id={`${id}-area`} label={t("Area")}>
          <input
            id={`${id}-area`}
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
            placeholder={t("Wuse 1")}
            className={INPUT}
          />
        </Field>

        <Field id={`${id}-source`} label={t("Received via")}>
          <select
            id={`${id}-source`}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className={SELECT}
          >
            {callSources.map((s) => (
              <option key={s} value={s}>
                {t(s)}
              </option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field id={`${id}-summary`} label={t("What was reported")}>
            <textarea
              id={`${id}-summary`}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              rows={2}
              placeholder={t(
                "What the caller described, in their words where you can.",
              )}
              className={INPUT}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <OpsButton type="submit" tone="brand" disabled={!ready}>
            {t("Put it in the queue")}
          </OpsButton>
        </div>
      </form>
    </OpsPanel>
  );
}

const INPUT =
  "w-full rounded-lg border border-[var(--ops-line)] bg-[var(--ops-raised)] px-3 py-2 text-sm outline-none transition-colors placeholder:text-[var(--ops-dim)] hover:border-[var(--ops-accent)]/60 focus:border-[var(--ops-accent)]";
const SELECT = `npf-ops-select ${INPUT}`;

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11px] tracking-[0.1em] text-[var(--ops-dim)] uppercase"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function Assign({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: [string, string][];
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-xs text-[var(--ops-dim)]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="npf-ops-select min-w-0 flex-1 rounded-lg border border-[var(--ops-line)] bg-[var(--ops-raised)] px-3 py-2 text-sm outline-none transition-colors hover:border-[var(--ops-accent)] focus:border-[var(--ops-accent)]"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map(([v, text]) => (
          <option key={v} value={v}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );
}

function Filter({
  id,
  label,
  value,
  onChange,
  options,
  all,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
  all: string;
}) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={OPS_SELECT}
      >
        <option value="">{all}</option>
        {options.map(([v, text]) => (
          <option key={v} value={v}>
            {text}
          </option>
        ))}
      </select>
    </>
  );
}
