"use client";

import { useFormStatus } from "react-dom";
import { setLanguage } from "../i18n/actions";
import { LANG_LABEL, LANG_SWITCH_LABEL } from "../i18n/config";
import { useLang } from "../i18n/client";
import { GlobeIcon } from "./icons";

/**
 * The control names the language it takes you to, written in that language's
 * own script — the one label a reader of either language can find without
 * reading the other. It posts to a server action, so it works before
 * hydration and with scripting off.
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
  const next = lang === "en" ? "ar" : "en";

  return (
    <form action={setLanguage} className={block ? "w-full" : "contents"}>
      <input type="hidden" name="lang" value={next} />
      <Button
        className={className}
        block={block}
        next={next}
        label={LANG_SWITCH_LABEL[lang]}
      />
    </form>
  );
}

function Button({
  className,
  block,
  next,
  label,
}: {
  className: string;
  block: boolean;
  next: string;
  label: string;
}) {
  // Disabled while the action is in flight: the whole page re-renders on the
  // server afterwards, and a second click would queue a second render.
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      lang={next}
      // The reader of the current language needs to know what this does, and
      // the button's own text is in the other script.
      aria-label={next === "ar" ? "التبديل إلى العربية" : "Switch to English"}
      title={LANG_LABEL[next as "en" | "ar"]}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors disabled:opacity-60 ${
        block ? "w-full" : ""
      } ${className}`}
    >
      <GlobeIcon className="size-4 shrink-0 opacity-80" />
      <span>{label}</span>
    </button>
  );
}
