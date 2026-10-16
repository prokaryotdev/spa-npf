"use client";

import { reliefNow } from "../content-ops";

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
  handOver,
  raiseEmergency,
  reportPosition,
  type Relief,
  setUnitStatus,
  updateIncident,
  type Incident,
  type Unit,
  type UnitStatus,
} from "./store";
import { useFormat, useT } from "../i18n/client";
import { CloseIcon } from "./icons";

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

      <Roster units={units} now={now} />

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
        <OpsPanel flush>
          <OpsEmpty
            tone="none"
            title={t("No unit matches that filter")}
            hint={t(
              "Clear the search box or pick every section to see the whole shift again.",
            )}
            action={
              <OpsButton
                onClick={() => {
                  setQuery("");
                  setSection("");
                }}
              >
                <CloseIcon aria-hidden className="size-3.5" />
                {t("Clear filters")}
              </OpsButton>
            }
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
                  /* An empty lane is a slot waiting for a card: ruled in
                     dashes like the queue's "No unit free", so a lane with
                     nobody in it still reads as a place on the board. */
                  <p className="m-3 flex h-11 items-center gap-2 rounded-(--ops-control-radius) border border-dashed border-npf-line px-3 text-[0.8125rem] text-ops-dim">
                    <span
                      aria-hidden
                      className="size-1.5 shrink-0 rounded-full bg-npf-steel/50"
                    />
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

      {/* The radio's emergency button, pressed from here in this build. A
          raised one turns the row red and stays until a supervisor stands it
          down from the banner. The radio's own controls fold away: they stood
          as two links (one red) on every row and read as alarms. */}
      {unit.emergency ? (
        <p className="col-span-2 mt-1 flex items-center gap-2 rounded-md bg-ops-p1 px-2.5 py-1.5 text-xs font-semibold text-white">
          <span aria-hidden className="size-2 animate-pulse rounded-full bg-white" />
          {t("Emergency raised · {ref}", { ref: unit.emergency })}
        </p>
      ) : (
        <details className="group/radio col-span-2 text-2xs">
          <summary className="flex w-fit cursor-pointer list-none items-center gap-1 rounded font-medium text-ops-dim transition-colors hover:text-ops-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-npf-blue-mid [&::-webkit-details-marker]:hidden">
            {t("Radio")}
          </summary>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
            <SharePosition unit={unit} />
            {!off ? (
              <button
                type="button"
                onClick={() => raiseEmergency(unit.callsign)}
                title={t("What the officer's radio sends when its emergency button is pressed")}
                className="font-medium text-ops-p1 underline-offset-2 hover:underline"
              >
                {t("Press emergency button")}
              </button>
            ) : null}
          </div>
        </details>
      )}
    </li>
  );
}

const RELIEFS: Relief[] = ["A", "B", "C"];
const RELIEF_START: Record<Relief, string> = { A: "06:00", B: "14:00", C: "22:00" };

/**
 * The duty roster at the head of the board: who crews each unit on each of
 * the three reliefs, which relief is on, and the handover at shift change.
 * A unit still on a call keeps its crew until the call clears ("held over"),
 * as UK and Nigerian control rooms both run it.
 *
 * Folded by default: the lanes below are the live board, the roster is what
 * the supervisor opens at 06:00, 14:00 and 22:00.
 */
function Roster({ units, now }: { units: Unit[]; now: number }) {
  const t = useT();
  const on = now ? reliefNow(now) : null;
  const behind = units.filter((u) => on && u.relief && u.relief !== on && !u.heldOver);
  const held = units.filter((u) => u.heldOver);
  if (!units.some((u) => u.crew)) return null;
  return (
    <details className="npf-ops-tile group">
      <summary className="flex min-h-13 cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 px-5 py-2">
        <span className="font-secondary text-[0.9375rem] font-bold text-npf-ink">{t("Duty roster")}</span>
        {on ? (
          <span className="rounded-[5px] bg-npf-cloud px-1.5 py-0.5 text-xs font-semibold text-npf-blue-ink">
            {t("Relief {r} on duty since {time} WAT", { r: on, time: RELIEF_START[on] })}
          </span>
        ) : null}
        {behind.length ? (
          <span className="npf-pill bg-ops-p2-wash text-ops-p2">
            <span aria-hidden className="npf-pill-dot" />
            {t("{n} units still on the last relief", { n: behind.length })}
          </span>
        ) : null}
        {held.length ? (
          <span className="text-xs text-ops-dim">{t("{n} held over on calls", { n: held.length })}</span>
        ) : null}
      </summary>
      <div className="border-t border-ops-line-soft">
        {on && behind.length ? (
          <div className="flex flex-wrap items-center gap-3 px-5 py-3">
            <OpsButton
              tone="brand"
              onClick={() => withTransition(() => handOver(units.map((u) => u.callsign), on))}
            >
              {t("Hand over to relief {r}", { r: on })}
            </OpsButton>
            <p className="text-xs text-ops-dim">
              {t("Free units change crew now; units on a call change when they clear it.")}
            </p>
          </div>
        ) : null}
        <table className="w-full text-start text-sm">
          <caption className="sr-only">{t("Duty roster: the officer on each unit for each relief")}</caption>
          <thead className="npf-ops-thead text-xs text-ops-dim">
            <tr>
              <th scope="col" className="py-2.5 ps-5 pe-4 font-medium">{t("Unit")}</th>
              {RELIEFS.map((r) => (
                <th key={r} scope="col" className={`py-2.5 pe-4 font-medium ${r === on ? "text-npf-blue-ink" : ""}`}>
                  {t("Relief {r}", { r })} <span className="font-mono font-normal">{RELIEF_START[r]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.callsign} className="border-b border-ops-line-soft last:border-0">
                <th scope="row" className="py-2 ps-5 pe-4 text-start font-medium">
                  {t(u.callsign)}
                  {u.heldOver ? (
                    <span className="ms-2 text-2xs font-normal text-ops-p2">{t("Held over")}</span>
                  ) : null}
                </th>
                {RELIEFS.map((r) => (
                  <td
                    key={r}
                    className={`py-2 pe-4 text-xs ${u.relief === r ? "font-semibold text-npf-ink" : "text-ops-dim"}`}
                  >
                    {u.crew ? t(u.crew[r]) : "–"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/**
 * The unit's position from the officer's own phone, for the map and the
 * nearest-unit ranking, until the radios' location feed is connected.
 * Shown only where the browser can give a position.
 */
function SharePosition({ unit }: { unit: Unit }) {
  const t = useT();
  const format = useFormat();
  const [state, setState] = useState<"idle" | "busy" | "failed">("idle");
  return (
    <p className="flex flex-wrap items-center gap-x-3 text-ops-dim">
      {unit.fixAt ? <span>{t("Position sent {time}", { time: format.time(unit.fixAt) })}</span> : null}
      <button
        type="button"
        disabled={state === "busy"}
        onClick={() => {
          if (!("geolocation" in navigator)) return setState("failed");
          setState("busy");
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              reportPosition(unit.callsign, {
                lat: Math.round(pos.coords.latitude * 1e5) / 1e5,
                lng: Math.round(pos.coords.longitude * 1e5) / 1e5,
              });
              setState("idle");
            },
            () => setState("failed"),
            { timeout: 10_000, enableHighAccuracy: true },
          );
        }}
        className="font-medium text-ops-accent underline-offset-2 hover:underline disabled:opacity-50"
      >
        {state === "busy" ? t("Finding position…") : t("Send position from this device")}
      </button>
      {state === "failed" ? <span className="text-ops-p2">{t("No position from this device.")}</span> : null}
    </p>
  );
}
