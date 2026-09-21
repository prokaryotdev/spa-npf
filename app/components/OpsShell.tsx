"use client";

import Link from "../i18n/Link";
import { usePathname } from "next/navigation";
import { stripLocale } from "../i18n/path";
import { useRouter } from "../i18n/Link";
import { useEffect } from "react";
import LanguageSwitch from "./LanguageSwitch";
import { resetDemo, signOut, useStore } from "./store";
import { useMounted, useNow } from "./OpsPieces";
import { useT } from "../i18n/client";
import { PoliceWordmark } from "./Wordmark";
import {
  AlertIcon,
  ArrowUpRight,
  InboxIcon,
  LayersIcon,
  RadioIcon,
  ShieldIcon,
  SignOutIcon,
} from "./icons";

const TABS = [
  {
    href: "/app/police",
    label: "Command board",
    short: "Board",
    Icon: RadioIcon,
  },
  {
    href: "/app/police/incidents",
    label: "Calls",
    short: "Calls",
    Icon: AlertIcon,
  },
  {
    href: "/app/police/units",
    label: "Units",
    short: "Units",
    Icon: LayersIcon,
  },
  {
    href: "/app/police/requests",
    label: "Requests",
    short: "Requests",
    Icon: InboxIcon,
  },
];

/** Abuja control rooms run three eight-hour reliefs; A starts at 06:00. */
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

/** The officer's initials, for the identity chip on the command bar. */
function initials(name: string) {
  return name
    .replace(/\b(insp|sgt|cpl|asp|dsp|csp|acp|dr|mr|mrs|ms)\.?\s*/gi, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * The console frame: guard, command bar, tab strip.
 *
 * It deliberately does not use the site's Header and Footer. This is an
 * internal tool, not a page of the website — what an officer needs is four
 * queues, the time, and a way out, and a marketing footer under a live call
 * list would be noise.
 *
 * The frame is one navy bar and the document does the scrolling. It used to
 * be a fixed viewport-height shell with the board scrolling inside it, which
 * meant two scrollbars on every screen, a table head that pinned to the wrong
 * box, and a trackpad that did nothing whenever the pointer sat over the
 * frame. One page, one scrollbar; the bar stays put by being sticky, which
 * is the same promise without the second scroll container.
 *
 * The four destinations sit in a rail from 1024px up and fold into a row
 * under the command bar below that. The rail carries no fill of its own: a
 * 216px slab of navy holding four items was a fifth of a column of content
 * and four fifths of nothing, and on a laptop it was the largest and emptiest
 * element on the screen. Unfilled, the column is only as tall as what is in
 * it, and the ground behind it is the board's.
 */
export default function OpsShell({ children }: { children: React.ReactNode }) {
  const t = useT();
  const router = useRouter();
  /*
   * usePathname reports the rewritten path on the server and the locale-
   * prefixed one in the browser, so comparing it raw against an unprefixed
   * TABS href matched during the server render and stopped matching the
   * moment React took over: the console has been shipping with no tab ever
   * marked current, and no aria-current for a screen reader either.
   */
  const path = stripLocale(usePathname()).rest;
  const { session, incidents, requests, units, loaded } = useStore();

  const officer = session?.role === "officer";

  useEffect(() => {
    if (!loaded) return;
    if (!session)
      router.replace(`/app/signin?next=${encodeURIComponent(path)}`);
  }, [loaded, session, router, path]);

  const counts: Record<string, number> = {
    "/app/police/incidents": incidents.filter((i) => i.status !== "Closed")
      .length,
    "/app/police/units": units.filter((u) => u.status === "Available").length,
    "/app/police/requests": requests.filter(
      (r) => r.status !== "Completed" && r.status !== "Rejected",
    ).length,
  };

  if (!loaded || !session)
    return (
      <div className="npf-ops grid min-h-[100dvh] place-items-center">
        <p className="flex items-center gap-3 text-sm text-[var(--ops-dim)]">
          <ShieldIcon
            aria-hidden
            className="size-5 animate-pulse text-[var(--ops-accent)]"
          />
          {t("Checking credentials…")}
        </p>
      </div>
    );

  if (!officer)
    return (
      <div className="npf-ops grid min-h-[100dvh] place-items-center px-6">
        <div className="max-w-[46ch] text-center">
          <ShieldIcon
            aria-hidden
            className="mx-auto size-10 text-[var(--ops-accent)]"
          />
          <h1 className="mt-4 font-secondary text-2xl font-bold">
            {t("Force credentials required")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ops-dim)]">
            {t(
              "You are signed in as {name}, a public account. The operations console is for Nigeria Police Force personnel.",
              { name: session.name },
            )}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/app/portal"
              className="rounded-full bg-[var(--ops-brand)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--ops-brand-lift)]"
            >
              {t("Go to my account")}
            </Link>
            <button
              type="button"
              onClick={() => {
                signOut();
                router.push("/app/signin?next=/app/police");
              }}
              className="rounded-full px-5 py-2.5 text-sm font-medium ring-1 ring-[var(--ops-line)] transition-colors hover:bg-[var(--ops-raised)]"
            >
              {t("Sign in as an officer")}
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="npf-ops flex min-h-[100dvh] flex-col">
      {/*
        The command bar. Everything in it is a constant of the shift — who is
        on the desk, where they are posted, what time it is, and the four
        places they can be — so it sticks to the top of the viewport rather
        than scrolling away with the board.

        The chrome is the Force's navy and the board below it is light. One
        strong step between the casing and the work is what stops a console of
        white panels on a pale page reading as a single undivided sheet, and
        it is the difference between an instrument and a web page with a
        toolbar on it.
      */}
      <header className="npf-ops-chrome sticky top-0 z-40 bg-[var(--ops-chrome)] text-white shadow-[0_1px_0_rgba(255,255,255,0.06),0_10px_24px_-12px_rgba(6,18,40,0.55)]">
        <div className="mx-auto flex h-15 max-w-[1800px] items-center gap-3 px-3 sm:px-4 lg:gap-5 lg:px-5">
          <Link
            href="/app/police"
            className="flex shrink-0 items-center gap-3 rounded-lg py-1"
          >
            {/* The mark scales to its box; the box is what carries the size. */}
            <span
              role="img"
              aria-label={t("Nigeria Police Force")}
              className="block h-7 shrink-0"
            >
              <PoliceWordmark className="h-full w-auto" />
            </span>
            <span className="hidden border-s border-[var(--ops-chrome-line)] ps-3 font-secondary text-[10px] leading-tight font-bold tracking-[0.18em] text-[var(--ops-chrome-gold)] uppercase sm:block">
              {t("Command")}
              <br />
              {t("& Control")}
            </span>
          </Link>

          <ShiftClock />

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-2.5 border-s border-[var(--ops-chrome-line)] ps-3 md:flex">
              <span
                aria-hidden
                className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--ops-chrome-raised)] font-secondary text-[12px] font-bold tracking-wide text-[var(--ops-chrome-gold)]"
              >
                {initials(session.name)}
              </span>
              <span className="hidden text-start leading-tight xl:block">
                <span className="block text-[13px] font-medium">
                  {t(session.name)}
                </span>
                <span className="block text-[11px] text-[var(--ops-chrome-dim)]">
                  {t(session.rank ?? "")} · {t(session.station ?? "")}
                </span>
              </span>
            </span>
            {/* An officer works a whole shift in here; the language control
                has to be on this bar, not back on the public site. */}
            <LanguageSwitch className="border border-[var(--ops-chrome-line)] text-[var(--ops-chrome-dim)] hover:bg-[var(--ops-chrome-raised)] hover:text-white" />
            <button
              type="button"
              onClick={() => {
                signOut();
                router.push("/app/home");
              }}
              title={t("End shift")}
              className="grid size-9 place-items-center rounded-lg border border-[var(--ops-chrome-line)] text-[var(--ops-chrome-dim)] transition-colors hover:border-transparent hover:bg-[var(--ops-p1)] hover:text-white"
            >
              <SignOutIcon className="size-4" />
              <span className="sr-only">{t("End shift")}</span>
            </button>
          </div>
        </div>

        <Tabs
          path={path}
          counts={counts}
          className="grid h-12 grid-cols-4 gap-1 border-t border-[var(--ops-chrome-line)] px-2 pb-2 sm:flex sm:justify-start sm:gap-1 lg:hidden"
        />
      </header>

      {/*
        The honesty notice. It has to be on every screen of the console and it
        is never the most important thing on any of them, so it rides below
        the chrome as a hairline and scrolls away with the board rather than
        holding a permanent amber band over the calls underneath it.
      */}
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 bg-[var(--ops-chrome-raised)] px-4 py-1.5 text-center text-[11px] leading-relaxed text-[var(--ops-chrome-dim)]">
        <AlertIcon
          aria-hidden
          className="size-3.5 shrink-0 text-[var(--ops-chrome-gold)]"
        />
        {t(
          "Illustrative data — a rebuild of the Nigeria Police Force website, connected to no operational system.",
        )}
        <button
          type="button"
          onClick={resetDemo}
          className="rounded font-medium text-white underline decoration-[var(--ops-chrome-gold)] underline-offset-2 hover:decoration-2"
        >
          {t("Reset the demo")}
        </button>
      </p>

      <div className="mx-auto flex w-full max-w-[1800px] flex-1 gap-5 px-3 sm:px-4 lg:px-5">
        <Rail path={path} counts={counts} />

        <main
          id="main-content"
          tabIndex={-1}
          className="min-w-0 flex-1 py-5 outline-none lg:py-6"
        >
          {children}
        </main>
      </div>

      <footer className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-4 px-4 py-4 text-[11px] text-[var(--ops-dim)] lg:px-5">
        <span>
          {t(session.rank ?? "")} · {t(session.station ?? "")}
        </span>
        <Link
          href="/app/home"
          className="inline-flex items-center gap-1.5 rounded transition-colors hover:text-[var(--ops-accent)]"
        >
          {t("Public site")}
          <ArrowUpRight className="size-3.5 shrink-0" />
        </Link>
      </footer>
    </div>
  );
}

/**
 * The console's four destinations on a desk. It pins under the command bar,
 * so the queue counts are still readable from the bottom of a call list.
 */
function Rail({
  path,
  counts,
}: {
  path: string;
  counts: Record<string, number>;
}) {
  const t = useT();
  return (
    <nav
      aria-label={t("Console")}
      className="sticky top-[var(--ops-top)] hidden h-fit w-[196px] shrink-0 flex-col gap-1 py-6 lg:flex"
    >
      {TABS.map(({ href, label, Icon }) => {
        const active =
          href === "/app/police" ? path === href : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active
                ? "bg-[var(--ops-chrome)] font-medium text-white"
                : "text-[var(--ops-text)] hover:bg-[var(--ops-raised)]"
            }`}
          >
            <Icon className="size-[18px] shrink-0" />
            <span className="truncate">{t(label)}</span>
            {counts[href] ? (
              <span
                className={`ms-auto rounded px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${
                  active
                    ? "bg-[var(--ops-chrome-gold)] text-[var(--ops-chrome)]"
                    : "bg-[var(--ops-raised)] text-[var(--ops-dim)]"
                }`}
              >
                {counts[href]}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * The same four destinations below 1024px: a four-up row under the command
 * bar, rather than a horizontally scrolling strip — an officer should not
 * have to swipe a navigation bar to find out the console has a Units board.
 */
function Tabs({
  path,
  counts,
  className,
}: {
  path: string;
  counts: Record<string, number>;
  className: string;
}) {
  const t = useT();
  return (
    <nav aria-label={t("Console")} className={className}>
      {TABS.map(({ href, short, Icon }) => {
        const active =
          href === "/app/police" ? path === href : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex h-full min-w-0 items-center justify-center gap-1.5 rounded-lg px-1.5 text-sm whitespace-nowrap transition-colors sm:gap-2 sm:px-2.5 ${
              active
                ? "bg-[var(--ops-chrome-raised)] font-medium text-white shadow-[inset_0_-2px_0_var(--ops-chrome-gold)]"
                : "text-[var(--ops-chrome-dim)] hover:bg-[var(--ops-chrome-raised)]/60 hover:text-white"
            }`}
          >
            {/*
              The icon is the first thing to go on a narrow phone. Four tabs,
              each holding an icon, a word and a count, left 90px a tab at
              390px — and what got dropped was the word, so the console
              shipped a navigation bar reading "C… U… R…". The label is the
              part that names the destination; the icon is the decoration.
            */}
            <Icon className="hidden size-[18px] shrink-0 sm:block" />
            <span className="truncate text-[11px] sm:text-xs">{t(short)}</span>
            {counts[href] ? (
              <span
                className={`rounded px-1 py-0.5 text-[10px] font-bold tabular-nums sm:px-1.5 sm:text-[11px] ${
                  active
                    ? "bg-[var(--ops-chrome-gold)] text-[var(--ops-chrome)]"
                    : "bg-[var(--ops-chrome-line)] text-white"
                }`}
              >
                {counts[href]}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * The shift clock, kept in its own component on purpose.
 *
 * It reads the shared tick, which changes every second. Left in the shell it
 * re-rendered the whole console frame — bar, tabs, banner, board and all —
 * once a second to move two digits. Down here the per-second work is a clock
 * and nothing else.
 */
function ShiftClock() {
  const t = useT();
  const now = useNow();
  const mounted = useMounted();
  const time = mounted ? clock.format(new Date(now)) : "--:--";
  const shift = mounted ? shiftOf(new Date(now)) : "—";

  return (
    <p className="ms-auto flex shrink-0 items-center gap-2.5 rounded-lg border border-[var(--ops-chrome-line)] bg-[var(--ops-chrome-raised)]/50 px-2.5 py-1.5 sm:px-3">
      <span
        dir="ltr"
        className="flex items-baseline font-secondary text-lg leading-none font-bold tabular-nums"
      >
        {time.slice(0, 2)}
        <span className="npf-ops-tick px-px">:</span>
        {time.slice(3)}
      </span>
      <span className="hidden font-primary text-[10px] leading-tight font-medium tracking-[0.1em] text-[var(--ops-chrome-dim)] uppercase sm:inline">
        {t("WAT · Shift {shift}", { shift: t(shift) })}
      </span>
    </p>
  );
}
