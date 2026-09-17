"use client";

import { usePathname } from "next/navigation";
import { LANG_LABEL, LANG_SWITCH_LABEL } from "../i18n/config";
import { useLang } from "../i18n/client";
import { localePath } from "../i18n/path";
import { GlobeIcon } from "./icons";

/**
 * The control names the language it takes you to, written in that language's
 * own script — the one label a reader of either language can find without
 * reading the other.
 *
 * A plain link now the language lives in the URL, which is simpler than the
 * server action it replaced and still works with scripting off. It also gives
 * the reader something to copy: the address in the bar is this page, in this
 * language.
 *
 * `usePathname` reports the rewritten path on the server and the prefixed one
 * in the browser; `localePath` strips either before prefixing, so both render
 * the same href and hydration has nothing to correct.
 */
export default function LanguageSwitch({
  className = "",
  block = false,
}: {
  /** Skin for the surface it sits on; the header and the dark consoles differ. */
  className?: string;
  /** Full-width, for the mobile drawer and the portal sidebar. */
  block?: boolean;
}) {
  const lang = useLang();
  const pathname = usePathname();
  const next = lang === "en" ? "ar" : "en";

  return (
    <a
      href={localePath(pathname, next)}
      lang={next}
      hrefLang={next}
      // The reader of the current language needs to know what this does, and
      // the link's own text is in the other script.
      aria-label={next === "ar" ? "التبديل إلى العربية" : "Switch to English"}
      title={LANG_LABEL[next]}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
        block ? "w-full" : ""
      } ${className}`}
    >
      <GlobeIcon className="size-4 shrink-0 opacity-80" />
      <span>{LANG_SWITCH_LABEL[lang]}</span>
    </a>
  );
}
