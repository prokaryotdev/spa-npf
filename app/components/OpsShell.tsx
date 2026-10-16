"use client";

import Link from "../i18n/Link";
import { usePathname } from "next/navigation";
import { stripLocale } from "../i18n/path";
import { useRouter } from "../i18n/Link";
import { useEffect, useMemo, useState } from "react";
import LanguageSwitch from "./LanguageSwitch";
import { KEY, setViewing, signOut, useStore, type Incident } from "./store";
import OpsPicker from "./OpsPicker";
import { STATES } from "../geo";
import { zones } from "../content-footer";
import { commandLabel, divisionLabel } from "./Where";
import {
  PriorityTag,
  isOverdue,
  useMinute,
  useMounted,
  useNow,
  useScoped,
} from "./OpsPieces";
import { useT } from "../i18n/client";
import { PoliceWordmark } from "./Wordmark";
import { ChevronDown, CloseIcon, ShieldIcon, SignOutIcon } from "./icons";
import {
  AlertGlyph,
  BoardGlyph,
  CallsGlyph,
  CaseGlyph,
  CustodyGlyph,
  MapGlyph,
  FindGlyph,
  ReportGlyph,
  RequestsGlyph,
  UnitsGlyph,
} from "./ops-glyphs";
import { postOf, zonalCommand, type ZonalCommand } from "../content-records";
import { clearEmergency, custodyLimit, type Post, type Unit } from "./store";
import { LockScreen, lockNow } from "./OpsLock";

/** A padlock, in the icon set's 1.75 line. */
const LockGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" aria-hidden className="size-4">
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
  </svg>
);

/**
 * Every board the console has, in three groups: the live work of the shift,
 * the investigation that follows it, and the desk's paperwork. A post sees
 * only the boards in its `tabs` (content-records.ts POSTS).
 */
const ALL_TABS = [
  { href: "/app/police", label: "Command board", short: "Board", Icon: BoardGlyph, group: "Operations" },
  { href: "/app/police/incidents", label: "Calls", short: "Calls", Icon: CallsGlyph, group: "Operations" },
  { href: "/app/police/units", label: "Units", short: "Units", Icon: UnitsGlyph, group: "Operations" },
  { href: "/app/police/map", label: "Map", short: "Map", Icon: MapGlyph, group: "Operations" },
  { href: "/app/police/cases", label: "Case files", short: "Cases", Icon: CaseGlyph, group: "Investigation" },
  { href: "/app/police/custody", label: "Custody", short: "Custody", Icon: CustodyGlyph, group: "Investigation" },
  { href: "/app/police/alerts", label: "Alerts", short: "Alerts", Icon: AlertGlyph, group: "Investigation" },
  { href: "/app/police/requests", label: "Requests", short: "Requests", Icon: RequestsGlyph, group: "Desk" },
  { href: "/app/police/report", label: "Shift report", short: "Report", Icon: ReportGlyph, group: "Desk" },
  { href: "/app/police/activity", label: "Activity", short: "Activity", Icon: FindGlyph, group: "Desk" },
];

type Tab = (typeof ALL_TABS)[number];

/** The boards a session's post works, in the order the console lists them. */
const tabsFor = (post?: Post) => {
  const allowed = postOf(post).tabs;
  return ALL_TABS.filter((tab) => allowed.includes(tab.href));
};

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
  const { session, incidents, requests, units, cases, custody, alerts, loaded, viewing } =
    useScoped();
  const now = useMinute();
  const post = session?.post;
  const tabs = useMemo(() => tabsFor(post), [post]);
  const allowed = tabs.some((tab) => isHere(tab.href, path));

  const officer = session?.role === "officer";

  useEffect(() => {
    if (!loaded) return;
    if (!session)
      router.replace(`/app/police-signin?next=${encodeURIComponent(path)}`);
    // A board outside the officer's post sends them to the first one theirs
    // has: an investigator opening the console lands on case files.
    else if (
      session.role === "officer" &&
      !allowed &&
      path === "/app/police" &&
      tabs[0]
    )
      router.replace(tabs[0].href);
  }, [loaded, session, router, path, allowed, tabs]);

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
  const openCases = cases.filter((c) => c.stage !== "Closed").length;
  const noIpo = cases.filter((c) => c.stage !== "Closed" && !c.ipo).length;
  const held = custody.filter((d) => d.status === "In custody");
  const overHeld = held.filter(
    (d) => now && now - new Date(d.arrested).getTime() > custodyLimit(d) * 3_600_000,
  ).length;
  const live = alerts.filter((a) => a.active).length;
  const newTips = alerts.reduce(
    (n, a) => n + a.tips.filter((tip) => !tip.read).length,
    0,
  );
  // Every unit whose officer has pressed the emergency button, in this view.
  const distress = units.filter((u) => u.emergency);
  const counts: Record<string, Count> = {
    /* Red means "waiting", so the red figure is the waiting count: a red 7
       over three waiting calls read as seven urgent ones. With none
       waiting, the badge goes back to the open count in grey. */
    "/app/police/incidents": {
      n: waiting || open,
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
    /* A case nobody is investigating is the case board's waiting call. */
    "/app/police/cases": {
      n: noIpo || openCases,
      note: noIpo
        ? t("{n} open, {w} with no officer", { n: openCases, w: noIpo })
        : t("{n} open", { n: openCases }),
      alert: noIpo > 0,
    },
    /* Red once anyone is held past the constitutional limit. */
    "/app/police/custody": {
      n: overHeld || held.length,
      note: overHeld
        ? t("{n} held, {w} past the legal limit", { n: held.length, w: overHeld })
        : t("{n} held", { n: held.length }),
      alert: overHeld > 0,
    },
    "/app/police/alerts": {
      n: newTips || live,
      note: newTips
        ? t("{n} active, {w} new tips", { n: live, w: newTips })
        : t("{n} active", { n: live }),
      alert: newTips > 0,
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

  if (!loaded || !session) return <ConsoleLoading path={path} />;

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
                router.push("/app/police-signin");
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
        tabs={tabs}
        counts={counts}
        officer={session}
        onEnd={endShift}
      />
      <LockScreen officer={session} />

      <div className="npf-ops-frame flex min-h-[100dvh] flex-col lg:ps-68 print:ps-0">
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
              division={session.division}
              zone={zonalCommand(session.zone)}
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

          <Tabs path={path} tabs={tabs} counts={counts} />
          {distress.map((u) => (
            <Distress
              key={u.callsign}
              unit={u}
              canOpen={tabs.some((tab) => tab.href === "/app/police/incidents")}
            />
          ))}
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="npf-page-in mx-auto w-full max-w-450 min-w-0 flex-1 px-4 pt-6 pb-12 outline-none sm:px-6 lg:px-8 lg:pt-8"
        >
          {allowed ? (
            children
          ) : path === "/app/police" ? null : (
            <NotYourPost tabs={tabs} />
          )}
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
  tabs,
  counts,
  officer,
  onEnd,
}: {
  path: string;
  tabs: Tab[];
  counts: Record<string, Count>;
  /** Absent while the session loads: the foot shows its shape instead. */
  officer?: { name: string; rank?: string; station?: string; post?: Post };
  onEnd?: () => void;
}) {
  const t = useT();
  return (
    <aside className="npf-ops-frame fixed inset-y-0 start-0 z-50 hidden w-68 flex-col border-e border-npf-hairline bg-white lg:flex print:hidden">
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
        {/* Grouped once the post has more than one kind of board: the live
            work, the investigation behind it, the desk's paperwork. */}
        {[...new Set(tabs.map((tab) => tab.group))].map((group, g, groups) => (
        <div key={group} className={g ? "mt-5" : ""}>
        {groups.length > 1 ? (
          <p className="mb-1.5 px-3 text-2xs font-semibold text-npf-steel">
            {t(group)}
          </p>
        ) : null}
        <ul className="space-y-1">
          {tabs.filter((tab) => tab.group === group).map(({ href, label, Icon }) => {
            const active = isHere(href, path);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`group flex h-12 items-center gap-3 rounded-chip px-3 text-sm font-medium transition-[background-color,color,scale] duration-(--dur-hover) active:scale-[0.98] active:duration-(--dur-press) ${
                    active
                      ? "bg-npf-mist font-semibold text-npf-blue-deep"
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
        </div>
        ))}
      </nav>

      {officer ? (
      <section className="shrink-0 border-t border-npf-hairline p-3">
        <h2 className="sr-only">{t("Duty officer")}</h2>
        {/* Who holds the desk: name over rank, two clean lines that end
            in an ellipsis rather than wrap, with the way out beside them. */}
        <div className="flex items-center gap-3 px-1">
          <span
            aria-hidden
            className="relative grid size-9 shrink-0 place-items-center rounded-[10px] bg-npf-blue font-secondary text-[0.8125rem] font-bold text-white"
          >
            {initials(officer.name)}
            <span className="absolute -end-1 -bottom-1 size-3 rounded-full border-2 border-white bg-npf-ok-fill" />
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span
              title={t(officer.name)}
              className="block truncate text-sm font-semibold text-npf-ink"
            >
              {t(officer.name)}
            </span>
            <span className="mt-0.5 block truncate text-xs text-npf-steel">
              {officer.post ? t(postOf(officer.post).label) : t(officer.rank ?? "")}
            </span>
          </span>
          <button
            type="button"
            onClick={lockNow}
            title={t("Lock the console")}
            className="grid size-9 shrink-0 place-items-center rounded-(--ops-control-radius) text-npf-steel ring-1 ring-npf-line ring-inset transition-[background-color,color,scale] duration-(--dur-hover) hover:bg-npf-paper hover:text-npf-ink active:scale-[0.94]"
          >
            <LockGlyph />
            <span className="sr-only">{t("Lock the console")}</span>
          </button>
          <button
            type="button"
            onClick={onEnd}
            title={t("End shift")}
            className="grid size-9 shrink-0 place-items-center rounded-(--ops-control-radius) text-npf-steel ring-1 ring-npf-line ring-inset transition-[background-color,color,box-shadow,scale] duration-(--dur-hover) hover:bg-npf-error-wash hover:text-ops-p1 hover:ring-[color-mix(in_srgb,var(--ops-p1)_35%,transparent)] active:scale-[0.94]"
          >
            <SignOutIcon aria-hidden className="size-4" />
            <span className="sr-only">{t("End shift")}</span>
          </button>
        </div>
        {/* Where the desk is, in a well under the officer: the room on one
            line, the headquarters and city on the next. Split at its first
            comma, so it never breaks mid-name across three ragged lines. */}
        {officer.station ? (
          <Station station={t(officer.station)} />
        ) : null}
      </section>
      ) : (
        <OfficerLoading />
      )}
    </aside>
  );
}

/** A placeholder bar where live text will land. */
function Skel({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`npf-ops-skel block rounded-md ${className}`} />;
}

/** The duty officer's foot while the session loads: the same shapes, empty. */
function OfficerLoading() {
  return (
    <div aria-hidden className="shrink-0 border-t border-npf-hairline p-3">
      <div className="flex items-center gap-3 px-1">
        <Skel className="size-9 shrink-0 rounded-[10px]" />
        <span className="flex-1 space-y-1.5">
          <Skel className="h-3.5 w-28" />
          <Skel className="h-3 w-16" />
        </span>
        <Skel className="size-9 shrink-0 rounded-(--ops-control-radius)" />
      </div>
      <Skel className="mt-3 h-12 w-full rounded-(--ops-control-radius)" />
    </div>
  );
}

/**
 * What the console shows while it reads the session: the console itself,
 * not a spinner on a blank page. The crest, the five destinations, the bar
 * and the navy band stand where they will stay; only what is live (the
 * officer, the figures, the rows) waits as soft shapes. When the session
 * lands, the real content takes those places and nothing on the page moves.
 * The band says in words what is happening, so the wait has a reason.
 */
function ConsoleLoading({ path }: { path: string }) {
  const t = useT();
  return (
    <div className="npf-ops min-h-[100dvh]" aria-busy="true">
      <Sidebar path={path} tabs={ALL_TABS.slice(0, 5)} counts={{}} />
      <div className="flex min-h-[100dvh] flex-col lg:ps-68 print:ps-0">
        <header className="sticky top-0 z-40 border-b border-npf-hairline bg-white/90 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <span className="block h-9 shrink-0 text-npf-blue-deep lg:hidden max-sm:[&_svg]:hidden">
              <PoliceWordmark className="h-full w-auto" />
            </span>
            <Skel className="h-10 w-44 rounded-(--ops-control-radius)" />
            <span className="ms-auto flex items-center gap-4">
              <Skel className="h-4 w-28 max-sm:hidden" />
              <Skel className="h-10 w-24 rounded-(--ops-control-radius)" />
            </span>
          </div>
          <Tabs path={path} tabs={ALL_TABS.slice(0, 5)} counts={{}} />
        </header>

        <main className="mx-auto w-full max-w-450 min-w-0 flex-1 px-4 pt-6 pb-12 sm:px-6 lg:px-8 lg:pt-8">
          <div className="npf-ops-band relative isolate overflow-clip rounded-(--radius-card) px-6 py-6 text-white sm:px-7">
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
              <div>
                <p
                  role="status"
                  className="flex items-center gap-3 font-secondary text-xl leading-[1.05] font-bold tracking-[-0.025em] whitespace-nowrap sm:text-[2rem]"
                >
                  <ShieldIcon aria-hidden className="npf-ops-breathe size-6 shrink-0 text-white/80 sm:size-7" />
                  {t("Checking credentials…")}
                </p>
                <span aria-hidden className="npf-ops-skel npf-ops-skel-dark mt-3 block h-3.5 w-48 rounded-md" />
              </div>
              <span aria-hidden className="flex gap-8">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="flex flex-col items-center gap-2">
                    <span className="npf-ops-skel npf-ops-skel-dark block h-9 w-10 rounded-md" />
                    <span className="npf-ops-skel npf-ops-skel-dark block h-2.5 w-14 rounded" />
                  </span>
                ))}
              </span>
            </div>
          </div>

          {/* The queue and its side column, as the board lays them out. */}
          <div aria-hidden className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_26rem]">
            {[3, 5].map((rows, col) => (
              <div key={col} className="npf-ops-tile overflow-clip">
                <div className="flex h-13 items-center gap-3 border-b border-ops-line-soft px-5">
                  <Skel className="h-4 w-24" />
                  <Skel className="h-4 w-14" />
                </div>
                {Array.from({ length: rows }, (_, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-4 border-b border-ops-line-soft px-5 last:border-0 ${col ? "h-11" : "h-24"}`}
                  >
                    <Skel className={col ? "size-2 rounded-full" : "h-5 w-7 rounded-[5px]"} />
                    <span className="flex-1 space-y-2">
                      <Skel className={col ? "h-3 w-24" : "h-3.5 w-48"} />
                      {col ? null : <Skel className="h-3 w-32" />}
                    </span>
                    <Skel className={col ? "h-3 w-10" : "h-9 w-40 rounded-(--ops-control-radius) max-sm:hidden"} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

/** The desk's station as two ruled lines: the room, then where it is. */
function Station({ station }: { station: string }) {
  const cut = station.indexOf(",");
  const room = cut > 0 ? station.slice(0, cut) : station;
  const rest = cut > 0 ? station.slice(cut + 1).trim() : "";
  return (
    <p
      title={station}
      className="mt-3 flex items-center gap-2.5 rounded-(--ops-control-radius) bg-npf-cloud px-3 py-2 ring-1 ring-ops-line-soft ring-inset"
    >
      <ShieldIcon aria-hidden className="size-4 shrink-0 text-npf-blue" />
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-xs font-medium text-npf-ink">
          {room}
        </span>
        {rest ? (
          <span className="mt-0.5 block truncate text-2xs text-npf-steel">
            {rest}
          </span>
        ) : null}
      </span>
    </p>
  );
}

/**
 * The same four destinations below 1024px, as the /services chips: all four
 * in one row, never a strip to swipe, so nobody has to scroll a menu to find
 * out the console has a Units board.
 */
function Tabs({
  path,
  tabs,
  counts,
}: {
  path: string;
  tabs: Tab[];
  counts: Record<string, Count>;
}) {
  const t = useT();
  return (
    /* Five destinations in one row, never a strip to swipe: below 640px
       each is an icon over a short word, the way a phone's own tab bar
       fits five, and the count rides on the icon. */
    <nav
      aria-label={t("Console")}
      className="mx-auto grid max-w-450 grid-cols-5 gap-1.5 px-4 pb-3 sm:flex sm:flex-wrap sm:gap-2 sm:px-6 lg:hidden"
    >
      {tabs.map(({ href, short, Icon }) => {
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
  division,
  zone,
  viewing,
}: {
  fixed?: string;
  /** A divisional desk's LGA: the bar names the division, not the state. */
  division?: string;
  /** A zonal desk picks among its own states only. */
  zone?: ZonalCommand | null;
  viewing: string | null;
}) {
  const t = useT();
  const { incidents } = useStore();
  const now = useNow();
  if (fixed)
    return (
      <p className="flex min-w-0 items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-npf-cloud text-npf-blue-ink">
          <ShieldIcon aria-hidden className="size-4" />
        </span>
        <span className="npf-h5 truncate leading-none text-npf-ink">
          {division ? divisionLabel(t, division) : commandLabel(t, fixed)}
        </span>
      </p>
    );
  /* Each command in the list carries its waiting count, red once one is
     late, so the officer picks the command that needs them from the list
     itself rather than from memory of the board. */
  const waiting = (state: string) => {
    const calls = incidents.filter(
      (i) => i.status === "New" && i.where.state === state,
    );
    if (!calls.length) return undefined;
    const late = calls.some((i) => isOverdue(i, now));
    return (
      <span
        aria-label={t("{n} waiting", { n: calls.length })}
        className={`grid h-5 min-w-5 shrink-0 place-items-center rounded-full px-1.5 font-mono text-2xs font-semibold text-white ${
          late ? "bg-ops-p1" : "bg-ops-p2"
        }`}
      >
        {calls.length}
      </span>
    );
  };

  return (
    <OpsPicker
      label={t("Command in view")}
      value={viewing ?? ""}
      onPick={(v) => setViewing(v || undefined)}
      search={t("Find a command")}
      empty={t("No command matches")}
      width="20rem"
      groups={zone ? [
        { items: [{ value: "", label: t(zone.name) }] },
        {
          label: t(zone.name),
          items: zone.states.map((name) => ({
            value: name,
            label: commandLabel(t, name),
            badge: waiting(name),
          })),
        },
      ] : [
        { items: [{ value: "", label: t("All commands") }] },
        ...zones.map((zone) => ({
          label: t(zone),
          items: STATES.filter((s) => s.zone === zone).map((s) => ({
            value: s.name,
            label: commandLabel(t, s.name),
            badge: waiting(s.name),
          })),
        })),
      ]}
      /* The shield says this pill is the console's scope, the same mark a
         command desk sees beside its fixed name. */
      active={!!viewing}
      triggerClassName="npf-select flex max-w-[min(18rem,52vw)] min-w-0 items-center gap-2.5 ps-4 pe-3"
      trigger={
        <>
          <span className="sr-only">{t("Command in view")}: </span>
          <ShieldIcon
            aria-hidden
            className={`size-4 shrink-0 max-sm:hidden ${viewing ? "text-white" : "text-npf-blue"}`}
          />
          <span className="truncate">
            {viewing ? commandLabel(t, viewing) : zone ? t(zone.name) : t("All commands")}
          </span>
          <ChevronDown
            aria-hidden
            className={`npf-ops-chev ms-auto size-4 shrink-0 ${
              viewing ? "text-white" : "text-npf-steel"
            }`}
          />
        </>
      }
    />
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

/**
 * An officer has pressed the emergency button. Red across the top of every
 * screen in the command until a supervisor stands it down: the one alarm the
 * console never lets scroll out of sight.
 */
function Distress({ unit, canOpen }: { unit: Unit; canOpen: boolean }) {
  const t = useT();
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-ops-p1 px-4 py-2.5 text-white sm:px-6 lg:px-8"
    >
      <span aria-hidden className="size-2.5 shrink-0 animate-pulse rounded-full bg-white" />
      <p className="min-w-0 flex-1 text-sm font-semibold">
        {t("Emergency: {unit} ({officer}) needs assistance near {area}.", {
          unit: unit.callsign,
          officer: t(unit.officer),
          area: t(unit.area),
        })}
      </p>
      {canOpen ? (
        <Link
          href={`/app/police/incidents?call=${unit.emergency}`}
          className="inline-flex h-8 items-center rounded-(--ops-control-radius) bg-white px-3 text-xs font-semibold text-ops-p1 hover:bg-white/90"
        >
          {t("Open the call")}
        </Link>
      ) : null}
      <button
        type="button"
        onClick={() => clearEmergency(unit.callsign)}
        className="inline-flex h-8 items-center rounded-(--ops-control-radius) px-3 text-xs font-semibold text-white ring-1 ring-white/60 ring-inset transition-colors hover:bg-white/10"
      >
        {t("Officer safe: stand down")}
      </button>
    </div>
  );
}

/**
 * A link from somewhere else landed on a board the officer's post does not
 * work. Said plainly, with the boards they do have, rather than bouncing
 * them somewhere without a word.
 */
function NotYourPost({ tabs }: { tabs: Tab[] }) {
  const t = useT();
  return (
    <div className="npf-ops-tile mx-auto max-w-xl p-6">
      <h1 className="font-secondary text-lg font-bold text-npf-ink">
        {t("This board is not part of your post")}
      </h1>
      <p className="mt-1 text-sm text-npf-body">{t("Your post works these boards instead.")}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {tabs.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="inline-flex h-9 items-center rounded-(--ops-control-radius) bg-white px-3 text-sm font-medium text-ops-text shadow-[var(--ops-control-rim),var(--ops-control-lift)] hover:bg-ops-hover"
            >
              {t(label)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
