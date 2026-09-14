"use client";

import { useId, useMemo, useState } from "react";
import { officers, units } from "../content-ops";
import { OpsPanel, OpsStatus, PriorityTag } from "./OpsPieces";
import {
  updateIncident,
  useStore,
  type Incident,
  type IncidentStatus,
} from "./store";
import { formatTime } from "./ui";
import { CloseIcon, SearchIcon } from "./icons";

const STATUSES: IncidentStatus[] = ["New", "Dispatched", "On Scene", "Closed"];
const PRIORITIES: Incident["priority"][] = [
  "Critical",
  "High",
  "Medium",
  "Low",
];

export default function OpsIncidents() {
  const id = useId();
  const { incidents } = useStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [mine, setMine] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return incidents.filter((i) => {
      if (status && i.status !== status) return false;
      if (priority && i.priority !== priority) return false;
      if (mine && i.assignee) return false;
      if (!q) return true;
      return `${i.id} ${i.kind} ${i.area} ${i.assignee ?? ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [incidents, query, status, priority, mine]);

  const open = incidents.find((i) => i.id === selected) ?? null;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-secondary text-2xl font-bold">Incidents</h1>
        <p className="mt-1 text-sm text-[var(--ops-dim)]">
          Everything reported today, oldest at the bottom.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-[var(--ops-line)] bg-[var(--ops-panel)] px-3 focus-within:border-[var(--ops-accent)]">
          <SearchIcon
            aria-hidden
            className="size-4 shrink-0 text-[var(--ops-dim)]"
          />
          <label htmlFor={`${id}-q`} className="sr-only">
            Filter incidents
          </label>
          <input
            id={`${id}-q`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Reference, type, area or officer"
            className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-[var(--ops-dim)]"
          />
        </div>

        <Select
          id={`${id}-status`}
          label="Status"
          value={status}
          onChange={setStatus}
          options={STATUSES}
          all="Any status"
        />
        <Select
          id={`${id}-priority`}
          label="Priority"
          value={priority}
          onChange={setPriority}
          options={PRIORITIES}
          all="Any priority"
        />
        <button
          type="button"
          aria-pressed={mine}
          onClick={() => setMine((v) => !v)}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            mine
              ? "bg-[var(--ops-accent)] text-[#062018]"
              : "border border-[var(--ops-line)] bg-[var(--ops-panel)] text-[var(--ops-dim)] hover:text-[var(--ops-text)]"
          }`}
        >
          Unassigned only
        </button>
      </div>

      <p aria-live="polite" className="text-xs text-[var(--ops-dim)]">
        {visible.length} of {incidents.length} incidents
      </p>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        {/* min-w-0: without it the table's min-width becomes the column's
            min-content width and shoves the detail panel off the page. */}
        <div className="min-w-0">
          <OpsPanel>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <caption className="sr-only">
                  Incidents, with priority, area, status and assigned officer
                </caption>
                <thead className="text-xs text-[var(--ops-dim)]">
                  <tr className="border-b border-[var(--ops-line)]">
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Ref
                    </th>
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Type / area
                    </th>
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Priority
                    </th>
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Status
                    </th>
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Assigned
                    </th>
                    <th scope="col" className="py-2 font-medium">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((incident) => (
                    <tr
                      key={incident.id}
                      onClick={() => setSelected(incident.id)}
                      aria-selected={selected === incident.id}
                      className={`cursor-pointer border-b border-[var(--ops-line)] transition-colors last:border-0 ${
                        selected === incident.id
                          ? "bg-[var(--ops-raised)]"
                          : "hover:bg-[var(--ops-raised)]/60"
                      }`}
                    >
                      <th
                        scope="row"
                        className="py-2.5 pr-3 text-left font-normal"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(incident.id);
                          }}
                          className="font-secondary font-bold tabular-nums underline-offset-4 hover:underline"
                        >
                          {incident.id}
                        </button>
                      </th>
                      <td className="py-2.5 pr-3">
                        {incident.kind}
                        <span className="block text-xs text-[var(--ops-dim)]">
                          {incident.area}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3">
                        <PriorityTag priority={incident.priority} />
                      </td>
                      <td className="py-2.5 pr-3">
                        <OpsStatus status={incident.status} />
                      </td>
                      <td className="py-2.5 pr-3 text-xs">
                        {incident.assignee ?? (
                          <span className="text-[#f0b354]">Unassigned</span>
                        )}
                        {incident.unit ? (
                          <span className="block text-[var(--ops-dim)]">
                            {incident.unit}
                          </span>
                        ) : null}
                      </td>
                      <td className="py-2.5 text-xs tabular-nums text-[var(--ops-dim)]">
                        {formatTime(incident.reported)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visible.length === 0 ? (
              <p className="py-10 text-center text-sm text-[var(--ops-dim)]">
                No incident matches those filters.
              </p>
            ) : null}
          </OpsPanel>
        </div>

        <div className="xl:sticky xl:top-4 xl:self-start">
          {open ? (
            <Detail incident={open} onClose={() => setSelected(null)} />
          ) : (
            <OpsPanel title="Incident detail">
              <p className="py-8 text-center text-sm text-[var(--ops-dim)]">
                Pick a row to assign it, move its status or read the log.
              </p>
            </OpsPanel>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({
  incident,
  onClose,
}: {
  incident: Incident;
  onClose: () => void;
}) {
  return (
    <OpsPanel
      title={incident.id}
      action={
        <button
          type="button"
          onClick={onClose}
          aria-label="Close incident detail"
          className="grid size-7 place-items-center rounded text-[var(--ops-dim)] transition-colors hover:bg-[var(--ops-raised)] hover:text-[var(--ops-text)]"
        >
          <CloseIcon className="size-4" />
        </button>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <PriorityTag priority={incident.priority} />
        <OpsStatus status={incident.status} />
      </div>

      <h3 className="font-secondary text-base font-bold">{incident.kind}</h3>
      <p className="mt-1 text-sm text-[var(--ops-dim)]">{incident.area}</p>
      <p className="mt-3 text-sm leading-relaxed">{incident.summary}</p>

      <dl className="mt-4 space-y-2 text-xs">
        <div className="flex justify-between gap-3">
          <dt className="text-[var(--ops-dim)]">Reported</dt>
          <dd className="tabular-nums">{formatTime(incident.reported)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[var(--ops-dim)]">Source</dt>
          <dd>{incident.source}</dd>
        </div>
      </dl>

      <div className="mt-5 space-y-3 border-t border-[var(--ops-line)] pt-4">
        <Assign
          id={`assign-officer-${incident.id}`}
          label="Officer"
          value={incident.assignee ?? ""}
          options={officers}
          placeholder="Unassigned"
          onChange={(assignee) =>
            updateIncident(incident.id, {
              assignee: assignee || null,
              // Assigning an untouched incident is the dispatch.
              status:
                assignee && incident.status === "New"
                  ? "Dispatched"
                  : incident.status,
            })
          }
        />
        <Assign
          id={`assign-unit-${incident.id}`}
          label="Unit"
          value={incident.unit ?? ""}
          options={units}
          placeholder="No unit"
          onChange={(unit) =>
            updateIncident(incident.id, { unit: unit || null })
          }
        />
        <Assign
          id={`assign-status-${incident.id}`}
          label="Status"
          value={incident.status}
          options={STATUSES}
          onChange={(status) =>
            updateIncident(incident.id, { status: status as IncidentStatus })
          }
        />
      </div>
    </OpsPanel>
  );
}

function Assign({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-xs text-[var(--ops-dim)]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 rounded-lg border border-[var(--ops-line)] bg-[var(--ops-raised)] px-3 py-2 text-sm outline-none focus:border-[var(--ops-accent)]"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Select({
  id,
  label,
  value,
  onChange,
  options,
  all,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  all: string;
}) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-[var(--ops-line)] bg-[var(--ops-panel)] px-3 py-2 text-sm outline-none focus:border-[var(--ops-accent)]"
      >
        <option value="">{all}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
}
