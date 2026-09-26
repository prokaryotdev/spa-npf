import type { Lang } from "./config";
import { dictionary } from "./ha";

/**
 * The dictionary is keyed by the English source string, not by an invented
 * key. Two reasons: the English in the JSX stays readable on its own, and a
 * missing translation degrades to correct English instead of a bare key
 * leaking onto a government page. `npm run test` fails on any missing entry,
 * so the fallback is a safety net rather than the plan.
 */
export type Vars = Record<string, string | number>;

const fill = (text: string, vars?: Vars) =>
  vars
    ? text.replace(/\{(\w+)\}/g, (whole, key: string) =>
        key in vars ? String(vars[key]) : whole,
      )
    : text;

export function translate(lang: Lang, text: string, vars?: Vars): string {
  if (typeof text !== "string" || !text) return text;
  if (lang === "en") return fill(text, vars);
  const hit = dictionary[text] ?? dictionary[text.trim()];
  return fill(hit ?? text, vars);
}

/** A bound translator, so call sites read `t("Read more")`. */
export type T = (text: string, vars?: Vars) => string;

export const translator =
  (lang: Lang): T =>
  (text, vars) =>
    translate(lang, text, vars);
