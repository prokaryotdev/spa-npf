"use client";

import { useMemo, useState } from "react";
import Link from "../i18n/Link";
import { useT } from "../i18n/client";
import { pinOf, placeOf } from "../geo";
import OpsMap, { type MapLayers } from "./OpsMap";
import {
  Elapsed,
  OpsButton,
  OpsFigures,
  OpsHead,
  OpsPanel,
  OpsStatus,
  PriorityTag,
  UnitStatusTag,
  isOverdue,
  kmLabel,
  nearestFree,
  useNow,
  useScoped,
  withTransition,
} from "./OpsPieces";
import { updateIncident, type Incident, type Unit } from "./store";
import { commandLabel } from "./Where";
import { CloseIcon } from "./icons";

/**
 * The map board: where every open call is, where every unit is, and which
 * free unit is closest to the call the desk is looking at, with the button to
 * send it right there. US and UK control rooms dispatch from a map like this
 * (AVL: automatic vehicle location); here it reads the units' last positions.
 */
export default function OpsMapBoard() {
  const t = useT();
  const { incidents, units, viewing, zone } = useScoped();
  const now = useNow();
  const [focus, setFocus] = useState<string | null>(null);
  const [layers, setLayers] = useState<MapLayers>({
    calls: true,
    units: true,
    history: false,
  });

  const open = useMemo(
    () =>
      incidents
        .filter((i) => i.status !== "Closed")
        .sort(
          (a, b) =>
            Number(b.status === "New") - Number(a.status === "New") ||
            a.priority.localeCompare(b.priority) ||
            a.reported.localeCompare(b.reported),
        ),
    [incidents],
  );
  const rough = open.filter((i) => !pinOf(i.where).exact).length;
  const free = units.filter((u) => u.status === "Available").length;
  const call = incidents.find((i) => i.id === focus) ?? null;
  const unit = call ? null : (units.find((u) => u.callsign === focus) ?? null);

  return (
    <div className="space-y-6">
      <OpsHead
        title={t("Map")}
        lead={viewing ? commandLabel(t, viewing) : zone ? t(zone.name) : t("All commands")}
        action={
          <OpsFigures
            figures={[
              { label: t("Open calls"), value: open.length },
              {
                label: t("Waiting"),
                value: open.filter((i) => i.status === "New").length,
                tone: open.some((i) => isOverdue(i, now)) ? "var(--ops-p1)" : undefined,
              },
              { label: t("Units free"), value: free, of: units.length, tone: "var(--ops-ok)" },
              { label: t("No exact pin"), value: rough, tone: "var(--ops-dim)" },
            ]}
          />
        }
      />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="npf-ops-tile relative h-[min(72vh,46rem)] min-h-96 overflow-clip">
          <OpsMap
            incidents={incidents}
            units={units}
            focus={focus}
            onPick={(id) => withTransition(() => setFocus(id))}
            layers={layers}
          />
          {/* What the map shows, switched on the map itself. */}
          <fieldset className="absolute start-3 top-3 z-[500] flex flex-wrap gap-1 rounded-(--ops-control-radius) bg-white/95 p-1 shadow-[var(--ops-control-rim),var(--shadow-raised)]">
            <legend className="sr-only">{t("Show on the map")}</legend>
            {(
              [
                ["calls", "Open calls"],
                ["units", "Units"],
                ["history", "Closed this shift"],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className={`flex h-8 cursor-pointer items-center gap-2 rounded-md px-2.5 text-xs font-medium transition-colors has-[:focus-visible]:outline-2 ${
                  layers[key] ? "bg-npf-blue text-white" : "text-npf-ink hover:bg-npf-cloud"
                }`}
              >
                <input
                  type="checkbox"
                  checked={layers[key]}
                  onChange={(e) => setLayers((l) => ({ ...l, [key]: e.target.checked }))}
                  className="sr-only"
                />
                {t(label)}
              </label>
            ))}
          </fieldset>
          <Legend />
        </section>

        <div className="min-w-0 space-y-4">
          {call ? (
            <CallCard call={call} units={units} onClose={() => setFocus(null)} onPick={setFocus} />
          ) : unit ? (
            <UnitCard unit={unit} onClose={() => setFocus(null)} onPick={setFocus} />
          ) : null}

          <OpsPanel title={t("Open calls")} count={open.length || undefined} flush>
            {open.length ? (
              <ul>
                {open.map((i) => (
                  <li key={i.id} className="border-b border-ops-line-soft last:border-0">
                    <button
                      type="button"
                      onClick={() => withTransition(() => setFocus(i.id))}
                      aria-pressed={focus === i.id}
                      className={`flex w-full items-start gap-3 px-5 py-3 text-start transition-colors ${
                        focus === i.id ? "bg-npf-mist" : "hover:bg-ops-hover"
                      } ${isOverdue(i, now) ? "npf-ops-overdue" : ""}`}
                    >
                      <PriorityTag priority={i.priority} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-npf-ink">
                          {t(i.kind)}
                        </span>
                        <span className="block truncate text-xs text-ops-dim">
                          {placeOf(t(i.area), i.where, !viewing)}
                        </span>
                      </span>
                      <span className="shrink-0 text-end">
                        <Elapsed from={i.reported} className="block text-xs font-medium" />
                        <span className="mt-1 block">
                          <OpsStatus status={i.status} />
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-6 text-sm text-ops-dim">{t("No open calls in view.")}</p>
            )}
          </OpsPanel>
        </div>
      </div>
    </div>
  );
}

function Legend() {
  const t = useT();
  return (
    <div className="absolute start-3 bottom-3 z-[500] grid gap-1.5 rounded-(--ops-control-radius) bg-white/95 px-3 py-2.5 text-2xs text-npf-body shadow-[var(--ops-control-rim),var(--shadow-raised)] max-sm:hidden">
      <span className="flex items-center gap-2">
        <span aria-hidden className="size-3 rounded-full bg-ops-p1 ring-2 ring-white ring-offset-1 ring-offset-ops-p1" />
        {t("Call, coloured by grade")}
      </span>
      <span className="flex items-center gap-2">
        <span aria-hidden className="size-3 rounded-full outline-2 outline-dashed outline-ops-p3 -outline-offset-2" />
        {t("Approximate: command headquarters")}
      </span>
      <span className="flex items-center gap-2">
        <span aria-hidden className="size-3 rounded-[3px] bg-ops-ok" />
        {t("Unit, coloured by status")}
      </span>
    </div>
  );
}

function CardHead({ title, onClose }: { title: string; onClose: () => void }) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={t("Close {what}", { what: title })}
      className="grid size-8 place-items-center rounded-(--ops-control-radius) text-ops-dim ring-1 ring-ops-line-soft ring-inset hover:bg-ops-hover hover:text-ops-text"
    >
      <CloseIcon aria-hidden className="size-4" />
    </button>
  );
}

/** The call picked on the map, and the free units closest to it. */
function CallCard({
  call,
  units,
  onClose,
  onPick,
}: {
  call: Incident;
  units: Unit[];
  onClose: () => void;
  onPick: (id: string) => void;
}) {
  const t = useT();
  const near = nearestFree(call, units).slice(0, 4);
  const pin = pinOf(call.where);
  return (
    <OpsPanel title={call.id} action={<CardHead title={call.id} onClose={onClose} />}>
      <div className="flex flex-wrap items-center gap-2">
        <PriorityTag priority={call.priority} withLabel />
        <OpsStatus status={call.status} />
        <Elapsed from={call.reported} className="ms-auto text-sm font-medium" />
      </div>
      <h3 className="mt-3 font-secondary text-base font-bold">{t(call.kind)}</h3>
      <p className="mt-0.5 text-sm text-ops-dim">{placeOf(t(call.area), call.where)}</p>
      {!pin.exact ? (
        <p className="mt-2 text-xs text-ops-p2">
          {t("No exact pin: shown at the command headquarters. Ask the caller for a landmark.")}
        </p>
      ) : null}
      {call.flags?.length ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {call.flags.map((f) => (
            <li key={f} className="rounded-[4px] bg-ops-p1-wash px-1.5 py-0.5 text-2xs font-semibold text-ops-p1">
              {t(f)}
            </li>
          ))}
        </ul>
      ) : null}

      {call.status === "New" ? (
        <div className="mt-4 border-t border-ops-line-soft pt-3">
          <p className="mb-2 text-xs font-semibold text-ops-dim">{t("Nearest free units")}</p>
          {near.length ? (
            <ul className="space-y-1.5">
              {near.map(({ unit, km }, n) => (
                <li key={unit.callsign} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onPick(unit.callsign)}
                    className="min-w-0 flex-1 text-start"
                  >
                    <span className="block truncate text-sm font-medium text-npf-ink">
                      {t(unit.callsign)}
                      <span className="ms-2 font-mono text-xs text-ops-dim">{kmLabel(km)}</span>
                    </span>
                    <span className="block truncate text-xs text-ops-dim">{t(unit.officer)}</span>
                  </button>
                  <OpsButton
                    tone={n === 0 ? "brand" : "quiet"}
                    className="!h-8 !px-3 !text-xs"
                    onClick={() =>
                      updateIncident(call.id, {
                        unit: unit.callsign,
                        assignee: unit.officer,
                        status: "Dispatched",
                      })
                    }
                  >
                    {t("Send")}
                  </OpsButton>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-ops-dim">{t("No unit free in this command.")}</p>
          )}
        </div>
      ) : call.unit ? (
        <p className="mt-4 border-t border-ops-line-soft pt-3 text-sm">
          {t("{unit} is on it.", { unit: t(call.unit) })}
        </p>
      ) : null}

      <Link
        href={`/app/police/incidents?call=${call.id}`}
        className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-(--ops-control-radius) bg-white text-sm font-medium text-ops-text shadow-[var(--ops-control-rim),var(--ops-control-lift)] hover:bg-ops-hover"
      >
        {t("Open the call")}
      </Link>
    </OpsPanel>
  );
}

function UnitCard({
  unit,
  onClose,
  onPick,
}: {
  unit: Unit;
  onClose: () => void;
  onPick: (id: string) => void;
}) {
  const t = useT();
  return (
    <OpsPanel title={t(unit.callsign)} action={<CardHead title={unit.callsign} onClose={onClose} />}>
      <div className="flex flex-wrap items-center gap-2">
        <UnitStatusTag status={unit.status} />
        <Elapsed from={unit.since} className="ms-auto text-sm font-medium" />
      </div>
      <dl className="mt-3 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-xs">
        <dt className="text-ops-dim">{t("Officer")}</dt>
        <dd className="font-medium">{t(unit.officer)}</dd>
        <dt className="text-ops-dim">{t("Section")}</dt>
        <dd>{t(unit.section)}</dd>
        <dt className="text-ops-dim">{t("Last seen")}</dt>
        <dd>{t(unit.area)}</dd>
      </dl>
      {unit.incident ? (
        <OpsButton className="mt-4 w-full" onClick={() => onPick(unit.incident!)}>
          {t("Show its call")}
        </OpsButton>
      ) : null}
    </OpsPanel>
  );
}
