"use client";

import { useId, useMemo, useState } from "react";
import {
  Elapsed,
  OPS_SELECT,
  OpsButton,
  OpsEmpty,
  OpsHead,
  OpsPanel,
  OpsSearch,
  PriorityTag,
  Readout,
  ReadoutStrip,
  UnitStatusTag,
  useNow,
} from "./OpsPieces";
import {
  setUnitStatus,
  updateIncident,
  useStore,
  type Unit,
  type UnitStatus,
} from "./store";
import { useT } from "../i18n/client";

const ORDER: Record<UnitStatus, number> = {
  Available: 0,
  Assigned: 1,
  "On Scene": 2,
  Unavailable: 3,
};

/**
 * The unit status monitor — the second half of a dispatch console, and the
 * half this one was missing.
 *
 * Every real CAD puts this beside the call queue for one reason: the queue
 * says what needs doing and this says who can do it. The column that matters
 * most is the clock, because a unit that has been on scene for fifty minutes
 * on a P4 is the thing a supervisor is looking for.
 */
export default function OpsUnits() {
  const t = useT();
  const id = useId();
  const { units, incidents } = useStore();
  const now = useNow();
  const [query, setQuery] = useState("");
  const [division, setDivision] = useState("");

  const divisions = useMemo(
    () => [...new Set(units.map((u) => u.division))],
    [units],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return units
      .filter((u) => {
        if (division && u.division !== division) return false;
        if (!q) return true;
        return [u.callsign, u.officer, t(u.officer), u.area, t(u.area)]
          .join(" ")
          .toLowerCase()
          .includes(q);
      })
      .sort(
        (a, b) =>
          ORDER[a.status] - ORDER[b.status] ||
          a.callsign.localeCompare(b.callsign),
      );
  }, [units, query, division, t]);

  const free = units.filter((u) => u.status === "Available");
  const committed = units.filter(
    (u) => u.status === "Assigned" || u.status === "On Scene",
  );
  const off = units.filter((u) => u.status === "Unavailable");

  return (
    <div className="space-y-5">
      <OpsHead
        title={t("Units")}
        lead={t(
          "Everyone on this shift and what they are on. The clock counts from the last status change.",
        )}
      />

      <ReadoutStrip>
        <Readout
          label={t("On duty")}
          value={units.length}
          note={t("{n} divisions", { n: divisions.length })}
        />
        <Readout
          label={t("Available")}
          value={free.length}
          tone={free.length ? "var(--ops-ok)" : "var(--ops-p2)"}
          note={t("on the air")}
        />
        <Readout
          label={t("Committed")}
          value={committed.length}
          note={t("on a call")}
        />
        <Readout
          label={t("Off the air")}
          value={off.length}
          note={t("refuelling, training")}
        />
      </ReadoutStrip>

      <div className="flex flex-wrap items-center gap-2">
        <OpsSearch
          id={`${id}-q`}
          label={t("Filter units")}
          placeholder={t("Callsign, officer or area")}
          value={query}
          onChange={setQuery}
        />
        <label htmlFor={`${id}-div`} className="sr-only">
          {t("Division")}
        </label>
        <select
          id={`${id}-div`}
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          className={OPS_SELECT}
        >
          <option value="">{t("Every division")}</option>
          {divisions.map((d) => (
            <option key={d} value={d}>
              {t(d)}
            </option>
          ))}
        </select>

        <p
          aria-live="polite"
          className="ms-auto text-xs text-[var(--ops-dim)] tabular-nums"
        >
          {t("{shown} of {total} units", {
            shown: visible.length,
            total: units.length,
          })}
        </p>
      </div>

      <OpsPanel flush>
        {/*
          No sideways scroller. Below `lg` the officer, the call and the
          location fold into the callsign's own cell, so a phone still shows
          every unit with its status, its clock and the control that changes
          it, rather than a 760px table swiped one column at a time.
        */}
        <table className="w-full text-start text-sm">
          <caption className="sr-only">
            {t(
              "Units on duty, with status, elapsed time in that status, and the call they are assigned to",
            )}
          </caption>
          <thead className="npf-ops-thead text-[11px] font-medium tracking-[0.08em] text-[var(--ops-dim)] uppercase">
            <tr>
              <th scope="col" className="py-2.5 pe-3 ps-4 font-medium">
                {t("Callsign")}
              </th>
              <th
                scope="col"
                className="hidden py-2.5 pe-3 font-medium lg:table-cell"
              >
                {t("Officer")}
              </th>
              <th
                scope="col"
                className="hidden py-2.5 pe-3 font-medium sm:table-cell"
              >
                {t("Status")}
              </th>
              <th scope="col" className="py-2.5 pe-3 text-end font-medium">
                {t("Elapsed")}
              </th>
              <th
                scope="col"
                className="hidden py-2.5 pe-3 font-medium lg:table-cell"
              >
                {t("On call")}
              </th>
              <th
                scope="col"
                className="hidden py-2.5 pe-3 font-medium lg:table-cell"
              >
                {t("Location")}
              </th>
              <th scope="col" className="py-2.5 pe-4 text-end font-medium">
                {t("Move to")}
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((unit) => (
              <Row
                key={unit.callsign}
                unit={unit}
                incident={incidents.find((i) => i.id === unit.incident) ?? null}
                now={now}
              />
            ))}
          </tbody>
        </table>

        {visible.length === 0 ? (
          <OpsEmpty
            tone="none"
            title={t("No unit matches that filter")}
            hint={t(
              "Clear the search box or pick every division to see the whole shift again.",
            )}
          />
        ) : null}
      </OpsPanel>
    </div>
  );
}

/** A unit sitting in one status for longer than this wants a welfare check. */
const STALE_MINUTES = 45;

function Row({
  unit,
  incident,
  now,
}: {
  unit: Unit;
  incident: ReturnType<typeof useStore>["incidents"][number] | null;
  now: number;
}) {
  const t = useT();
  const held = now ? (now - new Date(unit.since).getTime()) / 60_000 : 0;
  const stale = held > STALE_MINUTES && unit.status !== "Available";

  return (
    <tr className="border-b border-[var(--ops-line-soft)] transition-colors last:border-0 hover:bg-[var(--ops-raised)]/50">
      <th scope="row" className="py-2.5 pe-3 ps-4 align-top">
        {/*
          The folded lines live inside a capped block, not loose in the cell.
          A table cell ignores max-width under auto layout, so the `truncate`
          on a long standby location made the column as wide as "Bill Clinton
          Drive — standby" and pushed the status control clean off the panel
          edge — where `overflow-clip` cropped it with no scrollbar to find it
          by. Capped here, the same text ellipsises instead.
        */}
        <div className="max-w-[34vw] sm:max-w-[16rem] lg:max-w-none">
          <span className="font-secondary font-bold">{t(unit.callsign)}</span>
          <span className="block truncate text-[11px] font-normal text-[var(--ops-dim)]">
            {t(unit.division)}
            <span className="lg:hidden"> · {t(unit.officer)}</span>
          </span>
          <span className="mt-1 flex items-center gap-x-2 text-[11px] font-normal text-[var(--ops-dim)] lg:hidden">
            <span className="sm:hidden">
              <UnitStatusTag status={unit.status} />
            </span>
            {incident ? (
              <>
                <PriorityTag priority={incident.priority} />
                <span className="shrink-0 font-secondary font-bold tabular-nums">
                  {incident.id}
                </span>
              </>
            ) : null}
            <span className="truncate">{t(unit.area)}</span>
          </span>
        </div>
      </th>
      <td className="hidden py-2.5 pe-3 align-top whitespace-nowrap text-[var(--ops-dim)] lg:table-cell">
        {t(unit.officer)}
      </td>
      {/* Callsign, clock and control are what a phone has room for; the
          status pill folds up into the callsign block below 640px. */}
      <td className="hidden py-2.5 pe-3 align-top sm:table-cell">
        <UnitStatusTag status={unit.status} />
      </td>
      <td
        className="py-2.5 pe-3 text-end align-top font-medium whitespace-nowrap"
        style={stale ? { color: "var(--ops-p2)" } : undefined}
      >
        <Elapsed from={unit.since} />
        {stale ? (
          <span className="sr-only"> {t("— held over 45 minutes")}</span>
        ) : null}
      </td>
      <td className="hidden py-2.5 pe-3 align-top lg:table-cell">
        {incident ? (
          <span className="flex items-center gap-2 whitespace-nowrap">
            <PriorityTag priority={incident.priority} />
            <span className="font-secondary text-xs font-bold tabular-nums">
              {incident.id}
            </span>
          </span>
        ) : (
          <span className="text-xs text-[var(--ops-dim)]">—</span>
        )}
      </td>
      <td className="hidden w-full py-2.5 pe-3 align-top text-xs text-[var(--ops-dim)] lg:table-cell">
        {t(unit.area)}
      </td>
      <td className="py-2.5 pe-4 text-end align-top">
        {/*
          A unit on a call is cleared from the call, not from here — clearing
          it here would leave the incident showing a unit that has gone.
        */}
        {incident ? (
          <OpsButton
            onClick={() =>
              updateIncident(incident.id, {
                status:
                  incident.status === "Dispatched" ? "On Scene" : "Closed",
              })
            }
            className="min-w-24 max-w-30 justify-center !px-2.5 !py-1 text-center !text-xs sm:min-w-0 sm:max-w-none sm:whitespace-nowrap"
          >
            {incident.status === "Dispatched" ? t("Arrived") : t("Clear call")}
          </OpsButton>
        ) : (
          <OpsButton
            tone={unit.status === "Available" ? "quiet" : "brand"}
            onClick={() =>
              setUnitStatus(
                unit.callsign,
                unit.status === "Available" ? "Unavailable" : "Available",
              )
            }
            className="min-w-24 max-w-30 justify-center !px-2.5 !py-1 text-center !text-xs sm:min-w-0 sm:max-w-none sm:whitespace-nowrap"
          >
            {unit.status === "Available"
              ? t("Off the air")
              : t("Back on the air")}
          </OpsButton>
        )}
      </td>
    </tr>
  );
}
