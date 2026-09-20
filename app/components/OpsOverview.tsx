"use client";

import Link from "../i18n/Link";
import { useId } from "react";
import { dispatchTarget } from "../content-ops";
import OpsResponseChart from "./OpsResponseChart";
import {
  Elapsed,
  OpsHead,
  OpsPanel,
  OpsStatus,
  PriorityTag,
  Readout,
  ReadoutStrip,
  UnitStatusTag,
  duration,
  isOverdue,
  useMounted,
  useNow,
} from "./OpsPieces";
import { updateIncident, useStore, type Incident, type Unit } from "./store";
import { ArrowRight } from "./icons";
import { useT } from "../i18n/client";

/**
 * The command board. It answers the four questions a duty supervisor asks on
 * walking into the room, in the order they ask them: what is waiting, what is
 * late, who is running, and who is free.
 *
 * Pending calls come first and everything else is secondary, because an
 * unassigned call is the only thing on this screen that is actively getting
 * worse while nobody looks at it.
 */
export default function OpsOverview() {
  const t = useT();
  const { incidents, units } = useStore();
  const now = useNow();
  const mounted = useMounted();

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
  const closedToday = incidents.filter((i) => i.closed);

  /** Median time from call to dispatch on everything cleared this shift. */
  const dispatched = incidents
    .filter((i) => i.dispatched)
    .map(
      (i) =>
        (new Date(i.dispatched as string).getTime() -
          new Date(i.reported).getTime()) /
        60_000,
    )
    .sort((a, b) => a - b);
  const median = dispatched.length
    ? dispatched[Math.floor(dispatched.length / 2)]
    : 0;

  return (
    <div className="space-y-5">
      <OpsHead
        title={t("Command board")}
        lead={t(
          "Live picture for Wuse control. Grades run P1 immediate to P4 scheduled.",
        )}
      />

      {/*
        One band of readouts, not five cards. An officer reads this line left
        to right in a second; boxing each number would slow that down and add
        nothing, and the only number allowed to shout is the late one.
      */}
      <ReadoutStrip>
        <Readout
          label={t("Waiting")}
          value={pending.length}
          note={pending.length ? t("unassigned calls") : t("queue clear")}
        />
        <Readout
          label={t("Past target")}
          value={overdue.length}
          tone={overdue.length ? "var(--ops-p1)" : undefined}
          note={overdue.length ? t("dispatch now") : t("all within target")}
        />
        <Readout
          label={t("Running")}
          value={running.length}
          note={t("units committed")}
        />
        <Readout
          label={t("Available")}
          value={`${free.length}/${units.length}`}
          tone={free.length === 0 ? "var(--ops-p2)" : undefined}
          note={t("units on the air")}
        />
        <Readout
          label={t("Median dispatch")}
          value={mounted ? `${median.toFixed(1)}m` : "—"}
          note={t("{n} calls closed", { n: closedToday.length })}
        />
      </ReadoutStrip>

      {/*
        Two columns from 1024px up, not 1280. A control-room desk is a
        1366-wide laptop as often as it is a wall screen, and on one of those
        the old breakpoint stacked the unit board and the response chart
        under a full-width call queue — half a metre of scrolling for a
        screen whose whole promise is that it fits in one look.
      */}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
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
              <Empty>{t("Queue clear. Every call has a unit on it.")}</Empty>
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
              <Empty>{t("No unit is currently committed to a call.")}</Empty>
            )}
          </OpsPanel>
        </div>

        <div className="space-y-4">
          <UnitBoard units={units} />
          <OpsPanel title={t("Response time")}>
            <OpsResponseChart />
          </OpsPanel>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-4 py-12 text-center text-sm text-[var(--ops-dim)]">
      {children}
    </p>
  );
}

/** The link out of a panel to the board that owns the same data in full. */
function More({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded text-xs font-medium text-[var(--ops-accent)] transition-opacity hover:opacity-70"
    >
      {children}
      <ArrowRight aria-hidden className="size-3.5" />
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
  const free = units.filter((u) => u.status === "Available");
  const target = dispatchTarget[incident.priority];

  return (
    <li
      className={`npf-ops-row flex gap-4 border-b border-[var(--ops-line)] px-4 py-3 last:border-0 ${
        late ? "npf-ops-overdue" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <PriorityTag priority={incident.priority} />
          <Link
            href="/app/police/incidents"
            className="rounded font-secondary text-sm font-bold tabular-nums underline-offset-4 hover:underline"
          >
            {incident.id}
          </Link>
          <span className="text-sm font-medium">{t(incident.kind)}</span>
          <span className="text-sm text-[var(--ops-dim)]">
            {t(incident.area)}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--ops-dim)]">
          {t(incident.summary)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span
          className="font-secondary text-sm leading-none font-bold"
          style={{ color: late ? "var(--ops-p1)" : "var(--ops-text)" }}
        >
          <Elapsed from={incident.reported} />
          <span className="ms-1.5 font-primary text-[11px] font-normal text-[var(--ops-dim)]">
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
            updateIncident(incident.id, {
              unit: unit.callsign,
              assignee: unit.officer,
              status: "Dispatched",
            });
          }}
          className="max-w-[184px] rounded-lg border border-[var(--ops-line)] bg-[var(--ops-panel)] px-2.5 py-1.5 text-xs font-medium outline-none hover:border-[var(--ops-accent)] focus:border-[var(--ops-accent)] disabled:opacity-50 disabled:hover:border-[var(--ops-line)]"
        >
          <option value="">
            {free.length
              ? t("Dispatch — {n} free", { n: free.length })
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
    <li className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 border-b border-[var(--ops-line)] px-4 py-2.5 last:border-0">
      <PriorityTag priority={incident.priority} />
      <span className="font-secondary text-sm font-bold tabular-nums">
        {incident.id}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm">
        {t(incident.kind)}
        <span className="text-[var(--ops-dim)]"> · {t(incident.area)}</span>
      </span>
      <OpsStatus status={incident.status} />
      <span className="flex items-baseline gap-2 text-xs text-[var(--ops-dim)]">
        {t(incident.unit ?? "")}
        <Elapsed
          from={incident.onScene ?? incident.dispatched ?? incident.reported}
          className="font-medium text-[var(--ops-text)]"
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
  Unavailable: "var(--ops-raised)",
};

const UNIT_KEY: [string, string][] = [
  ["Free", "var(--ops-fill-ok)"],
  ["Committed", "var(--ops-fill-warn)"],
  ["Off the air", "var(--ops-raised)"],
];

/**
 * The unit status board, rolled up by division. A dispatcher does not ask
 * "how many units exist", they ask "is there a traffic car free", so the
 * available count is what the row leads with.
 */
function UnitBoard({ units }: { units: Unit[] }) {
  const t = useT();
  const divisions = [...new Set(units.map((u) => u.division))];
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
          {t("Units on duty by division, with how many are available")}
        </caption>
        <tbody>
          {divisions.map((division) => {
            const inDivision = units.filter((u) => u.division === division);
            const open = inDivision.filter((u) => u.status === "Available");
            return (
              <tr
                key={division}
                className="border-b border-[var(--ops-line)] last:border-0"
              >
                <th
                  scope="row"
                  className="py-2 ps-4 font-normal whitespace-nowrap"
                >
                  {t(division)}
                </th>
                <td className="w-full px-3 py-2">
                  {/* Availability as a filled track: the bar is the number,
                      not a decoration beside it. One segment per unit, in the
                      three colours the legend under the table names — free,
                      committed, off the air — so the row is readable without
                      counting and the colours mean the same thing they mean
                      on the status pills. */}
                  <span
                    aria-hidden
                    className="flex h-1.5 gap-px overflow-hidden rounded-full"
                  >
                    {inDivision.map((u) => (
                      <span
                        key={u.callsign}
                        className="flex-1 first:rounded-s-full last:rounded-e-full"
                        style={{ background: UNIT_FILL[u.status] }}
                      />
                    ))}
                  </span>
                </td>
                <td
                  className="py-2 pe-4 text-end text-xs font-bold whitespace-nowrap tabular-nums"
                  style={{
                    color: open.length ? "var(--ops-fill-ok)" : "var(--ops-p2)",
                  }}
                >
                  {open.length}
                  <span className="font-normal text-[var(--ops-dim)]">
                    /{inDivision.length}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Three colours across twelve tracks earn one line naming them. */}
      <ul className="flex flex-wrap gap-x-4 gap-y-1 border-t border-[var(--ops-line)] bg-[var(--ops-bg)]/60 px-4 py-2 text-[11px] text-[var(--ops-dim)]">
        {UNIT_KEY.map(([label, fill]) => (
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

      <div className="border-t border-[var(--ops-line)] p-4">
        <p className="mb-2.5 font-secondary text-xs font-bold">
          {t("On the air")}
        </p>
        {free.length ? (
          <ul className="space-y-2">
            {free.slice(0, 5).map((u) => (
              <li
                key={u.callsign}
                className="flex items-baseline justify-between gap-3 text-xs"
              >
                <span className="font-secondary font-bold">
                  {t(u.callsign)}
                </span>
                <span className="min-w-0 flex-1 truncate text-[var(--ops-dim)]">
                  {t(u.area)}
                </span>
                <UnitStatusTag status={u.status} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-[var(--ops-p2)]">
            {t("Every unit is committed. New calls will hold in the queue.")}
          </p>
        )}
      </div>
    </OpsPanel>
  );
}
