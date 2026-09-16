"use client";

import { useId, useMemo, useState } from "react";
import {
  Elapsed,
  OpsButton,
  OpsPanel,
  PriorityTag,
  Readout,
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
import { SearchIcon } from "./icons";

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
        return `${u.callsign} ${u.officer} ${u.area}`.toLowerCase().includes(q);
      })
      .sort(
        (a, b) =>
          ORDER[a.status] - ORDER[b.status] ||
          a.callsign.localeCompare(b.callsign),
      );
  }, [units, query, division]);

  const free = units.filter((u) => u.status === "Available");
  const committed = units.filter(
    (u) => u.status === "Assigned" || u.status === "On Scene",
  );
  const off = units.filter((u) => u.status === "Unavailable");

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-secondary text-2xl font-bold">Units</h1>
        <p className="mt-1 text-sm text-[var(--ops-dim)]">
          Everyone on this shift and what they are on. The clock counts from
          the last status change.
        </p>
      </header>

      <dl className="flex flex-wrap divide-x divide-[var(--ops-line)] rounded-xl border border-[var(--ops-line)] bg-[var(--ops-panel)] px-4 py-1">
        <Readout
          label="On duty"
          value={units.length}
          note={`${divisions.length} divisions`}
        />
        <Readout
          label="Available"
          value={free.length}
          tone={free.length ? "var(--ops-accent)" : "var(--ops-p2)"}
          note="on the air"
        />
        <Readout label="Committed" value={committed.length} note="on a call" />
        <Readout
          label="Off the air"
          value={off.length}
          note="refuelling, training"
        />
      </dl>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-[var(--ops-line)] bg-[var(--ops-panel)] px-3 focus-within:border-[var(--ops-accent)]">
          <SearchIcon
            aria-hidden
            className="size-4 shrink-0 text-[var(--ops-dim)]"
          />
          <label htmlFor={`${id}-q`} className="sr-only">
            Filter units
          </label>
          <input
            id={`${id}-q`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Callsign, officer or area"
            className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-[var(--ops-dim)]"
          />
        </div>
        <label htmlFor={`${id}-div`} className="sr-only">
          Division
        </label>
        <select
          id={`${id}-div`}
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          className="rounded-lg border border-[var(--ops-line)] bg-[var(--ops-panel)] px-3 py-2 text-sm outline-none focus:border-[var(--ops-accent)]"
        >
          <option value="">Every division</option>
          {divisions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <p aria-live="polite" className="text-xs text-[var(--ops-dim)]">
        {visible.length} of {units.length} units
      </p>

      <OpsPanel flush>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <caption className="sr-only">
              Units on duty, with status, elapsed time in that status, and the
              call they are assigned to
            </caption>
            <thead className="text-[11px] tracking-[0.1em] text-[var(--ops-dim)] uppercase">
              <tr className="border-b border-[var(--ops-line)]">
                <th scope="col" className="py-2.5 pr-3 pl-4 font-medium">
                  Callsign
                </th>
                <th scope="col" className="py-2.5 pr-3 font-medium">
                  Officer
                </th>
                <th scope="col" className="py-2.5 pr-3 font-medium">
                  Status
                </th>
                <th scope="col" className="py-2.5 pr-3 text-right font-medium">
                  Elapsed
                </th>
                <th scope="col" className="py-2.5 pr-3 font-medium">
                  On call
                </th>
                <th scope="col" className="py-2.5 pr-3 font-medium">
                  Location
                </th>
                <th scope="col" className="py-2.5 pr-4 text-right font-medium">
                  Move to
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((unit) => (
                <Row
                  key={unit.callsign}
                  unit={unit}
                  incident={
                    incidents.find((i) => i.id === unit.incident) ?? null
                  }
                  now={now}
                />
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-[var(--ops-dim)]">
            No unit matches that filter.
          </p>
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
  const held = now
    ? (now - new Date(unit.since).getTime()) / 60_000
    : 0;
  const stale = held > STALE_MINUTES && unit.status !== "Available";

  return (
    <tr className="border-b border-[var(--ops-line)] last:border-0 hover:bg-[var(--ops-raised)]/50">
      <th scope="row" className="py-2.5 pr-3 pl-4 text-left">
        <span className="font-secondary font-bold">{unit.callsign}</span>
        <span className="block text-[11px] font-normal text-[var(--ops-dim)]">
          {unit.division}
        </span>
      </th>
      <td className="py-2.5 pr-3 text-[var(--ops-dim)]">{unit.officer}</td>
      <td className="py-2.5 pr-3">
        <UnitStatusTag status={unit.status} />
      </td>
      <td
        className="py-2.5 pr-3 text-right font-medium"
        style={stale ? { color: "var(--ops-p2)" } : undefined}
      >
        <Elapsed from={unit.since} />
        {stale ? <span className="sr-only"> — held over 45 minutes</span> : null}
      </td>
      <td className="py-2.5 pr-3">
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
      <td className="py-2.5 pr-3 text-xs text-[var(--ops-dim)]">{unit.area}</td>
      <td className="py-2.5 pr-4 text-right">
        {/*
          A unit on a call is cleared from the call, not from here — clearing
          it here would leave the incident showing a unit that has gone.
        */}
        {incident ? (
          <OpsButton
            onClick={() =>
              updateIncident(incident.id, {
                status: incident.status === "Dispatched" ? "On Scene" : "Closed",
              })
            }
            className="!px-2.5 !py-1 !text-xs"
          >
            {incident.status === "Dispatched" ? "Arrived" : "Clear call"}
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
            className="!px-2.5 !py-1 !text-xs"
          >
            {unit.status === "Available" ? "Off the air" : "Back on the air"}
          </OpsButton>
        )}
      </td>
    </tr>
  );
}
