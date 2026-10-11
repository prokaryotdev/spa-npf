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
      action={
        chosen ? (
          <button
            type="button"
            onClick={() => choose(undefined)}
            className="npf-small -my-2 inline-flex min-h-11 items-center gap-1.5 font-medium text-npf-blue underline-offset-4 hover:text-npf-blue-deep hover:underline"
          >
            <CloseIcon aria-hidden className="size-3.5" />
            {t("All commands")}
          </button>
        ) : null
      }
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-6">
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
          /* On a phone the quiet commands, and a zone with none busy, step
             off: thirty-seven tiles is a long scroll to reach the queue. */
          return (
            <section
              key={zone}
              aria-label={t(zone)}
              className={`min-w-0 ${tiles.some((x) => x.busy) ? "" : "max-sm:hidden"}`}
            >
              <h3 className="mb-2.5 truncate border-b border-ops-line-soft pb-2 font-secondary text-sm font-bold text-npf-ink">
                {t(zone)}
              </h3>
              <ul className="grid gap-1">
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
        chosen ? (
          <button
            type="button"
            onClick={() => onChoose(null)}
            className="npf-small -my-2 inline-flex min-h-11 items-center gap-1.5 font-medium text-npf-blue underline-offset-4 hover:text-npf-blue-deep hover:underline"
          >
            <CloseIcon aria-hidden className="size-3.5" />
            {t("All divisions")}
          </button>
        ) : null
      }
    >
      <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 xl:grid-cols-5">
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
  const quiet = !waiting && !running;
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

  const surface = chosen
    ? "bg-ops-brand text-white shadow-[0_8px_20px_-10px_var(--color-npf-blue-deep)]"
    : late
      ? "bg-ops-p1-wash text-npf-ink ring-1 ring-inset ring-[color-mix(in_srgb,var(--ops-p1)_30%,transparent)] hover:ring-[color-mix(in_srgb,var(--ops-p1)_55%,transparent)]"
      : quiet
        ? "text-npf-steel hover:bg-npf-mist hover:text-npf-ink"
        : "bg-white text-npf-ink ring-1 ring-inset ring-npf-line hover:ring-npf-blue-mid/50";
  const figure = chosen
    ? "#fff"
    : late
      ? "var(--ops-p1)"
      : "var(--color-npf-blue-deep)";
  const meta = chosen ? "text-white/80" : "text-npf-steel";

  return (
    <button
      type="button"
      aria-pressed={chosen}
      aria-label={label}
      onClick={onChoose}
      /* A quiet tile is one line: its name and, if it has any, its free
         units. Only a tile with work open grows to carry the figure, so
         the busy commands stand taller than the rest of the zone. */
      className={`flex w-full flex-col justify-between rounded-xl px-3 text-start transition-[background-color,color,box-shadow,scale] duration-(--dur-hover) active:scale-[0.97] active:duration-(--dur-press) ${
        quiet && !chosen ? "min-h-9 py-1.5" : "min-h-16 gap-1.5 py-2.5 shadow-[0_6px_16px_-12px_var(--color-npf-blue-deep)]"
      } ${surface}`}
    >
      <span className="flex w-full items-center justify-between gap-2">
        <span
          className={`min-w-0 truncate text-sm leading-tight ${quiet ? "" : "font-semibold"}`}
        >
          {name}
        </span>
        {quiet && hasUnits ? (
          <span
            aria-hidden
            className={`text-2xs tabular-nums ${chosen ? "text-white/80" : "text-npf-steel"}`}
          >
            {free}/{units}
          </span>
        ) : null}
        {waiting ? (
          <span
            key={waiting}
            aria-hidden
            className="npf-ops-count -mt-0.5 font-secondary text-xl leading-none font-bold tabular-nums"
            style={{ color: figure }}
          >
            {waiting}
          </span>
        ) : null}
      </span>
      {quiet ? null : (
      <span
        aria-hidden
        className={`flex w-full items-center gap-x-2 text-2xs leading-none whitespace-nowrap tabular-nums ${meta}`}
      >
        {late ? (
          <span
            className={`font-semibold ${chosen ? "text-white" : "text-ops-p1"}`}
          >
            {t("{n} late", { n: late })}
          </span>
        ) : waiting ? (
          <span>{t("{n} waiting", { n: waiting })}</span>
        ) : (
          <span>{t("{n} running", { n: running })}</span>
        )}
        {hasUnits ? (
          <span className="ms-auto flex items-center gap-1">
            <span
              className="size-1.5 rounded-full"
              style={{
                background: free
                  ? chosen
                    ? "#fff"
                    : "var(--ops-fill-ok)"
                  : "color-mix(in srgb, var(--ops-dim) 45%, transparent)",
              }}
            />
            {free}/{units}
          </span>
        ) : null}
      </span>
      )}
    </button>
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
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <PriorityTag priority={incident.priority} />
          <Link
            href={`/app/police/incidents?call=${incident.id}`}
            className="rounded-chip font-secondary text-sm font-bold tabular-nums underline-offset-4 hover:underline"
          >
            {incident.id}
          </Link>
          <span className="text-sm font-medium">{t(incident.kind)}</span>
          <span className="text-sm text-ops-dim">
            {placeOf(t(incident.area), incident.where)}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ops-dim">
          {t(incident.summary)}
        </p>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 @md:flex-col @md:items-end @md:gap-2">
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
          <TargetBar incident={incident} now={now} />
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
          className="npf-ops-select h-10 max-w-56 rounded-full px-4 text-sm font-medium outline-none"
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
      className="npf-ops-call flex flex-wrap items-baseline gap-x-2.5 gap-y-1 border-b border-ops-line-soft px-5 py-3 transition-colors last:border-0 hover:bg-ops-hover"
      /* The same name as its pending row, which is what lets a dispatch
         carry the row across the board. */
      style={{ viewTransitionName: `call-${incident.id}` }}
    >
      <PriorityTag priority={incident.priority} />
      <Link
        href={`/app/police/incidents?call=${incident.id}`}
        className="rounded-chip font-secondary text-sm font-bold tabular-nums underline-offset-4 hover:underline"
      >
        {incident.id}
      </Link>
      {/* On a phone the call keeps its words and the status drops to a
          second line, rather than "Theft…" squeezed beside it. */}
      <span className="min-w-0 flex-1 text-sm @max-md:min-w-[60%] @md:truncate">
        {t(incident.kind)}
        <span className="text-ops-dim"> · {placeOf(t(incident.area), incident.where)}</span>
      </span>
      <OpsStatus status={incident.status} />
      <span className="flex items-baseline gap-2 text-xs text-ops-dim">
        {t(incident.unit ?? "")}
        <Elapsed
          from={incident.onScene ?? incident.dispatched ?? incident.reported}
          className="font-medium text-ops-text"
        />
      </span>
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
