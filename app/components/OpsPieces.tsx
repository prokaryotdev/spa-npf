"use client";

import { useSyncExternalStore } from "react";
import { dispatchTarget } from "../content-ops";
import { useT } from "../i18n/client";
import { useHydrated } from "./store";
import { CheckIcon, SearchIcon } from "./icons";
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
 * A block of the console.
 *
 * Elevation is declared once and it is the shadow. These panels used to carry
 * a 1px hairline and nothing else, which on a pale blue ground made a board
 * of white rectangles read as a wireframe of itself — the outline said
 * "container" and nothing said "surface". Now the hairlines work strictly
 * inside a panel, dividing its rows, and the shadow does the lifting.
 */
export function OpsPanel({
  title,
  count,
  action,
  flush,
  className = "",
  bodyClassName = "",
  children,
}: {
  title?: string;
  count?: React.ReactNode;
  action?: React.ReactNode;
  /** Let a table run to the panel edge instead of sitting inside padding. */
  flush?: boolean;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  const t = useT();
  return (
    <section
      /*
       * `overflow-clip`, not `overflow-hidden`. Both round off a flush table's
       * corners, but `hidden` makes the panel a scroll container, and a scroll
       * container captures every sticky descendant: the column heads inside
       * stopped pinning to the viewport and parked themselves 60px down the
       * panel instead, with the first row of calls sliding underneath them.
       * `clip` crops without ever becoming a scrollport, so the heads pin to
       * the page — the only thing that scrolls here.
       */
      className={`flex min-h-0 flex-col overflow-clip rounded-xl bg-[var(--ops-panel)] shadow-[var(--ops-shadow)] ${className}`}
    >
      {title ? (
        /*
         * Sentence case, not the small-caps the console used to set every
         * panel, label and column head in. Six shouting headings on one
         * screen is six things claiming to be the loudest, which leaves
         * nothing leading; the weight step does the work instead.
         */
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[var(--ops-line-soft)] px-4 py-3">
          <h2 className="flex items-center gap-2 font-secondary text-[15px] leading-none font-bold tracking-[-0.01em]">
            {t(title)}
            {count !== undefined ? (
              <span className="rounded bg-[var(--ops-raised)] px-1.5 py-0.5 font-primary text-[11px] leading-tight font-medium text-[var(--ops-dim)] tabular-nums">
                {count}
              </span>
            ) : null}
          </h2>
          {action}
        </div>
      ) : null}
      <div className={`min-h-0 ${flush ? "" : "p-4"} ${bodyClassName}`}>
        {children}
      </div>
    </section>
  );
}

/**
 * What a board says when a queue is clear or a filter matches nothing.
 *
 * Both are worth distinguishing: "nothing is waiting" is good news and reads
 * as a green tick, "nothing matched" is a dead end and has to offer the way
 * back out. The old version was one grey sentence for both.
 */
export function OpsEmpty({
  title,
  hint,
  tone = "clear",
  action,
}: {
  /** Already translated, like OpsHead's — so the coverage test can see it. */
  title: string;
  hint?: string;
  tone?: "clear" | "none";
  action?: React.ReactNode;
}) {
  const ok = tone === "clear";
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <span
        aria-hidden
        className="grid size-10 place-items-center rounded-full"
        style={{
          background: ok
            ? "color-mix(in srgb, var(--ops-fill-ok) 12%, transparent)"
            : "var(--ops-raised)",
          color: ok ? "var(--ops-fill-ok)" : "var(--ops-dim)",
        }}
      >
        {ok ? (
          <CheckIcon className="size-5" />
        ) : (
          <SearchIcon className="size-5" />
        )}
      </span>
      <p className="text-sm font-medium">{title}</p>
      {hint ? (
        <p className="max-w-[44ch] text-xs leading-relaxed text-[var(--ops-dim)]">
          {hint}
        </p>
      ) : null}
      {action}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Page furniture
 * ---------------------------------------------------------------------- */

/**
 * The title block every console screen opens with. The lead is capped at a
 * readable measure rather than running the full width of a 1600px board,
 * where a two-line sentence becomes one 180-character line.
 */
export function OpsHead({
  title,
  lead,
  action,
}: {
  title: string;
  lead: string;
  action?: React.ReactNode;
}) {
  return (
    /*
     * The title is 22px, not 26. On a console the screen name is the least
     * surprising thing on the screen — the officer chose it a second ago —
     * and setting it as the largest type on the board put the loudest voice
     * on the one element carrying no information.
     */
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        <h1 className="font-secondary text-[22px] leading-tight font-bold tracking-[-0.015em]">
          {title}
        </h1>
        <p className="mt-1 max-w-[70ch] text-[13px] leading-relaxed text-[var(--ops-dim)]">
          {lead}
        </p>
      </div>
      {action}
    </header>
  );
}

/**
 * The band of readouts at the top of a board. Its children stretch, because
 * a five-number strip that stops two thirds of the way across a wide board
 * reads as an unfinished row rather than as a line of instruments.
 */
export function ReadoutStrip({ children }: { children: React.ReactNode }) {
  return (
    <dl className="flex flex-wrap divide-x divide-[var(--ops-line-soft)] overflow-clip rounded-xl bg-[var(--ops-panel)] shadow-[var(--ops-shadow)]">
      {children}
    </dl>
  );
}

/** The search box shared by the three filterable boards. */
export function OpsSearch({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    /*
     * Capped at 340px. It used to be `flex-1` against a short row of filters,
     * so on the Units board a single search field ran 870px across an empty
     * white box — a control sized by what was left over rather than by what
     * anyone types into it.
     */
    <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-[var(--ops-line)] bg-[var(--ops-panel)] px-3 transition-colors sm:max-w-[340px] focus-within:border-[var(--ops-accent)] focus-within:ring-2 focus-within:ring-[var(--ops-accent)]/15">
      <SearchIcon
        aria-hidden
        className="size-4 shrink-0 text-[var(--ops-dim)]"
      />
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-[var(--ops-dim)]"
      />
    </div>
  );
}

/** The shared look of a `select` sitting in a filter bar. */
export const OPS_SELECT =
  "npf-ops-select rounded-lg border border-[var(--ops-line)] bg-[var(--ops-panel)] px-3 py-2 text-sm outline-none transition-colors hover:border-[var(--ops-accent)] focus:border-[var(--ops-accent)]";

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
  New: "bg-[#FDF0DC] text-[#8A4B06]",
  Dispatched: "bg-[#E7E9FC] text-[#36309B]",
  "On Scene": "bg-[#D9F1EC] text-[#0B5A54]",
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
  Available: "bg-[#DCF2E4] text-[#0E6437]",
  Assigned: "bg-[#FDF0DC] text-[#8A4B06]",
  "On Scene": "bg-[#E7E9FC] text-[#36309B]",
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
    /*
     * basis + grow: the strip fills the board's width at any count, and the
     * readouts wrap to a second line rather than crushing on a laptop.
     *
     * A toned readout tints its whole cell, faintly, in its own hue. Five
     * numbers set identically is five numbers with no order to read them in;
     * the one that means "act now" has to be the one the eye lands on, and a
     * red numeral alone on white was not winning that against four black ones
     * the same size.
     */
    <div
      className="relative flex-1 basis-[150px] px-4 py-3.5 sm:px-5"
      style={
        tone
          ? { background: `color-mix(in srgb, ${tone} 6%, transparent)` }
          : undefined
      }
    >
      <dt className="text-[10px] font-medium tracking-[0.12em] text-[var(--ops-dim)] uppercase">
        {t(label)}
      </dt>
      <dd
        className="mt-2 font-secondary text-[26px] leading-none font-bold tracking-[-0.02em] tabular-nums"
        style={tone ? { color: tone } : undefined}
      >
        {value}
      </dd>
      {note ? (
        <p
          className="mt-1.5 text-[11px] leading-tight"
          style={{ color: tone ? tone : "var(--ops-dim)" }}
        >
          {t(note)}
        </p>
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
      "bg-[var(--ops-brand)] text-white shadow-[0_1px_2px_rgba(16,42,82,0.25)] hover:bg-[var(--ops-brand-lift)] disabled:opacity-40 disabled:shadow-none",
    quiet:
      "border border-[var(--ops-line)] bg-[var(--ops-panel)] text-[var(--ops-text)] hover:border-[var(--ops-accent)] hover:bg-[var(--ops-raised)] disabled:opacity-40",
    danger:
      "border border-[var(--ops-p1)]/40 text-[var(--ops-p1)] hover:bg-[var(--ops-p1)]/12 disabled:opacity-40",
  };
  return (
    /*
     * `active:` on a real button, not just hover. A control that moves under
     * the finger is the cheapest way an interface says the press landed, and
     * on a board where one click dispatches a car to an assault it is worth
     * more than it costs.
     */
    <button
      type="button"
      {...props}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-[background-color,border-color,box-shadow,translate] duration-150 enabled:active:translate-y-px disabled:cursor-not-allowed ${tones[tone]} ${className}`}
    />
  );
}
