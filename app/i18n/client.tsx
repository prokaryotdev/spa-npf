"use client";

import { createContext, useContext, useMemo } from "react";
import { DEFAULT_LANG, type Lang } from "./config";
import { makeFormatters, type Formatters } from "./format";
import { localize } from "./localize";
import { translator, type T } from "./translate";

const LangContext = createContext<Lang>(DEFAULT_LANG);

/**
 * Mounted once in the root layout with the value the server read from the
 * cookie, so client components never guess the language and never have to
 * correct themselves after hydration.
 */
export function LocaleProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

export function useT(): T {
  const lang = useLang();
  return useMemo(() => translator(lang), [lang]);
}

export function useFormat(): Formatters {
  const lang = useLang();
  return useMemo(() => makeFormatters(lang), [lang]);
}

/** Translate a whole content object. See i18n/localize.ts. */
export function useLocalized<T>(value: T): T {
  const lang = useLang();
  return useMemo(() => localize(value, lang), [value, lang]);
}
