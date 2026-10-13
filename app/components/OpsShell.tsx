"use client";

import Link from "../i18n/Link";
import { usePathname } from "next/navigation";
import { stripLocale } from "../i18n/path";
import { useRouter } from "../i18n/Link";
import { useEffect, useState } from "react";
import LanguageSwitch from "./LanguageSwitch";
import { KEY, setViewing, signOut, type Incident } from "./store";
import { STATES } from "../geo";
import { commandLabel } from "./Where";
import { PriorityTag, useMounted, useNow, useScoped } from "./OpsPieces";
import { useT } from "../i18n/client";
import { PoliceWordmark } from "./Wordmark";
import { ArrowDown, CloseIcon, ShieldIcon, SignOutIcon } from "./icons";
import {
  BoardGlyph,
  CallsGlyph,
  ReportGlyph,
  RequestsGlyph,
  UnitsGlyph,
} from "./ops-glyphs";

const TABS = [
  {
    href: "/app/police",
    label: "Command board",
    short: "Board",
    Icon: BoardGlyph,
  },
  {
    href: "/app/police/incidents",
    label: "Calls",
    short: "Calls",
    Icon: CallsGlyph,
  },
  {
    href: "/app/police/units",
    label: "Units",
    short: "Units",
    Icon: UnitsGlyph,
  },
  {
    href: "/app/police/requests",
    label: "Requests",
    short: "Requests",
    Icon: RequestsGlyph,
  },
  {
    href: "/app/police/report",
    label: "Shift report",
    short: "Report",
    Icon: ReportGlyph,
  },
];

/** Control rooms run three eight-hour reliefs; A starts at 06:00 WAT. */
function shiftOf(d: Date) {
  const h = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Africa/Lagos",
    }).format(d),
  );
  if (h >= 6 && h < 14) return "A";
  if (h >= 14 && h < 22) return "B";
  return "C";
}

const clock = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Africa/Lagos",
});

/** The officer's initials, for the identity disc. */
function initials(name: string) {
  return name
    .replace(/\b(insp|sgt|cpl|asp|dsp|csp|acp|dr|mr|mrs|ms)\.?\s*/gi, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const isHere = (href: string, path: string) =>
  href === "/app/police" ? path === href : path.startsWith(href);

/**
 * The console frame: guard, command bar, rail.
 *
 * It wears the website (the white bar, the crest in Force blue, the ruled
 * rail of the account pages, the chips of /services) but not the website's
 * Header and Footer. An officer needs four queues, the time and a way out,
 * and a marketing footer under a live call list would be noise.
 *
 * One page, one scrollbar: the bar is sticky and the document scrolls, so
 * table heads and the call panel pin under it by --ops-top.
 */
export default function OpsShell({ children }: { children: React.ReactNode }) {
  const t = useT();
  const router = useRouter();
  /*
   * usePathname reports the rewritten path on the server and the locale-
   * prefixed one in the browser; strip it, or no tab is ever marked current
   * once React takes over.
   */
  const path = stripLocale(usePathname()).rest;
  const { session, incidents, requests, units, loaded, viewing } = useScoped();

  const officer = session?.role === "officer";

  useEffect(() => {
    if (!loaded) return;
    if (!session)
      router.replace(`/app/signin?next=${encodeURIComponent(path)}`);
  }, [loaded, session, router, path]);

  /*
   * Each badge says what its number counts, and colours it only when the
   * colour means something: red while a call sits unassigned.
   */
  const open = incidents.filter((i) => i.status !== "Closed").length;
  const waiting = incidents.filter((i) => i.status === "New").length;
  const free = units.filter((u) => u.status === "Available").length;
  const pending = requests.filter(
    (r) => r.status !== "Completed" && r.status !== "Rejected",
  ).length;
  const counts: Record<string, Count> = {
    "/app/police/incidents": {
      n: open,
      note: waiting
        ? t("{n} open, {w} waiting", { n: open, w: waiting })
        : t("{n} open", { n: open }),
      alert: waiting > 0,
    },
    "/app/police/units": {
      n: free,
      note: t("{n} available", { n: free }),
    },
    "/app/police/requests": {
      n: pending,
      note: t("{n} pending", { n: pending }),
    },
  };

  // The tab title carries the waiting count, so a desk working in another
  // window still sees a call land.
  useEffect(() => {
    if (!loaded || !officer) return;
    const base = document.title.replace(/^\(\d+\) /, "");
    document.title = waiting ? `(${waiting}) ${base}` : base;
  }, [loaded, officer, waiting, path]);

  const endShift = () => {
    signOut();
    router.push("/app/home");
  };

  if (!loaded || !session)
    return (
      <div className="npf-ops grid min-h-[100dvh] place-items-center">
        <p className="npf-small flex items-center gap-3 text-ops-dim">
          <ShieldIcon
            aria-hidden
            className="size-5 animate-pulse text-npf-blue"
          />
          {t("Checking credentials…")}
        </p>
      </div>
    );

  if (!officer)
    return (
      <div className="npf-ops grid min-h-[100dvh] place-items-center px-6">
        <div className="max-w-[46ch] text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-npf-cloud text-npf-blue">
            <ShieldIcon aria-hidden className="size-8" />
          </span>
          <h1 className="npf-h3 mt-5 text-npf-ink">
            {t("Force credentials required")}
          </h1>
          <p className="npf-body mt-3 text-npf-body">
            {t(
              "You are signed in as {name}, a public account. The operations console is for Nigeria Police Force personnel.",
              { name: session.name },
            )}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/app/portal" className="npf-btn npf-btn-primary">
              {t("Go to my account")}
            </Link>
            <button
              type="button"
              onClick={() => {
                signOut();
                router.push("/app/signin?next=/app/police");
              }}
              className="npf-btn npf-btn-secondary"
            >
              {t("Sign in as an officer")}
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="npf-ops min-h-[100dvh]">
      {/*
        The dashboard frame: a white sidebar fixed down the left edge holding
        the crest, the four destinations and who holds the desk, and a slim
        bar over the work area for the clock and the way out. The work area
        is a pale cloud so every panel on it reads as a tile.
      */}
      <Sidebar
        path={path}
        counts={counts}
        officer={session}
        onEnd={endShift}
      />

      <div className="flex min-h-[100dvh] flex-col lg:ps-68 print:ps-0">
        <header className="sticky top-0 z-40 print:hidden border-b border-npf-hairline bg-white/90 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            {/* The crest lives in the sidebar on a desk; on a phone it
                heads the bar, badge only, so the command picker beside it
                keeps room for its own name instead of running under the
                lettering. */}
            <Link
              href="/app/police"
              className="flex shrink-0 items-center rounded-chip py-1 text-npf-blue-deep lg:hidden max-sm:[&_svg]:hidden"
            >
              <span
                role="img"
                aria-label={t("Nigeria Police Force")}
                className="block h-9 shrink-0"
              >
                <PoliceWordmark className="h-full w-auto" />
              </span>
            </Link>
            <CommandPicker
              fixed={session.command}
              viewing={viewing}
            />

            {/* The thing getting worse while nobody looks, on every screen
                that does not already lead with it in its band. */}
            {waiting > 0 &&
              path !== "/app/police" &&
              path !== "/app/police/incidents" && (
                <Link
                  href="/app/police/incidents"
                  className="npf-pill shrink-0 bg-ops-p1-wash text-ops-p1 transition-[background-color,scale] duration-(--dur-hover) hover:bg-ops-p1-wash/70 active:scale-[0.97] max-lg:hidden"
                >
                  <span aria-hidden className="npf-pill-dot animate-pulse" />
                  {t("{n} waiting", { n: waiting })}
                </Link>
              )}

            <div className="ms-auto flex shrink-0 items-center gap-3 sm:gap-4">
              <ShiftClock />

              {/* Status on one side of the rule, the officer's own controls
                  on the other. */}
              <span aria-hidden className="h-6 w-px bg-npf-hairline max-sm:hidden" />

              {/* An officer works a whole shift in here; the language control
                  has to be on this bar, not back on the public site. */}
              <div className="flex items-center gap-2">
                <LanguageSwitch />
                <button
                  type="button"
                  onClick={endShift}
                  title={t("End shift")}
                  className="npf-icon-btn lg:hidden"
                >
                  <SignOutIcon aria-hidden className="size-4.5" />
                  <span className="sr-only">{t("End shift")}</span>
                </button>
              </div>
            </div>
          </div>

          <Tabs path={path} counts={counts} />
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="npf-page-in mx-auto w-full max-w-450 min-w-0 flex-1 px-4 pt-6 pb-12 outline-none sm:px-6 lg:px-8 lg:pt-8"
        >
          {children}
        </main>
        <NewCalls viewing={viewing} />
      </div>
    </div>
  );
}

type Count = { n: number; note: string; alert?: boolean };

/** A queue's count as a small pill; red only while a call sits waiting. */
function Badge({ count, active }: { count?: Count; active: boolean }) {
  if (!count?.n) return null;
  const tone = count.alert
    ? "bg-npf-alert text-white"
    : active
      ? "bg-npf-blue text-white"
      : "bg-npf-cloud text-npf-blue-ink";
  return (
    <span
      title={count.note}
      className={`ms-auto grid h-5.5 min-w-6 place-items-center rounded-full px-1.5 font-mono text-xs font-medium tabular-nums ${tone}`}
    >
      <span aria-hidden>{count.n}</span>
      <span className="sr-only">{count.note}</span>
    </span>
  );
}

/**
 * The sidebar on a desk: crest at the head, the four destinations, and the
 * duty officer with the way out at the foot. Fixed to the viewport, so it
 * never scrolls away from a long call list.
 */
function Sidebar({
  path,
  counts,
  officer,
  onEnd,
}: {
  path: string;
  counts: Record<string, Count>;
  officer: { name: string; rank?: string; station?: string };
  onEnd: () => void;
}) {
  const t = useT();
  return (
    <aside className="fixed inset-y-0 start-0 z-50 hidden w-68 flex-col border-e border-npf-hairline bg-white lg:flex print:hidden">
      <Link
        href="/app/police"
        className="flex h-16 shrink-0 items-center border-b border-npf-hairline px-6 text-npf-blue-deep"
      >
        <span
          role="img"
          aria-label={t("Nigeria Police Force")}
          className="block h-10"
        >
          <PoliceWordmark className="h-full w-auto" />
        </span>
      </Link>

      <nav
        aria-label={t("Console")}
        className="min-h-0 flex-1 overflow-y-auto px-3 py-5"
      >
        <ul className="space-y-1">
          {TABS.map(({ href, label, Icon }) => {
            const active = isHere(href, path);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`group flex h-12 items-center gap-3 rounded-chip px-3 text-sm font-medium transition-[background-color,color,scale] duration-(--dur-hover) active:scale-[0.98] active:duration-(--dur-press) ${
                    active
                      ? "bg-npf-mist text-npf-blue-deep"
                      : "text-npf-body hover:bg-npf-paper hover:text-npf-ink"
                  }`}
                >
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-lg transition-colors duration-(--dur-hover) ${
                      active
                        ? "bg-npf-blue text-white"
                        : "bg-npf-cloud text-npf-blue-ink group-hover:bg-npf-chip"
                    }`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="truncate">{t(label)}</span>
                  <Badge count={counts[href]} active={active} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <section className="shrink-0 border-t border-npf-hairline p-4">
        <h2 className="sr-only">{t("Duty officer")}</h2>
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="relative grid size-10 shrink-0 place-items-center rounded-full bg-npf-blue font-secondary text-sm font-bold text-white"
          >
            {initials(officer.name)}
            <span className="absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 border-white bg-npf-ok-fill" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-npf-ink">
              {t(officer.name)}
            </span>
            {/* Rank over station, each on its own line: "Inspector · Force
                Control Room" on one line ran out of rail and ended in an
                ellipsis, cutting off where the officer sits. */}
            <span className="block truncate text-xs text-npf-steel">
              {t(officer.rank ?? "")}
            </span>
            <span className="line-clamp-2 text-xs text-npf-steel">
              {t(officer.station ?? "")}
            </span>
          </span>
          <button
            type="button"
            onClick={onEnd}
            title={t("End shift")}
            className="npf-icon-btn shrink-0"
          >
            <SignOutIcon aria-hidden className="size-4.5" />
            <span className="sr-only">{t("End shift")}</span>
          </button>
        </div>
      </section>
    </aside>
  );
}

/**
 * The same four destinations below 1024px, as the /services chips: all four
 * in one row, never a strip to swipe, so nobody has to scroll a menu to find
 * out the console has a Units board.
 */
function Tabs({
  path,
  counts,
}: {
  path: string;
  counts: Record<string, Count>;
}) {
  const t = useT();
  return (
    /* Five destinations in one row, never a strip to swipe: below 640px
       each is an icon over a short word, the way a phone's own tab bar
       fits five, and the count rides on the icon. */
    <nav
      aria-label={t("Console")}
      className="mx-auto grid max-w-450 grid-cols-5 gap-1.5 px-4 pb-3 sm:flex sm:gap-2 sm:px-6 lg:hidden"
    >
      {TABS.map(({ href, short, Icon }) => {
        const active = isHere(href, path);
        const count = counts[href];
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-13 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-sm font-medium whitespace-nowrap ring-1 transition-[background-color,color,box-shadow,scale] duration-(--dur-hover) ring-inset active:scale-[0.97] active:duration-(--dur-press) sm:min-h-10 sm:flex-auto sm:flex-row sm:gap-2 sm:rounded-(--ops-control-radius) sm:px-2.5 ${
              active
                ? "bg-npf-blue text-white ring-npf-blue"
                : "bg-white text-npf-ink ring-npf-hairline hover:bg-npf-paper"
            }`}
          >
            <span className="relative">
              <Icon className="size-5 shrink-0" />
              {count?.n ? (
                <span
                  title={count.note}
                  className={`absolute -end-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full px-1 font-mono text-2xs leading-none font-medium tabular-nums ring-2 sm:hidden ${
                    count.alert
                      ? "bg-npf-alert text-white ring-white"
                      : active
                        ? "bg-white text-npf-blue ring-npf-blue"
                        : "bg-npf-cloud text-npf-blue-ink ring-white"
                  }`}
                >
                  <span aria-hidden>{count.n}</span>
                  <span className="sr-only">{count.note}</span>
                </span>
              ) : null}
            </span>
            <span className="max-w-full truncate text-2xs sm:text-sm">
              {t(short)}
            </span>
            {count?.n ? (
              <span
                aria-hidden
                className={`hidden h-5 min-w-5 place-items-center rounded-full px-1 font-mono text-2xs font-medium tabular-nums sm:grid ${
                  count.alert
                    ? "bg-npf-alert text-white"
                    : active
                      ? "bg-white/20 text-white"
                      : "bg-npf-cloud text-npf-blue-ink"
                }`}
              >
                {count.n}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * The shift clock, in its own component on purpose: it reads the shared
 * per-second tick, and left in the shell it re-rendered the whole frame once
 * a second to move two digits.
 */
function ShiftClock() {
  const t = useT();
  const now = useNow();
  const mounted = useMounted();
  const time = mounted ? clock.format(new Date(now)) : "--:--";
  const shift = mounted ? shiftOf(new Date(now)) : "-";

  return (
    /* Off on a phone: crest, command, language and the way out already fill
       390px, and with the clock as well the command picker was squeezed
       until its arrow sat on top of its own name. */
    <p className="flex shrink-0 items-baseline gap-2 max-sm:hidden">
      <span
        dir="ltr"
        className="flex items-baseline font-mono text-[0.9375rem] leading-none font-semibold text-npf-ink tabular-nums"
      >
        {time.slice(0, 2)}
        <span className="npf-ops-tick">:</span>
        {time.slice(3)}
      </span>
      <span className="npf-small hidden leading-none text-npf-steel sm:inline">
        {t("WAT · Shift {shift}", { shift: t(shift) })}
      </span>
    </p>
  );
}

/**
 * Which command the console is showing. A command desk is held to its own
 * command and sees its name; a Force Headquarters desk sees every command
 * and can narrow to one, which is how a national desk follows a state.
 */
function CommandPicker({
  fixed,
  viewing,
}: {
  fixed?: string;
  viewing: string | null;
}) {
  const t = useT();
  if (fixed)
    return (
      <p className="flex min-w-0 items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-npf-cloud text-npf-blue-ink">
          <ShieldIcon aria-hidden className="size-4" />
        </span>
        <span className="npf-h5 truncate leading-none text-npf-ink">
          {commandLabel(t, fixed)}
        </span>
      </p>
    );
  return (
    <div className="flex min-w-0 items-center gap-2">
      <label htmlFor="ops-command" className="sr-only">
        {t("Command in view")}
      </label>
      {/* The shield says this pill is the console's scope, the same mark a
          command desk sees beside its fixed name. */}
      <span className="npf-select-wrap min-w-0">
        <ShieldIcon
          aria-hidden
          className={`pointer-events-none absolute start-3.5 top-[calc(50%-0.5rem)] z-10 size-4 max-sm:hidden ${
            viewing ? "text-white" : "text-npf-blue"
          }`}
        />
        <select
          id="ops-command"
          value={viewing ?? ""}
          onChange={(e) => setViewing(e.target.value || undefined)}
          data-active={viewing ? "" : undefined}
          className="npf-select max-w-[min(18rem,52vw)] truncate sm:ps-10"
        >
          <option value="">{t("All commands")}</option>
          {STATES.map((s) => (
            <option key={s.name} value={s.name}>
              {commandLabel(t, s.name)}
            </option>
          ))}
        </select>
        <ArrowDown aria-hidden className="npf-select-arrow" />
      </span>
    </div>
  );
}

/**
 * A call that lands from somewhere else — a citizen's report, another desk —
 * while the officer is looking at a different screen. The storage event only
 * fires for writes made in another tab, so a call this desk took itself never
 * announces itself back. Urgent grades also sound a short tone.
 */
function NewCalls({ viewing }: { viewing: string | null }) {
  const t = useT();
  const [calls, setCalls] = useState<Incident[]>([]);

  useEffect(() => {
    const ids = (raw: string | null) => {
      try {
        return (JSON.parse(raw ?? "{}").incidents ?? []) as Incident[];
      } catch {
        return [];
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY) return;
      const before = new Set(ids(e.oldValue).map((i) => i.id));
      const landed = ids(e.newValue).filter(
        (i) =>
          !before.has(i.id) &&
          i.status === "New" &&
          (!viewing || i.where.state === viewing),
      );
      if (!landed.length) return;
      setCalls((c) => [...landed, ...c].slice(0, 3));
      if (landed.some((i) => i.priority === "P1" || i.priority === "P2"))
        chime();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [viewing]);

  const dismiss = (id: string) =>
    setCalls((c) => c.filter((i) => i.id !== id));

  return (
    <div
      aria-live="assertive"
      className="fixed end-4 bottom-4 z-50 grid w-[min(24rem,calc(100vw-2rem))] gap-2 print:hidden"
    >
      {calls.map((call) => (
        <div
          key={call.id}
          className="npf-ops-tile npf-page-in flex items-start gap-3 p-4"
          style={{ boxShadow: "var(--ops-shadow), var(--shadow-raised)" }}
        >
          <PriorityTag priority={call.priority} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-npf-ink">
              {t("New call {ref}", { ref: call.id })}
            </p>
            <p className="mt-0.5 truncate text-xs text-ops-dim">
              {t(call.kind)} · {commandLabel(t, call.where.state)}
            </p>
            <Link
              href={`/app/police/incidents?call=${call.id}`}
              onClick={() => dismiss(call.id)}
              className="mt-2 inline-flex h-9 items-center rounded-(--ops-control-radius) bg-ops-brand px-3.5 text-xs font-medium text-white hover:bg-ops-brand-lift"
            >
              {t("Open the call")}
            </Link>
          </div>
          <button
            type="button"
            onClick={() => dismiss(call.id)}
            aria-label={t("Dismiss")}
            className="grid size-7 shrink-0 place-items-center rounded-md text-ops-dim hover:bg-ops-hover hover:text-ops-text"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

/** Two short tones. Silent where the browser has not allowed sound yet. */
function chime() {
  try {
    const ctx = new AudioContext();
    [880, 660].forEach((hz, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = hz;
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.16);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.18);
      osc.stop(ctx.currentTime + i * 0.18 + 0.17);
    });
    setTimeout(() => ctx.close(), 600);
  } catch {}
}
