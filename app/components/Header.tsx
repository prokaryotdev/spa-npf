"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navigation } from "../content";
import {
  ChevronDown,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  UserCircle,
} from "./icons";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
            scrolled
              ? "pt-5 pb-2 md:h-0 md:-translate-y-3 md:py-0 md:opacity-0"
              : "pt-5 pb-2 md:h-[74px] md:translate-y-0 md:opacity-100"
          }`}
        >
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
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
              aria-label="Dubai Government"
              className="relative hidden h-[58px] w-[145px] md:block"
            >
              <Image
                src="/img/logo-gov-dubai.svg"
                alt="Government of Dubai"
                fill
                sizes="145px"
                className={`object-contain object-left transition-[filter] duration-500 ${
                  scrolled ? "" : "brightness-0 invert"
                }`}
                priority
              />
            </Link>
            <Link
              href="/app/home"
              aria-label="Dubai Police home"
              className="relative h-9 w-[104px] md:h-11 md:w-[127px]"
            >
              <Image
                src="/img/logo-dubai-police.svg"
                alt="Dubai Police"
                fill
                sizes="127px"
                className={`object-contain transition-[filter] duration-500 ${
                  scrolled ? "" : "brightness-0 invert"
                }`}
                priority
              />
            </Link>
          </div>

          <button
            type="button"
            aria-label="Search"
            className={`grid size-11 place-items-center rounded-full transition-colors md:hidden ${
              scrolled ? "bg-black/5 text-dp-ink" : "bg-white/15 text-white"
            }`}
          >
            <SearchIcon className="size-5" />
          </button>
        </div>

        {/* Desktop nav bar */}
        <nav
          aria-label="Main"
          className={`mb-2 hidden h-14 items-center justify-between rounded-full px-3 transition-colors duration-500 md:flex ${
            scrolled ? "bg-black/[0.04]" : "bg-white/10 backdrop-blur-md"
          }`}
        >
          <ul className="flex items-center">
            <li className="px-3">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className={scrolled ? "text-dp-ink" : "text-white"}
              >
                <MenuIcon className="size-[18px]" />
              </button>
            </li>
            {navigation.map((item) => (
              <li key={item.label} className="group relative px-4">
                <Link
                  href={item.href}
                  aria-haspopup={item.children ? "true" : undefined}
                  className={`relative inline-flex items-center gap-1 py-4 text-base transition-colors duration-300 ${
                    scrolled ? "text-dp-ink" : "text-white"
                  } before:absolute before:bottom-0 before:left-0 before:h-1 before:w-full before:origin-left before:scale-x-0 before:rounded-t-full before:bg-dp-green before:transition-transform before:duration-300 group-hover:before:scale-x-100 motion-reduce:before:transition-none`}
                >
                  {item.label}
                  {item.children ? (
                    <ChevronDown className="size-4 opacity-70" />
                  ) : null}
                </Link>
                {item.children ? (
                  <ul
                    role="menu"
                    className="invisible absolute top-full left-0 z-50 mt-0.5 w-[375px] rounded-xl border border-black/5 bg-white p-3 opacity-0 shadow-[0_20px_40px_-24px_rgba(0,60,40,0.45)] transition-opacity duration-300 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                  >
                    {item.children.map((child) => (
                      <li key={child.label} role="none">
                        <Link
                          role="menuitem"
                          href={child.href}
                          className="block rounded-lg px-4 py-2.5 text-dp-ink transition-colors hover:bg-[rgba(13,160,110,0.07)]"
                        >
                          {child.label}
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
                aria-label="Search"
                className="grid size-10 place-items-center rounded-full transition-colors hover:bg-black/5"
              >
                <SearchIcon className="size-5" />
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  scrolled ? "bg-black/[0.06]" : "bg-white/15 hover:bg-white/25"
                }`}
              >
                English
              </button>
            </li>
            <li>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-dp-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dp-green-mid"
              >
                Sign In
                <UserCircle className="size-[18px]" />
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Slide-out menu */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        <div
          className={`absolute top-0 left-0 h-full w-[min(420px,88vw)] overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-500 ease-[var(--ease-custom)] ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <span className="font-secondary text-lg font-bold text-dp-green-deep">
              Main Menu
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              tabIndex={menuOpen ? 0 : -1}
              className="grid size-10 place-items-center rounded-full bg-black/5 text-dp-ink"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  tabIndex={menuOpen ? 0 : -1}
                  className="block rounded-lg px-3 py-3 text-lg text-dp-ink transition-colors hover:bg-[rgba(13,160,110,0.07)]"
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <ul className="mb-2 ml-3 border-l border-black/10 pl-3">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          tabIndex={menuOpen ? 0 : -1}
                          className="block rounded-lg px-3 py-2 text-dp-body transition-colors hover:text-dp-green"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <button
            type="button"
            tabIndex={menuOpen ? 0 : -1}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-dp-green px-5 py-3 text-white transition-colors hover:bg-dp-green-mid"
          >
            Sign In
            <UserCircle className="size-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
