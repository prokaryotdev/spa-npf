"use client";

import Link from "../i18n/Link";
import { usePathname } from "next/navigation";
import { stripLocale } from "../i18n/path";
import { useRouter } from "../i18n/Link";
import { Fragment, useEffect, useLayoutEffect, useRef } from "react";
import LanguageSwitch from "./LanguageSwitch";
import { signOut, useStore } from "./store";
import { useMounted, useNow } from "./OpsPieces";
import { useT } from "../i18n/client";
import { PoliceWordmark } from "./Wordmark";
import { ShieldIcon, SignOutIcon } from "./icons";
import {
  BoardGlyph,
  CallsGlyph,
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

  /*
   * Each badge says what its number counts, and colours it only when the
   * colour means something: red while a call sits unassigned, green for
   * units free to send. A grey 7 next to "Calls" said nothing about whether
   * anyone needed to look.
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
      tone: waiting ? "alert" : undefined,
    },
    "/app/police/units": {
      n: free,
      note: t("{n} available", { n: free }),
      tone: "ok",
    },
    "/app/police/requests": {
      n: pending,
      note: t("{n} pending", { n: pending }),
    },
  };

  if (!loaded || !session)
    return (
      <div className="npf-ops grid min-h-[100dvh] place-items-center">
        <p className="flex items-center gap-3 text-sm text-ops-dim">
          <ShieldIcon
            aria-hidden
            className="size-5 animate-pulse text-ops-accent"
          />
          {t("Checking credentials…")}
        </p>
      </div>
    );

  if (!officer)
    return (
      <div className="npf-ops grid min-h-[100dvh] place-items-center px-6">
        <div className="max-w-[46ch] text-center">
          <ShieldIcon aria-hidden className="mx-auto size-10 text-ops-accent" />
          <h1 className="mt-4 font-secondary text-2xl font-bold">
            {t("Force credentials required")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ops-dim">
            {t(
              "You are signed in as {name}, a public account. The operations console is for Nigeria Police Force personnel.",
              { name: session.name },
            )}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/app/portal"
              className="rounded-chip bg-ops-brand px-4 py-2 text-sm font-medium text-white transition-[background-color,color,scale] not-disabled:active:scale-[0.97] active:duration-(--dur-press) hover:bg-ops-brand-lift"
            >
              {t("Go to my account")}
            </Link>
            <button
              type="button"
              onClick={() => {
                signOut();
                router.push("/app/signin?next=/app/police");
              }}
              className="rounded-chip bg-white/[0.08] px-4 py-2 text-sm font-medium transition-[background-color,color,scale] not-disabled:active:scale-[0.97] active:duration-(--dur-press) hover:bg-white/[0.12]"
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

        The bar is a macOS toolbar: the window itself, frosted, with one
        faint hairline under it, so calls scrolling beneath it stay softly
        visible and the frame never outshouts the board.
      */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ops-chrome/72 text-ops-text backdrop-blur-2xl backdrop-saturate-150">
        <div className="mx-auto flex h-13 max-w-450 items-center gap-3 px-3 sm:px-4 lg:gap-4 lg:px-6">
          <Link
            href="/app/police"
            className="flex shrink-0 items-center gap-3 rounded-chip py-1"
          >
            {/* The mark scales to its box; the box is what carries the size. */}
            <span
              role="img"
              aria-label={t("Nigeria Police Force")}
              className="block h-7 shrink-0"
            >
              <PoliceWordmark className="h-full w-auto" />
            </span>
            <span className="hidden border-s border-white/10 ps-3 font-secondary text-[0.9375rem] leading-none font-bold tracking-[-0.01em] whitespace-nowrap sm:block">
              {t("Command")} {t("& Control")}
            </span>
          </Link>

          <ShiftClock />

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-2.5 md:flex lg:hidden">
              <span
                aria-hidden
                className="npf-ops-avatar grid size-8 shrink-0 place-items-center rounded-full font-secondary text-xs font-bold tracking-wide text-white"
              >
                {initials(session.name)}
              </span>
              <span className="hidden text-start leading-tight xl:block">
                <span className="block text-meta font-medium">
                  {t(session.name)}
                </span>
                <span className="block text-2xs text-ops-chrome-dim">
                  {t(session.rank ?? "")} · {t(session.station ?? "")}
                </span>
              </span>
            </span>
            {/* An officer works a whole shift in here; the language control
                has to be on this bar, not back on the public site. */}
            <LanguageSwitch
              tone="dark"
              className="h-8 rounded-chip px-3! py-0! bg-white/[0.07] text-ops-text hover:bg-white/[0.12]"
            />
            <button
              type="button"
              onClick={() => {
                signOut();
                router.push("/app/home");
              }}
              title={t("End shift")}
              className="grid size-8 place-items-center rounded-chip bg-white/[0.07] text-ops-text transition-colors hover:bg-ops-p1/20 hover:text-[#ff6961]"
            >
              <SignOutIcon className="size-4" />
              <span className="sr-only">{t("End shift")}</span>
            </button>
          </div>
        </div>

        <Tabs
          path={path}
          counts={counts}
          className="h-12 px-3 pb-2.5 sm:px-4 lg:hidden"
        />
      </header>

      <div className="mx-auto flex w-full max-w-450 flex-1 gap-8 px-4 sm:px-5 lg:px-6">
        <Rail path={path} counts={counts} officer={session} />

        <main
          id="main-content"
          tabIndex={-1}
          className="min-w-0 flex-1 pt-6 pb-10 outline-none lg:pt-8 lg:pb-12"
        >
          {children}
        </main>
      </div>

    </div>
  );
}

type Count = { n: number; note: string; tone?: "alert" | "ok" };

/** A queue's count, its colour carrying the one thing worth a glance. */
function Badge({
  count,
  active,
  className = "",
}: {
  count?: Count;
  active: boolean;
  className?: string;
}) {
  if (!count?.n) return null;
  // A sidebar count is plain secondary text, the way Mail and Finder set
  // theirs; only calls left waiting earn the red capsule.
  const tone =
    count.tone === "alert"
      ? "rounded-full bg-ops-p1 px-1.5 font-semibold text-white"
      : active
        ? "text-ops-text"
        : "text-ops-dim";
  return (
    <span
      title={count.note}
      className={`min-w-5 py-px text-center text-xs tabular-nums ${tone} ${className}`}
    >
      <span aria-hidden>{count.n}</span>
      <span className="sr-only">{count.note}</span>
    </span>
  );
}

/**
 * The console's four destinations on a desk. It pins under the command bar,
 * so the queue counts are still readable from the bottom of a call list.
 */
function Rail({
  path,
  counts,
  officer,
}: {
  path: string;
  counts: Record<string, Count>;
  officer: { name: string; rank?: string; station?: string };
}) {
  const t = useT();
  const nav = useRef<HTMLElement>(null);
  const pill = useRef<HTMLSpanElement>(null);

  /*
   * One highlight that glides to the current destination, rather than one
   * per link that blinks off here and on there. The rail lives in the
   * layout, so it survives the route change and has somewhere to glide from.
   * Written straight to the element: it is a position, not React state.
   */
  useLayoutEffect(() => {
    const el = pill.current;
    const at = nav.current?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!el) return;
    if (!at) {
      el.style.opacity = "0";
      return;
    }
    el.style.opacity = "1";
    el.style.height = `${at.offsetHeight}px`;
    el.style.transform = `translateY(${at.offsetTop}px)`;
    // The first placement lands; only moves after it glide.
    if (!el.dataset.ready) {
      void el.offsetHeight;
      el.dataset.ready = "1";
    }
  }, [path]);

  return (
    /*
     * A macOS sidebar: no boxes, just who holds the desk and where they can
     * go, set straight on the window. The officer moves here from the
     * toolbar on a desk-width screen, where there is room to name them.
     */
    <aside className="sticky top-[var(--ops-top)] hidden h-fit w-56 shrink-0 flex-col gap-6 py-8 lg:flex">
      <section className="px-2">
        <h2 className="sr-only">{t("Duty officer")}</h2>
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="npf-ops-avatar relative grid size-10 shrink-0 place-items-center rounded-full font-secondary text-sm font-bold tracking-wide text-white"
          >
            {initials(officer.name)}
            <span className="absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 border-ops-bg bg-ops-ok" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-medium">
              {t(officer.name)}
            </span>
            <span className="mt-0.5 block truncate text-2xs text-ops-dim">
              {t(officer.rank ?? "")} · {t(officer.station ?? "")}
            </span>
          </span>
        </div>
      </section>

      <nav
        ref={nav}
        aria-label={t("Console")}
        className="relative flex flex-col gap-0.5"
      >
        <span
          ref={pill}
          aria-hidden
          className="npf-ops-pill pointer-events-none absolute inset-x-0 top-0 rounded-chip bg-white/[0.09] opacity-0"
        />
        {TABS.map(({ href, label, Icon }, i) => {
          const active =
            href === "/app/police" ? path === href : path.startsWith(href);
          return (
            <Fragment key={href}>
              {/* The board is the overview; a little air sets the three
                queues an officer works apart from it. */}
              {i === 1 ? <span aria-hidden className="h-3" /> : null}
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`group relative flex h-9 items-center gap-2.5 rounded-chip px-2.5 text-sm transition-[background-color,color,scale] duration-150 active:scale-[0.98] active:duration-(--dur-press) ${
                  active
                    ? "font-medium text-ops-text"
                    : "text-ops-text/85 hover:bg-white/[0.05]"
                }`}
              >
                {/* Sidebar symbols in the accent, as in Finder and Mail. */}
                <Icon className="size-5.5 shrink-0 text-ops-accent" />
                <span className="truncate">{t(label)}</span>
                <Badge
                  count={counts[href]}
                  active={active}
                  className="ms-auto"
                />
              </Link>
            </Fragment>
          );
        })}
      </nav>
    </aside>
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
  counts: Record<string, Count>;
  className: string;
}) {
  const t = useT();
  return (
    <nav aria-label={t("Console")} className={className}>
      {/* An Apple segmented control: one recessed track, the current
          destination a raised segment inside it. */}
      <div className="flex h-full gap-0.5 rounded-[10px] bg-white/[0.07] p-0.5">
      {TABS.map(({ href, short, Icon }) => {
        const active =
          href === "/app/police" ? path === href : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex h-full min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[8px] px-1.5 text-sm whitespace-nowrap transition-[background-color,color,box-shadow] duration-200 sm:gap-2 sm:px-3 ${
              active
                ? "bg-[#4a4c54] font-medium text-white shadow-[0_1px_3px_rgb(0_0_0/0.35),inset_0_1px_0_rgb(255_255_255/0.08)]"
                : "text-ops-text/75 hover:text-white"
            }`}
          >
            {/*
              The icon is the first thing to go on a narrow phone. Four tabs,
              each holding an icon, a word and a count, left 90px a tab at
              390px — and what got dropped was the word, so the console
              shipped a navigation bar reading "C… U… R…". The label is the
              part that names the destination; the icon is the decoration.
            */}
            <Icon className="hidden size-5 shrink-0 sm:block" />
            <span className="truncate text-xs sm:text-[0.8125rem]">
              {t(short)}
            </span>
            <Badge count={counts[href]} active={active} />
          </Link>
        );
      })}
      </div>
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
    <p className="ms-auto flex shrink-0 items-baseline gap-2 px-1">
      <span
        dir="ltr"
        className="flex items-baseline font-secondary text-[0.9375rem] leading-none font-bold tabular-nums"
      >
        {time.slice(0, 2)}
        <span className="npf-ops-tick px-px">:</span>
        {time.slice(3)}
      </span>
      <span className="hidden font-primary text-[0.8125rem] leading-none text-ops-dim sm:inline">
        {t("WAT · Shift {shift}", { shift: t(shift) })}
      </span>
    </p>
  );
}
