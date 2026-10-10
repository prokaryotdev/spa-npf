"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { LANGS, LANG_LABEL } from "../i18n/config";
import { useLang, useT } from "../i18n/client";
import { localePath } from "../i18n/path";
import { CheckIcon, GlobeIcon } from "./icons";

/**
 * Every language names itself in its own words, so a reader of any of them
 * can find theirs without reading the others.
 *
 * Plain links, because the language lives in the URL: no script is needed to
 * switch, and the address in the bar is this page in that language. The menu
 * is a <details>, so it opens with scripting off too; the effect below only
 * adds what a menu is expected to do on top (close on Escape, on a click
 * outside, and after a pick).
 *
 * `usePathname` reports the rewritten path on the server and the prefixed one
 * in the browser; `localePath` strips either before prefixing, so both render
 * the same hrefs and hydration has nothing to correct.
 */
export default function LanguageSwitch({
  className = "",
  block = false,
  tone = "light",
}: {
  /** Skin for the button on the surface it sits on. */
  className?: string;
  /** The mobile drawer: every language laid out, no menu to open. */
  block?: boolean;
  /** The menu's own surface: the public site is light, the console dark. */
  tone?: "light" | "dark";
}) {
  const lang = useLang();
  const t = useT();
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = menu.current;
    if (!el) return;
    const close = () => el.removeAttribute("open");
    const onClick = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !el.open) return;
      close();
      el.querySelector("summary")?.focus();
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const options = LANGS.map((code) => ({
    code,
    href: localePath(pathname, code),
    current: code === lang,
  }));

  if (block)
    return (
      <nav aria-label={t("Language")} className="grid grid-cols-2 gap-2">
        {options.map(({ code, href, current }) => (
          <a
            key={code}
            href={href}
            lang={code}
            hrefLang={code}
            aria-current={current ? "true" : undefined}
            className={`flex items-center justify-between gap-2 rounded-chip border px-4 py-3 text-sm font-medium transition-colors ${
              current
                ? "border-npf-blue bg-npf-blue text-white"
                : "border-npf-hairline text-npf-ink hover:bg-npf-cloud"
            }`}
          >
            {LANG_LABEL[code]}
            {current ? <CheckIcon aria-hidden className="size-4" /> : null}
          </a>
        ))}
      </nav>
    );

  const dark = tone === "dark";
  return (
    <details ref={menu} className="group relative">
      <summary
        aria-label={t("Language: {name}", { name: LANG_LABEL[lang] })}
        className={`inline-flex cursor-pointer list-none items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-[background-color,color,scale] select-none active:scale-[0.97] [&::-webkit-details-marker]:hidden ${className}`}
      >
        <GlobeIcon className="size-4 shrink-0 opacity-80" />
        <span>{LANG_LABEL[lang]}</span>
      </summary>
      <ul
        className={`npf-lang-menu absolute end-0 top-[calc(100%+0.5rem)] z-50 min-w-44 rounded-[14px] p-1.5 ${
          dark
            ? "bg-[#1e1f25] text-ops-text shadow-[0_12px_32px_rgb(0_0_0/0.5),0_0_0_1px_rgb(255_255_255/0.08)]"
            : "bg-white text-npf-ink shadow-[0_12px_32px_rgb(20_49_95/0.16),0_0_0_1px_rgb(20_49_95/0.08)]"
        }`}
      >
        {options.map(({ code, href, current }) => (
          <li key={code}>
            <a
              href={href}
              lang={code}
              hrefLang={code}
              aria-current={current ? "true" : undefined}
              className={`flex items-center justify-between gap-6 rounded-[9px] px-3 py-2 text-sm transition-colors ${
                current ? "font-semibold" : ""
              } ${dark ? "hover:bg-[#0a84ff] hover:text-white" : "hover:bg-npf-cloud"}`}
            >
              {LANG_LABEL[code]}
              {current ? (
                <CheckIcon aria-hidden className="size-4 shrink-0" />
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
