"use client";

import { filterBy } from "../search-text";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  callOutcomes,
  callSources,
  callTypes,
  dispatchTarget,
} from "../content-ops";
import { useFormat, useT } from "../i18n/client";
import type { T } from "../i18n/translate";
import {
  Elapsed,
  OPS_SELECT,
  OpsButton,
  OpsEmpty,
  OpsFigures,
  OpsHead,
  OpsPanel,
  OpsSearch,
  OpsStatus,
  PRIORITY,
  PriorityTag,
  TargetBar,
  duration,
  isNearDue,
  isOverdue,
  useNow,
  useScoped,
} from "./OpsPieces";
import { STATES, jurisdiction, placeOf, stateNamed } from "../geo";
import { commandLabel, divisionLabel, line } from "./Where";
import {
  logIncident,
  updateIncident,
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
) => line(t, entry.text, entry.vars);

/**
 * The calls board: every call of the shift, and the panel where one is worked.
 *
 * The table leads with the grade and the clock rather than the reference
 * number, because nobody scans a board looking for NPF-4417; they scan it
 * looking for the oldest P1 with nobody on it.
 */
export default function OpsIncidents() {
  const t = useT();
  const id = useId();
  const { incidents, units, viewing } = useScoped();
  const now = useNow();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [unassigned, setUnassigned] = useState(false);
  // A link from the board, a unit or a request arrives as ?call=NPF-4416
  // and opens that call. Read through the router, not window.location: on a
  // client-side navigation the address has not changed yet when this first
  // renders, so every such link used to land on the board with nothing open.
  const asked = useSearchParams().get("call");
  const [selected, setSelected] = useState<string | null>(asked);
  const [seen, setSeen] = useState(asked);
  if (asked !== seen) {
    setSeen(asked);
    setSelected(asked);
  }
  const [taking, setTaking] = useState(false);

  // Below the two-column width the detail stacks under the whole board, so a
  // tapped call would open out of sight. Bring it up to meet the finger.
  const detail = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!selected || !window.matchMedia("(max-width: 1023px)").matches) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    detail.current?.scrollIntoView({
      behavior: still ? "auto" : "smooth",
      block: "start",
    });
  }, [selected]);

  /**
   * Both languages are searched: the board holds English reference data but
   * an Hausa-speaking operator types the call type in Hausa.
   */
  const visible = useMemo(() => {
    const shown = incidents.filter((i) => {
      if (status && i.status !== status) return false;
      if (priority && i.priority !== priority) return false;
      if (unassigned && i.unit) return false;
      return true;
    });
    return filterBy(shown, query, (i) =>
      [
        i.id,
        i.kind,
        t(i.kind),
        i.area,
        t(i.area),
        i.where.state,
        i.where.lga,
        i.assignee ?? "",
        t(i.assignee ?? ""),
        i.unit ?? "",
        i.outcome ?? "",
        t(i.outcome ?? ""),
        // The grade and the state as the board prints them, so "p1",
        // "urgent" or "en route" in the box finds what the tags say.
        i.priority,
        PRIORITY[i.priority].label,
        t(PRIORITY[i.priority].label),
        STATUS_LABEL[i.status],
        t(STATUS_LABEL[i.status]),
      ].join(" "),
    );
  }, [incidents, query, status, priority, unassigned, t]);

  const waiting = incidents.filter((i) => i.status === "New");
  const late = waiting.filter((i) => isOverdue(i, now)).length;
  const running = incidents.filter(
    (i) => i.status === "Dispatched" || i.status === "On Scene",
  ).length;

  // A call can leave this desk's view by being transferred; its panel goes too.
  const open = incidents.find((i) => i.id === selected) ?? null;

  return (
    <div className="space-y-8">
      <OpsHead
        title={t("Calls")}
        action={
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
          <OpsFigures
            figures={[
              { label: t("Waiting"), value: waiting.length },
              {
                label: t("Late"),
                value: late,
                tone: late ? "var(--ops-p1)" : "var(--ops-dim)",
              },
              { label: t("Running"), value: running },
              {
                label: t("Closed"),
                value: incidents.length - waiting.length - running,
                tone: "var(--ops-dim)",
              },
            ]}
          />
          {/* Open, it closes the form: the quiet tone and a cross, so
              "Cancel" never wears the plus and the weight of the action it
              undoes. */}
          <OpsButton
            tone={taking ? "quiet" : "brand"}
            aria-expanded={taking}
            onClick={() => setTaking((v) => !v)}
          >
            {taking ? (
              <CloseIcon aria-hidden className="size-4" />
            ) : (
              <PlusIcon aria-hidden className="size-4" />
            )}
            {taking ? t("Cancel") : t("Take a call")}
          </OpsButton>
          </div>
        }
      />

      {taking ? (
        <TakeCall
          viewing={viewing}
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
          placeholder={t("Reference, type, area, LGA, officer or callsign")}
          value={query}
          onChange={setQuery}
          found={visible.length}
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
          className="ms-auto text-xs text-ops-dim tabular-nums"
        >
          {t("{shown} of {total} calls", {
            shown: visible.length,
            total: incidents.length,
          })}
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_336px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
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
              <thead className="npf-ops-thead text-xs text-ops-dim">
                <tr className="whitespace-nowrap">
                  <th scope="col" className="py-3 pe-3 ps-5 font-medium">
                    {t("Grade")}
                  </th>
                  <th
                    scope="col"
                    className="hidden py-3 pe-4 font-medium sm:table-cell"
                  >
                    {t("Ref")}
                  </th>
                  <th scope="col" className="w-full py-3 pe-4 font-medium">
                    {t("Type / area")}
                  </th>
                  <th
                    scope="col"
                    className="hidden py-3 pe-4 font-medium md:table-cell"
                  >
                    {t("Status")}
                  </th>
                  <th
                    scope="col"
                    className="hidden py-3 pe-4 font-medium md:table-cell"
                  >
                    {t("Unit")}
                  </th>
                  <th scope="col" className="py-3 pe-5 text-end font-medium">
                    {t("Elapsed")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((incident) => {
                  const late = isOverdue(incident, now);
                  const near = isNearDue(incident, now);
                  const active = selected === incident.id;
                  return (
                    <tr
                      key={incident.id}
                      onClick={() => setSelected(incident.id)}
                      aria-selected={active}
                      className={`npf-ops-pick cursor-pointer border-b border-ops-line-soft last:border-0 ${
                        active ? "bg-npf-mist" : "hover:bg-ops-hover"
                      } ${late ? "npf-ops-overdue" : ""}`}
                    >
                      <td className="py-3.5 pe-3 ps-5 align-top">
                        <PriorityTag priority={incident.priority} />
                      </td>
                      <th
                        scope="row"
                        className="hidden py-3.5 pe-4 align-top font-normal whitespace-nowrap sm:table-cell"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(incident.id);
                          }}
                          className="rounded-sm pt-0.5 font-mono text-xs text-ops-dim tabular-nums underline-offset-4 transition-colors hover:text-ops-text hover:underline"
                        >
                          {incident.id}
                        </button>
                      </th>
                      <td className="py-3.5 pe-4 align-top font-medium">
                        {/* The reference column folds away below 640px, and
                            its button with it; this one keeps the row
                            reachable from a keyboard on a narrow screen. */}
                        <span className="sm:hidden">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(incident.id);
                            }}
                            className="rounded-sm font-mono text-xs font-normal tabular-nums text-ops-dim"
                          >
                            {incident.id}
                          </button>{" "}
                        </span>
                        {t(incident.kind)}
                        <span className="mt-0.5 block text-xs font-normal text-ops-dim">
                          {placeOf(t(incident.area), incident.where, !viewing)}
                        </span>
                        <span className="mt-1.5 flex flex-wrap items-center gap-2 md:hidden">
                          <OpsStatus status={incident.status} />
                          <span className="text-2xs text-ops-dim">
                            {incident.unit ? t(incident.unit) : t("No unit")}
                          </span>
                        </span>
                      </td>
                      <td className="hidden py-3.5 pe-4 align-top md:table-cell">
                        <OpsStatus status={incident.status} />
                        {incident.outcome ? (
                          <span className="mt-1 block text-2xs whitespace-nowrap text-ops-dim">
                            {t(incident.outcome)}
                          </span>
                        ) : null}
                      </td>
                      <td className="hidden py-3.5 pe-4 align-top text-xs whitespace-nowrap md:table-cell">
                        {incident.unit ? (
                          <>
                            <span className="text-sm font-medium">
                              {t(incident.unit)}
                            </span>
                            <span className="mt-0.5 block text-ops-dim">
                              {t(incident.assignee ?? "")}
                            </span>
                          </>
                        ) : (
                          <span
                            style={{ color: "var(--ops-p2)" }}
                            className="text-sm font-medium"
                          >
                            {t("No unit")}
                          </span>
                        )}
                      </td>
                      <td
                        className="py-3.5 pe-5 text-end align-top font-medium whitespace-nowrap tabular-nums"
                        style={
                          late
                            ? { color: "var(--ops-p1)" }
                            : near
                              ? { color: "var(--ops-p2)" }
                              : undefined
                        }
                      >
                        <Elapsed
                          from={incident.reported}
                          to={incident.closed}
                        />
                        {/* Only what changes the reading: the target a
                            waiting call is racing, or that a clock stopped.
                            "since call" under every running row said the
                            column head again, twelve times. */}
                        {incident.closed || incident.status === "New" ? (
                          <span className="mt-0.5 block text-2xs font-normal text-ops-dim">
                            {incident.closed
                              ? t("total")
                              : t("of {n}m", {
                                  n: dispatchTarget[incident.priority],
                                })}
                          </span>
                        ) : null}
                        {incident.status === "New" ? (
                          <TargetBar
                            incident={incident}
                            now={now}
                            className="ms-auto mt-1.5 w-16"
                          />
                        ) : null}
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
                action={
                  <OpsButton
                    onClick={() => {
                      setQuery("");
                      setStatus("");
                      setPriority("");
                      setUnassigned(false);
                    }}
                  >
                    <CloseIcon aria-hidden className="size-3.5" />
                    {t("Clear filters")}
                  </OpsButton>
                }
              />
            ) : null}
          </OpsPanel>
        </div>

        {/* The detail panel pins under the console chrome rather than to the
            top of the viewport — the page is the scroller now, so `top: 0`
            would slide it up behind the navy bar. */}
        <div
          ref={detail}
          className="scroll-mt-[calc(var(--ops-top)+1rem)] lg:sticky lg:top-[calc(var(--ops-top)+1.25rem)] lg:self-start"
        >
          {open ? (
            <Detail
              key={open.id}
              incident={open}
              units={units}
              onClose={() => setSelected(null)}
            />
          ) : (
            /* Hidden below the two-column width: stacked under twelve
               rows, an empty "pick a row" card is a dead end at the foot
               of the page, and a tapped row opens its detail here anyway. */
            <OpsPanel title={t("Call detail")} className="max-lg:hidden" flush>
              <OpsEmpty
                tone="idle"
                icon={<RadioIcon className="size-5" />}
                hint={t("Pick a row to dispatch it, move it on, or read the log.")}
              />
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
  const [moving, setMoving] = useState(false);
  // A call closes through its outcome, never straight from a button: the
  // shift report counts what the shift achieved, not only how fast it moved.
  const [closing, setClosing] = useState(false);
  // Only the call's own command's units: the list a national desk sees is
  // every unit in the country, and a Lagos car cannot attend in Kano.
  const free = units.filter(
    (u) =>
      u.state === incident.where.state &&
      (u.status === "Available" || u.callsign === incident.unit),
  );
  const next = NEXT[incident.status];
  const { reporter } = incident;

  return (
    <OpsPanel
      title={incident.id}
      action={
        <button
          type="button"
          onClick={onClose}
          aria-label={t("Close call detail")}
          className="grid size-8 place-items-center rounded-(--ops-control-radius) text-ops-dim ring-1 ring-ops-line-soft ring-inset transition-colors hover:bg-ops-hover hover:text-ops-text hover:ring-ops-line"
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
      <p className="mt-0.5 text-sm text-ops-dim">
        {placeOf(t(incident.area), incident.where)}
      </p>
      <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">
        {t(incident.summary)}
      </p>

      {/* Who owns the call and who to ring back: the two questions a desk
          asks of a call it did not take itself. */}
      <dl className="mt-4 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 border-t border-ops-line-soft pt-3 text-xs">
        <dt className="text-ops-dim">{t("Command")}</dt>
        <dd className="font-medium">{commandLabel(t, incident.where.state)}</dd>
        <dt className="text-ops-dim">{t("Division")}</dt>
        <dd>{divisionLabel(t, incident.where.lga)}</dd>
        {incident.occurred ? (
          <>
            <dt className="text-ops-dim">{t("Happened")}</dt>
            <dd className="tabular-nums">{format.dateTime(incident.occurred)}</dd>
          </>
        ) : null}
        {incident.injuries ? (
          <>
            <dt className="text-ops-dim">{t("Injuries")}</dt>
            <dd
              className={incident.injuries === "Yes" ? "font-semibold" : ""}
              style={incident.injuries === "Yes" ? { color: "var(--ops-p1)" } : undefined}
            >
              {t(incident.injuries)}
            </dd>
          </>
        ) : null}
        {reporter !== undefined ? (
          <>
            <dt className="text-ops-dim">{t("Reporter")}</dt>
            <dd>
              {reporter ? (
                <>
                  {reporter.name} ·{" "}
                  {reporter.safeToCall ? (
                    <a
                      href={`tel:${reporter.phone}`}
                      className="font-medium text-ops-accent underline-offset-2 hover:underline"
                    >
                      {reporter.phone}
                    </a>
                  ) : (
                    <span style={{ color: "var(--ops-p2)" }} className="font-medium">
                      {t("Do not call — not safe")}
                    </span>
                  )}
                </>
              ) : (
                t("Anonymous")
              )}
            </dd>
          </>
        ) : null}
        {incident.outcome ? (
          <>
            <dt className="text-ops-dim">{t("Outcome")}</dt>
            <dd className="font-medium">{t(incident.outcome)}</dd>
          </>
        ) : null}
        {incident.evidence?.length ? (
          <>
            <dt className="text-ops-dim">{t("Evidence")}</dt>
            <dd className="break-words">{incident.evidence.join(", ")}</dd>
          </>
        ) : null}
      </dl>

      {/*
        The four stamps of a call, as a run of times with the gap between
        them. The gaps are the point: "received 11:52, dispatched 11:56" is
        two facts, "4m to dispatch" is the one an inspector asks about.
      */}
      <Stamps incident={incident} />

      <div className="mt-4 space-y-2.5 border-t border-ops-line-soft pt-4">
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
            s === "Closed"
              ? setClosing(true)
              : updateIncident(incident.id, { status: s as IncidentStatus })
          }
        />
        <Assign
          id={`${id}-grade`}
          label={t("Grade")}
          value={incident.priority}
          options={PRIORITIES.map((p) => [p, `${p} ${t(PRIORITY[p].label)}`])}
          onChange={(p) =>
            updateIncident(incident.id, { priority: p as Priority })
          }
        />
      </div>

      {incident.status !== "Closed" ? (
        moving ? (
          <Transfer incident={incident} onDone={() => setMoving(false)} />
        ) : (
          <button
            type="button"
            onClick={() => setMoving(true)}
            className="mt-3 text-xs font-medium text-ops-accent underline-offset-4 hover:underline"
          >
            {t("Wrong command or division? Transfer the call")}
          </button>
        )
      ) : null}

      {closing ? (
        <CloseCall incident={incident} onDone={() => setClosing(false)} />
      ) : next ? (
        <OpsButton
          tone="brand"
          onClick={() =>
            next[0] === "Closed"
              ? setClosing(true)
              : updateIncident(incident.id, { status: next[0] })
          }
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

      <div className="mt-5 border-t border-ops-line-soft pt-4">
        <p className="mb-3 text-xs font-semibold text-ops-dim">{t("Log")}</p>
        <ol className="space-y-2 text-xs">
          {incident.log
            .slice()
            .reverse()
            .map((entry, i) => (
              <li key={entry.at + i} className="flex gap-3">
                <time
                  dateTime={entry.at}
                  className="w-10 shrink-0 text-ops-dim tabular-nums"
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
            className="min-w-0 flex-1 px-3 py-2 text-[0.8125rem] rounded-(--ops-control-radius) bg-white text-npf-ink shadow-[var(--ops-control-lift)] ring-1 ring-npf-line ring-inset outline-none placeholder:text-npf-steel transition-[box-shadow] hover:ring-npf-steel/55 focus:ring-2 focus:ring-npf-blue-mid"
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

/**
 * Closing a call: pick how it ended, then close. The outcome goes on the
 * call, into its log, and onto the shift report.
 */
function CloseCall({
  incident,
  onDone,
}: {
  incident: Incident;
  onDone: () => void;
}) {
  const t = useT();
  const id = useId();
  const [outcome, setOutcome] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!outcome) return;
        updateIncident(incident.id, { status: "Closed", outcome });
        onDone();
      }}
      className="mt-4 grid gap-3 rounded-chip bg-ops-fill p-3"
    >
      <label htmlFor={`${id}-outcome`} className="text-xs font-semibold">
        {t("How did the call end?")}
      </label>
      <select
        id={`${id}-outcome`}
        value={outcome}
        required
        autoFocus
        onChange={(e) => setOutcome(e.target.value)}
        className={SELECT}
      >
        <option value="">{t("Choose an outcome")}</option>
        {callOutcomes.map((o) => (
          <option key={o} value={o}>
            {t(o)}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <OpsButton type="submit" tone="brand" disabled={!outcome}>
          {t("Close call")}
        </OpsButton>
        <OpsButton onClick={onDone}>{t("Cancel")}</OpsButton>
      </div>
    </form>
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
    <ol className="mt-4 border-t border-ops-line-soft pt-3 text-xs">
      {rows.map(([label, at, from]) => (
        <li
          key={label}
          className="flex items-baseline justify-between gap-3 py-1"
        >
          <span className={at ? "" : "text-ops-dim"}>{t(label)}</span>
          {at ? (
            <span className="flex items-baseline gap-2.5 tabular-nums">
              {from ? (
                <span className="text-ops-accent" dir="ltr">
                  +{duration(new Date(at).getTime() - new Date(from).getTime())}
                </span>
              ) : null}
              <time dateTime={at} className="text-ops-dim">
                {format.time(at)}
              </time>
            </span>
          ) : (
            <span className="sr-only">{t("None")}</span>
          )}
        </li>
      ))}
    </ol>
  );
}

/** The call-taking form. What the desk fills in while the caller is talking. */
function TakeCall({
  onDone,
  viewing,
}: {
  onDone: (created: Incident) => void;
  viewing: string | null;
}) {
  const t = useT();
  const id = useId();
  // State holds the English value the store records; only the option text is
  // translated, so a call logged in Hausa still reads back in English.
  const [kind, setKind] = useState(callTypes[0]);
  const [priority, setPriority] = useState<Priority>("P3");
  const [area, setArea] = useState("");
  const [summary, setSummary] = useState("");
  const [source, setSource] = useState(callSources[0]);
  // A command desk logs calls in its own command; a national desk picks one.
  const [state, setState] = useState(viewing ?? "");
  const [lga, setLga] = useState("");

  const ready = area.trim() && summary.trim() && state && lga;

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
              where: jurisdiction(state, lga, area.trim()),
            }),
          );
        }}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
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
                {p} {t(PRIORITY[p].label)} ·{" "}
                {t("dispatch within {n}m", { n: dispatchTarget[p] })}
              </option>
            ))}
          </select>
        </Field>

        <PlacePicker
          id={id}
          state={state}
          lga={lga}
          lockState={Boolean(viewing)}
          onChange={(s, l) => {
            setState(s);
            setLga(l);
          }}
        />

        <Field id={`${id}-area`} label={t("Street or landmark")}>
          <input
            id={`${id}-area`}
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
            placeholder={t("Allen Avenue, by the filling station")}
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
  "w-full px-3 py-2 text-sm rounded-(--ops-control-radius) bg-white text-npf-ink shadow-[var(--ops-control-lift)] ring-1 ring-npf-line ring-inset outline-none placeholder:text-npf-steel transition-[box-shadow] hover:ring-npf-steel/55 focus:ring-2 focus:ring-npf-blue-mid";
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
        className="mb-1.5 block text-xs font-semibold text-ops-dim"
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
    // A form row in a settings pane: labels in one column, so the three
    // pop-up buttons start on the same edge.
    <div className="grid grid-cols-[3.75rem_minmax(0,1fr)] items-center gap-3">
      <label htmlFor={id} className="text-[0.8125rem] text-ops-dim">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="npf-ops-select h-10 min-w-0 flex-1 ps-3 text-sm font-medium outline-none"
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

/** State and LGA as two console selects; the state is fixed on a command desk. */
function PlacePicker({
  id,
  state,
  lga,
  lockState,
  onChange,
}: {
  id: string;
  state: string;
  lga: string;
  lockState?: boolean;
  onChange: (state: string, lga: string) => void;
}) {
  const t = useT();
  const lgas = stateNamed(state)?.lgas ?? [];
  return (
    <>
      <Field id={`${id}-state`} label={t("State")}>
        <select
          id={`${id}-state`}
          value={state}
          disabled={lockState}
          onChange={(e) => onChange(e.target.value, "")}
          className={SELECT}
        >
          <option value="">{t("Choose a state")}</option>
          {STATES.map((s) => (
            <option key={s.name} value={s.name}>
              {commandLabel(t, s.name)}
            </option>
          ))}
        </select>
      </Field>
      <Field id={`${id}-lga`} label={t("Local Government Area")}>
        <select
          id={`${id}-lga`}
          value={lga}
          disabled={!state}
          onChange={(e) => onChange(state, e.target.value)}
          className={SELECT}
        >
          <option value="">
            {state
              ? t("Choose one of {n} areas", { n: lgas.length })
              : t("Choose a state first")}
          </option>
          {lgas.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </Field>
    </>
  );
}

/**
 * Moving a call to the command or division it belongs to. Across a state
 * line the unit is stood down and the call goes back to pending there.
 */
function Transfer({
  incident,
  onDone,
}: {
  incident: Incident;
  onDone: () => void;
}) {
  const t = useT();
  const id = useId();
  const [state, setState] = useState(incident.where.state);
  const [lga, setLga] = useState(incident.where.lga);
  const changed = state !== incident.where.state || lga !== incident.where.lga;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!changed || !lga) return;
        updateIncident(incident.id, {
          where: jurisdiction(state, lga, incident.where.address),
        });
        onDone();
      }}
      className="mt-4 grid gap-3 rounded-chip bg-ops-fill p-3"
    >
      <p className="text-xs font-semibold">{t("Transfer the call")}</p>
      <PlacePicker
        id={id}
        state={state}
        lga={lga}
        onChange={(s, l) => {
          setState(s);
          setLga(l);
        }}
      />
      {state !== incident.where.state && incident.unit ? (
        <p className="text-xs" style={{ color: "var(--ops-p2)" }}>
          {t(
            "{unit} will be stood down: units only attend calls in their own command.",
            { unit: incident.unit },
          )}
        </p>
      ) : null}
      <div className="flex gap-2">
        <OpsButton type="submit" tone="brand" disabled={!changed || !lga}>
          {t("Transfer")}
        </OpsButton>
        <OpsButton onClick={onDone}>{t("Cancel")}</OpsButton>
      </div>
    </form>
  );
}
