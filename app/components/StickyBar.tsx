"use client";

import Link from "../i18n/Link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useT, useLocalized } from "../i18n/client";
import { stripLocale } from "../i18n/path";
import { emergencyNumbers as emergencyNumbersSource } from "../content";
import {
  ArrowUpIcon,
  ArrowUpRight,
  CallIcon,
  PinIcon,
  ServicesIcon,
  SmileIcon,
} from "./icons";

const links = [
  { label: "Services", href: "/app/services", Icon: ServicesIcon },
  {
    label: "Customer Centers",
    href: "/app/home/customer-centers",
    Icon: PinIcon,
  },
];

/**
 * The foot of every page, once the hero is behind you.
 *
 * One primary action and a quiet row of secondary ones: on a police site the
 * thing a visitor may need in a hurry is the emergency line, so that is the
 * only coloured control in the bar and everything else recedes to plain
 * text. The number comes from content.ts rather than being typed here, so it
 * can never drift from the footer's copy of it.
 */
export default function StickyBar() {
  const t = useT();
  const [emergency] = useLocalized(emergencyNumbersSource);
  const { rest } = stripLocale(usePathname() ?? "/");
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const quiet =
    "group relative inline-flex h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-[#3f4a5a] transition-colors hover:bg-npf-blue/[0.06] hover:text-npf-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-npf-blue";

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-50 transition-transform duration-500 ease-[var(--ease-custom)] ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <nav
        aria-label={t("Quick access toolbar")}
        className="pointer-events-auto border-t border-npf-blue/[0.12] bg-white/90 backdrop-blur-xl backdrop-saturate-150"
      >
        <div className="npf-container">
          <div className="flex h-16 items-center gap-2 pb-[env(safe-area-inset-bottom)] sm:gap-4">
            <a
              href={`tel:${emergency.number}`}
              className="group inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#b30900]/25 bg-[#b30900]/[0.06] px-3.5 text-[#b30900] transition-colors duration-200 ease-[var(--ease-custom)] hover:border-[#b30900] hover:bg-[#b30900] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b30900]"
            >
              <CallIcon className="size-[18px] shrink-0 transition-transform duration-500 ease-[var(--ease-custom)] group-hover:-rotate-12" />
              <span className="text-sm font-semibold tracking-[-0.01em]">
                {t("Call")}{" "}
                <span className="tabular-nums">{emergency.number}</span>
              </span>
              <span className="sr-only">— {emergency.note}</span>
            </a>

            <span
              aria-hidden
              className="h-7 w-px shrink-0 bg-npf-blue/[0.14]"
            />

            <ul className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {links.map(({ label, href, Icon }) => {
                const active = rest === href;
                return (
                  <li key={label} className="shrink-0">
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`${quiet} ${
                        active ? "bg-npf-blue/[0.08] !text-npf-blue" : ""
                      }`}
                    >
                      <Icon className="size-[18px] shrink-0" />
                      <span className="hidden whitespace-nowrap md:block">
                        {t(label)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex shrink-0 items-center gap-1">
              <a
                href="https://www.servicerating.gov.ng/"
                target="_blank"
                rel="noopener noreferrer"
                className={quiet}
              >
                <SmileIcon className="size-[18px] shrink-0" />
                <span className="hidden whitespace-nowrap lg:block">
                  {t("Rate this service")}
                </span>
                <ArrowUpRight className="size-3.5 shrink-0 opacity-45" />
                <span className="sr-only">{t("(opens in a new window)")}</span>
              </a>
              <button
                type="button"
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: window.matchMedia(
                      "(prefers-reduced-motion: reduce)",
                    ).matches
                      ? "auto"
                      : "smooth",
                  })
                }
                aria-label={t("Back to top")}
                className={`${quiet} px-2.5`}
              >
                <ArrowUpIcon className="size-[18px] transition-transform duration-200 ease-[var(--ease-custom)] group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
