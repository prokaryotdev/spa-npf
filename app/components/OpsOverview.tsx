"use client";

import { postOf, zonalCommand } from "../content-records";
import { custodyLimit } from "./store";

import Link from "../i18n/Link";
import { useState } from "react";
import { dispatchTarget } from "../content-ops";
import { zones } from "../content-footer";
import {
  Elapsed,
  OpsEmpty,
  OpsFigures,
  OpsHead,
  OpsPanel,
  OpsStatus,
  PriorityTag,
  TargetBar,
  targetTone,
  duration,
  isOverdue,
  useNow,
  useScoped,
  withTransition,
} from "./OpsPieces";
import {
  setViewing,
  updateIncident,
  useStore,
  type Incident,
  type Unit,
} from "./store";
import { STATES, placeOf } from "../geo";
import { ArrowRight, CheckIcon, ChevronDown, CloseIcon, RadioIcon } from "./icons";
import OpsPicker from "./OpsPicker";
import { useFormat, useT } from "../i18n/client";

/**
 * The command board.
 *
 * It opens on the work: pending calls with their dispatch control, then the
 * calls already running. Beside them, the Force by zone: every busy command
 * as a tile carrying its waiting and running numbers. A national desk sees
 * which tiles are red and picks one; the queues narrow to that command. A
 * command desk gets the same mosaic one level down, by division. Under the
 * mosaic, the units by section.
 */
export default function OpsOverview() {
  const t = useT();
  const { incidents: inView, units, session, viewing, zone } = useScoped();
  const now = useNow();
  const format = useFormat();
  const fixed = session?.command;
  // A command desk narrows by division; units carry no division, so the
  // narrowing applies to calls only.
  const [division, setDivision] = useState<string | null>(null);
  const incidents = division
    ? inView.filter((i) => i.where.division === division)
    : inView;

  const pending = incidents
    .filter((i) => i.status === "New")
    .sort(
      (a, b) =>
        a.priority.localeCompare(b.priority) ||
        a.reported.localeCompare(b.reported),
    );
  const running = incidents.filter(
    (i) => i.status === "Dispatched" || i.status === "On Scene",
  );
  const overdue = pending.filter((i) => isOverdue(i, now));
  const free = units.filter((u) => u.status === "Available");

  return (
    <div className="space-y-6">
      <OpsHead
        title={t("Command board")}
        lead={[
          now ? format.date(new Date(now).toISOString().slice(0, 10)) : null,
          viewing ?? session?.command ?? (zone ? t(zone.name) : t("All commands")),
        ]
          .filter(Boolean)
          .join(" · ")}
        action={
          <OpsFigures
            figures={[
              { label: t("Waiting"), value: pending.length },
              {
                label: t("Late"),
                value: overdue.length,
                tone: overdue.length ? "var(--ops-p1)" : "var(--ops-dim)",
              },
              { label: t("Running"), value: running.length },
              {
                label: t("Units free"),
                value: free.length,
                of: units.length,
                tone: "var(--ops-ok)",
              },
            ]}
          />
        }
      />

      <Attention />

      {/* The queue leads, straight under the band: a call nobody has taken
          is the one thing on this board that gets worse by itself. Where it
          is (the mosaic) and who can go (units) stand beside it on a desk
          and follow it on a phone. */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
        <div className="@container min-w-0 space-y-4">
          <OpsPanel
            title={t("Pending")}
            count={
              pending.length
                ? t("{n} waiting", { n: pending.length })
                : undefined
            }
            action={
              overdue.length ? (
                <span className="npf-pill bg-ops-p1-wash text-ops-p1">
                  <span aria-hidden className="npf-pill-dot" />
                  {t("{n} late", { n: overdue.length })}
                </span>
              ) : undefined
            }
            flush
          >
            {pending.length ? (
              <>
                <QueueHead
                  cols={PENDING_COLS}
                  labels={["", t("Call"), t("Waiting"), t("Dispatch")]}
                  end={[2]}
                />
                <ul>
                  {pending.map((incident) => (
                    <PendingCall
                      key={incident.id}
                      incident={incident}
                      units={units}
                      now={now}
                    />
                  ))}
                </ul>
              </>
            ) : (
              <OpsEmpty
                title={t("Queue clear")}
                hint={t(
                  "Every call that came in has a unit on it. A new one lands here the second the desk takes it.",
                )}
              />
            )}
          </OpsPanel>

          <OpsPanel
            title={t("Running")}
            count={
              running.length
                ? t("{n} committed", { n: running.length })
                : undefined
            }
            action={<More href="/app/police/incidents">{t("All calls")}</More>}
            flush
          >
            {running.length ? (
              <>
                <QueueHead
                  cols={RUNNING_COLS}
                  labels={["", t("Call"), t("Status"), t("Unit"), t("Elapsed")]}
                  end={[4]}
                />
                <ul>
                  {running.map((incident) => (
                    <RunningCall key={incident.id} incident={incident} />
                  ))}
                </ul>
              </>
            ) : (
              <OpsEmpty
                tone="idle"
                icon={<RadioIcon className="size-5" />}
                title={t("Nobody is committed")}
                hint={t(
                  "No unit is on a call right now. Dispatch one from the pending queue above.",
                )}
              />
            )}
          </OpsPanel>
        </div>

        <div className="min-w-0 space-y-4">
          {fixed ? (
            <DivisionMosaic
              incidents={inView}
              now={now}
              chosen={division}
              onChoose={(d) => withTransition(() => setDivision(d))}
            />
          ) : (
            <CommandMosaic now={now} chosen={viewing} />
          )}
          <UnitBoard units={units} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

type Tally = {
  waiting: number;
  late: number;
  running: number;
  free?: number;
  units?: number;
};

/** What a set of calls (and, for a command, its units) adds up to. */
function tally(calls: Incident[], now: number, units?: Unit[]): Tally {
  const pending = calls.filter((i) => i.status === "New");
  return {
    waiting: pending.length,
    late: pending.filter((i) => isOverdue(i, now)).length,
    running: calls.filter(
      (i) => i.status === "Dispatched" || i.status === "On Scene",
    ).length,
    free: units?.filter((u) => u.status === "Available").length,
    units: units?.length,
  };
}

const busy = (s: Tally) => !!(s.waiting || s.running);
/** Worst first: late, then waiting, then running. */
const worse = (a: Tally, b: Tally) =>
  b.late - a.late || b.waiting - a.waiting || b.running - a.running;

function sumOf(tallies: Tally[]): Tally {
  return tallies.reduce<Tally>(
    (a, s) => ({
      waiting: a.waiting + s.waiting,
      late: a.late + s.late,
      running: a.running + s.running,
      free: (a.free ?? 0) + (s.free ?? 0),
      units: (a.units ?? 0) + (s.units ?? 0),
    }),
    { waiting: 0, late: 0, running: 0, free: 0, units: 0 },
  );
}

/**
 * The national board: all 37 commands in their six zones, as a desk table.
 * It reads the whole store, not the command in view, because it is the
 * control that chooses the command in view; picking a row is the same act
 * as picking a command in the bar above, and picking it again hands back
 * the whole Force.
 *
 * Zones stand worst first, and inside a zone its busy commands do too, so
 * the top of the table is where the work is. Quiet commands step off until
 * asked for: thirty quiet names around the seven that matter is the board
 * hiding its own answer.
 */
function CommandMosaic({ now, chosen }: { now: number; chosen: string | null }) {
  const t = useT();
  const { incidents, units, session } = useStore();
  const [all, setAll] = useState(false);
  // A zonal desk sees its own State Commands, not the country's.
  const zone = zonalCommand(session?.zone);
  const choose = (name: string | undefined) =>
    withTransition(() => setViewing(name));

  const inZone = zone?.states;
  const groups = zones
    .map((zone, order) => {
      const rows = STATES.filter(
        (s) => s.zone === zone && (!inZone || inZone.includes(s.name)),
      ).map((s) => ({
        key: s.name,
        name: s.name,
        tally: tally(
          incidents.filter((i) => i.where.state === s.name),
          now,
          units.filter((u) => u.state === s.name),
        ),
      }));
      return {
        key: zone,
        name: t(zone),
        order,
        sum: sumOf(rows.map((r) => r.tally)),
        rows: rows
          .filter((r) => all || busy(r.tally) || r.key === chosen)
          .sort((a, b) => worse(a.tally, b.tally) || a.name.localeCompare(b.name)),
      };
    })
    .filter((g) => g.sum.units || g.rows.length || !inZone)
    .sort((a, b) => worse(a.sum, b.sum) || a.order - b.order);

  return (
    <OpsPanel
      title={t("Commands")}
      flush
      action={
        chosen ? (
          <ClearChoice onClick={() => choose(undefined)}>
            {t("All commands")}
          </ClearChoice>
        ) : undefined
      }
    >
      <SituationTable
        head={t("Command")}
        groups={groups}
        chosen={chosen}
        onChoose={(name) => choose(chosen === name ? undefined : name)}
        withUnits
      />
      <div className="border-t border-ops-line-soft px-5 py-1">
        <button
          type="button"
          aria-expanded={all}
          onClick={() => setAll(!all)}
          className="npf-small inline-flex min-h-11 items-center gap-1.5 font-medium text-npf-blue underline-offset-4 hover:text-npf-blue-deep hover:underline"
        >
          {all
            ? t("Busy commands only")
            : t("Show all {n} commands", { n: inZone?.length ?? STATES.length })}
          <ChevronDown aria-hidden className="npf-ops-chev size-4" />
        </button>
      </div>
    </OpsPanel>
  );
}

/**
 * A command desk's board: its divisions with a call open, busiest first.
 * A command has dozens of divisions and most are quiet at any hour, so the
 * quiet ones stay off the board rather than burying the three that matter.
 * Units carry no division, so there is no units column here.
 */
function DivisionMosaic({
  incidents,
  now,
  chosen,
  onChoose,
}: {
  incidents: Incident[];
  now: number;
  chosen: string | null;
  onChoose: (division: string | null) => void;
}) {
  const t = useT();
  const open = incidents.filter((i) => i.status !== "Closed");
  const rows = [...new Set(open.map((i) => i.where.division))]
    .map((d) => ({
      key: d,
      name: t(d),
      tally: tally(
        open.filter((i) => i.where.division === d),
        now,
      ),
    }))
    .sort((a, b) => worse(a.tally, b.tally) || a.name.localeCompare(b.name));

  if (!rows.length) return null;
  return (
    <OpsPanel
      title={t("Divisions")}
      flush
      action={
        chosen ? (
          <ClearChoice onClick={() => onChoose(null)}>
            {t("All divisions")}
          </ClearChoice>
        ) : undefined
      }
    >
      <SituationTable
        head={t("Division")}
        groups={[{ key: "all", rows }]}
        chosen={chosen}
        onChoose={(name) => onChoose(chosen === name ? null : name)}
      />
    </OpsPanel>
  );
}

type SituationRow = { key: string; name: string; tally: Tally };
type SituationGroup = {
  key: string;
  name?: string;
  sum?: Tally;
  rows: SituationRow[];
};

/**
 * The situation as a desk table: one ruled head, then a band per zone with
 * the zone's own totals in the same columns, then its commands. Every figure
 * stands in a fixed column, so the eye runs straight down "waiting" without
 * reading a single name. A zone with nothing on says so in a green tag
 * where its figures would be.
 */
function SituationTable({
  head,
  groups,
  chosen,
  onChoose,
  withUnits,
}: {
  head: string;
  groups: SituationGroup[];
  chosen: string | null;
  onChoose: (key: string) => void;
  withUnits?: boolean;
}) {
  const t = useT();
  return (
    <table className="w-full table-fixed text-sm">
      <colgroup>
        <col />
        <col className="w-15 sm:w-17" />
        <col className="w-15 sm:w-17" />
        {withUnits ? <col className="w-20 sm:w-24" /> : null}
      </colgroup>
      <thead>
        <tr className="border-b border-ops-line bg-[color-mix(in_srgb,var(--color-npf-cloud)_70%,white)] text-xs font-semibold text-npf-steel">
          <th scope="col" className="py-2 ps-5">
            {head}
          </th>
          <th scope="col" className="py-2 text-center">
            {t("Waiting")}
          </th>
          <th scope="col" className="py-2 text-center">
            {t("Running")}
          </th>
          {withUnits ? (
            <th scope="col" className="py-2 pe-5 text-end">
              {t("Units free")}
            </th>
          ) : null}
        </tr>
      </thead>
      {groups.map((g) => (
        <tbody key={g.key} className="border-b border-ops-line-soft last:border-0">
          {g.name && g.sum ? (
            <ZoneRow name={g.name} sum={g.sum} withUnits={withUnits} />
          ) : null}
          {g.rows.map((r) => (
            <CommandRow
              key={r.key}
              row={r}
              chosen={chosen === r.key}
              onChoose={() => onChoose(r.key)}
              withUnits={withUnits}
              indent={!!g.name}
            />
          ))}
        </tbody>
      ))}
    </table>
  );
}

/** A zone's band: its name, its late tag, and its totals in the columns. */
function ZoneRow({
  name,
  sum,
  withUnits,
}: {
  name: string;
  sum: Tally;
  withUnits?: boolean;
}) {
  const t = useT();
  const quiet = !busy(sum);
  return (
    <tr className="bg-[color-mix(in_srgb,var(--color-npf-cloud)_55%,white)]">
      <th scope="rowgroup" className="py-2 ps-5 text-start font-normal">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={`font-secondary text-[0.8125rem] leading-tight font-bold ${
              quiet ? "text-npf-steel" : "text-npf-ink"
            }`}
          >
            {name}
          </span>
          {sum.late ? (
            <span className="npf-pill bg-ops-p1-wash !py-0.5 text-ops-p1">
              <span aria-hidden className="npf-pill-dot" />
              {t("{n} late", { n: sum.late })}
            </span>
          ) : null}
        </span>
      </th>
      {quiet ? (
        <td colSpan={2} className="py-2 text-center">
          <span className="npf-pill bg-ops-ok-wash !py-0.5 text-ops-ok">
            <CheckIcon aria-hidden className="size-3" />
            {t("Queue clear")}
          </span>
        </td>
      ) : (
        <>
          <td className="py-2 text-center">
            <Total n={sum.waiting} />
          </td>
          <td className="py-2 text-center">
            <Total n={sum.running} />
          </td>
        </>
      )}
      {withUnits ? (
        <td className="py-2 pe-5 text-end">
          <Free free={sum.free ?? 0} of={sum.units ?? 0} />
        </td>
      ) : null}
    </tr>
  );
}

/** A zone total: plain ink figures, so the zone band never outshouts its rows. */
function Total({ n }: { n: number }) {
  return n ? (
    <span className="font-mono text-[0.8125rem] font-semibold text-npf-ink tabular-nums">
      {n}
    </span>
  ) : (
    <Nil />
  );
}

/** A column with nothing in it: a dash, read aloud as zero. */
function Nil({ className = "text-npf-steel" }: { className?: string }) {
  return (
    <>
      <span aria-hidden className={className}>
        –
      </span>
      <span className="sr-only">0</span>
    </>
  );
}

/**
 * One command or division. The whole row is the button (its name cell's
 * button stretches over the row), so the officer clicks anywhere along it.
 * The dot before the name is the row's state in one mark: red late, amber
 * waiting, blue running; the figures in the columns carry the same news in
 * numbers, so colour is never alone.
 */
function CommandRow({
  row: { name, tally: s },
  chosen,
  onChoose,
  withUnits,
  indent,
}: {
  row: SituationRow;
  chosen: boolean;
  onChoose: () => void;
  withUnits?: boolean;
  indent?: boolean;
}) {
  const t = useT();
  const label =
    s.units !== undefined
      ? t("{name}: {w} waiting, {l} late, {r} running, {f} of {u} units free", {
          name,
          w: s.waiting,
          l: s.late,
          r: s.running,
          f: s.free ?? 0,
          u: s.units,
        })
      : t("{name}: {w} waiting, {l} late, {r} running", {
          name,
          w: s.waiting,
          l: s.late,
          r: s.running,
        });
  const dot = chosen
    ? "bg-white"
    : s.late
      ? "bg-ops-p1"
      : s.waiting
        ? "bg-ops-p2"
        : s.running
          ? "bg-npf-blue-mid"
          : "ring-1 ring-npf-line ring-inset";

  return (
    <tr
      className={`relative border-t border-ops-line-soft transition-colors duration-(--dur-hover) ${
        chosen
          ? "bg-ops-brand text-white"
          : s.late
            ? "bg-[color-mix(in_srgb,var(--ops-p1)_4%,white)] hover:bg-[color-mix(in_srgb,var(--ops-p1)_8%,white)]"
            : "hover:bg-ops-hover"
      }`}
    >
      <th scope="row" className={`p-0 text-start font-normal ${indent ? "ps-7" : "ps-5"}`}>
        <button
          type="button"
          aria-pressed={chosen}
          aria-label={label}
          title={label}
          onClick={onChoose}
          className="flex h-10 w-full min-w-0 items-center gap-2.5 text-start after:absolute after:inset-0 focus-visible:outline-none! focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-npf-blue-mid"
        >
          <span aria-hidden className={`size-2 shrink-0 rounded-full ${dot}`} />
          <span
            className={`truncate ${
              chosen
                ? "font-semibold"
                : busy(s)
                  ? "font-medium text-npf-ink"
                  : "text-npf-steel"
            }`}
          >
            {name}
          </span>
        </button>
      </th>
      <td className="text-center">
        <Count n={s.waiting} kind={s.late ? "late" : "waiting"} chosen={chosen} />
      </td>
      <td className="text-center">
        <Count n={s.running} kind="running" chosen={chosen} />
      </td>
      {withUnits ? (
        <td className="pe-5 text-end">
          <Free free={s.free ?? 0} of={s.units ?? 0} chosen={chosen} />
        </td>
      ) : null}
    </tr>
  );
}

/**
 * Units free as a figure and a short bar of the share. Nobody free while
 * the command has units is the one reading that turns red, because it is
 * the one that stops a dispatch.
 */
function Free({ free, of, chosen }: { free: number; of: number; chosen?: boolean }) {
  if (!of) return <Nil className={chosen ? "text-white/70" : "text-npf-steel"} />;
  if (!free)
    return (
      <span className="npf-pill bg-ops-p1-wash !py-0.5 font-mono text-ops-p1">
        0/{of}
      </span>
    );
  return (
    <span className="inline-flex items-center justify-end gap-2">
      <span
        aria-hidden
        className={`hidden h-1.5 w-7 overflow-hidden rounded-full sm:block ${
          chosen ? "bg-white/25" : "bg-ops-line-soft"
        }`}
      >
        <span
          className="block h-full rounded-full transition-[width] duration-500 ease-(--ease-out)"
          style={{
            width: `${(free / of) * 100}%`,
            background: chosen ? "#fff" : "var(--ops-fill-ok)",
          }}
        />
      </span>
      <span
        className={`font-mono text-xs font-semibold tabular-nums ${chosen ? "text-white" : "text-npf-ink"}`}
      >
        {free}
        <span className={`font-normal ${chosen ? "text-white/75" : "text-ops-dim"}`}>
          /{of}
        </span>
      </span>
    </span>
  );
}

/**
 * A figure in a column. Waiting and late are solid, running is an outline,
 * so the two read apart by shape as well as colour; nothing is a dash.
 */
function Count({
  n,
  kind,
  chosen,
}: {
  n: number;
  kind: "late" | "waiting" | "running";
  chosen: boolean;
}) {
  if (!n) return <Nil className={chosen ? "text-white/70" : "text-npf-steel"} />;
  const tone = chosen
    ? kind === "running"
      ? "text-white ring-1 ring-white/60 ring-inset"
      : "bg-white text-npf-blue-deep"
    : kind === "late"
      ? "bg-ops-p1 text-white"
      : kind === "waiting"
        ? "bg-ops-p2 text-white"
        : "text-npf-blue-ink ring-1 ring-npf-blue-mid/45 ring-inset";
  return (
    <span
      key={n}
      className={`npf-ops-count inline-grid h-5 min-w-5 place-items-center rounded-full px-1.5 font-mono text-2xs leading-none font-semibold ${tone}`}
    >
      {n}
    </span>
  );
}

/** Hands a narrowed board back to the whole Force (or command). */
function ClearChoice({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="npf-small -my-2 inline-flex min-h-11 items-center gap-1.5 font-medium text-npf-blue underline-offset-4 hover:text-npf-blue-deep hover:underline"
    >
      <CloseIcon aria-hidden className="size-3.5" />
      {children}
    </button>
  );
}

/** The link out of a panel to the board that owns the same data in full. */
function More({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group npf-small -my-2 inline-flex min-h-11 items-center gap-1.5 font-medium text-npf-blue underline-offset-4 transition-colors hover:text-npf-blue-deep hover:underline"
    >
      {children}
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform duration-200 ease-(--ease-out) group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
      />
    </Link>
  );
}

/*
 * The two queues share one grid, so a call keeps its columns when it moves
 * from Pending to Running: grade, the call itself, then the readings. From
 * 48rem of panel the readings stand in fixed columns under a ruled head;
 * narrower, they fold under the call.
 */
const PENDING_COLS = "@3xl:grid-cols-[2.5rem_minmax(0,1fr)_6.5rem_11rem]";
const RUNNING_COLS =
  "@3xl:grid-cols-[2.5rem_minmax(0,1fr)_7.25rem_9rem_4.5rem]";

/** The ruled column heads over a queue, shown once the columns are. */
function QueueHead({
  cols,
  labels,
  end = [],
}: {
  cols: string;
  labels: string[];
  /** Columns whose content sits at the end edge, so the head does too. */
  end?: number[];
}) {
  return (
    <div
      aria-hidden
      className={`hidden gap-x-6 border-b border-ops-line bg-[color-mix(in_srgb,var(--color-npf-cloud)_70%,white)] px-5 py-2 text-xs font-semibold text-npf-steel @3xl:grid ${cols}`}
    >
      {labels.map((label, i) => (
        <span
          key={i}
          className={end.includes(i) ? "text-end" : ""}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

/** What the call is and where: the same two lines on both queues. */
function CallLines({
  incident,
  summary,
}: {
  incident: Incident;
  summary?: boolean;
}) {
  const t = useT();
  return (
    <div className="min-w-0">
      {/* The whole first line opens the call: the type is what the eye
          lands on, so it is the target, not only the reference beside it. */}
      <Link
        href={`/app/police/incidents?call=${incident.id}`}
        className="group/call flex w-fit flex-wrap items-baseline gap-x-2 gap-y-0.5 rounded-sm"
      >
        <span className="text-[0.9375rem] leading-snug font-semibold text-npf-ink underline-offset-4 transition-colors group-hover/call:text-npf-blue group-hover/call:underline">
          {t(incident.kind)}
        </span>
        <span className="font-mono text-xs text-ops-dim tabular-nums">
          {incident.id}
        </span>
      </Link>
      <p className="mt-1 truncate text-[0.8125rem] text-npf-body">
        {placeOf(t(incident.area), incident.where)}
      </p>
      {summary ? (
        <p className="mt-2 line-clamp-2 max-w-[62ch] text-[0.8125rem] leading-relaxed text-ops-dim">
          {t(incident.summary)}
        </p>
      ) : null}
    </div>
  );
}

/**
 * A call with nobody on it. The row carries its own dispatch control, because
 * the alternative — open the call, find the unit, come back — is three steps
 * for the single action this screen exists to make fast.
 *
 * Down the queue the clocks stand in one column and the dispatch controls in
 * the next, so the eye runs down how long each has waited and the hand down
 * one edge of controls.
 */
function PendingCall({
  incident,
  units,
  now,
}: {
  incident: Incident;
  units: Unit[];
  now: number;
}) {
  const t = useT();
  const late = isOverdue(incident, now);
  // Its own command's units only, even on a national desk.
  const free = units.filter(
    (u) => u.status === "Available" && u.state === incident.where.state,
  );
  const target = dispatchTarget[incident.priority];
  const tone = targetTone(incident, now);

  return (
    <li
      className={`npf-ops-row npf-ops-call grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 gap-y-4 border-b border-ops-line-soft px-5 py-5 @3xl:gap-x-6 transition-colors last:border-0 hover:bg-ops-hover ${PENDING_COLS} @3xl:items-start ${
        late ? "npf-ops-overdue" : ""
      }`}
      style={{ viewTransitionName: `call-${incident.id}` }}
    >
      <span className="pt-0.5">
        <PriorityTag priority={incident.priority} />
      </span>
      <CallLines incident={incident} summary />

      {/* Below 36rem the clock and the control share one line under the
          call, indented to the call's own edge. */}
      <div className="col-start-2 flex items-center gap-5 @3xl:contents">
        <span className="flex w-24 shrink-0 flex-col gap-1.5 @3xl:w-auto @3xl:items-end @3xl:pt-0.5">
          <span className="flex flex-col gap-1 whitespace-nowrap @3xl:items-end">
            <span style={{ color: tone }}>
              <Elapsed
                from={incident.reported}
                className="text-base leading-none font-semibold tracking-[-0.02em]"
              />
            </span>
            <span
              className={`text-2xs leading-none ${late ? "font-semibold text-ops-p1" : "text-ops-dim"}`}
            >
              {late
                ? t("over {span}", { span: duration(target * 60_000) })
                : t("of {n}m", { n: target })}
            </span>
          </span>
          <TargetBar incident={incident} now={now} className="w-full" />
        </span>

        <span className="block min-w-0 flex-1 @3xl:flex-none">
          {free.length ? (
            /* Each free unit is a row with its callsign, then where it is and
               who is on it, behind the green dot free units wear on the
               Units panel. */
            <OpsPicker
              label={t("Dispatch {ref} to a unit", { ref: incident.id })}
              width="17rem"
              groups={[
                {
                  items: free.map((u) => ({
                    value: u.callsign,
                    label: t(u.callsign),
                    hint: `${t(u.area)} · ${t(u.officer)}`,
                    dot: "var(--ops-fill-ok)",
                  })),
                },
              ]}
              onPick={(callsign) => {
                const unit = units.find((u) => u.callsign === callsign);
                if (!unit) return;
                /* The call travels from the queue into Running, so the eye
                   follows it to where it went instead of losing it in a blink
                   out of one list and into the other. */
                withTransition(() =>
                  updateIncident(incident.id, {
                    unit: unit.callsign,
                    assignee: unit.officer,
                    status: "Dispatched",
                  }),
                );
              }}
              triggerClassName="flex h-9 w-full max-w-52 min-w-fit items-center gap-2 rounded-(--ops-control-radius) bg-white ps-3 pe-2.5 text-[0.8125rem] font-medium whitespace-nowrap text-npf-ink shadow-[var(--ops-control-rim),var(--ops-control-lift)] transition-[box-shadow,scale] duration-150 hover:shadow-[var(--ops-control-rim-hover),var(--ops-control-lift)] active:scale-[0.97] @3xl:max-w-none"
              trigger={
                <>
                  <span className="sr-only">
                    {t("Dispatch {ref} to a unit", { ref: incident.id })}:{" "}
                  </span>
                  {t("Dispatch · {n} free", { n: free.length })}
                  <ChevronDown aria-hidden className="npf-ops-chev ms-auto size-4 shrink-0 text-npf-steel" />
                </>
              }
            />
          ) : (
            /* Nothing to choose, so no control: an empty slot the size of
               the select, ruled in dashes, saying so plainly. */
            <span className="flex h-9 w-full max-w-52 min-w-fit items-center gap-2 rounded-(--ops-control-radius) border border-dashed border-npf-line px-3 text-[0.8125rem] whitespace-nowrap text-ops-dim @3xl:max-w-none">
              <span
                aria-hidden
                className="size-1.5 shrink-0 rounded-full bg-npf-steel/50"
              />
              {t("No unit free")}
            </span>
          )}
        </span>
      </div>
    </li>
  );
}

/**
 * A call that already has a unit. Read-only here; worked on the Calls board.
 * Status, unit and clock stand in fixed columns, so down the list they read
 * as three straight edges whatever the tag or the callsign says.
 */
function RunningCall({ incident }: { incident: Incident }) {
  const t = useT();
  return (
    <li
      className={`npf-ops-call grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-ops-line-soft px-5 py-4 @3xl:gap-x-6 transition-colors last:border-0 hover:bg-ops-hover ${RUNNING_COLS}`}
      /* The same name as its pending row, which is what lets a dispatch
         carry the row across the board. */
      style={{ viewTransitionName: `call-${incident.id}` }}
    >
      <span className="self-start pt-0.5">
        <PriorityTag priority={incident.priority} />
      </span>
      <CallLines incident={incident} />

      <div className="col-start-2 flex items-center gap-3 @3xl:contents">
        <span className="flex">
          <OpsStatus status={incident.status} />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[0.8125rem] font-medium text-npf-ink">
            {t(incident.unit ?? "")}
          </span>
          {incident.assignee ? (
            <span className="hidden truncate text-xs text-ops-dim @3xl:block">
              {t(incident.assignee)}
            </span>
          ) : null}
        </span>
        <Elapsed
          from={incident.onScene ?? incident.dispatched ?? incident.reported}
          className="ms-auto text-sm font-semibold text-npf-ink @3xl:text-end"
        />
      </div>
    </li>
  );
}

/**
 * A unit's status as a block of colour: the ink its status pill wears
 * everywhere else in the console (the Units lanes, the Running tags), so a
 * segment here means what the same colour means there.
 */
const UNIT_KEY: { status: Unit["status"]; label: string; fill: string }[] = [
  { status: "Available", label: "Free", fill: "var(--ops-fill-ok)" },
  { status: "Assigned", label: "En route", fill: "var(--ops-route)" },
  { status: "On Scene", label: "On scene", fill: "var(--ops-scene)" },
  {
    status: "Unavailable",
    label: "Off the air",
    // Off the air has to show as a segment, not as a gap in the bar.
    fill: "color-mix(in srgb, var(--ops-dim) 40%, transparent)",
  },
];

/**
 * The unit status board, rolled up by section.
 *
 * One bar across the top is the whole fleet, split by status, with each
 * share named and counted under it: the shift's capacity in one look. Under
 * it the sections as a desk table, a column per status headed by its own
 * colour, so the legend is the header and every count stands in a straight
 * line. A dispatcher does not ask "how many units exist", they ask "is there
 * a traffic car free", so Free leads, and a section with nobody free turns
 * that cell into a red tag.
 */
function UnitBoard({ units }: { units: Unit[] }) {
  const t = useT();
  const sections = [...new Set(units.map((u) => u.section))];
  const count = (list: Unit[], status: Unit["status"]) =>
    list.filter((u) => u.status === status).length;
  const free = count(units, "Available");

  return (
    <OpsPanel
      title={t("Units")}
      count={t("{n} free", { n: free })}
      action={<More href="/app/police/units">{t("Status board")}</More>}
      flush
    >
      {units.length ? (
        <div className="px-5 pt-4 pb-3.5">
          <span aria-hidden className="flex h-2.5 gap-[3px]">
            {UNIT_KEY.map(({ status, fill }) => {
              const n = count(units, status);
              return n ? (
                <span
                  key={status}
                  className="rounded-[3px] transition-[flex-grow] duration-500 ease-(--ease-out)"
                  style={{ flexGrow: n, background: fill }}
                />
              ) : null;
            })}
          </span>
          <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ops-dim">
            {UNIT_KEY.map(({ status, label }) => {
              const n = count(units, status);
              return (
                <li key={status} className="flex items-baseline gap-1.5">
                  {t(label)}
                  <span
                    className={`font-mono tabular-nums ${n ? "font-semibold text-npf-ink" : ""}`}
                  >
                    {n}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <table className="w-full text-sm">
        <caption className="sr-only">
          {t("Units on duty by section, with how many are available")}
        </caption>
        <thead>
          <tr className="border-y border-ops-line bg-[color-mix(in_srgb,var(--color-npf-cloud)_70%,white)] text-xs font-semibold text-npf-steel">
            <th scope="col" className="w-full py-2 ps-5">
              {t("Section")}
            </th>
            {UNIT_KEY.map(({ status, label, fill }, i) => (
              <th
                key={status}
                /* One line from 640px up in every language. On a phone the
                   Hausa and Yoruba heads are too long to sit on one line beside
                   the section names, so there, and only there, they wrap. */
                scope="col"
                className={`px-2 py-2 align-bottom leading-tight whitespace-nowrap max-sm:[&:lang(ha)]:whitespace-normal max-sm:[&:lang(yo)]:whitespace-normal ${
                  i === UNIT_KEY.length - 1 ? "pe-5 text-end" : "text-center"
                }`}
              >
                <span
                  aria-hidden
                  className="mx-auto mb-1 block h-1 w-4 rounded-full in-[.text-end]:ms-auto in-[.text-end]:me-0"
                  style={{ background: fill }}
                />
                {t(label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => {
            const inSection = units.filter((u) => u.section === section);
            const open = count(inSection, "Available");
            return (
              <tr
                key={section}
                className="border-b border-ops-line-soft transition-colors last:border-0 hover:bg-ops-hover"
              >
                <th
                  scope="row"
                  className={`w-full max-w-0 truncate py-2.5 ps-5 ${
                    open ? "font-medium text-npf-ink" : "font-normal text-npf-steel"
                  }`}
                >
                  {t(section)}
                </th>
                {UNIT_KEY.map(({ status }, i) => {
                  const n = count(inSection, status);
                  const last = i === UNIT_KEY.length - 1;
                  return (
                    <td
                      key={status}
                      className={`px-2 py-2 font-mono text-xs tabular-nums ${
                        last ? "pe-5 text-end" : "text-center"
                      }`}
                    >
                      {status === "Available" && !n ? (
                        /* Nobody free is the one reading that stops a
                           dispatch, so it is the one that turns red. */
                        <span className="npf-pill bg-ops-p1-wash !py-0.5 text-ops-p1">
                          0<span className="sr-only"> {t("No unit free")}</span>
                        </span>
                      ) : n ? (
                        <span
                          className={
                            status === "Available"
                              ? "text-[0.8125rem] font-semibold text-npf-ink"
                              : "text-npf-ink"
                          }
                        >
                          {n}
                        </span>
                      ) : (
                        <Nil />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </OpsPanel>
  );
}

/**
 * What else in the command is getting worse while the desk looks at calls:
 * someone held past the constitutional limit, a case nobody is
 * investigating, tips from the public nobody has read. A line of links, and
 * nothing at all when there is nothing.
 */
function Attention() {
  const t = useT();
  const now = useNow();
  const { custody, cases, alerts, session } = useScoped();
  const tabs = postOf(session?.post).tabs;
  const over = custody.filter(
    (d) =>
      d.status === "In custody" &&
      now - new Date(d.arrested).getTime() > custodyLimit(d) * 3_600_000,
  ).length;
  const noIpo = cases.filter((c) => c.stage !== "Closed" && !c.ipo).length;
  const tips = alerts.reduce((n, a) => n + a.tips.filter((x) => !x.read).length, 0);
  const items = [
    over && tabs.includes("/app/police/custody")
      ? { href: "/app/police/custody", text: t("{n} held past the legal limit", { n: over }), red: true }
      : null,
    noIpo && tabs.includes("/app/police/cases")
      ? { href: "/app/police/cases", text: t(noIpo === 1 ? "{n} case with no investigator" : "{n} cases with no investigator", { n: noIpo }), red: false }
      : null,
    tips && tabs.includes("/app/police/alerts")
      ? { href: "/app/police/alerts", text: t(tips === 1 ? "{n} new tip from the public" : "{n} new tips from the public", { n: tips }), red: false }
      : null,
  ].filter(Boolean) as { href: string; text: string; red: boolean }[];
  if (!now || !items.length) return null;
  return (
    <nav aria-label={t("Also needs attention")} className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-ops-dim">{t("Also needs attention")}</span>
      {items.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          className={`npf-pill transition-colors ${i.red ? "bg-ops-p1-wash text-ops-p1 hover:bg-ops-p1-wash/70" : "bg-ops-p2-wash text-ops-p2 hover:bg-ops-p2-wash/70"}`}
        >
          <span aria-hidden className="npf-pill-dot" />
          {i.text}
        </Link>
      ))}
    </nav>
  );
}
