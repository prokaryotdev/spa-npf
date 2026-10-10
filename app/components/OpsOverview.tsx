"use client";

import Link from "../i18n/Link";
import { useId, useState } from "react";
import { flushSync } from "react-dom";
import { dispatchTarget } from "../content-ops";
import OpsMap from "./OpsMap";
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
} from "./OpsPieces";
import { updateIncident, useStore, type Incident, type Unit } from "./store";
import { useRouter } from "../i18n/Link";
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
  const router = useRouter();
  /* The call the officer is pointing at, on the list or on the map. */
  const [focus, setFocus] = useState<string | null>(null);

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
    <div className="space-y-8">
      {/*
        The title and the three numbers a supervisor needs on walking in:
        what is waiting, what is late, and who is free. Set as a line beside
        the title rather than a row of tiles, so the map stays the stage.
      */}
      <OpsHead
        title={t("Command board")}
        action={
          <dl className="flex items-baseline gap-6 sm:gap-8">
            <Count label={t("Waiting")} value={pending.length} />
            <Count
              label={t("Late")}
              value={overdue.length}
              alert={overdue.length > 0}
            />
            <Count
              label={t("Units free")}
              value={`${free.length}/${units.length}`}
            />
          </dl>
        }
      />

      {/*
        The live picture. On a desk the map fills the stage and the call
        lists float over its left edge in one frosted sheet, with the unit
        roll-up over its right edge on a wide screen; the officer reads the
        city and the queue in one look. Below 1024px the same blocks stack
        under a shorter map, in the order a phone needs them.
      */}
      {/* The map stage and the unit sheet share one frame, so on a wide
          screen the sheet can float over the stage and below that it
          follows it in the flow instead of hiding under the map. */}
      <div className="relative">
      <section
        aria-label={t("Live picture")}
        className="relative lg:h-[max(560px,calc(100dvh-var(--ops-top)-10.5rem))]"
      >
        <div className="npf-ops-tile isolate h-[min(58vh,460px)] overflow-clip lg:absolute lg:inset-0 lg:h-auto">
          <OpsMap
            incidents={incidents}
            units={units}
            focus={focus}
            sheets
            onPick={(id) =>
              router.push(`/app/police/incidents?call=${encodeURIComponent(id)}`)
            }
          />
        </div>

        <div className="npf-ops-float @container mt-8 space-y-8 lg:absolute lg:start-4 lg:top-4 lg:bottom-4 lg:z-[500] lg:mt-0 lg:w-[23rem] lg:space-y-5 lg:overflow-y-auto lg:overscroll-contain lg:p-2 lg:pt-4">
          <OpsPanel
            title={t("Pending")}
            count={
              pending.length
                ? t("{n} waiting", { n: pending.length })
                : undefined
            }
            className="lg:[&>div:first-child]:px-3"
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
                    onFocus={setFocus}
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
            className="lg:[&>div:first-child]:px-3"
            flush
          >
            {running.length ? (
              <ul>
                {running.map((incident) => (
                  <RunningCall
                    key={incident.id}
                    incident={incident}
                    onFocus={setFocus}
                  />
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

      </section>

        <div className="npf-ops-float-xl mt-8 xl:absolute xl:end-4 xl:top-4 xl:z-[500] xl:mt-0 xl:max-h-[calc(100%-2rem)] xl:w-72 xl:overflow-y-auto xl:overscroll-contain xl:p-2 xl:pt-4 xl:[&>section>div:first-child]:px-3">
          <UnitBoard units={units} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

/** One of the board's three headline numbers. Red only when it means act. */
function Count({
  label,
  value,
  alert = false,
}: {
  label: string;
  value: React.ReactNode;
  alert?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse">
      <dt className="text-xs text-ops-dim">{label}</dt>
      <dd
        key={String(value)}
        className="npf-ops-count font-secondary text-[1.625rem] leading-none font-bold tracking-[-0.02em] tabular-nums"
        style={alert ? { color: "var(--ops-p1)" } : undefined}
      >
        {value}
      </dd>
    </div>
  );
}

/** The link out of a panel to the board that owns the same data in full. */
function More({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 rounded-chip text-xs font-medium text-ops-accent transition-opacity hover:opacity-80"
    >
      {children}
      <ArrowRight
        aria-hidden
        className="size-3.5 transition-transform duration-200 ease-(--ease-out) group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
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
  onFocus,
}: {
  incident: Incident;
  units: Unit[];
  late: boolean;
  onFocus: (id: string | null) => void;
}) {
  const t = useT();
  const id = useId();
  const free = units.filter((u) => u.status === "Available");
  const target = dispatchTarget[incident.priority];

  return (
    <li
      /* Stacked on a phone, side by side from 640px. Squeezing a 190px
         dispatch control alongside the call on a 390px screen left the
         summary about twenty characters wide — three ragged lines of what the
         caller actually said. */
      className={`npf-ops-row npf-ops-call flex flex-col gap-3 border-b border-ops-line-soft px-5 py-4 transition-colors last:border-0 hover:bg-white/[0.04] @md:flex-row @md:gap-4 ${
        late ? "npf-ops-overdue" : ""
      }`}
      style={{ viewTransitionName: `call-${incident.id}` }}
      onMouseEnter={() => onFocus(incident.id)}
      onMouseLeave={() => onFocus(null)}
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
            {t(incident.area)}
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
          className="npf-ops-select h-8 max-w-50 rounded-chip px-3 text-[0.8125rem] font-medium outline-none"
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
function RunningCall({
  incident,
  onFocus,
}: {
  incident: Incident;
  onFocus: (id: string | null) => void;
}) {
  const t = useT();
  return (
    <li
      className="npf-ops-call flex flex-wrap items-baseline gap-x-2.5 gap-y-1 border-b border-ops-line-soft px-5 py-3 transition-colors last:border-0 hover:bg-white/[0.04]"
      /* The same name as its pending row, which is what lets a dispatch
         carry the row across the board. */
      style={{ viewTransitionName: `call-${incident.id}` }}
      onMouseEnter={() => onFocus(incident.id)}
      onMouseLeave={() => onFocus(null)}
    >
      <PriorityTag priority={incident.priority} />
      <span className="font-secondary text-sm font-bold tabular-nums">
        {incident.id}
      </span>
      {/* On a phone the call keeps its words and the status drops to a
          second line, rather than "Theft…" squeezed beside it. */}
      <span className="min-w-0 flex-1 text-sm @max-md:min-w-[60%] @md:truncate">
        {t(incident.kind)}
        <span className="text-ops-dim"> · {t(incident.area)}</span>
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
