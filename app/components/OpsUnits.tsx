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
        <div className="grid items-start gap-x-4 gap-y-6 md:grid-cols-2 2xl:grid-cols-4">
          {LANES.map((lane) => {
            const inLane = visible.filter((u) => u.status === lane.status);
            return (
              <section key={lane.status} aria-label={t(lane.label)}>
                <h2 className="mb-2.5 flex items-center gap-2 px-1 font-secondary text-base font-bold text-npf-ink">
                  <span
                    aria-hidden
                    className="size-2.5 rounded-full"
                    style={{ background: lane.ink }}
                  />
                  {t(lane.label)}
                  <span className="ms-auto font-primary text-sm font-semibold text-npf-steel tabular-nums">
                    {inLane.length}
                  </span>
                </h2>
                {inLane.length ? (
                  <ul className="grid gap-2">
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
                  <p className="rounded-xl px-4 py-5 text-center text-xs text-npf-steel ring-1 ring-npf-hairline ring-inset">
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

  return (
    <li
      className={`npf-ops-call flex flex-col gap-3 rounded-xl p-4 ${
        off ? "ring-1 ring-npf-hairline ring-inset" : "bg-white ring-1 ring-npf-line ring-inset"
      }`}
      style={{ viewTransitionName: `unit-${unit.callsign.replace(/\W/g, "")}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-secondary text-base leading-tight font-bold text-npf-ink">
            {t(unit.callsign)}
          </p>
          <p className="mt-0.5 truncate text-xs text-ops-dim">
            {t(unit.officer)}
            {" · "}
            {t(unit.section)}
            {showState ? ` · ${unit.state}` : ""}
          </p>
        </div>
        <span
          className="shrink-0 font-secondary text-sm font-bold"
          style={{ color: stale ? "var(--ops-p2)" : "var(--ops-text)" }}
        >
          <Elapsed from={unit.since} />
          {stale ? (
            <span className="sr-only"> {t("(held over 45 minutes)")}</span>
          ) : null}
        </span>
      </div>

      {incident ? (
        <p className="flex min-w-0 items-center gap-2 text-xs">
          <PriorityTag priority={incident.priority} />
          <span className="shrink-0 font-secondary font-bold tabular-nums">
            {incident.id}
          </span>
          <span className="truncate text-ops-dim">{t(incident.kind)}</span>
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 truncate text-xs text-ops-dim">
          {t(unit.area)}
        </span>
        {/*
          A unit on a call is cleared from the call, not from here: clearing
          it here would leave the incident showing a unit that has gone.
        */}
        {incident?.status === "Dispatched" ? (
          <OpsButton
            tone="brand"
            onClick={() =>
              withTransition(() =>
                updateIncident(incident.id, { status: "On Scene" }),
              )
            }
            className="h-9 shrink-0 !px-3.5 !text-xs"
          >
            {t("Arrived")}
          </OpsButton>
        ) : incident ? (
          // Clearing asks how the call ended, and that question lives on the
          // call, so this opens it rather than closing it blind.
          <Link
            href={`/app/police/incidents?call=${incident.id}`}
            className="inline-flex h-9 shrink-0 items-center rounded-full bg-ops-brand px-3.5 text-xs font-medium text-white transition-colors hover:bg-ops-brand-lift"
          >
            {t("Clear call")}
          </Link>
        ) : (
          <OpsButton
            tone={off ? "brand" : "ghost"}
            onClick={() =>
              withTransition(() =>
                setUnitStatus(unit.callsign, off ? "Available" : "Unavailable"),
              )
            }
            className="h-9 shrink-0 !px-3.5 !text-xs"
          >
            {off ? t("Back on the air") : t("Off the air")}
          </OpsButton>
        )}
      </div>
    </li>
  );
}
