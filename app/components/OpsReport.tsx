"use client";

import { useState } from "react";
import { callOutcomes, dispatchTarget } from "../content-ops";
import { useT } from "../i18n/client";
import type { T } from "../i18n/translate";
import {
  OpsButton,
  OpsEmpty,
  OpsFigures,
  OpsHead,
  OpsPanel,
  PriorityTag,
  useNow,
  useScoped,
} from "./OpsPieces";
import { commandLabel, divisionLabel } from "./Where";
import type { Incident, Priority } from "./store";

/**
 * The shift report: what the desk handed over. How many calls came in and
 * when, how fast each grade got a unit against its target, what the calls
 * were and how they ended, and the same by command (or, on a command desk,
 * by division). Every figure is counted from the calls in the store, scoped
 * by the command picker and the range above the charts, so the report and
 * the boards never disagree.
 *
 * Printable: the console chrome drops away and the report goes to paper for
 * the relief that takes over.
 */

const HOUR = 3_600_000;
const GRADES: Priority[] = ["P1", "P2", "P3", "P4"];

const RANGES = [
  { id: "shift", label: "This shift" },
  { id: "12", label: "Last 12 hours" },
  { id: "24", label: "Last 24 hours" },
] as const;
type Range = (typeof RANGES)[number]["id"];

const watParts = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Africa/Lagos",
});
const watHour = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  hour12: false,
  timeZone: "Africa/Lagos",
});

/** When the relief on duty began: 06:00, 14:00 or 22:00 WAT. */
function shiftStart(now: number) {
  const [h, m] = watParts.format(new Date(now)).split(":").map(Number);
  const start = h >= 22 ? 22 : h >= 14 ? 14 : h >= 6 ? 6 : -2;
  return now - ((h - start) * 60 + m) * 60_000 - (now % 60_000);
}

const minutesBetween = (from: string, to: string) =>
  (new Date(to).getTime() - new Date(from).getTime()) / 60_000;

function median(xs: number[]) {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** "7 min": a span, never "07:00", which reads as a time of day. */
const mins = (t: T, m: number) => t("{n} min", { n: Math.round(m) });

const toDispatch = (i: Incident) =>
  i.dispatched ? minutesBetween(i.reported, i.dispatched) : null;

const onTarget = (i: Incident) => {
  const m = toDispatch(i);
  return m !== null && m <= dispatchTarget[i.priority];
};

export default function OpsReport() {
  const t = useT();
  const { incidents: all, viewing, session } = useScoped();
  const now = useNow();
  const [range, setRange] = useState<Range>("12");

  const from = !now
    ? 0
    : range === "shift"
      ? shiftStart(now)
      : now - Number(range) * HOUR;
  const calls = all.filter((i) => new Date(i.reported).getTime() >= from);
  const dispatched = calls.filter((i) => i.dispatched);
  const hit = dispatched.filter(onTarget).length;
  const closed = calls.filter((i) => i.status === "Closed");
  const mid = median(dispatched.map((i) => toDispatch(i)!));
  const scope = viewing ?? session?.command ?? null;

  return (
    <div className="space-y-6">
      <OpsHead
        title={t("Shift report")}
        lead={[
          t(RANGES.find((r) => r.id === range)!.label),
          scope ? commandLabel(t, scope) : t("All commands"),
        ].join(" · ")}
        action={
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <OpsFigures
              figures={[
                { label: t("Calls taken"), value: calls.length },
                {
                  label: t("Dispatched on target"),
                  value: hit,
                  of: dispatched.length,
                },
                {
                  label: t("Median to dispatch"),
                  value: mid === null ? "–" : mins(t, mid),
                },
                { label: t("Closed"), value: closed.length },
              ]}
            />
            <OpsButton
              tone="brand"
              onClick={() => window.print()}
              className="print:hidden"
            >
              {t("Print")}
            </OpsButton>
          </div>
        }
      />

      {/* One range for everything below it, so every figure agrees. */}
      <div
        role="radiogroup"
        aria-label={t("Report period")}
        className="flex flex-wrap gap-2 print:hidden"
      >
        {RANGES.map((r) => (
          <OpsButton
            key={r.id}
            role="radio"
            aria-checked={range === r.id}
            tone={range === r.id ? "brand" : "quiet"}
            onClick={() => setRange(r.id)}
          >
            {t(r.label)}
          </OpsButton>
        ))}
      </div>

      {calls.length === 0 ? (
        <OpsPanel>
          <OpsEmpty
            tone="none"
            title={t("No calls in this period")}
            hint={t(
              "Pick a longer period, or choose all commands in the bar above.",
            )}
          />
        </OpsPanel>
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <OpsPanel title={t("Calls by hour")} count={calls.length}>
              <ByHour calls={calls} from={from} now={now} />
            </OpsPanel>
            <OpsPanel
              title={t("How calls ended")}
              count={closed.length || undefined}
            >
              <Bars
                rows={callOutcomes
                  .map((o) => ({
                    key: o,
                    label: t(o),
                    n: closed.filter((i) => i.outcome === o).length,
                  }))
                  .filter((r) => r.n)}
                note={
                  calls.length - closed.length
                    ? t("{n} still open", { n: calls.length - closed.length })
                    : undefined
                }
              />
            </OpsPanel>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <OpsPanel title={t("Time to dispatch, by grade")}>
              <ToDispatch calls={calls} />
            </OpsPanel>
            <OpsPanel title={t("Calls by type")}>
              <Bars rows={byType(t, calls)} />
            </OpsPanel>
          </div>

          <OpsPanel
            title={scope ? t("By division") : t("By command")}
            flush
          >
            <ByPlace t={t} calls={calls} division={Boolean(scope)} />
          </OpsPanel>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

/** Nine commonest types, the rest folded into one "Other" row. */
function byType(t: T, calls: Incident[]) {
  const counts = new Map<string, number>();
  for (const i of calls) counts.set(i.kind, (counts.get(i.kind) ?? 0) + 1);
  const rows = [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([k, n]) => ({ key: k, label: t(k), n }));
  if (rows.length <= 10) return rows;
  const other = rows.slice(9).reduce((s, r) => s + r.n, 0);
  return [...rows.slice(0, 9), { key: "other", label: t("Other"), n: other }];
}

/**
 * Horizontal bars, one series: the label over the bar, the value at its tip.
 * Labels and values are text, so the list is its own table view.
 */
function Bars({
  rows,
  note,
}: {
  rows: { key: string; label: string; n: number }[];
  note?: string;
}) {
  const t = useT();
  const max = Math.max(1, ...rows.map((r) => r.n));
  if (!rows.length)
    return <p className="text-sm text-ops-dim">{t("Nothing closed yet.")}</p>;
  return (
    <>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.key}>
            <p className="mb-1 flex justify-between gap-3 text-xs">
              <span className="min-w-0 truncate text-ops-text">{r.label}</span>
              <span className="font-semibold tabular-nums">{r.n}</span>
            </p>
            <span aria-hidden className="block h-2.5 rounded-e-[4px] bg-ops-fill">
              <span
                className="block h-full rounded-e-[4px] bg-ops-accent"
                style={{ width: `${(r.n / max) * 100}%` }}
              />
            </span>
          </li>
        ))}
      </ul>
      {note ? <p className="mt-4 text-xs text-ops-dim">{note}</p> : null}
    </>
  );
}

/** The tooltip a mark shows on hover and keyboard focus. Value first. */
function Tip({ value, label }: { value: string; label: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 translate-y-1 rounded-lg bg-npf-ink px-2.5 py-1.5 text-xs whitespace-nowrap text-white opacity-0 shadow-lg transition-[opacity,translate] duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
    >
      <strong className="font-semibold">{value}</strong>
      <span className="ms-1.5 text-white/70">{label}</span>
    </span>
  );
}

/** A collapsed table under a chart: the same numbers without the picture. */
function TableView({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: (string | number)[][];
}) {
  const t = useT();
  return (
    <details className="group/tv mt-4 text-xs print:hidden">
      <summary className="w-fit cursor-pointer rounded-sm font-medium text-ops-accent underline-offset-4 hover:underline">
        {t("Show as a table")}
      </summary>
      <table className="mt-3 w-full text-start">
        <caption className="sr-only">{caption}</caption>
        <thead className="text-ops-dim">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="py-1.5 pe-4 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-ops-line-soft">
              {r.map((c, j) => (
                <td key={j} className="py-1.5 pe-4">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

/**
 * Calls received in each hour of the period, WAT. One series, so no legend:
 * the panel title names it. Only the busiest hour carries its number; the
 * gridlines and the tooltips carry the rest.
 */
function ByHour({
  calls,
  from,
  now,
}: {
  calls: Incident[];
  from: number;
  now: number;
}) {
  const t = useT();
  const first = Math.floor(from / HOUR) * HOUR;
  const hours: { at: number; n: number }[] = [];
  for (let at = first; at <= now; at += HOUR) hours.push({ at, n: 0 });
  for (const i of calls) {
    const k = Math.floor((new Date(i.reported).getTime() - first) / HOUR);
    if (hours[k]) hours[k].n++;
  }
  const peak = Math.max(1, ...hours.map((h) => h.n));
  // Clean ticks: a whole-number step that gives at most four lines.
  const step = Math.max(1, Math.ceil(peak / 4));
  const top = Math.ceil(peak / step) * step;
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step);
  const label = (at: number) => `${watHour.format(new Date(at))}:00`;
  const every = hours.length > 12 ? 3 : hours.length > 6 ? 2 : 1;
  const peakAt = hours.findIndex((h) => h.n === peak);

  return (
    <div>
      <div className="flex gap-2">
        {/* y ticks */}
        <div
          aria-hidden
          className="relative h-48 w-5 shrink-0 text-end text-2xs text-ops-dim tabular-nums"
        >
          {ticks.map((v) => (
            <span
              key={v}
              className="absolute end-0 translate-y-1/2"
              style={{ bottom: `${(v / top) * 100}%` }}
            >
              {v}
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="relative h-48">
            {ticks.map((v) => (
              <span
                key={v}
                aria-hidden
                className="absolute inset-x-0 h-px bg-ops-line-soft"
                style={{ bottom: `${(v / top) * 100}%` }}
              />
            ))}
            <div className="absolute inset-0 flex items-end gap-0.5">
              {hours.map((h, i) => (
                <div
                  key={h.at}
                  tabIndex={0}
                  role="img"
                  aria-label={t("{time}: {n} calls", {
                    time: label(h.at),
                    n: h.n,
                  })}
                  className="group relative flex h-full flex-1 flex-col items-center justify-end rounded-sm outline-offset-2"
                >
                  {i === peakAt && h.n ? (
                    <span
                      aria-hidden
                      className="mb-1 text-2xs font-semibold text-ops-text tabular-nums"
                    >
                      {h.n}
                    </span>
                  ) : null}
                  <span
                    aria-hidden
                    className="block w-full max-w-6 rounded-t-[4px] bg-ops-accent transition-[filter] group-hover:brightness-125"
                    style={{ height: `${(h.n / top) * 100}%` }}
                  />
                  <Tip
                    value={t(h.n === 1 ? "{n} call" : "{n} calls", { n: h.n })}
                    label={`${label(h.at)}–${label(h.at + HOUR)}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            aria-hidden
            className="mt-2 flex gap-0.5 text-2xs text-ops-dim tabular-nums"
          >
            {hours.map((h, i) => (
              <span key={h.at} className="flex-1 text-center">
                {i % every === 0 ? watHour.format(new Date(h.at)) : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-1 text-end text-2xs text-ops-dim">{t("Hour, WAT")}</p>
      <TableView
        caption={t("Calls by hour")}
        head={[t("Hour, WAT"), t("Calls")]}
        rows={hours.map((h) => [
          `${label(h.at)}–${label(h.at + HOUR)}`,
          h.n,
        ])}
      />
    </div>
  );
}

/**
 * Every dispatched call as a dot on its grade's row, at the minutes it took
 * to get a unit, against that grade's target line. Each row has its own
 * scale (five minutes and two hours on one axis would crush P1 into a
 * corner), so these are four small charts sharing a layout.
 *
 * On target is a Force-blue circle, late a red diamond: shape carries it as
 * well as colour, and the count on the right says it in words.
 */
function ToDispatch({ calls }: { calls: Incident[] }) {
  const t = useT();
  const rows = GRADES.map((g) => {
    const target = dispatchTarget[g];
    const done = calls.filter((i) => i.priority === g && i.dispatched);
    const waiting = calls.filter(
      (i) => i.priority === g && !i.dispatched,
    ).length;
    const max = Math.max(target * 1.5, ...done.map((i) => toDispatch(i)! * 1.1));
    return { g, target, done, waiting, max };
  });

  return (
    <div>
      <ul className="space-y-1">
        {rows.map(({ g, target, done, waiting, max }) => {
          const hit = done.filter(onTarget).length;
          return (
            <li
              key={g}
              className="grid grid-cols-[3rem_minmax(0,1fr)_7.5rem] items-center gap-3 border-b border-ops-line-soft py-3 last:border-0"
            >
              <PriorityTag priority={g} />
              <div className="relative h-12">
                {/* axis */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-[calc(50%-0.5rem)] h-px bg-ops-line"
                />
                {/* target */}
                <span
                  aria-hidden
                  className="absolute top-0 bottom-4 w-px bg-ops-text"
                  style={{ left: `${(target / max) * 100}%` }}
                />
                <span
                  aria-hidden
                  className="absolute bottom-0 -translate-x-1/2 text-2xs leading-none whitespace-nowrap text-ops-dim tabular-nums"
                  style={{ left: `${(target / max) * 100}%` }}
                >
                  {t("{n}m target", { n: target })}
                </span>
                {done.map((i) => {
                  const m = toDispatch(i)!;
                  const ok = m <= target;
                  const text = t(ok ? "{time} to dispatch, on target" : "{time} to dispatch, late", {
                    time: mins(t, m),
                  });
                  return (
                    <span
                      key={i.id}
                      tabIndex={0}
                      role="img"
                      aria-label={`${i.id}, ${t(i.kind)}: ${text}`}
                      className="group absolute top-[calc(50%-0.5rem)] grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-offset-1"
                      style={{ left: `${(m / max) * 100}%` }}
                    >
                      <span
                        aria-hidden
                        className={`block size-3 ring-2 ring-white transition-transform group-hover:scale-125 ${
                          ok ? "rounded-full" : "rotate-45 rounded-[2px]"
                        }`}
                        style={{
                          background: ok ? "var(--ops-accent)" : "var(--ops-p1)",
                        }}
                      />
                      <Tip value={mins(t, m)} label={`${i.id} · ${t(i.kind)}`} />
                    </span>
                  );
                })}
              </div>
              <p className="text-end text-xs leading-snug">
                {done.length ? (
                  <span className="font-semibold tabular-nums">
                    {t("{hit} of {n} on target", { hit, n: done.length })}
                  </span>
                ) : (
                  <span className="text-ops-dim">{t("None dispatched")}</span>
                )}
                {waiting ? (
                  <span className="block text-ops-dim">
                    {t("{n} waiting", { n: waiting })}
                  </span>
                ) : null}
              </p>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ops-dim">
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-full bg-ops-accent" />
          {t("On target")}
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-2.5 rotate-45 rounded-[2px] bg-ops-p1"
          />
          {t("Late")}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-3 w-px bg-ops-text" />
          {t("Dispatch target for the grade")}
        </span>
      </p>

      <TableView
        caption={t("Time to dispatch, by grade")}
        head={[t("Ref"), t("Grade"), t("Type"), t("To dispatch"), t("Target")]}
        rows={rows.flatMap(({ g, target, done }) =>
          done.map((i) => [
            i.id,
            g,
            t(i.kind),
            mins(t, toDispatch(i)!),
            t("{n}m target", { n: target }),
          ]),
        )}
      />
    </div>
  );
}

/** The same figures, one row per command (or per division on a command desk). */
function ByPlace({
  t,
  calls,
  division,
}: {
  t: T;
  calls: Incident[];
  division: boolean;
}) {
  const groups = new Map<string, Incident[]>();
  for (const i of calls) {
    const k = division ? i.where.lga : i.where.state;
    groups.set(k, [...(groups.get(k) ?? []), i]);
  }
  const rows = [...groups].sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]),
  );
  const cell = "py-3 pe-5 text-end tabular-nums";
  return (
    <table className="w-full text-start text-sm">
      <caption className="sr-only">
        {division ? t("By division") : t("By command")}
      </caption>
      <thead className="npf-ops-thead text-xs text-ops-dim">
        <tr className="whitespace-nowrap">
          <th scope="col" className="py-3 pe-4 ps-5 font-medium">
            {division ? t("Division") : t("Command")}
          </th>
          <th scope="col" className={`${cell} font-medium`}>
            {t("Calls")}
          </th>
          <th scope="col" className={`${cell} font-medium`}>
            {t("Open")}
          </th>
          <th scope="col" className={`${cell} font-medium max-sm:hidden`}>
            {t("Arrests")}
          </th>
          <th scope="col" className={`${cell} font-medium`}>
            {t("On target")}
          </th>
          <th scope="col" className={`${cell} font-medium max-sm:hidden`}>
            {t("Median to dispatch")}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([k, list]) => {
          const sent = list.filter((i) => i.dispatched);
          const hit = sent.filter(onTarget).length;
          const late = sent.length - hit;
          const mid = median(sent.map((i) => toDispatch(i)!));
          return (
            <tr key={k} className="border-t border-ops-line-soft">
              <th scope="row" className="py-3 pe-4 ps-5 text-start font-medium">
                {division ? divisionLabel(t, k) : commandLabel(t, k)}
              </th>
              <td className={cell}>{list.length}</td>
              <td className={cell}>
                {list.filter((i) => i.status !== "Closed").length}
              </td>
              <td className={`${cell} max-sm:hidden`}>
                {list.filter((i) => i.outcome === "Arrest made").length}
              </td>
              <td className={cell}>
                {sent.length ? `${hit}/${sent.length}` : "–"}
                {late ? (
                  <span className="ms-1.5 font-medium text-ops-p1">
                    {t("{n} late", { n: late })}
                  </span>
                ) : null}
              </td>
              <td className={`${cell} max-sm:hidden`}>
                {mid === null ? "–" : mins(t, mid)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
