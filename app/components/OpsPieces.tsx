"use client";

import { useSyncExternalStore } from "react";
import { dispatchTarget } from "../content-ops";
import { useT } from "../i18n/client";
import { useHydrated } from "./store";
import type { Incident, Priority, UnitStatus } from "./store";

/* -------------------------------------------------------------------------
 * The clock
 * ---------------------------------------------------------------------- */

/**
 * One interval for the whole console rather than one per row. A board with
 * forty live timers on it should tick once a second, not forty times.
 */
const tickers = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribeTick(fn: () => void) {
  tickers.add(fn);
  timer ??= setInterval(() => {
    stamp = Date.now();
    for (const t of tickers) t();
  }, 1000);
  return () => {
    tickers.delete(fn);
    if (tickers.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

let stamp = Date.now();

/**
 * The shared "now". Server-side it is frozen, because a clock that differs
 * between the two renders is a hydration mismatch — the console's credential
 * guard means no timer is ever painted on the server anyway.
 */
export function useNow() {
  return useSyncExternalStore(
    subscribeTick,
    () => stamp,
    () => 0,
  );
}

/**
 * True once the browser has taken over; timers read `--:--` until then.
 * Aliased so a console screen pulls its clock helpers from one file.
 */
export const useMounted = useHydrated;

const pad = (n: number) => String(n).padStart(2, "0");

/** 04:12, or 1:22:09 once a call has been running for over an hour. */
export function duration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/**
 * A running clock since `from`, or a fixed span when `to` is given.
 *
 * Dispatch is a job measured in elapsed time, not in wall clock: what matters
 * is that this call has been waiting eleven minutes, never that it came in at
 * 11:52. So the board counts, and the timestamp lives in the detail panel.
 */
export function Elapsed({
  from,
  to,
  className = "",
}: {
  from: string;
  to?: string | null;
  className?: string;
}) {
  const now = useNow();
  const mounted = useMounted();
  const start = new Date(from).getTime();
  const end = to ? new Date(to).getTime() : now;
  if (!mounted)
    return (
      <span className={`tabular-nums ${className}`} aria-hidden>
        --:--
      </span>
    );
  return (
    <time className={`tabular-nums ${className}`} dateTime={from}>
      {duration(end - start)}
    </time>
  );
}

/** Minutes a pending call has been waiting, for the overdue test. */
export function waitingMinutes(incident: Incident, now: number) {
  return (now - new Date(incident.reported).getTime()) / 60_000;
}

/** A pending call that has outrun the target for its grade. */
export function isOverdue(incident: Incident, now: number) {
  if (incident.status !== "New" || !now) return false;
  return waitingMinutes(incident, now) > dispatchTarget[incident.priority];
}

/* -------------------------------------------------------------------------
 * Surfaces
 * ---------------------------------------------------------------------- */

/**
 * A block of the console. One elevation cue — a hairline — because a board
 * this dense cannot afford every panel casting a shadow at the reader.
 */
export function OpsPanel({
  title,
  count,
  action,
  flush,
  children,
}: {
  title?: string;
  count?: React.ReactNode;
  action?: React.ReactNode;
  /** Let a table run to the panel edge instead of sitting inside padding. */
  flush?: boolean;
  children: React.ReactNode;
}) {
  const t = useT();
  return (
    <section className="overflow-hidden rounded-xl border border-[var(--ops-line)] bg-[var(--ops-panel)]">
      {title ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--ops-line)] px-4 py-3">
          <h2 className="flex items-baseline gap-2.5 font-secondary text-sm font-bold tracking-[0.09em] uppercase">
            {t(title)}
            {count !== undefined ? (
              <span className="font-primary text-xs font-normal tracking-normal text-[var(--ops-dim)] normal-case tabular-nums">
                {count}
              </span>
            ) : null}
          </h2>
          {action}
        </div>
      ) : null}
      <div className={flush ? "" : "p-4"}>{children}</div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * Grades and statuses
 * ---------------------------------------------------------------------- */

export const PRIORITY: Record<Priority, { token: string; label: string }> = {
  P1: { token: "var(--ops-p1)", label: "Immediate" },
  P2: { token: "var(--ops-p2)", label: "Urgent" },
  P3: { token: "var(--ops-p3)", label: "Routine" },
  P4: { token: "var(--ops-p4)", label: "Scheduled" },
};

/**
 * The grade reads as its number first and its colour second. An officer who
 * cannot separate red from amber, and an officer glancing at the board from
 * three metres away, both have to get the same answer — so P1 is spelled out
 * and the dot is confirmation, never the carrier.
 */
export function PriorityTag({
  priority,
  withLabel,
}: {
  priority: Priority;
  withLabel?: boolean;
}) {
  const t = useT();
  const { token, label } = PRIORITY[priority];
  return (
    <span
      className="inline-flex shrink-0 items-center gap-2 text-xs font-bold whitespace-nowrap"
      style={{ color: token }}
    >
      <span
        aria-hidden
        className="npf-ops-dot size-1.5 rounded-full bg-current"
      />
      {priority}
      <span className={withLabel ? "font-medium opacity-80" : "sr-only"}>
        {t(label)}
      </span>
    </span>
  );
}

const CALL_TONE: Record<Incident["status"], string> = {
  New: "bg-[#3b2c0b] text-[#f8d79a]",
  Dispatched: "bg-[#2A1B4D] text-[#C3B0F5]",
  "On Scene": "bg-[#0b3b2a] text-[#7fe7bb]",
  Closed: "bg-[var(--ops-raised)] text-[var(--ops-dim)]",
};

/** A pending call says "Pending" on the board — "New" is not a state of work. */
const CALL_LABEL: Record<Incident["status"], string> = {
  New: "Pending",
  Dispatched: "En route",
  "On Scene": "On scene",
  Closed: "Closed",
};

export function OpsStatus({ status }: { status: Incident["status"] }) {
  const t = useT();
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap ${CALL_TONE[status]}`}
    >
      {t(CALL_LABEL[status])}
    </span>
  );
}

const UNIT_TONE: Record<UnitStatus, string> = {
  Available: "bg-[#0b3b2a] text-[#7fe7bb]",
  Assigned: "bg-[#3b2c0b] text-[#f8d79a]",
  "On Scene": "bg-[#2A1B4D] text-[#C3B0F5]",
  Unavailable: "bg-[var(--ops-raised)] text-[var(--ops-dim)]",
};

export function UnitStatusTag({ status }: { status: UnitStatus }) {
  const t = useT();
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap ${UNIT_TONE[status]}`}
    >
      {t(status)}
    </span>
  );
}

/* -------------------------------------------------------------------------
 * Readouts
 * ---------------------------------------------------------------------- */

/**
 * One number on the status strip. Deliberately not a card: these are a single
 * band of readouts, and boxing each one would make four panels out of a line
 * of type an officer reads left to right in under a second.
 */
export function Readout({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  note?: string;
  tone?: string;
}) {
  const t = useT();
  return (
    <div className="px-4 py-3 first:pl-0 sm:px-5">
      <dt className="text-[11px] tracking-[0.12em] text-[var(--ops-dim)] uppercase">
        {t(label)}
      </dt>
      <dd
        className="mt-1.5 font-secondary text-[26px] leading-none font-bold tabular-nums"
        style={tone ? { color: tone } : undefined}
      >
        {value}
      </dd>
      {note ? (
        <p className="mt-1.5 text-[11px] text-[var(--ops-dim)]">{t(note)}</p>
      ) : null}
    </div>
  );
}

/** Buttons in the console. Square-cornered: this is a tool, not a brochure. */
export function OpsButton({
  tone = "quiet",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "brand" | "quiet" | "danger";
}) {
  const tones = {
    brand:
      "bg-[var(--ops-brand)] text-white hover:bg-[var(--ops-brand-lift)] disabled:opacity-40",
    quiet:
      "border border-[var(--ops-line)] text-[var(--ops-dim)] hover:border-[var(--ops-accent)]/50 hover:bg-[var(--ops-raised)] hover:text-[var(--ops-text)] disabled:opacity-40",
    danger:
      "border border-[var(--ops-p1)]/40 text-[var(--ops-p1)] hover:bg-[var(--ops-p1)]/12 disabled:opacity-40",
  };
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${tones[tone]} ${className}`}
    />
  );
}
