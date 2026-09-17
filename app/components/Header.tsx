"use client";

import Link from "../i18n/Link";
import { useCallback, useEffect, useState } from "react";
import { navigation as navigationSource } from "../content";
import { useT, useLocalized } from "../i18n/client";
import AccountLink from "./AccountLink";
import LanguageSwitch from "./LanguageSwitch";
import ServiceSearch from "./ServiceSearch";
import {
  AccessibilityIcon,
  ChevronDown,
  CloseIcon,
  MenuIcon,
  SearchIcon,
} from "./icons";
import { useDialog } from "./useDialog";

/**
 * `solid` is for pages that open on content rather than a dark hero, where the
 * transparent-over-photo treatment would leave white text on white.
 */
export default function Header({ solid = false }: { solid?: boolean }) {
  const navigation = useLocalized(navigationSource);
  const t = useT();
  const [atTop, setAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bigText, setBigText] = useState(false);
  const scrolled = solid || !atTop;

  useEffect(() => {
    document.documentElement.classList.toggle("dp-large-text", bigText);
  }, [bigText]);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY <= 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // showModal/close drive the drawer; the browser locks background scrolling.
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const menu = useDialog(menuOpen, closeMenu);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const searchDialog = useDialog(searchOpen, closeSearch);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-[background-color,backdrop-filter] duration-500 ease-[var(--ease-custom)] ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="dp-container">
        {/* The logo band folds away once you scroll, leaving the nav pill. */}
        <div
          className={`flex items-center justify-between overflow-hidden transition-all duration-500 ease-[var(--ease-custom)] ${
            atTop
              ? "pt-5 pb-2 md:h-[74px] md:translate-y-0 md:opacity-100"
              : "pt-5 pb-2 md:h-0 md:-translate-y-3 md:py-0 md:opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t("Open menu")}
            aria-expanded={menuOpen}
            className={`grid size-11 place-items-center rounded-full transition-colors md:hidden ${
              scrolled ? "bg-black/5 text-dp-ink" : "bg-white/15 text-white"
            }`}
          >
            <MenuIcon className="size-5" />
          </button>

          <div className="flex w-auto items-center gap-6 md:w-full md:justify-between">
            <Link
              href="/app/home"
              aria-label={t("Government of Dubai")}
              className={`hidden h-[58px] w-[145px] transition-colors duration-500 md:block ${
                scrolled ? "text-dp-ink" : "text-white"
              }`}
            >
              <span aria-hidden className="dp-logo dp-logo-gov" />
            </Link>
            <Link
              href="/app/home"
              aria-label={t("Dubai Police home")}
              className={`h-9 w-[104px] transition-colors duration-500 md:h-11 md:w-[127px] ${
                scrolled ? "text-dp-green-deep" : "text-white"
              }`}
            >
              <span aria-hidden className="dp-logo dp-logo-police" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label={t("Search")}
            aria-expanded={searchOpen}
            className={`grid size-11 place-items-center rounded-full transition-colors md:hidden ${
              scrolled ? "bg-black/5 text-dp-ink" : "bg-white/15 text-white"
            }`}
          >
            <SearchIcon className="size-5" />
          </button>
        </div>

        {/* Desktop nav bar */}
        <nav
          aria-label={t("Main")}
          className={`mb-2 hidden h-14 items-center justify-between rounded-full px-3 transition-colors duration-500 md:flex ${
            scrolled ? "bg-black/[0.04]" : "bg-white/10 backdrop-blur-md"
          }`}
        >
          <ul className="flex items-center">
            <li className="px-3">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={t("Open menu")}
                aria-expanded={menuOpen}
                className={scrolled ? "text-dp-ink" : "text-white"}
              >
                <MenuIcon className="size-[18px]" />
              </button>
            </li>
            {navigation.map((item) => (
              <li key={item.label} className="group relative px-3 xl:px-4">
                <Link
                  href={item.href}
                  aria-haspopup={item.children ? "true" : undefined}
                  className={`relative inline-flex items-center gap-1 py-4 text-base whitespace-nowrap transition-colors duration-300 ${
                    scrolled ? "text-dp-ink" : "text-white"
                  } before:absolute before:bottom-0 before:start-0 before:h-1 before:w-full before:origin-left before:scale-x-0 before:rounded-t-full before:bg-dp-green before:transition-transform before:duration-300 group-hover:before:scale-x-100 rtl:before:origin-right motion-reduce:before:transition-none`}
                >
                  {t(item.label)}
                  {item.children ? (
                    <ChevronDown className="size-4 opacity-70" />
                  ) : null}
                </Link>
                {item.children ? (
                  <ul
                    role="menu"
                    className="invisible absolute top-full start-0 z-50 mt-0.5 w-[375px] rounded-xl border border-black/5 bg-white p-3 opacity-0 shadow-[0_20px_40px_-24px_rgba(0,60,40,0.45)] transition-opacity duration-300 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                  >
                    {item.children.map((child) => (
                      <li key={child.label} role="none">
                        <Link
                          role="menuitem"
                          href={child.href}
                          className="block rounded-lg px-4 py-2.5 text-dp-ink transition-colors hover:bg-[rgba(13,160,110,0.07)]"
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

          <ul
            className={`flex items-center gap-2 ${scrolled ? "text-dp-ink" : "text-white"}`}
          >
            <li>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label={t("Search")}
                aria-expanded={searchOpen}
                className="grid size-10 place-items-center rounded-full transition-colors hover:bg-black/5"
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
                className={`grid size-10 place-items-center rounded-full transition-colors hover:bg-black/5 ${
                  bigText ? "bg-dp-green text-white hover:bg-dp-green" : ""
                }`}
              >
                <AccessibilityIcon className="size-5" />
              </button>
            </li>
            <li className="flex">
              <LanguageSwitch
                className={
                  scrolled
                    ? "bg-black/[0.06] hover:bg-black/[0.1]"
                    : "bg-white/15 hover:bg-white/25"
                }
              />
            </li>
            <li>
              <AccountLink />
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
        aria-label={t("Search Dubai Police")}
        onClick={(e) => {
          if (e.target === searchDialog.current) setSearchOpen(false);
        }}
        className="dp-search-sheet m-0 mt-0 w-full max-w-none bg-transparent p-4 pt-24 backdrop:bg-[rgba(4,20,14,0.6)] md:pt-28"
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
        className="dp-drawer m-0 h-[100dvh] max-h-none w-[min(420px,88vw)] max-w-none overflow-y-auto bg-white p-6 shadow-2xl"
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="font-secondary text-lg font-bold text-dp-green-deep">
            {t("Main Menu")}
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label={t("Close menu")}
            className="grid size-10 place-items-center rounded-full bg-black/5 text-dp-ink"
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
                className="block rounded-lg px-3 py-3 text-lg text-dp-ink transition-colors hover:bg-[rgba(13,160,110,0.07)]"
              >
                {t(item.label)}
              </Link>
              {item.children ? (
                <ul className="mb-2 ms-3 border-s border-black/10 ps-3">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <Link
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-dp-body transition-colors hover:text-dp-green"
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
            className="border border-black/10 py-3 text-dp-ink hover:bg-black/[0.04]"
          />
        </div>
      </dialog>
    </header>
  );
}
