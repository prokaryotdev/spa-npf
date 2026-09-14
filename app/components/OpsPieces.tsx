"use client";

import type { Incident } from "./store";
import { formatTime } from "./ui";

/** A bordered block of the console. */
export function OpsPanel({
  title,
  action,
  children,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--ops-line)] bg-[var(--ops-panel)] p-4">
      {title ? (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-secondary text-base font-bold">{title}</h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

const PRIORITY: Record<Incident["priority"], { color: string; label: string }> =
  {
    Critical: { color: "#ff6b6b", label: "Critical" },
    High: { color: "#f0b354", label: "High" },
    Medium: { color: "#5fb4e8", label: "Medium" },
    Low: { color: "#93ab9f", label: "Low" },
  };

/**
 * Priority reads as a dot plus its word, never the dot alone — an officer
 * scanning in a hurry and an officer who cannot separate red from amber both
 * have to get the same answer.
 */
export function PriorityTag({ priority }: { priority: Incident["priority"] }) {
  const { color, label } = PRIORITY[priority];
  return (
    <span className="inline-flex shrink-0 items-center gap-2 text-xs font-medium whitespace-nowrap">
      <span
        aria-hidden
        className="dp-ops-dot size-2 rounded-full"
        style={{ backgroundColor: color, color }}
      />
      <span style={{ color }}>{label}</span>
    </span>
  );
}

const STATUS_TONE: Record<Incident["status"], string> = {
  New: "bg-[#3a2c0a] text-[#f0d79a]",
  Dispatched: "bg-[#0f2f45] text-[#a8d8f5]",
  "On Scene": "bg-[#10392b] text-[#7cf0bd]",
  Closed: "bg-[var(--ops-raised)] text-[var(--ops-dim)]",
};

export function OpsStatus({ status }: { status: Incident["status"] }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap ${STATUS_TONE[status]}`}
    >
      {status}
    </span>
  );
}

/** One line of the live queue. Read-only; assignment lives on Incidents. */
export function IncidentRow({ incident }: { incident: Incident }) {
  return (
    <li className="dp-ops-row flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2.5">
      <span className="font-secondary text-sm font-bold tabular-nums">
        {incident.id}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm">
        {incident.kind}
        <span className="text-[var(--ops-dim)]"> · {incident.area}</span>
      </span>
      <PriorityTag priority={incident.priority} />
      <OpsStatus status={incident.status} />
      <span className="w-full text-xs text-[var(--ops-dim)] sm:w-auto sm:text-right">
        {formatTime(incident.reported)} ·{" "}
        {incident.assignee ?? (
          <span className="text-[#f0b354]">unassigned</span>
        )}
      </span>
    </li>
  );
}
