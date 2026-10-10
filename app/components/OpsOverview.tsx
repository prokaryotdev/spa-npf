"use client";

import Link from "../i18n/Link";
import { useId } from "react";
import { flushSync } from "react-dom";
import { dispatchTarget } from "../content-ops";
import {
  Elapsed,
  OpsEmpty,
  OpsHead,
  OpsPanel,
  OpsStatus,
  PriorityTag,
  duration,
  isOverdue,
  useNow,
  useScoped,
} from "./OpsPieces";
import { updateIncident, type Incident, type Unit } from "./store";
import { placeOf } from "../geo";
import {
  AlertIcon,
  ArrowRight,
  ClockIcon,
  PhoneCallIcon,
  RadioIcon,
  UserCircle,
} from "./icons";
import { useFormat, useT } from "../i18n/client";

/**
 * The command board. It answers the four questions a duty supervisor asks on
 * walking into the room, in the order they ask them: what is waiting, what is
 * late, who is running, and who is free.
 *
 * Laid out like /services: the title, a mist strip of the four numbers, then
 * the queues in white cards. Pending calls lead, wide, because an unassigned
 * call is the only thing on this screen that is actively getting worse while
 * nobody looks at it; the unit roll-up rides beside them on a desk.
 */
export default function OpsOverview() {
  const t = useT();
  const { incidents, units } = useScoped();
  const now = useNow();
  const format = useFormat();

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
        lead={now ? format.date(new Date(now).toISOString().slice(0, 10)) : undefined}
      />

      {/*
        The four headline tiles. Each number carries the breakdown a
        supervisor asks for next (which grades are waiting, who is en route
        and who is on scene, how the units split) so the tile answers the
        follow-up without a click. Red only when something is late.
      */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Kpi label={t("Waiting")} value={pending.length} Icon={PhoneCallIcon}>
          <GradeMix calls={pending} />
        </Kpi>
        <Kpi
          label={t("Late")}
          value={overdue.length}
          Icon={overdue.length ? AlertIcon : ClockIcon}
          alert={overdue.length > 0}
        >
          <GradeMix calls={overdue} />
        </Kpi>
        <Kpi label={t("Running")} value={running.length} Icon={RadioIcon}>
          {(["Dispatched", "On Scene"] as const).map((status) => {
            const n = running.filter((i) => i.status === status).length;
            return n ? (
              <span key={status} className="inline-flex items-center gap-1.5">
                <OpsStatus status={status} />
                <span className="font-semibold text-npf-ink tabular-nums">
                  {n}
                </span>
              </span>
            ) : null;
          })}
        </Kpi>
        <Kpi
          label={t("Units free")}
          value={
            <>
              {free.length}
              <span className="text-[0.6em] font-semibold text-npf-steel">
                /{units.length}
              </span>
            </>
          }
          Icon={UserCircle}
        >
          {/* One segment per unit, in the colours the Units panel names. */}
          <span aria-hidden className="flex h-2 w-full gap-0.5">
            {units.map((u) => (
              <span
                key={u.callsign}
                className="flex-1 rounded-full transition-[background-color] duration-500 ease-(--ease-out)"
                style={{ background: UNIT_FILL[u.status] }}
              />
            ))}
          </span>
        </Kpi>
      </div>

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
                    late={isOverdue(incident, now)}
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

/**
 * A headline tile: the label, its icon, the number, and one line of
 * breakdown under it. Red only when it means act.
 */
function Kpi({
  label,
  value,
  Icon,
  alert = false,
  children,
}: {
  label: string;
  value: React.ReactNode;
  Icon: (props: { className?: string }) => React.ReactNode;
  alert?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section
      aria-label={label}
      className={`npf-ops-tile flex min-w-0 flex-col p-4 sm:p-5 ${alert ? "bg-[linear-gradient(180deg,var(--color-npf-error-wash),#fff_70%)]" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm font-medium text-npf-steel">{label}</h2>
        <span
          aria-hidden
          className={`grid size-9 shrink-0 place-items-center rounded-full sm:size-10 ${
            alert ? "bg-npf-alert text-white" : "bg-npf-cloud text-npf-blue-ink"
          }`}
        >
          <Icon className="size-4.5 sm:size-5" />
        </span>
      </div>
      <p
        key={String(typeof value === "object" ? "" : value)}
        className="npf-ops-count -mt-1 font-secondary text-[2rem] leading-none font-bold tracking-[-0.02em] tabular-nums sm:text-[2.5rem]"
        style={{ color: alert ? "var(--ops-p1)" : "var(--color-npf-blue-deep)" }}
      >
        {value}
      </p>
      <div className="mt-4 flex min-h-6 flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
        {children}
      </div>
    </section>
  );
}

/** How a set of calls splits by grade: one tag and a count per grade held. */
function GradeMix({ calls }: { calls: Incident[] }) {
  const grades = (["P1", "P2", "P3", "P4"] as const)
    .map((p) => [p, calls.filter((c) => c.priority === p).length] as const)
    .filter(([, n]) => n);
  return grades.map(([p, n]) => (
    <span key={p} className="inline-flex items-center gap-1.5">
      <PriorityTag priority={p} withLabel={false} />
      <span className="font-semibold text-npf-ink tabular-nums">{n}</span>
    </span>
  ));
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
  late,
}: {
  incident: Incident;
  units: Unit[];
  late: boolean;
}) {
  const t = useT();
  const id = useId();
  // Its own command's units only, even on a national desk.
  const free = units.filter(
    (u) => u.status === "Available" && u.state === incident.where.state,
  );
  const target = dispatchTarget[incident.priority];

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
            href="/app/police/incidents"
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
        <span
          className="font-secondary text-sm leading-none font-bold"
          style={{ color: late ? "var(--ops-p1)" : "var(--ops-text)" }}
        >
          <Elapsed from={incident.reported} />
          <span className="ms-1.5 font-primary text-2xs font-normal text-ops-dim">
            {late
              ? t("over {span}", { span: duration(target * 60_000) })
              : t("of {n}m", { n: target })}
          </span>
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
            if ("startViewTransition" in document)
              document.startViewTransition(() => flushSync(send));
            else send();
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
      <span className="font-secondary text-sm font-bold tabular-nums">
        {incident.id}
      </span>
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
