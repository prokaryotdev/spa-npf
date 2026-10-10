"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { dispatchTarget } from "../content-ops";
import { useT } from "../i18n/client";
import { useHydrated } from "./store";
import { CheckIcon, CloseIcon, SearchIcon } from "./icons";
import { FindGlyph } from "./ops-glyphs";
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
function waitingMinutes(incident: Incident, now: number) {
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
    <section className={`flex min-h-0 flex-col ${className}`}>
      {title ? (
        /*
         * The title sits above its surface, the way a grouped list is
         * labelled in an Apple app: the heading names the group, the count
         * follows it in secondary text, and the surface below carries only
         * the rows. No band, no rule, no caps.
         */
        <div className="flex min-h-7 shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 px-1 pb-2.5">
          <h2 className="flex items-baseline gap-2 font-secondary text-[1.0625rem] leading-tight font-bold tracking-[-0.01em]">
            {t(title)}
            {count !== undefined ? (
              <span className="font-primary text-sm font-normal tracking-normal text-ops-dim tabular-nums">
                {count}
              </span>
            ) : null}
          </h2>
          {action}
        </div>
      ) : null}
      <div
        /*
         * `overflow-clip`, not `overflow-hidden`. Both round off a flush
         * table's corners, but `hidden` makes the surface a scroll container,
         * and a scroll container captures every sticky descendant: the column
         * heads stopped pinning to the viewport and parked 60px down the
         * panel instead. `clip` crops without ever becoming a scrollport.
         */
        className={`npf-ops-tile min-h-0 flex-1 overflow-clip ${flush ? "" : "p-4 sm:p-5"} ${bodyClassName}`}
      >
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
        className="grid size-12 place-items-center rounded-full"
        style={{
          background: ok
            ? "color-mix(in srgb, var(--ops-fill-ok) 14%, transparent)"
            : "rgb(255 255 255 / 0.06)",
          color: ok ? "var(--ops-fill-ok)" : "var(--ops-text)",
        }}
      >
        {ok ? (
          <CheckIcon className="size-5.5" />
        ) : (
          <FindGlyph className="size-7" />
        )}
      </span>
      <p className="font-secondary text-base font-bold">{title}</p>
      {hint ? (
        <p className="max-w-[44ch] text-xs leading-relaxed text-ops-dim">
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
  lead?: string;
  action?: React.ReactNode;
}) {
  return (
    /*
     * An Apple large title: bold, tightly tracked, with the lead in
     * secondary text under it. It is the one big voice on the screen, and the
     * board below steps down from it rather than competing.
     */
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <h1 className="font-secondary text-[1.75rem] leading-[1.15] font-bold tracking-[-0.025em] sm:text-[2rem]">
          {title}
        </h1>
        {lead ? (
          <p className="mt-1.5 max-w-[68ch] text-sm leading-relaxed text-ops-dim">
            {lead}
          </p>
        ) : null}
      </div>
      {action}
    </header>
  );
}

/**
 * The search box shared by the three filterable boards.
 *
 * Built for a desk worked from the keyboard: "/" jumps into it from anywhere
 * on the board, Escape clears it, and a cleared box hands focus back. The
 * matching itself (filterBy) takes any word order, forgives a slip, folds
 * Hausa hooks, holds "quoted words" together and drops -minus words.
 */
export function OpsSearch({
  id,
  label,
  placeholder,
  value,
  onChange,
  found,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  /** How many rows the query leaves, so a dead end shows on the box. */
  found?: number;
}) {
  const t = useT();
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const at = e.target;
      if (
        at instanceof Element &&
        at.closest("input, textarea, select, [contenteditable='true']")
      )
        return;
      e.preventDefault();
      input.current?.focus();
      input.current?.select();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const dead = value.trim() !== "" && found === 0;

  return (
    /*
     * Capped at 360px. It used to be `flex-1` against a short row of filters,
     * so on the Units board a single search field ran 870px across an empty
     * box — a control sized by what was left over rather than by what anyone
     * types into it.
     */
    <div
      className={`group flex h-9 min-w-50 flex-1 items-center gap-2 rounded-[10px] bg-white/[0.07] ps-2.5 pe-1.5 transition-[background-color,box-shadow] duration-150 sm:max-w-90 hover:bg-white/[0.09] focus-within:bg-white/[0.09] ${
        dead
          ? "shadow-[0_0_0_1.5px_rgb(255_69_58/0.75)]"
          : "focus-within:shadow-[0_0_0_3px_rgb(64_156_255/0.55)]"
      }`}
    >
      <SearchIcon
        aria-hidden
        className={`size-4 shrink-0 transition-colors ${dead ? "text-ops-p1" : "text-ops-dim"}`}
      />
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        ref={input}
        id={id}
        type="search"
        value={value}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
        aria-invalid={dead || undefined}
        aria-keyshortcuts="/"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && value) {
            e.preventDefault();
            onChange("");
          }
        }}
        placeholder={placeholder}
        className="npf-ops-search h-full w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-ops-dim focus-visible:outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange("");
            input.current?.focus();
          }}
          className="group/clear grid size-6 shrink-0 place-items-center rounded-full"
        >
          {/* The filled clear mark of a system search field. */}
          <span
            aria-hidden
            className="grid size-4 place-items-center rounded-full bg-ops-dim/70 text-ops-panel transition-colors group-hover/clear:bg-ops-text"
          >
            <CloseIcon className="size-2.5" />
          </span>
          <span className="sr-only">{t("Clear search")}</span>
        </button>
      ) : (
        <kbd
          aria-hidden
          className="hidden h-5 min-w-5 shrink-0 place-items-center rounded-[5px] bg-white/[0.08] px-1 font-primary text-2xs font-medium text-ops-dim sm:grid"
        >
          /
        </kbd>
      )}
    </div>
  );
}

/** The shared look of a `select` sitting in a filter bar. */
export const OPS_SELECT =
  "npf-ops-select h-9 rounded-chip px-3 text-sm font-medium outline-none";

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
    /*
     * The grade is a chip in its own hue, not a dot beside a word. The dot
     * put a second coloured mark on every row next to the status pill's own,
     * and two dots a row is noise; one tinted chip is the grade at a glance.
     */
    <span className="inline-flex shrink-0 items-center gap-2 text-xs whitespace-nowrap">
      <span
        className="grid h-5 min-w-7 place-items-center rounded-[6px] px-1.5 text-2xs font-bold tabular-nums"
        style={{
          color: token,
          background: `color-mix(in srgb, ${token} 17%, transparent)`,
        }}
      >
        {priority}
      </span>
      <span className={withLabel ? "font-medium text-ops-dim" : "sr-only"}>
        {t(label)}
      </span>
    </span>
  );
}

const CALL_TONE: Record<Incident["status"], string> = {
  New: "bg-ops-p2-wash text-ops-p2",
  Dispatched: "bg-ops-route-wash text-ops-route",
  "On Scene": "bg-ops-scene-wash text-ops-scene",
  Closed: "bg-white/[0.08] text-ops-dim",
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
    <span className={`npf-pill ${CALL_TONE[status]}`}>
      <span aria-hidden className="npf-pill-dot" />
      {t(CALL_LABEL[status])}
    </span>
  );
}

const UNIT_TONE: Record<UnitStatus, string> = {
  Available: "bg-ops-ok-wash text-ops-ok",
  // The same inks as the call it is on: en route is indigo, on scene teal.
  Assigned: "bg-ops-route-wash text-ops-route",
  "On Scene": "bg-ops-scene-wash text-ops-scene",
  Unavailable: "bg-white/[0.08] text-ops-dim",
};

export function UnitStatusTag({ status }: { status: UnitStatus }) {
  const t = useT();
  return (
    <span className={`npf-pill ${UNIT_TONE[status]}`}>
      <span aria-hidden className="npf-pill-dot" />
      {t(status)}
    </span>
  );
}

/** Buttons in the console: Apple push buttons, filled, 8px corners. */
export function OpsButton({
  tone = "quiet",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "brand" | "quiet" | "danger";
}) {
  const tones = {
    brand:
      "bg-ops-brand text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] hover:bg-ops-brand-lift disabled:opacity-40 disabled:shadow-none",
    quiet:
      "bg-white/[0.08] text-ops-text hover:bg-white/[0.12] disabled:opacity-40",
    danger:
      "bg-ops-p1/15 text-[#ff6961] hover:bg-ops-p1/22 disabled:opacity-40",
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
      className={`inline-flex h-9 items-center gap-1.5 rounded-chip px-3.5 text-sm font-medium whitespace-nowrap transition-[background-color,border-color,box-shadow,scale] enabled:active:scale-[0.97] active:duration-(--dur-press) disabled:cursor-not-allowed ${tones[tone]} ${className}`}
    />
  );
}
