"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import LanguageSwitch from "./LanguageSwitch";
import { resetDemo, signOut, useStore } from "./store";
import { useMounted, useNow } from "./OpsPieces";
import { useT } from "../i18n/client";
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

/** Dubai control rooms run three eight-hour reliefs; A starts at 06:00. */
function shiftOf(d: Date) {
  const h = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Asia/Dubai",
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
  timeZone: "Asia/Dubai",
});

/**
 * The console frame: guard, command bar, rail.
 *
 * It deliberately does not use the site's Header and Footer. This is an
 * internal tool, not a page of the website — what an officer needs is four
 * queues, the time, and a way out, and a marketing footer under a live call
 * list would be noise.
 */
export default function OpsShell({ children }: { children: React.ReactNode }) {
  const t = useT();
  const router = useRouter();
  const path = usePathname();
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
      <div className="dp-ops grid min-h-[100dvh] place-items-center">
        <p className="text-sm text-[var(--ops-dim)]">
          {t("Checking credentials…")}
        </p>
      </div>
    );

  if (!officer)
    return (
      <div className="dp-ops grid min-h-[100dvh] place-items-center px-6">
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
              "You are signed in as {name}, a public account. The operations console is for Dubai Police personnel.",
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
    <div className="dp-ops min-h-[100dvh]">
      {/*
        The command bar. Everything in it is a constant of the shift — who is
        on the desk, which station, what time it is — so it stays pinned while
        the boards under it scroll.
      */}
      <header className="sticky top-0 z-30 border-b border-[var(--ops-line)] bg-[var(--ops-bg)]/95 backdrop-blur">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 lg:px-6">
          <Link href="/app/police" className="flex items-center gap-3">
            {/* .dp-logo fills its box, so the box is what carries the size. */}
            <span
              role="img"
              aria-label={t("Dubai Police")}
              className="block h-7 w-[86px] shrink-0 text-[var(--ops-text)]"
            >
              <span aria-hidden className="dp-logo dp-logo-police" />
            </span>
            <span className="border-s border-[var(--ops-line)] ps-3 font-secondary text-[11px] leading-tight font-bold tracking-[0.16em] text-[var(--ops-accent)] uppercase">
              {t("Command")}
              <br />
              {t("& Control")}
            </span>
          </Link>

          <ShiftClock />

          <div className="flex items-center gap-3 border-[var(--ops-line)] ps-0 sm:border-s sm:ps-5">
            <div className="text-end">
              <p className="text-sm font-medium">{t(session.name)}</p>
              <p className="text-[11px] text-[var(--ops-dim)]">
                {t(session.rank ?? "")} · {t(session.station ?? "")}
              </p>
            </div>
            {/* An officer works a whole shift in here; the language control
                has to be on this bar, not back on the public site. */}
            <LanguageSwitch className="border border-[var(--ops-line)] text-[var(--ops-dim)] hover:bg-[var(--ops-raised)] hover:text-[var(--ops-text)]" />
            <button
              type="button"
              onClick={() => {
                signOut();
                router.push("/app/home");
              }}
              title={t("End shift")}
              className="grid size-9 place-items-center rounded-lg border border-[var(--ops-line)] text-[var(--ops-dim)] transition-colors hover:border-[var(--ops-p1)]/40 hover:text-[var(--ops-p1)]"
            >
              <SignOutIcon className="size-4" />
              <span className="sr-only">{t("End shift")}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[212px_1fr]">
        <nav
          aria-label={t("Console")}
          className="border-b border-[var(--ops-line)] lg:sticky lg:top-[61px] lg:h-[calc(100dvh-61px)] lg:border-e lg:border-b-0"
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
                        ? "bg-[var(--ops-raised)] font-medium text-[var(--ops-text)] shadow-[inset_2px_0_0_var(--ops-accent)]"
                        : "text-[var(--ops-dim)] hover:bg-[var(--ops-panel)] hover:text-[var(--ops-text)]"
                    }`}
                  >
                    <Icon className="size-[18px] shrink-0" />
                    <span className="lg:hidden">{t(short)}</span>
                    <span className="hidden lg:inline">{t(label)}</span>
                    {counts[href] ? (
                      <span
                        className={`ms-auto rounded px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${
                          active
                            ? "bg-[var(--ops-brand)] text-white"
                            : "bg-[var(--ops-raised)] text-[var(--ops-dim)]"
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

          <div className="hidden border-t border-[var(--ops-line)] p-3 lg:mt-auto lg:block">
            <Link
              href="/app/home"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--ops-dim)] transition-colors hover:bg-[var(--ops-panel)] hover:text-[var(--ops-text)]"
            >
              <ArrowUpRight className="size-4 shrink-0" />
              {t("Public site")}
            </Link>
          </div>
        </nav>

        <main id="main-content" tabIndex={-1} className="min-w-0 outline-none">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-[var(--ops-line)] bg-[#2a1f06] px-4 py-2 text-xs leading-relaxed text-[#f4dca8] lg:px-6">
            <AlertIcon aria-hidden className="size-4 shrink-0" />
            {t(
              "Illustrative data — a rebuild of the Dubai Police website, connected to no operational system.",
            )}
            <button
              type="button"
              onClick={resetDemo}
              className="font-medium underline underline-offset-2 hover:text-white"
            >
              {t("Reset the demo")}
            </button>
          </p>
          <div className="px-4 py-5 lg:px-6 lg:py-6">{children}</div>
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
    <p className="ms-auto flex items-baseline gap-2 font-secondary text-xl font-bold tabular-nums">
      <span dir="ltr" className="flex items-baseline gap-2">
        {time.slice(0, 2)}
        <span className="dp-ops-tick -mx-1">:</span>
        {time.slice(3)}
      </span>
      <span className="font-primary text-[11px] font-normal tracking-[0.12em] text-[var(--ops-dim)] uppercase">
        {t("GST · Shift {shift}", { shift: t(shift) })}
      </span>
    </p>
  );
}
