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
    label: "Service requests",
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

/**
 * The console frame: guard, command bar, rail.
 *
 * It deliberately does not use the site's Header and Footer. This is an
 * internal tool, not a page of the website — what an officer needs is four
 * queues, the time, and a way out, and a marketing footer under a live call
 * list would be noise.
 *
 * The frame is fixed to the viewport and the board inside it scrolls. A
 * console that scrolls as one document loses its clock and its queue counts
 * the moment anybody reads to the bottom of a call list, and it leaves a
 * navigation rail that stops in mid-air where the content ran out.
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
        <p className="text-sm text-[var(--ops-dim)]">
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
    <div className="npf-ops flex h-[100dvh] flex-col overflow-hidden">
      {/*
        The command bar. Everything in it is a constant of the shift — who is
        on the desk, which station, what time it is — so it is part of the
        frame and never scrolls.

        The chrome is the Force's navy and the board inside it is light. One
        strong step between the casing and the work is what stops a console of
        white panels on a pale page reading as a single undivided sheet, and
        it is the difference between an instrument and a web page with a
        toolbar on it.
      */}
      <header className="npf-ops-chrome z-30 shrink-0 bg-[var(--ops-chrome)] text-white">
        <div className="flex h-14 items-center gap-2 px-3 sm:gap-4 lg:px-4">
          <Link
            href="/app/police"
            className="flex min-w-0 shrink items-center gap-3 rounded-lg py-1"
          >
            {/* The mark scales to its box; the box is what carries the size. */}
            <span
              role="img"
              aria-label={t("Nigeria Police Force")}
              className="block h-6 shrink-0 sm:h-7"
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
            <div className="hidden text-end leading-tight md:block">
              <p className="text-[13px] font-medium">{t(session.name)}</p>
              <p className="text-[11px] text-[var(--ops-chrome-dim)]">
                {t(session.rank ?? "")} · {t(session.station ?? "")}
              </p>
            </div>
            {/* An officer works a whole shift in here; the language control
                has to be on this bar, not back on the public site. */}
            <LanguageSwitch className="ms-1 border border-[var(--ops-chrome-line)] text-[var(--ops-chrome-dim)] hover:bg-[var(--ops-chrome-raised)] hover:text-white" />
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

        {/*
          The honesty notice. It has to be on every screen of the console and
          it is never the most important thing on any of them, so it rides the
          chrome as a hairline rather than sitting over the board as a full
          amber band louder than the calls underneath it.
        */}
        <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 border-t border-[var(--ops-chrome-line)] bg-[var(--ops-chrome-raised)] px-4 py-1.5 text-[11px] leading-relaxed text-[var(--ops-chrome-dim)] lg:px-5">
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
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <nav
          aria-label={t("Console")}
          className="npf-ops-chrome shrink-0 bg-[var(--ops-chrome)] text-white lg:flex lg:w-[216px] lg:flex-col"
        >
          <ul className="flex gap-1 overflow-x-auto p-2 lg:flex-col lg:overflow-visible lg:p-3">
            {TABS.map(({ href, label, short, Icon }) => {
              const active =
                href === "/app/police" ? path === href : path.startsWith(href);
              return (
                <li key={href} className="shrink-0">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap transition-colors ${
                      active
                        ? "bg-[var(--ops-chrome-raised)] font-medium text-white shadow-[inset_2px_0_0_var(--ops-chrome-gold)]"
                        : "text-[var(--ops-chrome-dim)] hover:bg-[var(--ops-chrome-raised)]/60 hover:text-white"
                    }`}
                  >
                    <Icon className="size-[18px] shrink-0" />
                    <span className="lg:hidden">{t(short)}</span>
                    <span className="hidden lg:inline">{t(label)}</span>
                    {counts[href] ? (
                      <span
                        className={`ms-auto rounded px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${
                          active
                            ? "bg-[var(--ops-chrome-gold)] text-[var(--ops-chrome)]"
                            : "bg-[var(--ops-chrome-line)] text-white"
                        }`}
                      >
                        {counts[href]}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden p-3 lg:mt-auto lg:block">
            <Link
              href="/app/home"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--ops-chrome-dim)] transition-colors hover:bg-[var(--ops-chrome-raised)] hover:text-white"
            >
              <ArrowUpRight className="size-4 shrink-0" />
              {t("Public site")}
            </Link>
          </div>
        </nav>

        {/* The one scrolling surface. min-h-0 lets it actually shrink inside
            the flex column instead of pushing the frame past the viewport. */}
        <main
          id="main-content"
          tabIndex={-1}
          className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-[var(--ops-bg)] px-4 py-5 outline-none lg:px-6 lg:py-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

/**
 * The shift clock, kept in its own component on purpose.
 *
 * It reads the shared tick, which changes every second. Left in the shell it
 * re-rendered the whole console frame — rail, banner, board and all — once a
 * second to move two digits. Down here the per-second work is a clock and
 * nothing else.
 */
function ShiftClock() {
  const t = useT();
  const now = useNow();
  const mounted = useMounted();
  const time = mounted ? clock.format(new Date(now)) : "--:--";
  const shift = mounted ? shiftOf(new Date(now)) : "—";

  return (
    <p className="ms-auto flex shrink-0 items-center gap-2.5 rounded-lg border border-[var(--ops-chrome-line)] bg-[var(--ops-chrome-raised)]/60 px-2.5 py-1.5 sm:px-3">
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
