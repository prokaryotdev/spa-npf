"use client";

import Link from "../i18n/Link";
import { useId } from "react";
import { dispatchTarget } from "../content-ops";
import OpsResponseChart from "./OpsResponseChart";
import {
  Elapsed,
  OpsPanel,
  OpsStatus,
  PriorityTag,
  Readout,
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-secondary text-2xl font-bold">
            {t("Command board")}
          </h1>
          <p className="mt-1 text-sm text-[var(--ops-dim)]">
            {t(
              "Live picture for Asokoro control. Grades run P1 immediate to P4 scheduled.",
            )}
          </p>
        </div>
      </div>

      {/*
        One band of readouts, not four cards. An officer reads this line left
        to right in a second; boxing each number would slow that down and add
        nothing, and the only number allowed to shout is the late one.
      */}
      <dl className="flex flex-wrap divide-x divide-[var(--ops-line)] rounded-xl border border-[var(--ops-line)] bg-[var(--ops-panel)] px-4 py-1">
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
      </dl>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
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
              <p className="px-4 py-12 text-center text-sm text-[var(--ops-dim)]">
                {t("Queue clear. Every call has a unit on it.")}
              </p>
            )}
          </OpsPanel>

          <OpsPanel
            title={t("Running")}
            count={
              running.length
                ? t("{n} committed", { n: running.length })
                : undefined
            }
            action={
              <Link
                href="/app/police/incidents"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ops-accent)] transition-opacity hover:opacity-80"
              >
                {t("All calls")}
                <ArrowRight aria-hidden className="size-3.5" />
              </Link>
            }
            flush
          >
            {running.length ? (
              <ul>
                {running.map((incident) => (
                  <RunningCall key={incident.id} incident={incident} />
                ))}
              </ul>
            ) : (
              <p className="px-4 py-10 text-center text-sm text-[var(--ops-dim)]">
                {t("No unit is currently committed to a call.")}
              </p>
            )}
          </OpsPanel>
        </div>

        <div className="space-y-4">
          <UnitBoard units={units} />
          <OpsPanel title={t("Response time")} flush>
            <div className="p-4">
              <OpsResponseChart />
            </div>
          </OpsPanel>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * A call with nobody on it. The row carries its own dispatch control, because
 * the alternative — open the call, find the unit, come back — is three steps
 * for the single action this screen exists to make fast.
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
      className={`npf-ops-row border-b border-[var(--ops-line)] px-4 py-3 last:border-0 ${
        late ? "npf-ops-overdue" : ""
      }`}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <PriorityTag priority={incident.priority} />
        <Link
          href="/app/police/incidents"
          className="font-secondary text-sm font-bold tabular-nums underline-offset-4 hover:underline"
        >
          {incident.id}
        </Link>
        <span className="min-w-0 flex-1 truncate text-sm">
          {t(incident.kind)}
          <span className="text-[var(--ops-dim)]"> · {t(incident.area)}</span>
        </span>
        <span
          className="text-end text-sm font-bold"
          style={{ color: late ? "var(--ops-p1)" : "var(--ops-text)" }}
        >
          <Elapsed from={incident.reported} />
          <span className="ms-2 text-[11px] font-normal text-[var(--ops-dim)]">
            {late
              ? t("over {span}", { span: duration(target * 60_000) })
              : t("of {n}m", { n: target })}
          </span>
        </span>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
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
          className="rounded-lg border border-[var(--ops-line)] bg-[var(--ops-raised)] px-2.5 py-1.5 text-xs outline-none focus:border-[var(--ops-accent)] disabled:opacity-50"
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
        <p className="min-w-0 flex-1 truncate text-xs text-[var(--ops-dim)]">
          {t(incident.summary)}
        </p>
      </div>
    </li>
  );
}

/** A call that already has a unit. Read-only here; worked on the Calls board. */
function RunningCall({ incident }: { incident: Incident }) {
  const t = useT();
  return (
    <li className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-[var(--ops-line)] px-4 py-2.5 last:border-0">
      <PriorityTag priority={incident.priority} />
      <span className="font-secondary text-sm font-bold tabular-nums">
        {incident.id}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm">
        {t(incident.kind)}
        <span className="text-[var(--ops-dim)]"> · {t(incident.area)}</span>
      </span>
      <OpsStatus status={incident.status} />
      <span className="text-xs text-[var(--ops-dim)]">
        {t(incident.unit ?? "")}
        <Elapsed
          from={incident.onScene ?? incident.dispatched ?? incident.reported}
          className="ms-2 text-[var(--ops-text)]"
        />
      </span>
    </li>
  );
}

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
      action={
        <Link
          href="/app/police/units"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ops-accent)] transition-opacity hover:opacity-80"
        >
          {t("Status board")}
          <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      }
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
                  className="py-2.5 ps-4 text-start font-normal whitespace-nowrap"
                >
                  {t(division)}
                </th>
                <td className="w-full px-3 py-2.5">
                  {/* Availability as a filled track: the bar is the number,
 not a decoration beside it. */}
                  <span
                    aria-hidden
                    className="flex h-1.5 gap-px overflow-hidden rounded-full"
                  >
                    {inDivision.map((u) => (
                      <span
                        key={u.callsign}
                        className="flex-1 first:rounded-s-full last:rounded-e-full"
                        style={{
                          background:
                            u.status === "Available"
                              ? "var(--ops-accent)"
                              : u.status === "Unavailable"
                                ? "var(--ops-raised)"
                                : "var(--ops-p2)",
                        }}
                      />
                    ))}
                  </span>
                </td>
                <td
                  className="py-2.5 pe-4 text-end text-xs font-bold whitespace-nowrap tabular-nums"
                  style={{
                    color: open.length ? "var(--ops-accent)" : "var(--ops-p2)",
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

      <div className="border-t border-[var(--ops-line)] p-4">
        <p className="mb-2.5 text-[11px] tracking-[0.12em] text-[var(--ops-dim)] uppercase">
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
