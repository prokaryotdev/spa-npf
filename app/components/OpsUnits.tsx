"use client";

import Link from "../i18n/Link";
import { filterBy } from "../search-text";
import { useId, useMemo, useState } from "react";
import {
  Elapsed,
  OPS_SELECT,
  OpsButton,
  OpsEmpty,
  OpsFigures,
  OpsHead,
  OpsPanel,
  OpsSearch,
  PriorityTag,
  useNow,
  useScoped,
  withTransition,
} from "./OpsPieces";
import {
  setUnitStatus,
  updateIncident,
  type Incident,
  type Unit,
  type UnitStatus,
} from "./store";
import { useT } from "../i18n/client";

/**
 * The four lanes of the duty board, in the order a dispatcher reads them:
 * who can go, who is going, who is there, who is off. Each carries the ink
 * its status pill wears everywhere else in the console.
 */
const LANES: { status: UnitStatus; label: string; ink: string }[] = [
  { status: "Available", label: "Available", ink: "var(--ops-fill-ok)" },
  { status: "Assigned", label: "En route", ink: "var(--ops-route)" },
  { status: "On Scene", label: "On scene", ink: "var(--ops-scene)" },
  {
    status: "Unavailable",
    label: "Off the air",
    ink: "color-mix(in srgb, var(--ops-dim) 60%, transparent)",
  },
];

/**
 * The unit status board, laid out like the magnetic duty board on a
 * control-room wall: a lane per status, a card per unit, and a unit that
 * changes status travels to its new lane. The question a dispatcher brings
 * here is "who can I send", and the first lane answers it before anything
 * is read.
 *
 * The clock on each card matters most after that: a unit fifty minutes on
 * scene at a P4 is what a supervisor is looking for, so it turns amber.
 */
export default function OpsUnits() {
  const t = useT();
  const id = useId();
  const { units, incidents, viewing } = useScoped();
  const now = useNow();
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("");

  const sections = useMemo(
    () => [...new Set(units.map((u) => u.section))],
    [units],
  );

  const visible = useMemo(() => {
    return filterBy(
      units.filter((u) => !section || u.section === section),
      query,
      (u) =>
        [
          u.callsign,
          u.officer,
          t(u.officer),
          u.area,
          t(u.area),
          u.section,
          t(u.section),
          u.state,
          u.status,
          t(u.status),
          u.incident ?? "",
        ].join(" "),
    ).sort((a, b) => a.callsign.localeCompare(b.callsign));
  }, [units, query, section, t]);

  const count = (s: UnitStatus) => units.filter((u) => u.status === s).length;

  return (
    <div className="space-y-6">
      <OpsHead
        title={t("Units")}
        action={
          <OpsFigures
            figures={[
              {
                label: t("Available"),
                value: count("Available"),
                of: units.length,
                tone: "var(--ops-ok)",
              },
              { label: t("En route"), value: count("Assigned") },
              { label: t("On scene"), value: count("On Scene") },
              {
                label: t("Off the air"),
                value: count("Unavailable"),
                tone: "var(--ops-dim)",
              },
            ]}
          />
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <OpsSearch
          id={`${id}-q`}
          label={t("Filter units")}
          placeholder={t("Callsign, officer or area")}
          value={query}
          onChange={setQuery}
          found={visible.length}
        />
        <label htmlFor={`${id}-div`} className="sr-only">
          {t("Section")}
        </label>
        <select
          id={`${id}-div`}
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className={OPS_SELECT}
        >
          <option value="">{t("Every section")}</option>
          {sections.map((d) => (
            <option key={d} value={d}>
              {t(d)}
            </option>
          ))}
        </select>

        <p
          aria-live="polite"
          className="ms-auto text-xs text-ops-dim tabular-nums"
        >
          {t("{shown} of {total} units", {
            shown: visible.length,
            total: units.length,
          })}
        </p>
      </div>

      {visible.length === 0 ? (
        <OpsPanel>
          <OpsEmpty
            tone="none"
            title={t("No unit matches that filter")}
            hint={t(
              "Clear the search box or pick every section to see the whole shift again.",
            )}
          />
        </OpsPanel>
      ) : (
        /* All four lanes side by side on a wide desk, like the wall board.
           Narrower, four lanes cut callsigns short, so Available takes the
           left column and the three committed lanes stack beside it: no
           hole beside En route, nothing pushed below the fold. The empty last
           row soaks up the long lane's height, so the stack stays tight. */
        <div className="grid items-start gap-4 md:grid-cols-2 md:grid-rows-[auto_auto_auto_1fr] 2xl:grid-cols-4 2xl:grid-rows-none">
          {LANES.map((lane) => {
            /* A free lane reads by callsign, so a unit is where it is looked
               for; a committed lane leads with the longest hold, the unit a
               supervisor checks on first. */
            const inLane = visible.filter((u) => u.status === lane.status);
            if (lane.status !== "Available")
              inLane.sort((a, b) => a.since.localeCompare(b.since));
            return (
              <section
                key={lane.status}
                aria-label={t(lane.label)}
                className={`npf-ops-tile overflow-clip ${
                  lane.status === "Available" ? "md:row-span-4 2xl:row-span-1" : ""
                }`}
              >
                <h2 className="flex min-h-12 items-center gap-2.5 border-b border-ops-line-soft px-4 font-secondary text-base leading-tight font-bold text-npf-ink">
                  <span
                    aria-hidden
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: lane.ink }}
                  />
                  {t(lane.label)}
                  <span className="ms-auto rounded-[5px] bg-npf-cloud px-1.5 py-0.5 font-primary text-xs font-semibold text-npf-blue-ink tabular-nums ring-1 ring-ops-line-soft ring-inset">
                    {inLane.length}
                  </span>
                </h2>
                {inLane.length ? (
                  <ul className="divide-y divide-ops-line-soft">
                    {inLane.map((unit) => (
                      <UnitCard
                        key={unit.callsign}
                        unit={unit}
                        incident={
                          incidents.find((i) => i.id === unit.incident) ?? null
                        }
                        now={now}
                        showState={!viewing}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-6 text-center text-xs text-npf-steel">
                    {t("None")}
                  </p>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** A unit sitting in one status for longer than this wants a welfare check. */
const STALE_MINUTES = 45;

/**
 * One unit on the board: callsign and clock on top, who and where under
 * them, the call it is on, and the one control that moves it on.
 */
function UnitCard({
  unit,
  incident,
  now,
  showState,
}: {
  unit: Unit;
  incident: Incident | null;
  now: number;
  showState: boolean;
}) {
  const t = useT();
  const held = now ? (now - new Date(unit.since).getTime()) / 60_000 : 0;
  const stale = held > STALE_MINUTES && unit.status !== "Available";
  const off = unit.status === "Unavailable";

  // No section: the callsign already names it ("Highway 02"), and the
  // section filter and search still find it.
  const where = [
    t(unit.area),
    t(unit.officer),
    ...(showState ? [unit.state] : []),
  ].join(" · ");

  return (
    /* A row in its lane rather than a card of its own: callsign and clock,
       then where it is and who has it. A free unit stops there, with its one
       control on the second line; a committed unit adds its call. */
    <li
      className="npf-ops-call grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 bg-white px-4 py-3"
      style={{ viewTransitionName: `unit-${unit.callsign.replace(/\W/g, "")}` }}
    >
      <p className="truncate font-secondary text-base leading-tight font-bold text-npf-ink">
        {t(unit.callsign)}
      </p>
      {/* A free unit's clock is how long it has stood by, which nobody
          acts on, so it steps back; a committed unit's clock is the one a
          supervisor reads. */}
      <span
        className={`justify-self-end font-secondary text-sm ${
          unit.status === "Available" ? "font-medium" : "font-bold"
        }`}
        style={{
          color: stale
            ? "var(--ops-p2)"
            : unit.status === "Available"
              ? "var(--ops-dim)"
              : "var(--ops-text)",
        }}
      >
        <Elapsed from={unit.since} />
        {stale ? (
          <span className="sr-only"> {t("(held over 45 minutes)")}</span>
        ) : null}
      </span>

      <p
        title={where}
        className={`truncate text-xs text-ops-dim ${incident ? "col-span-2" : ""}`}
      >
        {where}
      </p>

      {incident ? (
        <>
          <p className="mt-1.5 flex min-w-0 items-center gap-2 text-xs">
            <PriorityTag priority={incident.priority} />
            <span className="shrink-0 font-mono font-semibold tabular-nums">
              {incident.id}
            </span>
            <span className="truncate text-ops-dim">{t(incident.kind)}</span>
          </p>
          {/*
            A unit on a call is cleared from the call, not from here: clearing
            it here would leave the incident showing a unit that has gone.
          */}
          {incident.status === "Dispatched" ? (
            <OpsButton
              tone="brand"
              onClick={() =>
                withTransition(() =>
                  updateIncident(incident.id, { status: "On Scene" }),
                )
              }
              className="mt-1.5 h-8 !px-3.5 !text-xs"
            >
              {t("Arrived")}
            </OpsButton>
          ) : (
            // Clearing asks how the call ended, and that question lives on the
            // call, so this opens it rather than closing it blind.
            <Link
              href={`/app/police/incidents?call=${incident.id}`}
              className="mt-1.5 inline-flex h-8 items-center rounded-(--ops-control-radius) bg-ops-brand px-3 text-xs font-medium whitespace-nowrap text-white transition-colors hover:bg-ops-brand-lift"
            >
              {t("Clear call")}
            </Link>
          )}
        </>
      ) : (
        /* Taking a unit off the air, or putting it back, is routine: a ghost,
           so the filled buttons on the board are the calls waiting on a
           decision. */
        <OpsButton
          tone="ghost"
          onClick={() =>
            withTransition(() =>
              setUnitStatus(unit.callsign, off ? "Available" : "Unavailable"),
            )
          }
          className="h-8 !px-3 !text-xs"
        >
          {off ? t("Back on the air") : t("Off the air")}
        </OpsButton>
      )}
    </li>
  );
}
