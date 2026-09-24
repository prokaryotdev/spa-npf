"use client";

import Link from "../i18n/Link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  emergencyNumbers as emergencyNumbersSource,
  navigation as navigationSource,
} from "../content";
import { useT, useLocalized } from "../i18n/client";
import { stripLocale } from "../i18n/path";
import AccountLink from "./AccountLink";
import LanguageSwitch from "./LanguageSwitch";
import ServiceSearch from "./ServiceSearch";
import {
  AccessibilityIcon,
  ArrowRight,
  CallIcon,
  ChevronDown,
  CloseIcon,
  MenuIcon,
  SearchIcon,
} from "./icons";
import { PoliceWordmark } from "./Wordmark";
import { useDialog } from "./useDialog";

/**
 * The emergency line, one tap away on every page. It lives in the header
 * because the header is the one thing that never scrolls out of reach, so
 * nothing has to float over the content to keep 112 close. It is the alarm
 * red, the one place the header breaks from navy, with white type that holds
 * on the dark hero and the white scrolled bar alike. It is the same pill as
 * Sign In beside it, one line, so the two read as a pair and only the colour
 * says which one matters. From lg a quiet "Emergency" says what the number is
 * for; below that the handset and the number carry it alone. The number comes
 * from content.ts, like the footer's copy of it.
 */
function CallButton({ onDark }: { onDark: boolean }) {
  const t = useT();
  const [emergency] = useLocalized(emergencyNumbersSource);
  return (
    <a
      href={`tel:${emergency.number}`}
      className={`group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-npf-alert ps-3.5 pe-4 text-white shadow-card transition-[background-color,scale] hover:bg-npf-alert-deep active:scale-[0.97] active:duration-(--dur-press) ${
        onDark ? "focus-visible:outline-white" : "focus-visible:outline-npf-alert"
      }`}
    >
      {/*
        The handset is drawn in the top of its box. The nudges line its ink
        up with the caps, a hair above the pill's middle, where the eye reads
        it as centred.
      */}
      <CallIcon className="size-[18px] shrink-0 translate-y-[1.5px] transition-[rotate] group-hover:-rotate-12" />
      <span className="flex -translate-y-px items-baseline gap-1.5 leading-none">
        <span className="hidden font-medium text-white/85 lg:inline">
          {t("Emergency")}
        </span>
        <span className="sr-only">{t("Call")} </span>
        <span className="font-secondary text-base font-bold tabular-nums">
          {emergency.number}
        </span>
      </span>
      <span className="sr-only">, {emergency.note}</span>
    </a>
  );
}

/**
 * The nav item for the page you are on: the longest href the path starts
 * with, so Application Status wins over Services and Information over Home.
 * The bare root is the home page.
 */
function useCurrent(hrefs: string[]) {
  const { rest } = stripLocale(usePathname() ?? "/");
  const path = rest === "/" ? "/app/home" : rest;
  return hrefs
    .filter((href) => path === href || path.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];
}

/**
 * One row from xl: the police mark, the sections centred, the tools. Only
 * Sign In is the Force's blue and 112 the alarm red; the rest are plain, so
 * the header has two filled controls and nothing else shouting. Below xl it is
 * the phone header: menu, mark, 112, search.
 *
 * `solid` is for pages that open on content rather than a dark hero, where the
 * transparent-over-photo treatment would leave white text on white.
 */
export default function Header({ solid = false }: { solid?: boolean }) {
  const navigation = useLocalized(navigationSource);
  const t = useT();
  const current = useCurrent(navigation.map((item) => item.href));
  const marker = useRef<HTMLDivElement>(null);
  const [atTop, setAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bigText, setBigText] = useState(false);
  const scrolled = solid || !atTop;

  useEffect(() => {
    document.documentElement.classList.toggle("npf-large-text", bigText);
  }, [bigText]);

  // The marker covers the first 80px of the page; once it has scrolled out,
  // the header turns solid. One observer instead of a handler per scroll.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setAtTop(entry.isIntersecting),
    );
    if (marker.current) observer.observe(marker.current);
    return () => observer.disconnect();
  }, []);

  // showModal/close drive the drawer; the browser locks background scrolling.
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const menu = useDialog(menuOpen, closeMenu);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const searchDialog = useDialog(searchOpen, closeSearch);

  const ink = scrolled ? "text-npf-ink" : "text-white";
  const ghost = scrolled ? "hover:bg-npf-ink/[0.06]" : "hover:bg-white/10";
  const round = `grid size-11 place-items-center rounded-full transition-[background-color,scale] active:scale-[0.97] active:duration-(--dur-press) ${ghost}`;

  return (
    <>
      <div
        ref={marker}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-20 w-px"
      />
      <header
        className={`fixed top-0 left-0 z-50 w-full border-b transition-[background-color,border-color] duration-(--dur-media) ${
          scrolled
            ? "border-npf-ink/[0.08] bg-white/90 backdrop-blur-xl"
            : "border-white/15 bg-gradient-to-b from-npf-night/60 to-transparent"
        }`}
      >
        <div className="npf-container">
          {/* Phone and tablet */}
          <div className="flex items-center justify-between gap-3 pt-5 pb-2 xl:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t("Open menu")}
              aria-expanded={menuOpen}
              className={`grid size-11 place-items-center rounded-full transition-colors ${
                scrolled ? "bg-npf-ink/[0.06] text-npf-ink" : "bg-white/15 text-white"
              }`}
            >
              <MenuIcon className="size-5" />
            </button>
            <Link
              href="/app/home"
              aria-label={t("Nigeria Police Force home")}
              className={`h-9 transition-colors duration-(--dur-media) ${
                scrolled ? "text-npf-blue-deep" : "text-white"
              }`}
            >
              <PoliceWordmark className="h-full w-auto" />
            </Link>
            <div className="flex items-center gap-2">
              <CallButton onDark={!scrolled} />
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label={t("Search")}
                aria-expanded={searchOpen}
                className={`grid size-11 place-items-center rounded-full transition-colors ${
                  scrolled ? "bg-npf-ink/[0.06] text-npf-ink" : "bg-white/15 text-white"
                }`}
              >
                <SearchIcon className="size-5" />
              </button>
            </div>
          </div>

          {/* Desktop */}
          <nav
            aria-label={t("Main")}
            className={`hidden h-[72px] items-center gap-8 xl:flex ${ink}`}
          >
            <Link
              href="/app/home"
              aria-label={t("Nigeria Police Force home")}
              className={`h-10 shrink-0 transition-colors duration-(--dur-media) ${
                scrolled ? "text-npf-blue-deep" : "text-white"
              }`}
            >
              <PoliceWordmark className="h-full w-auto" />
            </Link>

            <ul className="mx-auto flex items-center">
              {navigation.map((item) => {
                const here = item.href === current;
                return (
                  <li key={item.label} className="group relative">
                    <Link
                      href={item.href}
                      aria-current={here ? "page" : undefined}
                      aria-haspopup={item.children ? "true" : undefined}
                      className={`relative inline-flex items-center gap-1 px-3 py-6 font-medium whitespace-nowrap transition-opacity 2xl:px-4 ${
                        scrolled ? "before:bg-npf-gold" : "before:bg-npf-gold-soft"
                      } before:absolute before:inset-x-3 before:bottom-4 before:h-0.5 before:origin-left before:rounded-full before:transition-[scale] 2xl:before:inset-x-4 rtl:before:origin-right ${
                        here
                          ? "before:scale-x-100"
                          : "opacity-85 before:scale-x-0 group-hover:opacity-100 group-hover:before:scale-x-100"
                      }`}
                    >
                      {t(item.label)}
                      {item.children ? (
                        <ChevronDown className="size-4 opacity-70 transition-[rotate] group-hover:rotate-180" />
                      ) : null}
                    </Link>
                    {item.children ? (
                      // pt-2 is the bridge the pointer crosses from the link
                      // to the panel without the hover dropping.
                      <div className="invisible absolute top-full left-1/2 z-50 -translate-x-1/2 translate-y-1 pt-2 opacity-0 transition-[opacity,translate,visibility] group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                        <ul className="w-[320px] rounded-card bg-white p-2 text-npf-ink shadow-raised ring-1 ring-npf-ink/[0.06]">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <Link
                                href={child.href}
                                className="group/item flex items-center justify-between gap-3 rounded-chip px-4 py-3 transition-colors hover:bg-npf-blue/[0.06] hover:text-npf-blue-deep"
                              >
                                {t(child.label)}
                                <ArrowRight className="size-4 shrink-0 -translate-x-1 opacity-0 transition-[opacity,translate] group-hover/item:translate-x-0 group-hover/item:opacity-100 rtl:-scale-x-100" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            <ul className="flex shrink-0 items-center gap-1">
              <li>
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label={t("Search")}
                  aria-expanded={searchOpen}
                  className={round}
                >
                  <SearchIcon className="size-5" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setBigText((v) => !v)}
                  aria-pressed={bigText}
                  aria-label={t("Larger text")}
                  title={t("Larger text")}
                  className={`${round} ${
                    bigText ? "bg-npf-blue text-white hover:bg-npf-blue" : ""
                  }`}
                >
                  <AccessibilityIcon className="size-5" />
                </button>
              </li>
              <li className="flex">
                <LanguageSwitch className={`h-11 ${ghost}`} />
              </li>
              <li className="ms-1 flex">
                <AccountLink />
              </li>
              <li className="ms-2 flex">
                <CallButton onDark={!scrolled} />
              </li>
            </ul>
          </nav>
        </div>

      {/*
        Search overlay. The box needs room for its suggestion panel and the
        page behind it is irrelevant while you are typing, so it opens as a
        sheet under the header rather than expanding inside the nav bar.
      */}
      <dialog
        ref={searchDialog}
        aria-label={t("Search Nigeria Police Force")}
        onClick={(e) => {
          if (e.target === searchDialog.current) setSearchOpen(false);
        }}
        className="npf-search-sheet m-0 mt-0 w-full max-w-none bg-transparent p-4 pt-24 md:pt-28"
      >
        <div className="mx-auto w-full max-w-[680px]">
          {/* Mounted only while open so autoFocus fires on every opening. */}
          {searchOpen ? (
            <ServiceSearch
              variant="hero"
              autoFocus
              placeholder={t("Search for a service, news or page")}
              onNavigate={closeSearch}
            />
          ) : null}
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            className="mx-auto mt-4 flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            <CloseIcon className="size-4" />
            {t("Close")}
          </button>
        </div>
      </dialog>

      {/*
        Slide-out menu. A <dialog> so the browser handles Escape, the focus
        trap, the background scroll lock and keeping the contents out of the
        tab order while closed — all of which this used to do by hand, badly.
      */}
      <dialog
        ref={menu}
        aria-label={t("Main menu")}
        // A click that lands on the dialog itself landed on the backdrop.
        onClick={(e) => {
          if (e.target === menu.current) setMenuOpen(false);
        }}
        className="npf-drawer m-0 h-[100dvh] max-h-none w-[min(420px,88vw)] max-w-none overflow-y-auto bg-white p-6 shadow-2xl"
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="h-9 text-npf-blue-deep">
            <PoliceWordmark className="h-full w-auto" />
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label={t("Close menu")}
            className="grid size-11 place-items-center rounded-full bg-npf-ink/[0.06] text-npf-ink transition-[background-color,scale] hover:bg-npf-ink/10 active:scale-[0.97]"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>
        {/* One handler for every link inside; clicks bubble up here. */}
        <ul className="space-y-1" onClick={() => setMenuOpen(false)}>
          {navigation.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={item.href === current ? "page" : undefined}
                className={`npf-h4 block rounded-chip px-4 py-3 transition-colors hover:bg-npf-blue/[0.06] ${
                  item.href === current
                    ? "bg-npf-blue/[0.06] text-npf-blue-deep"
                    : "text-npf-ink"
                }`}
              >
                {t(item.label)}
              </Link>
              {item.children ? (
                <ul className="mt-1 mb-3 ms-4 border-s border-npf-ink/10 ps-3">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <Link
                        href={child.href}
                        className="block rounded-chip px-3 py-2.5 text-npf-body transition-colors hover:bg-npf-blue/[0.06] hover:text-npf-blue-deep"
                      >
                        {t(child.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="mt-8 space-y-3">
          <AccountLink block onNavigate={closeMenu} />
          {/* The drawer is the only place a phone can reach the switch. */}
          <LanguageSwitch
            block
            className="border border-npf-ink/10 py-3 text-npf-ink hover:bg-npf-ink/[0.04]"
          />
        </div>
      </dialog>
      </header>
    </>
  );
}
