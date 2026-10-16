"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { dispatchTarget } from "../content-ops";
import { zonalCommand } from "../content-records";
import { useT } from "../i18n/client";
import { divisionOf, useHydrated, useStore, viewingOf } from "./store";
import { CheckIcon, CloseIcon, SearchIcon } from "./icons";
import { FindGlyph } from "./ops-glyphs";
import type { Incident, Priority, Unit, UnitStatus } from "./store";
import { distanceKm, pinOf } from "../geo";

/* -------------------------------------------------------------------------
 * The command in view
 * ---------------------------------------------------------------------- */

/**
 * The store, narrowed to the command this desk is looking at. Every console
 * screen reads through this, so a Kano desk never counts, sees or sends a
 * Lagos unit, and a Force Headquarters desk sees the whole country until it
 * picks one command.
 */
export function useScoped() {
  const store = useStore();
  const viewing = viewingOf(store.session);
  const division = divisionOf(store.session);
  const zone = zonalCommand(store.session?.zone);
  return useMemo(() => {
    // A zonal desk looking at its whole zone: every state in it, no other.
    if (!viewing && zone) {
      const inZone = (state?: string) => !!state && zone.states.includes(state);
      return {
        ...store,
        viewing,
        division,
        zone,
        incidents: store.incidents.filter((i) => inZone(i.where.state)),
        units: store.units.filter((u) => inZone(u.state)),
        requests: store.requests.filter((r) => inZone(r.where?.state)),
        cases: store.cases.filter((c) => inZone(c.where.state)),
        custody: store.custody.filter((d) => inZone(d.where.state)),
        alerts: store.alerts.filter((a) => !a.scope || inZone(a.scope)),
      };
    }
    if (!viewing) return { ...store, viewing, division, zone };
    // A divisional desk is narrowed once more, to its own LGA. Its units are
    // the ones based there; alerts still come from the whole command.
    const here = (w?: { state: string; lga: string }) =>
      !!w && w.state === viewing && (!division || w.lga === division);
    return {
      ...store,
      viewing,
      division,
      zone,
      incidents: store.incidents.filter((i) => here(i.where)),
      units: store.units.filter(
        (u) => u.state === viewing && (!division || u.base === division),
      ),
      requests: store.requests.filter((r) => here(r.where)),
      cases: store.cases.filter((c) => here(c.where)),
      custody: store.custody.filter((d) => here(d.where)),
      alerts: store.alerts.filter((a) => !a.scope || a.scope === viewing),
    };
  }, [store, viewing, division, zone]);
}

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
 * The shared clock to the minute. Same tick, but React only re-renders when
 * the minute turns: for a frame that counts things by the hour (the custody
 * badge) and must not redraw itself, and restart its effects, every second.
 */
export function useMinute() {
  return useSyncExternalStore(
    subscribeTick,
    () => Math.floor(stamp / 60_000) * 60_000,
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
  const t = useT();
  const now = useNow();
  const mounted = useMounted();
  const start = new Date(from).getTime();
  const end = to ? new Date(to).getTime() : now;
  // Past an hour the seconds are noise and "30:00:03" reads as a time of
  // day; say the span in words instead.
  const mins = Math.floor(Math.max(0, end - start) / 60_000);
  const span =
    mins >= 1440
      ? t("{d} d {h} h", { d: Math.floor(mins / 1440), h: Math.floor((mins % 1440) / 60) })
      : mins >= 60
        ? t("{h} h {m} min", { h: Math.floor(mins / 60), m: mins % 60 })
        : to
          ? // A finished span does not tick; "16:00" would read as a time.
            t("{n} min", { n: mins })
          : duration(end - start);
  if (!mounted)
    return (
      <span className={`font-mono tabular-nums ${className}`} aria-hidden>
        --:--
      </span>
    );
  return (
    <time className={`font-mono tabular-nums ${className}`} dateTime={from}>
      {span}
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

/**
 * A pending call into the last quarter of its target. Red at the deadline
 * is too late to be a warning; amber here gives the desk the minute it
 * needs to act before the call turns late.
 */
export function isNearDue(incident: Incident, now: number) {
  if (incident.status !== "New" || !now || isOverdue(incident, now))
    return false;
  return (
    waitingMinutes(incident, now) >= dispatchTarget[incident.priority] * 0.75
  );
}

/** The ink a pending call's clock wears: red when late, amber near it. */
export function targetTone(incident: Incident, now: number) {
  return isOverdue(incident, now)
    ? "var(--ops-p1)"
    : isNearDue(incident, now)
      ? "var(--ops-p2)"
      : "var(--color-npf-blue-mid)";
}

/**
 * How much of its grade's dispatch target a pending call has used. The
 * clock beside it says how long; this says how close to late.
 */
export function TargetBar({
  incident,
  now,
  className = "w-28",
}: {
  incident: Incident;
  now: number;
  className?: string;
}) {
  const target = dispatchTarget[incident.priority];
  const used = now
    ? Math.min(
        100,
        (now - new Date(incident.reported).getTime()) / (target * 600),
      )
    : 0;
  return (
    <span
      aria-hidden
      className={`block h-1 overflow-hidden rounded-full bg-ops-fill ${className}`}
    >
      <span
        className="block h-full rounded-full transition-[width] duration-1000 ease-linear"
        style={{ width: `${used}%`, background: targetTone(incident, now) }}
      />
    </span>
  );
}

/* -------------------------------------------------------------------------
 * Surfaces
 * ---------------------------------------------------------------------- */

/**
 * A panel of the dashboard: one white tile, its title bar inside it over a
 * hairline, the rows or the content below.
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
    /*
     * `overflow-clip`, not `overflow-hidden`. Both round off a flush table's
     * corners, but `hidden` makes the tile a scroll container, and a scroll
     * container captures every sticky descendant: the column heads would
     * park inside the panel instead of pinning under the bar.
     */
    <section
      className={`npf-ops-tile flex min-h-0 flex-col overflow-clip ${className}`}
    >
      {title ? (
        <div className="flex min-h-13 shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-ops-line-soft px-5 py-2">
          <h2 className="flex items-center gap-2.5 font-secondary text-[0.9375rem] leading-tight font-bold text-npf-ink">
            {t(title)}
            {count !== undefined ? (
              <span className="rounded-[5px] bg-npf-cloud px-1.5 py-0.5 font-primary text-xs font-semibold text-npf-blue-ink tabular-nums ring-1 ring-ops-line-soft ring-inset">
                {count}
              </span>
            ) : null}
          </h2>
          {action}
        </div>
      ) : null}
      <div
        className={`min-h-0 flex-1 ${flush ? "" : "p-5"} ${bodyClassName}`}
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
  icon,
  action,
}: {
  /** Already translated, like OpsHead's — so the coverage test can see it. */
  title?: string;
  hint?: string;
  /**
   * `clear`: good news, a green tick that draws itself once. `none`: a
   * search or filter that left nothing, which should come with an action
   * back out. `idle`: nothing chosen or nothing on yet, neither good nor bad.
   */
  tone?: "clear" | "none" | "idle";
  /** The idle mark, when the board has a glyph of its own for it. */
  icon?: React.ReactNode;
  /** Buttons that undo the dead end: clear the filters, widen the period. */
  action?: React.ReactNode;
}) {
  const mark = {
    clear:
      "bg-ops-ok-wash text-ops-ok ring-[color-mix(in_srgb,var(--ops-ok)_22%,transparent)]",
    none: "bg-npf-cloud text-npf-blue-ink ring-ops-line",
    idle: "bg-npf-mist text-ops-accent ring-[color-mix(in_srgb,var(--color-npf-blue-mid)_20%,transparent)]",
  }[tone];
  return (
    /*
     * Set on the panel's own reading line, not as a centred poster: the
     * officer's eye is already at the left edge where the rows would be,
     * and that is where the news that there are none should be.
     */
    <div
      role="status"
      className="flex items-start gap-4 px-5 py-6 sm:py-7"
    >
      <span
        aria-hidden
        className={`grid size-10 shrink-0 place-items-center rounded-[10px] ring-1 ring-inset ${mark}`}
      >
        {tone === "clear" ? (
          <CheckIcon className="npf-ops-draw size-5" />
        ) : tone === "none" ? (
          <FindGlyph className="size-6" />
        ) : (
          icon
        )}
      </span>
      <div className="min-w-0 flex-1 pt-px">
        {title ? (
          <p className="font-secondary text-[0.9375rem] leading-snug font-bold text-npf-ink">
            {title}
          </p>
        ) : null}
        {hint ? (
          <p
            className={`max-w-[58ch] text-[0.8125rem] leading-relaxed text-npf-body text-pretty ${
              title ? "mt-1" : "pt-2"
            }`}
          >
            {hint}
          </p>
        ) : null}
        {action ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">{action}</div>
        ) : null}
      </div>
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
     * The console's one dark moment: Force navy carrying the title and the
     * screen's figures, kept short so the work starts high on a laptop.
     */
    <header className="npf-ops-band relative isolate overflow-clip rounded-(--radius-card) px-5 py-4 text-white sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
        <div className="min-w-0">
          <h1 className="font-secondary text-2xl leading-[1.1] font-bold tracking-[-0.02em] text-balance sm:text-[1.625rem]">
            {title}
          </h1>
          {lead ? (
            <p className="npf-small mt-1 max-w-[68ch] text-white/75">
              {lead}
            </p>
          ) : null}
        </div>
        {action}
      </div>
    </header>
  );
}

/**
 * The figures a screen adds up to, set as one line beside its title rather
 * than a row of cards. Each label sits under its number; `of` turns a count
 * into "9/15". Colour comes from the caller and means something (red for
 * late, green for free), so it is never decoration.
 */
export function OpsFigures({
  figures,
}: {
  /** A count, or a ready-made reading such as a median time. */
  figures: { label: string; value: number | string; of?: number; tone?: string }[];
}) {
  return (
    /* On a phone the figures share one row in equal columns, labels
       wrapping under them, instead of the fourth dropping to a line alone.
       A reading wider than a count ("7 min") gets a 2×2 grid instead, or the
       four run into each other at 390px. */
    <dl
      className={`grid w-full items-start gap-x-4 sm:flex sm:items-end sm:w-auto sm:flex-wrap sm:gap-x-8 sm:gap-y-4 ${
        figures.some((f) => typeof f.value === "string")
          ? "grid-cols-2 gap-y-5"
          : "grid-flow-col auto-cols-fr"
      }`}
    >
      {figures.map(({ label, value, of, tone }) => (
        <div key={label} className="flex flex-col-reverse gap-1">
          <dt className="text-xs leading-snug font-medium text-white/72">{label}</dt>
          <dd
            key={value}
            className="npf-ops-count font-mono text-[1.625rem] leading-none font-medium tracking-[-0.03em] tabular-nums sm:text-[1.875rem]"
            style={{ color: tone }}
          >
            {value}
            {of !== undefined ? (
              <span className="text-base text-white/60">/{of}</span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
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
      className={`group flex h-10 min-w-50 flex-1 items-center gap-2.5 rounded-(--ops-control-radius) bg-white ps-3 pe-2 shadow-[var(--ops-control-lift)] ring-inset transition-[box-shadow] duration-150 sm:max-w-90 ${
        dead
          ? "ring-2 ring-npf-alert/70"
          : "ring-1 ring-npf-line hover:ring-npf-steel/55 focus-within:ring-2 focus-within:ring-npf-blue-mid"
      }`}
    >
      <SearchIcon
        aria-hidden
        className={`size-4 shrink-0 transition-colors ${dead ? "text-ops-p1" : "text-npf-steel"}`}
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
        className="npf-ops-search h-full w-full min-w-0 bg-transparent text-sm text-npf-ink outline-none placeholder:text-npf-steel focus-visible:outline-none"
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
            className="grid size-4 place-items-center rounded-full bg-npf-steel/70 text-white transition-colors group-hover/clear:bg-npf-ink"
          >
            <CloseIcon className="size-2.5" />
          </span>
          <span className="sr-only">{t("Clear search")}</span>
        </button>
      ) : (
        <kbd
          aria-hidden
          className="hidden h-5 min-w-5 shrink-0 place-items-center rounded-[4px] bg-white px-1 font-mono text-2xs font-medium text-ops-dim ring-1 ring-npf-line ring-inset sm:grid"
        >
          /
        </kbd>
      )}
    </div>
  );
}

/** The shared look of a `select` sitting in a filter bar. */
export const OPS_SELECT =
  "npf-ops-select h-10 ps-3 text-sm font-medium text-npf-ink outline-none";

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
        className="grid h-5 min-w-7 place-items-center rounded-[4px] px-1.5 font-mono text-2xs font-semibold tabular-nums"
        /* P1 is the one grade set solid: an immediate call should be found
           before it is read. The others are tinted in their own hue. */
        style={
          priority === "P1"
            ? { color: "#fff", background: token }
            : {
                color: token,
                background: `color-mix(in srgb, ${token} 12%, transparent)`,
                boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${token} 28%, transparent)`,
              }
        }
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
  Closed: "bg-ops-fill text-ops-dim",
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
  Unavailable: "bg-ops-fill text-ops-dim",
};

/**
 * A unit's state in the words the rest of the console already uses: the
 * call a unit is assigned to reads "En route", so the unit does too, and
 * "Off the air" is what the Units board's own buttons and legend say.
 * "Assigned" and "Unavailable" were the store's words leaking onto the glass,
 * and "On Scene" in title case sat one screen away from "On scene".
 */
const UNIT_LABEL: Record<UnitStatus, string> = {
  Available: "Available",
  Assigned: "En route",
  "On Scene": "On scene",
  Unavailable: "Off the air",
};

export function UnitStatusTag({ status }: { status: UnitStatus }) {
  const t = useT();
  return (
    <span className={`npf-pill ${UNIT_TONE[status]}`}>
      <span aria-hidden className="npf-pill-dot" />
      {t(UNIT_LABEL[status])}
    </span>
  );
}

/** Buttons in the console: the site's pill shape, filled. */
export function OpsButton({
  tone = "quiet",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** `ghost` is for the routine control repeated down a list, so the row
   *  that needs a decision is the one that carries a filled button. */
  tone?: "brand" | "quiet" | "ghost" | "danger";
}) {
  const tones = {
    brand:
      "bg-ops-brand text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_1px_2px_rgb(10_21_38/0.25)] hover:bg-ops-brand-lift disabled:bg-npf-cloud disabled:text-ops-dim disabled:shadow-[var(--ops-control-rim)]",
    quiet:
      "bg-white text-ops-text shadow-[var(--ops-control-rim),var(--ops-control-lift)] hover:bg-ops-hover hover:shadow-[var(--ops-control-rim-hover),var(--ops-control-lift)] disabled:opacity-40",
    ghost:
      "text-ops-dim ring-1 ring-ops-line-soft ring-inset hover:bg-ops-hover hover:text-ops-text hover:ring-ops-line disabled:opacity-40",
    danger:
      "bg-white text-ops-p1 ring-1 ring-[color-mix(in_srgb,var(--ops-p1)_35%,transparent)] ring-inset hover:bg-npf-error-wash disabled:opacity-40",
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
      className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-(--ops-control-radius) px-3.5 text-sm font-medium whitespace-nowrap transition-[background-color,border-color,box-shadow,scale] enabled:active:scale-[0.97] active:duration-(--dur-press) disabled:cursor-not-allowed ${tones[tone]} ${className}`}
    />
  );
}

/**
 * Runs a board change through a view transition where the browser has one,
 * so a call or a unit that changes lane travels there instead of blinking
 * out of one list and into another.
 */
export function withTransition(change: () => void) {
  if ("startViewTransition" in document)
    document.startViewTransition(() => flushSync(change));
  else change();
}

/* -------------------------------------------------------------------------
 * Who is closest
 * ---------------------------------------------------------------------- */

/**
 * The free units that can attend a call, nearest first, with the distance.
 * Only the call's own command's units: a Lagos car cannot attend in Kano. A
 * unit with no position sorts last rather than being hidden.
 *
 * Straight-line kilometres, not drive time. A live CAD would rank by road
 * time from the units' GPS; this is the same ordering with less data.
 */
export function nearestFree(incident: Incident, units: Unit[]) {
  const at = pinOf(incident.where);
  return units
    .filter(
      (u) =>
        u.state === incident.where.state &&
        u.status === "Available" &&
        !u.emergency,
    )
    .map((u) => ({ unit: u, km: u.geo ? distanceKm(at, u.geo) : null }))
    .sort((a, b) => (a.km ?? 1e9) - (b.km ?? 1e9));
}

/** "1.2 km", "14 km": rounded the way a dispatcher says it. */
export const kmLabel = (km: number | null) =>
  km === null ? "" : km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;

/**
 * Earlier calls at the same place: the premise history a dispatcher reads
 * before sending anyone. Same LGA and within 300 m when both have a pin, or
 * the same street line when they do not.
 */
export function historyAt(incident: Incident, all: Incident[]) {
  const here = incident.where.geo;
  return all.filter((i) => {
    if (i.id === incident.id || i.where.lga !== incident.where.lga) return false;
    if (here && i.where.geo) return distanceKm(here, i.where.geo) < 0.3;
    return i.area.trim().toLowerCase() === incident.area.trim().toLowerCase();
  });
}

/* -------------------------------------------------------------------------
 * Forms on the boards
 * ---------------------------------------------------------------------- */

/** A text box or text area in a console form. */
export const OPS_INPUT =
  "w-full px-3 py-2 text-sm rounded-(--ops-control-radius) bg-white text-npf-ink shadow-[var(--ops-control-lift)] ring-1 ring-npf-line ring-inset outline-none placeholder:text-npf-steel transition-[box-shadow] hover:ring-npf-steel/55 focus:ring-2 focus:ring-npf-blue-mid";

/** A select in a console form, the same box as the text fields. */
export const OPS_FORM_SELECT = `npf-ops-select ${OPS_INPUT}`;

/** A labelled field in a console form. */
export function OpsField({
  id,
  label,
  children,
  className = "",
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-ops-dim">
        {label}
      </label>
      {children}
    </div>
  );
}

/**
 * A titled section inside a record's panel: People, Statements, Exhibits.
 * A hairline above, the title and its count, the rows, and the way to add.
 */
export function OpsSection({
  title,
  count,
  action,
  children,
}: {
  title: string;
  count?: number;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5 border-t border-ops-line-soft pt-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-xs font-semibold text-ops-dim">
          {title}
          {count ? (
            <span className="rounded-[4px] bg-npf-cloud px-1.5 font-mono text-2xs text-npf-blue-ink tabular-nums">
              {count}
            </span>
          ) : null}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}

/** A log of who did what, newest first, as every record in the console keeps it. */
export function OpsLog({
  lines,
  render,
  time,
}: {
  lines: { at: string; text: string; vars?: Record<string, string>; by?: string }[];
  render: (line: { text: string; vars?: Record<string, string> }) => React.ReactNode;
  time: (at: string) => string;
}) {
  const t = useT();
  return (
    <ol className="space-y-2.5 text-xs">
      {lines
        .slice()
        .reverse()
        .map((entry, i) => (
          <li key={entry.at + i} className="flex gap-3">
            <time dateTime={entry.at} className="w-10 shrink-0 font-mono text-ops-dim tabular-nums">
              {time(entry.at)}
            </time>
            <span className="min-w-0 leading-relaxed">
              {render(entry)}
              {entry.by ? (
                <span className="mt-0.5 block text-2xs text-ops-dim">{t(entry.by)}</span>
              ) : null}
            </span>
          </li>
        ))}
    </ol>
  );
}
