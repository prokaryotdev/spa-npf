import { INTL_LOCALE, type Lang } from "./config";

export type Formatters = {
  date: (iso: string) => string;
  dateTime: (iso: string) => string;
  time: (iso: string) => string;
  aed: (amount: number) => string;
  num: (value: number) => string;
};

/**
 * Every formatter is pinned to Dubai time and to an explicit locale. Left to
 * the runtime the server renders one calendar and the browser another, which
 * React reports as a hydration mismatch.
 */
export function makeFormatters(lang: Lang): Formatters {
  const locale = INTL_LOCALE[lang];
  const zone = { timeZone: "Asia/Dubai" } as const;
  const date = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...zone,
  });
  const dateTime = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...zone,
  });
  const time = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...zone,
  });
  const num = new Intl.NumberFormat(locale);
  return {
    date: (iso) => date.format(new Date(iso)),
    dateTime: (iso) => dateTime.format(new Date(iso)),
    time: (iso) => time.format(new Date(iso)),
    // The currency leads the figure in both scripts; Arabic writes the name
    // out rather than using the three-letter code.
    aed: (amount) =>
      lang === "ar"
        ? `${num.format(amount)} درهم`
        : `AED ${num.format(amount)}`,
    num: (value) => num.format(value),
  };
}
