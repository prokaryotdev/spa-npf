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
 * It opens on the Force itself: every command as a tile, grouped by
 * geopolitical zone, each carrying its own waiting, late and free-unit
 * numbers. A national desk reads the whole country in one look, sees which
 * tiles are red, and picks one; the queues under the mosaic narrow to that
 * command. A command desk gets the same mosaic one level down, by division.
 *
 * Under it the work: pending calls with their dispatch control, the calls
 * already running, and the units by section.
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

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <div className="@container min-w-0 space-y-4">
          <OpsPanel
            title={t("Pending")}
            count={
              pending.length
                ? t("{n} waiting", { n: pending.length })
                : undefined
            }
            flush
          >
            {pending.length ? (
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
              <ul>
                {running.map((incident) => (
                  <RunningCall key={incident.id} incident={incident} />
                ))}
              </ul>
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

        {/* Pinned beside the queues only where the screen is tall enough. */}
        <div className="xl:[@media(min-height:46rem)]:sticky xl:[@media(min-height:46rem)]:top-[calc(var(--ops-top)+1.5rem)]">
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
          /* On a phone the quiet commands, and a zone with none busy, step
             off: thirty-seven chips is a long scroll to reach the queue. */
          return (
            <section
              key={zone}
              aria-label={t(zone)}
              className={`grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-x-4 px-5 py-2.5 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-x-6 ${
                tiles.some((x) => x.busy) ? "" : "max-sm:hidden"
              }`}
            >
              <ZoneHead name={t(zone)} sum={zoneSum} />
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-1.5">
                {tiles.map(({ s, sum, busy }) => (
                  <li key={s.name} className={busy ? "" : "max-sm:hidden"}>
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
      className={`npf-ops-count grid h-5 min-w-5 place-items-center rounded-full px-1 text-2xs leading-none font-bold ${tone}`}
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

/**
 * A call with nobody on it. The row carries its own dispatch control, because
 * the alternative — open the call, find the unit, come back — is three steps
 * for the single action this screen exists to make fast.
 *
 * The clock and the control share the trailing column, stacked. Across the
 * queue that makes one straight edge of elapsed times to scan down and one
 * column of dispatch controls to reach for, instead of a select box sitting
 * in the middle of every row outweighing the call it belongs to.
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
      /* Stacked on a phone, side by side from 640px. Squeezing a 190px
         dispatch control alongside the call on a 390px screen left the
         summary about twenty characters wide — three ragged lines of what the
         caller actually said. */
      className={`npf-ops-row npf-ops-call flex flex-col gap-3 border-b border-ops-line-soft px-5 py-4 transition-colors last:border-0 hover:bg-ops-hover @md:flex-row @md:gap-4 ${
        late ? "npf-ops-overdue" : ""
      }`}
      style={{ viewTransitionName: `call-${incident.id}` }}
    >
      {/* Three lines in a fixed order on every row: what (grade, reference,
          type), where, what the caller said. Letting the place run on after
          the type put it on line one for a short place and line two for a
          long one, so no two rows read the same. */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <PriorityTag priority={incident.priority} />
          <Link
            href={`/app/police/incidents?call=${incident.id}`}
            className="rounded-chip font-secondary text-sm font-bold tabular-nums underline-offset-4 hover:underline"
          >
            {incident.id}
          </Link>
          <span className="text-sm font-semibold text-npf-ink">
            {t(incident.kind)}
          </span>
        </div>
        <p className="mt-1 text-sm text-npf-body">
          {placeOf(t(incident.area), incident.where)}
        </p>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ops-dim">
          {t(incident.summary)}
        </p>
      </div>

      {/* One fixed-width column: the clock, its bar and the control share
          the same edges, so down the queue they read as three straight
          lines instead of a bar shorter than the button under it. */}
      <div className="flex shrink-0 items-center justify-between gap-3 @md:w-44 @md:flex-col @md:items-stretch @md:gap-2">
        <span className="flex flex-col gap-1.5 @md:items-end">
          <span
            className="font-secondary text-sm leading-none font-bold"
            style={{ color: tone }}
          >
            <Elapsed from={incident.reported} />
            <span className="ms-1.5 font-primary text-2xs font-normal text-ops-dim">
              {late
                ? t("over {span}", { span: duration(target * 60_000) })
                : t("of {n}m", { n: target })}
            </span>
          </span>
          <TargetBar incident={incident} now={now} className="w-28 @md:w-full" />
        </span>

        <label htmlFor={id} className="sr-only">
          {t("Dispatch {ref} to a unit", { ref: incident.id })}
        </label>
        <select
          id={id}
          value=""
          disabled={free.length === 0}
          onChange={(e) => {
            const unit = units.find((u) => u.callsign === e.target.value);
            if (!unit) return;
            const send = () =>
              updateIncident(incident.id, {
                unit: unit.callsign,
                assignee: unit.officer,
                status: "Dispatched",
              });
            /* The call travels from the queue into Running, so the eye
               follows it to where it went instead of losing it in a blink
               out of one list and into the other. */
            withTransition(send);
          }}
          className="npf-ops-select h-10 max-w-56 rounded-full px-4 text-sm font-medium outline-none @md:max-w-none"
        >
          {/* The prompt, not a choice: it names the control and stays out
              of the list. */}
          <option value="" hidden>
            {free.length
              ? t("Dispatch · {n} free", { n: free.length })
              : t("No unit free")}
          </option>
          {free.map((u) => (
            <option key={u.callsign} value={u.callsign}>
              {t(u.callsign)} · {t(u.area)}
            </option>
          ))}
        </select>
      </div>
    </li>
  );
}

/** A call that already has a unit. Read-only here; worked on the Calls board. */
function RunningCall({ incident }: { incident: Incident }) {
  const t = useT();
  return (
    <li
      className="npf-ops-call flex flex-col gap-2 border-b border-ops-line-soft px-5 py-3 transition-colors last:border-0 hover:bg-ops-hover @md:flex-row @md:items-center @md:gap-4"
      /* The same name as its pending row, which is what lets a dispatch
         carry the row across the board. */
      style={{ viewTransitionName: `call-${incident.id}` }}
    >
      {/* The same two lines as a pending call, what then where, so a call
          reads the same before and after dispatch and a long place is
          never cut off. */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <PriorityTag priority={incident.priority} />
          <Link
            href={`/app/police/incidents?call=${incident.id}`}
            className="rounded-chip font-secondary text-sm font-bold tabular-nums underline-offset-4 hover:underline"
          >
            {incident.id}
          </Link>
          <span className="text-sm font-semibold text-npf-ink">
            {t(incident.kind)}
          </span>
        </div>
        <p className="mt-1 text-sm text-npf-body">
          {placeOf(t(incident.area), incident.where)}
        </p>
      </div>
      {/* Status, unit and clock in fixed slots from a tablet up, so they
          stand in three columns down the list whatever the pill or the
          callsign says. */}
      <div className="flex shrink-0 items-center gap-2.5">
        <span className="flex @md:min-w-24">
          <OpsStatus status={incident.status} />
        </span>
        <span className="truncate text-xs text-ops-dim @md:w-24">
          {t(incident.unit ?? "")}
        </span>
        <Elapsed
          from={incident.onScene ?? incident.dispatched ?? incident.reported}
          className="ms-auto text-xs font-semibold text-ops-text @md:min-w-12 @md:text-end"
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
                  <span
                    aria-hidden
                    className="flex h-1.5 gap-0.5"
                  >
                    {inDivision.map((u) => (
                      <span
                        key={u.callsign}
                        className="flex-1 rounded-full transition-[background-color] duration-500 ease-(--ease-out)"
                        style={{ background: UNIT_FILL[u.status] }}
                      />
                    ))}
                  </span>
                </td>
                <td
                  className="py-2.5 pe-5 text-end text-xs font-bold whitespace-nowrap tabular-nums"
                  style={{
                    color: open.length ? "var(--ops-fill-ok)" : "var(--ops-p2)",
                  }}
                >
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
