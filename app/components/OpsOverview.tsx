"use client";

import Link from "../i18n/Link";
import { useId, useState } from "react";
import { dispatchTarget } from "../content-ops";
import { zones } from "../content-footer";
import {
  Elapsed,
  OpsEmpty,
  OpsFigures,
  OpsHead,
  OpsPanel,
  OpsStatus,
  PriorityTag,
  TargetBar,
  targetTone,
  duration,
  isOverdue,
  useNow,
  useScoped,
  withTransition,
} from "./OpsPieces";
import {
  setViewing,
  updateIncident,
  useStore,
  type Incident,
  type Unit,
} from "./store";
import { STATES, placeOf } from "../geo";
import { ArrowRight, CloseIcon } from "./icons";
import { useFormat, useT } from "../i18n/client";

/**
 * The command board.
 *
 * It opens on the work: pending calls with their dispatch control, then the
 * calls already running. Beside them, the Force by zone: every busy command
 * as a tile carrying its waiting and running numbers. A national desk sees
 * which tiles are red and picks one; the queues narrow to that command. A
 * command desk gets the same mosaic one level down, by division. Under the
 * mosaic, the units by section.
 */
export default function OpsOverview() {
  const t = useT();
  const { incidents: inView, units, session, viewing } = useScoped();
  const now = useNow();
  const format = useFormat();
  const fixed = session?.command;
  // A command desk narrows by division; units carry no division, so the
  // narrowing applies to calls only.
  const [division, setDivision] = useState<string | null>(null);
  const incidents = division
    ? inView.filter((i) => i.where.division === division)
    : inView;

  const pending = incidents
    .filter((i) => i.status === "New")
    .sort(
      (a, b) =>
        a.priority.localeCompare(b.priority) ||
        a.reported.localeCompare(b.reported),
    );
  const running = incidents.filter(
    (i) => i.status === "Dispatched" || i.status === "On Scene",
  );
  const overdue = pending.filter((i) => isOverdue(i, now));
  const free = units.filter((u) => u.status === "Available");

  return (
    <div className="space-y-6">
      <OpsHead
        title={t("Command board")}
        lead={[
          now ? format.date(new Date(now).toISOString().slice(0, 10)) : null,
          viewing ?? session?.command ?? t("All commands"),
        ]
          .filter(Boolean)
          .join(" · ")}
        action={
          <OpsFigures
            figures={[
              { label: t("Waiting"), value: pending.length },
              {
                label: t("Late"),
                value: overdue.length,
                tone: overdue.length ? "var(--ops-p1)" : "var(--ops-dim)",
              },
              { label: t("Running"), value: running.length },
              {
                label: t("Units free"),
                value: free.length,
                of: units.length,
                tone: "var(--ops-ok)",
              },
            ]}
          />
        }
      />

      {/* The queue leads, straight under the band: a call nobody has taken
          is the one thing on this board that gets worse by itself. Where it
          is (the mosaic) and who can go (units) stand beside it on a desk
          and follow it on a phone. */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
        <div className="@container min-w-0 space-y-4">
          <OpsPanel
            title={t("Pending")}
            count={
              pending.length
                ? t("{n} waiting", { n: pending.length })
                : undefined
            }
            action={
              overdue.length ? (
                <span className="npf-pill bg-ops-p1-wash text-ops-p1">
                  <span aria-hidden className="npf-pill-dot" />
                  {t("{n} late", { n: overdue.length })}
                </span>
              ) : undefined
            }
            flush
          >
            {pending.length ? (
              <>
                <QueueHead
                  cols={PENDING_COLS}
                  labels={["", t("Call"), t("Waiting"), t("Dispatch")]}
                  end={[2]}
                />
                <ul>
                  {pending.map((incident) => (
                    <PendingCall
                      key={incident.id}
                      incident={incident}
                      units={units}
                      now={now}
                    />
                  ))}
                </ul>
              </>
            ) : (
              <OpsEmpty
                title={t("Queue clear")}
                hint={t(
                  "Every call that came in has a unit on it. A new one lands here the second the desk takes it.",
                )}
              />
            )}
          </OpsPanel>

          <OpsPanel
            title={t("Running")}
            count={
              running.length
                ? t("{n} committed", { n: running.length })
                : undefined
            }
            action={<More href="/app/police/incidents">{t("All calls")}</More>}
            flush
          >
            {running.length ? (
              <>
                <QueueHead
                  cols={RUNNING_COLS}
                  labels={["", t("Call"), t("Status"), t("Unit"), t("Elapsed")]}
                  end={[4]}
                />
                <ul>
                  {running.map((incident) => (
                    <RunningCall key={incident.id} incident={incident} />
                  ))}
                </ul>
              </>
            ) : (
              <OpsEmpty
                title={t("Nobody is committed")}
                hint={t(
                  "No unit is on a call right now. Dispatch one from the pending queue above.",
                )}
              />
            )}
          </OpsPanel>
        </div>

        <div className="min-w-0 space-y-4">
          {fixed ? (
            <DivisionMosaic
              incidents={inView}
              now={now}
              chosen={division}
              onChoose={(d) => withTransition(() => setDivision(d))}
            />
          ) : (
            <CommandMosaic now={now} chosen={viewing} />
          )}
          <UnitBoard units={units} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

type Tally = {
  waiting: number;
  late: number;
  running: number;
  free?: number;
  units?: number;
};

/** What a set of calls (and, for a command, its units) adds up to. */
function tally(calls: Incident[], now: number, units?: Unit[]): Tally {
  const pending = calls.filter((i) => i.status === "New");
  return {
    waiting: pending.length,
    late: pending.filter((i) => isOverdue(i, now)).length,
    running: calls.filter(
      (i) => i.status === "Dispatched" || i.status === "On Scene",
    ).length,
    free: units?.filter((u) => u.status === "Available").length,
    units: units?.length,
  };
}

/**
 * The national mosaic: all 37 commands in their six zones. It reads the
 * whole store, not the command in view, because it is the control that
 * chooses the command in view; picking a tile is the same act as picking a
 * command in the bar above, and picking it again hands back the whole Force.
 */
function CommandMosaic({ now, chosen }: { now: number; chosen: string | null }) {
  const t = useT();
  const { incidents, units } = useStore();
  // Quiet commands step off until asked for: thirty quiet names around the
  // seven that matter is the board hiding its own answer.
  const [all, setAll] = useState(false);
  const choose = (name: string | undefined) =>
    withTransition(() => setViewing(name));

  return (
    <OpsPanel
      title={t("Commands")}
      flush
      action={
        <span className="flex items-center gap-5">
          <Legend />
          {chosen ? (
          <button
            type="button"
            onClick={() => choose(undefined)}
            className="npf-small -my-2 inline-flex min-h-11 items-center gap-1.5 font-medium text-npf-blue underline-offset-4 hover:text-npf-blue-deep hover:underline"
          >
            <CloseIcon aria-hidden className="size-3.5" />
            {t("All commands")}
          </button>
          ) : null}
        </span>
      }
    >
      {/* One strip per zone, ruled off from the next: the zone and what it
          owes on the left, its commands on the right. Every strip is the
          same width with the same auto-fill tracks, so the cells line up in
          columns down the whole board. A quiet command is bare text; only a
          busy one is a filled cell, so it is found before it is read. */}
      <div className="divide-y divide-ops-line-soft">
        {zones.map((zone) => {
          const tiles = STATES.filter((s) => s.zone === zone).map((s) => {
            const sum = tally(
              incidents.filter((i) => i.where.state === s.name),
              now,
              units.filter((u) => u.state === s.name),
            );
            const busy = !!(sum.waiting || sum.running) || chosen === s.name;
            return { s, sum, busy };
          });
          const zoneSum = tiles.reduce(
            (a, { sum }) => ({
              waiting: a.waiting + sum.waiting,
              late: a.late + sum.late,
              running: a.running + sum.running,
            }),
            { waiting: 0, late: 0, running: 0 },
          );
          /* Every zone keeps its row, in the same order, so "queue clear"
             is read in the same place it would be red. */
          return (
            <section
              key={zone}
              aria-label={t(zone)}
              className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-start gap-x-4 px-5 py-2.5"
            >
              <ZoneHead name={t(zone)} sum={zoneSum} />
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-1.5">
                {tiles.map(({ s, sum, busy }) => (
                  <li key={s.name} className={busy || all ? "" : "hidden"}>
                    <Tile
                      name={s.name}
                      tally={sum}
                      chosen={chosen === s.name}
                      onChoose={() =>
                        choose(chosen === s.name ? undefined : s.name)
                      }
                    />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <div className="border-t border-ops-line-soft px-5 py-1">
        <button
          type="button"
          aria-expanded={all}
          onClick={() => setAll(!all)}
          className="npf-small inline-flex min-h-11 items-center font-medium text-npf-blue underline-offset-4 hover:text-npf-blue-deep hover:underline"
        >
          {all
            ? t("Busy commands only")
            : t("Show all {n} commands", { n: STATES.length })}
        </button>
      </div>
    </OpsPanel>
  );
}

/**
 * A command desk's mosaic: its divisions with a call open, busiest first.
 * A command has dozens of divisions and most are quiet at any hour, so the
 * quiet ones stay off the board rather than burying the three that matter.
 */
function DivisionMosaic({
  incidents,
  now,
  chosen,
  onChoose,
}: {
  incidents: Incident[];
  now: number;
  chosen: string | null;
  onChoose: (division: string | null) => void;
}) {
  const t = useT();
  const open = incidents.filter((i) => i.status !== "Closed");
  const divisions = [...new Set(open.map((i) => i.where.division))]
    .map((d) => ({
      name: d,
      tally: tally(
        open.filter((i) => i.where.division === d),
        now,
      ),
    }))
    .sort(
      (a, b) =>
        b.tally.late - a.tally.late ||
        b.tally.waiting - a.tally.waiting ||
        b.tally.running - a.tally.running,
    );

  if (!divisions.length) return null;
  return (
    <OpsPanel
      title={t("Divisions")}
      action={
        <span className="flex items-center gap-5">
          <Legend />
          {chosen ? (
          <button
            type="button"
            onClick={() => onChoose(null)}
            className="npf-small -my-2 inline-flex min-h-11 items-center gap-1.5 font-medium text-npf-blue underline-offset-4 hover:text-npf-blue-deep hover:underline"
          >
            <CloseIcon aria-hidden className="size-3.5" />
            {t("All divisions")}
          </button>
          ) : null}
        </span>
      }
    >
      <ul className="flex flex-wrap gap-2">
        {divisions.map(({ name, tally }) => (
          <li key={name}>
            <Tile
              name={t(name)}
              tally={tally}
              chosen={chosen === name}
              onChoose={() => onChoose(chosen === name ? null : name)}
            />
          </li>
        ))}
      </ul>
    </OpsPanel>
  );
}

/**
 * One command or division. The waiting count is the figure, because a call
 * nobody has taken is the thing on this board that gets worse by itself;
 * late turns the whole tile red. A quiet tile drops back to the ground so
 * the busy ones are what the eye lands on.
 */
function Tile({
  name,
  tally: { waiting, late, running, free, units },
  chosen,
  onChoose,
}: {
  name: string;
  tally: Tally;
  chosen: boolean;
  onChoose: () => void;
}) {
  const t = useT();
  const hasUnits = !!units && free !== undefined;
  const label = hasUnits
    ? t("{name}: {w} waiting, {l} late, {r} running, {f} of {u} units free", {
        name,
        w: waiting,
        l: late,
        r: running,
        f: free,
        u: units,
      })
    : t("{name}: {w} waiting, {l} late, {r} running", {
        name,
        w: waiting,
        l: late,
        r: running,
      });

  /*
   * A cell, in alphabetical place so a command is always where the officer
   * last saw it. The fill says how bad it is: red when a call is late, amber
   * while one waits, a pale Force-blue wash while units are out. A quiet cell
   * has no fill and no outline, only steel text: thirty outlined boxes made
   * the quiet commands as loud as the busy ones. Units free stays in the
   * spoken label and on the Units panel; on every cell it was noise.
   */
  const surface = chosen
    ? "bg-ops-brand font-semibold text-white shadow-[0_6px_16px_-8px_var(--color-npf-blue-deep)]"
    : late
      ? "bg-ops-p1-wash font-semibold text-npf-ink hover:bg-[color-mix(in_srgb,var(--ops-p1)_14%,white)]"
      : waiting
        ? "bg-ops-p2-wash font-semibold text-npf-ink hover:bg-[color-mix(in_srgb,var(--ops-p2)_16%,white)]"
        : running
          ? "bg-npf-mist font-medium text-npf-ink hover:bg-npf-chip"
          : "text-npf-steel hover:bg-npf-cloud hover:text-npf-ink";
  const counted = !!(waiting || running);

  return (
    <button
      type="button"
      aria-pressed={chosen}
      aria-label={label}
      title={label}
      onClick={onChoose}
      /* The counts sit at the cell's end, so down a column of cells they
         form one edge to scan. A long name gives way before a count does;
         the whole name is in the title and the spoken label. */
      className={`inline-flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-lg ps-3 pe-2 text-sm whitespace-nowrap transition-[background-color,color,box-shadow,scale] duration-(--dur-hover) active:scale-[0.97] active:duration-(--dur-press) sm:h-10 ${surface}`}
    >
      <span className="truncate">{name}</span>
      {counted ? (
        <span aria-hidden className="flex shrink-0 items-center gap-1 tabular-nums">
          <Count n={waiting} kind={late ? "late" : "waiting"} chosen={chosen} />
          <Count n={running} kind="running" chosen={chosen} />
        </span>
      ) : null}
    </button>
  );
}

/**
 * The calls a zone owes, said in words under its name: waiting first, the
 * late share of it next, then running. A quiet zone says its queue is clear
 * and steps back to steel.
 */
function ZoneHead({
  name,
  sum,
}: {
  name: string;
  sum: { waiting: number; late: number; running: number };
}) {
  const t = useT();
  const parts = [
    sum.waiting ? t("{n} waiting", { n: sum.waiting }) : null,
    sum.late ? t("{n} late", { n: sum.late }) : null,
    sum.running ? t("{n} running", { n: sum.running }) : null,
  ].filter(Boolean);
  return (
    /* Beside its commands on a phone too: stacked above them, a zone with
       one busy command spent a whole extra line on its name. */
    <div className="pt-1 sm:pt-0.5">
      <h3
        className={`font-secondary text-sm leading-tight font-bold ${
          parts.length ? "text-npf-ink" : "text-npf-steel"
        }`}
      >
        {name}
      </h3>
      <p
        className={`mt-1 text-xs tabular-nums ${
          sum.late ? "font-semibold text-npf-ink" : "text-npf-steel"
        }`}
      >
        {parts.length ? parts.join(", ") : t("Queue clear")}
      </p>
    </div>
  );
}

/**
 * A figure on a chip. Waiting and late are solid, running is an outline, so
 * the two read apart by shape as well as colour.
 */
function Count({
  n,
  kind,
  chosen,
}: {
  n: number;
  kind: "late" | "waiting" | "running";
  chosen: boolean;
}) {
  const tone = chosen
    ? kind === "running"
      ? "text-white ring-1 ring-white/60 ring-inset"
      : "bg-white text-npf-blue-deep"
    : kind === "late"
      ? "bg-ops-p1 text-white"
      : kind === "waiting"
        ? "bg-ops-p2 text-white"
        : "text-npf-blue-ink ring-1 ring-npf-blue-mid/45 ring-inset";
  if (!n) return null;
  return (
    <span
      key={n}
      className={`npf-ops-count grid h-5 min-w-5 place-items-center rounded-full px-1 font-mono text-2xs leading-none font-semibold ${tone}`}
    >
      {n}
    </span>
  );
}

/** What the figures on a chip mean, said once over the board. */
function Legend() {
  const t = useT();
  const key = (mark: string, label: string) => (
    <span className="flex items-center gap-1.5">
      <span aria-hidden className={`size-3 rounded-full ${mark}`} />
      {label}
    </span>
  );
  return (
    <span
      aria-hidden
      className="flex items-center gap-4 text-xs text-npf-steel max-md:hidden"
    >
      {key("bg-ops-p1", t("Late"))}
      {key("bg-ops-p2", t("Waiting"))}
      {key("ring-1 ring-npf-blue-mid/45 ring-inset", t("Running"))}
    </span>
  );
}

/** The link out of a panel to the board that owns the same data in full. */
function More({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group npf-small -my-2 inline-flex min-h-11 items-center gap-1.5 font-medium text-npf-blue underline-offset-4 transition-colors hover:text-npf-blue-deep hover:underline"
    >
      {children}
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform duration-200 ease-(--ease-out) group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
      />
    </Link>
  );
}

/*
 * The two queues share one grid, so a call keeps its columns when it moves
 * from Pending to Running: grade, the call itself, then the readings. From
 * 48rem of panel the readings stand in fixed columns under a ruled head;
 * narrower, they fold under the call.
 */
const PENDING_COLS = "@3xl:grid-cols-[2.5rem_minmax(0,1fr)_6.5rem_11rem]";
const RUNNING_COLS =
  "@3xl:grid-cols-[2.5rem_minmax(0,1fr)_7.25rem_9rem_4.5rem]";

/** The ruled column heads over a queue, shown once the columns are. */
function QueueHead({
  cols,
  labels,
  end = [],
}: {
  cols: string;
  labels: string[];
  /** Columns whose content sits at the end edge, so the head does too. */
  end?: number[];
}) {
  return (
    <div
      aria-hidden
      className={`hidden gap-x-6 border-b border-ops-line bg-[color-mix(in_srgb,var(--color-npf-cloud)_70%,white)] px-5 py-2 text-xs font-semibold text-npf-steel @3xl:grid ${cols}`}
    >
      {labels.map((label, i) => (
        <span
          key={i}
          className={end.includes(i) ? "text-end" : ""}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

/** What the call is and where: the same two lines on both queues. */
function CallLines({
  incident,
  summary,
}: {
  incident: Incident;
  summary?: boolean;
}) {
  const t = useT();
  return (
    <div className="min-w-0">
      {/* The whole first line opens the call: the type is what the eye
          lands on, so it is the target, not only the reference beside it. */}
      <Link
        href={`/app/police/incidents?call=${incident.id}`}
        className="group/call flex w-fit flex-wrap items-baseline gap-x-2 gap-y-0.5 rounded-sm"
      >
        <span className="text-[0.9375rem] leading-snug font-semibold text-npf-ink underline-offset-4 transition-colors group-hover/call:text-npf-blue group-hover/call:underline">
          {t(incident.kind)}
        </span>
        <span className="font-mono text-xs text-ops-dim tabular-nums">
          {incident.id}
        </span>
      </Link>
      <p className="mt-1 truncate text-[0.8125rem] text-npf-body">
        {placeOf(t(incident.area), incident.where)}
      </p>
      {summary ? (
        <p className="mt-2 line-clamp-2 max-w-[62ch] text-[0.8125rem] leading-relaxed text-ops-dim">
          {t(incident.summary)}
        </p>
      ) : null}
    </div>
  );
}

/**
 * A call with nobody on it. The row carries its own dispatch control, because
 * the alternative — open the call, find the unit, come back — is three steps
 * for the single action this screen exists to make fast.
 *
 * Down the queue the clocks stand in one column and the dispatch controls in
 * the next, so the eye runs down how long each has waited and the hand down
 * one edge of controls.
 */
function PendingCall({
  incident,
  units,
  now,
}: {
  incident: Incident;
  units: Unit[];
  now: number;
}) {
  const t = useT();
  const id = useId();
  const late = isOverdue(incident, now);
  // Its own command's units only, even on a national desk.
  const free = units.filter(
    (u) => u.status === "Available" && u.state === incident.where.state,
  );
  const target = dispatchTarget[incident.priority];
  const tone = targetTone(incident, now);

  return (
    <li
      className={`npf-ops-row npf-ops-call grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 gap-y-4 border-b border-ops-line-soft px-5 py-5 @3xl:gap-x-6 transition-colors last:border-0 hover:bg-ops-hover ${PENDING_COLS} @3xl:items-start ${
        late ? "npf-ops-overdue" : ""
      }`}
      style={{ viewTransitionName: `call-${incident.id}` }}
    >
      <span className="pt-0.5">
        <PriorityTag priority={incident.priority} />
      </span>
      <CallLines incident={incident} summary />

      {/* Below 36rem the clock and the control share one line under the
          call, indented to the call's own edge. */}
      <div className="col-start-2 flex items-center gap-5 @3xl:contents">
        <span className="flex w-24 shrink-0 flex-col gap-1.5 @3xl:w-auto @3xl:items-end @3xl:pt-0.5">
          <span className="flex flex-col gap-1 whitespace-nowrap @3xl:items-end">
            <span style={{ color: tone }}>
              <Elapsed
                from={incident.reported}
                className="text-base leading-none font-semibold tracking-[-0.02em]"
              />
            </span>
            <span
              className={`text-2xs leading-none ${late ? "font-semibold text-ops-p1" : "text-ops-dim"}`}
            >
              {late
                ? t("over {span}", { span: duration(target * 60_000) })
                : t("of {n}m", { n: target })}
            </span>
          </span>
          <TargetBar incident={incident} now={now} className="w-full" />
        </span>

        <span className="block min-w-0 flex-1 @3xl:flex-none">
          {free.length ? (
            <>
              <label htmlFor={id} className="sr-only">
                {t("Dispatch {ref} to a unit", { ref: incident.id })}
              </label>
              <select
                id={id}
                value=""
                onChange={(e) => {
                  const unit = units.find((u) => u.callsign === e.target.value);
                  if (!unit) return;
                  /* The call travels from the queue into Running, so the eye
                     follows it to where it went instead of losing it in a blink
                     out of one list and into the other. */
                  withTransition(() =>
                    updateIncident(incident.id, {
                      unit: unit.callsign,
                      assignee: unit.officer,
                      status: "Dispatched",
                    }),
                  );
                }}
                className="npf-ops-select h-9 w-full max-w-52 min-w-fit ps-3 text-[0.8125rem] font-medium whitespace-nowrap outline-none @3xl:max-w-none"
              >
                {/* The prompt, not a choice: it names the control and stays out
                    of the list. */}
                <option value="" hidden>
                  {t("Dispatch · {n} free", { n: free.length })}
                </option>
                {free.map((u) => (
                  <option key={u.callsign} value={u.callsign}>
                    {t(u.callsign)} · {t(u.area)}
                  </option>
                ))}
              </select>
            </>
          ) : (
            /* Nothing to choose, so no control: an empty slot the size of
               the select, ruled in dashes, saying so plainly. */
            <span className="flex h-9 w-full max-w-52 min-w-fit items-center gap-2 rounded-(--ops-control-radius) border border-dashed border-npf-line px-3 text-[0.8125rem] whitespace-nowrap text-ops-dim @3xl:max-w-none">
              <span
                aria-hidden
                className="size-1.5 shrink-0 rounded-full bg-npf-steel/50"
              />
              {t("No unit free")}
            </span>
          )}
        </span>
      </div>
    </li>
  );
}

/**
 * A call that already has a unit. Read-only here; worked on the Calls board.
 * Status, unit and clock stand in fixed columns, so down the list they read
 * as three straight edges whatever the tag or the callsign says.
 */
function RunningCall({ incident }: { incident: Incident }) {
  const t = useT();
  return (
    <li
      className={`npf-ops-call grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-ops-line-soft px-5 py-4 @3xl:gap-x-6 transition-colors last:border-0 hover:bg-ops-hover ${RUNNING_COLS}`}
      /* The same name as its pending row, which is what lets a dispatch
         carry the row across the board. */
      style={{ viewTransitionName: `call-${incident.id}` }}
    >
      <span className="self-start pt-0.5">
        <PriorityTag priority={incident.priority} />
      </span>
      <CallLines incident={incident} />

      <div className="col-start-2 flex items-center gap-3 @3xl:contents">
        <span className="flex">
          <OpsStatus status={incident.status} />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[0.8125rem] font-medium text-npf-ink">
            {t(incident.unit ?? "")}
          </span>
          {incident.assignee ? (
            <span className="hidden truncate text-xs text-ops-dim @3xl:block">
              {t(incident.assignee)}
            </span>
          ) : null}
        </span>
        <Elapsed
          from={incident.onScene ?? incident.dispatched ?? incident.reported}
          className="ms-auto text-sm font-semibold text-npf-ink @3xl:text-end"
        />
      </div>
    </li>
  );
}

/** What a segment of the availability track means, by unit status. */
const UNIT_FILL: Record<Unit["status"], string> = {
  Available: "var(--ops-fill-ok)",
  Assigned: "var(--ops-fill-warn)",
  "On Scene": "var(--ops-fill-warn)",
  // Off the air has to show as a segment, not as a gap in the track.
  Unavailable: "color-mix(in srgb, var(--ops-dim) 45%, transparent)",
};

/** The order a section's track is drawn in: what can go first. */
const UNIT_ORDER: Record<Unit["status"], number> = {
  Available: 0,
  Assigned: 1,
  "On Scene": 1,
  Unavailable: 2,
};

const UNIT_KEY = [
  { label: "Free", fill: "var(--ops-fill-ok)" },
  { label: "Committed", fill: "var(--ops-fill-warn)" },
  {
    label: "Off the air",
    fill: "color-mix(in srgb, var(--ops-dim) 45%, transparent)",
  },
];

/**
 * The unit status board, rolled up by division. A dispatcher does not ask
 * "how many units exist", they ask "is there a traffic car free", so the
 * available count is what the row leads with.
 */
function UnitBoard({ units }: { units: Unit[] }) {
  const t = useT();
  const divisions = [...new Set(units.map((u) => u.section))];
  const free = units.filter((u) => u.status === "Available");

  return (
    <OpsPanel
      title={t("Units")}
      count={t("{n} free", { n: free.length })}
      action={<More href="/app/police/units">{t("Status board")}</More>}
      flush
    >
      <table className="w-full text-sm">
        <caption className="sr-only">
          {t("Units on duty by section, with how many are available")}
        </caption>
        <tbody>
          {divisions.map((division) => {
            const inDivision = units.filter((u) => u.section === division);
            const open = inDivision.filter((u) => u.status === "Available");
            return (
              <tr
                key={division}
                className="border-b border-ops-line-soft last:border-0"
              >
                <th
                  scope="row"
                  className="py-2.5 ps-5 font-normal whitespace-nowrap"
                >
                  {t(division)}
                </th>
                <td className="w-full px-3 py-2.5">
                  {/* Availability as a filled track: the bar is the number,
                      not a decoration beside it. One segment per unit, in the
                      three colours the legend under the table names — free,
                      committed, off the air — so the row is readable without
                      counting and the colours mean the same thing they mean
                      on the status pills. */}
                  {/* Free first, then committed, then off the air, so the
                      green run from the start is the answer. Each unit has
                      at most 1.5rem, so a one-car section draws a short
                      track instead of one as long as a fleet of seven. */}
                  <span
                    aria-hidden
                    className="flex h-1.5 gap-0.5"
                  >
                    {[...inDivision]
                      .sort((a, b) => UNIT_ORDER[a.status] - UNIT_ORDER[b.status])
                      .map((u) => (
                      <span
                        key={u.callsign}
                        className="max-w-6 flex-1 rounded-full transition-[background-color] duration-500 ease-(--ease-out)"
                        style={{ background: UNIT_FILL[u.status] }}
                      />
                    ))}
                  </span>
                </td>
                {/* Ink, not status colour: the track already says it. */}
                <td className="py-2.5 pe-5 text-end font-mono text-xs font-semibold whitespace-nowrap text-npf-ink tabular-nums">
                  {open.length}
                  <span className="font-normal text-ops-dim">
                    /{inDivision.length}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Three colours across twelve tracks earn one line naming them. */}
      <ul className="flex flex-wrap gap-x-4 gap-y-1 border-t border-ops-line-soft px-5 py-3 text-xs text-ops-dim">
        {UNIT_KEY.map(({ label, fill }) => (
          <li key={label} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="size-2 rounded-full"
              style={{ background: fill }}
            />
            {t(label)}
          </li>
        ))}
      </ul>

    </OpsPanel>
  );
}
