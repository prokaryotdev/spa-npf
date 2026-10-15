"use client";

import { Fragment, useMemo, useRef, useState, type ReactNode } from "react";
import {
  CloseIcon,
  DownloadIcon,
  SearchIcon,
} from "./icons";
import { useFormat, useT } from "../i18n/client";
import { escape, fold, near, split } from "../search-text";

export type Column<T> = {
  key: keyof T & string;
  label: string;
  /** Right-align and use tabular figures. */
  numeric?: boolean;
  /** Render the cell as a link to the value at this key. */
  linkKey?: keyof T & string;
  linkLabel?: string;
  /** An ISO date, shown the way the reader's language writes dates. */
  date?: boolean;
  width?: string;
  /** Out of how many: drawn as a short bar of that many steps beside the figure. */
  scale?: number;
};

// "50,000" and "50 000" are one number, the way the rows store it.
const words = (query: string) =>
  split(fold(query.replace(/(\d)[,\s](?=\d{3}\b)/g, "$1")));

/**
 * Marks every place a search word lands in a cell. The cell is folded a
 * character at a time so a match found in "ƙasa" or "50000" lights up the
 * "Ƙasa" or "50,000" the reader actually sees.
 */
export function highlight(
  text: string,
  terms: string[],
  className = "rounded-[3px] bg-npf-gold-wash text-inherit shadow-[0_0_0_1px_var(--color-npf-gold-soft)] [box-decoration-break:clone]",
): ReactNode {
  if (!terms.length) return text;
  let folded = "";
  const at: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const digitComma =
      c === "," && /\d/.test(text[i - 1] ?? "") && /\d/.test(text[i + 1] ?? "");
    const f = digitComma ? "" : /\s/.test(c) ? " " : fold(c);
    for (const ch of f) {
      folded += ch;
      at.push(i);
    }
  }
  const lit = new Array<boolean>(text.length).fill(false);
  for (const term of terms) {
    for (let j = folded.indexOf(term); j !== -1; j = folded.indexOf(term, j + 1))
      for (let k = at[j]; k <= at[j + term.length - 1]; k++) lit[k] = true;
  }
  if (!lit.includes(true)) return text;
  const out: ReactNode[] = [];
  let start = 0;
  for (let i = 1; i <= text.length; i++) {
    if (i < text.length && lit[i] === lit[start]) continue;
    const part = text.slice(start, i);
    out.push(
      lit[start] ? (
        <mark key={start} className={className}>
          {part}
        </mark>
      ) : (
        part
      ),
    );
    start = i;
  }
  return out;
}

/**
 * The searchable table the Information pages are built on. Every
 * row is shown — none of these tables is long enough to be worth paging, and
 * a reader scanning for their offence should never have to guess which page
 * it is on. Everything runs on the rows already in the page.
 */
export default function DataTable<T extends Record<string, unknown>>({
  rows,
  columns,
  filterKey,
  caption,
  minWidth = "640px",
}: {
  rows: readonly T[];
  columns: Column<T>[];
  /** Column the rows are grouped by: a heading where each group starts. */
  filterKey?: keyof T & string;
  caption: string;
  /**
   * Width below which the table scrolls sideways. Tables of short values can
   * sit well under this and stay fully readable on a phone.
   */
  minWidth?: string;
}) {
  const t = useT();
  const fmt = useFormat();
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);

  // Each row folded once: its first column (the name a reader searches for)
  // and everything, in both languages so an Hausa reader can search the
  // table they see and an English one can too. The category is searched even
  // though it has no column, so "parking" finds every parking offence.
  const index = useMemo(() => {
    const both = (raw: unknown) => {
      const value = String(raw ?? "");
      return `${value} ${t(value)}`;
    };
    return rows.map((row) => {
      const head = fold(both(row[columns[0].key]));
      const all = fold(
        [...columns.map((c) => c.key), ...(filterKey ? [filterKey] : [])]
          .map((k) => both(row[k]))
          .join(" "),
      );
      return { row, head, all, words: split(all) };
    });
  }, [rows, columns, filterKey, t]);

  const terms = useMemo(() => words(query), [query]);

  const visible = useMemo(() => {
    // Every word has to be in the row. A word the table has nowhere is taken
    // as a slip and matched one letter off the start of a word, the same
    // rule as the site search, so "overspeding" still finds speeding.
    const typo = terms.map((w) => !index.some((r) => r.all.includes(w)));
    const matches = (r: (typeof index)[number], w: string, i: number) =>
      r.all.includes(w) ||
      (typo[i] &&
        w.length >= 4 &&
        r.words.some(
          (x) =>
            near(x.slice(0, w.length), w) ||
            near(x.slice(0, w.length + 1), w),
        ));
    // Rank by where the words land: the name starting with the whole query,
    // then each word starting the name, a word in it, anywhere in it, or only
    // in the other columns.
    const rank = (r: (typeof index)[number]) => {
      let total = r.head.startsWith(terms.join(" ")) ? 100 : 0;
      for (const w of terms) {
        if (r.head.startsWith(w)) total += 50;
        else if (new RegExp(`\\b${escape(w)}`).test(r.head)) total += 30;
        else if (r.head.includes(w)) total += 12;
        else if (new RegExp(`\\b${escape(w)}`).test(r.all)) total += 6;
        else total += 3;
      }
      return total;
    };

    return index
      .filter((r) => terms.every((w, i) => matches(r, w, i)))
      .map((r) => ({ row: r.row, score: terms.length ? rank(r) : 0 }))
      // Stable, so equal matches keep the order the table was written in.
      .sort((a, b) => b.score - a.score)
      .map((r) => r.row);
  }, [index, terms]);

  // Left as written, the rows run in their categories, so each category
  // gets a heading where it starts. A search ranks by match, which breaks that order.
  const groupAt = (i: number) =>
    filterKey && !terms.length
      ? String(visible[i][filterKey] ?? "") !==
        String(visible[i - 1]?.[filterKey] ?? "")
        ? t(String(visible[i][filterKey]))
        : null
      : null;

  const clearButton = (
    <button
      type="button"
      onClick={() => {
        setQuery("");
        input.current?.focus();
      }}
      className="npf-small mt-3 font-semibold text-npf-blue underline underline-offset-4 hover:text-npf-blue-deep"
    >
      {t("Clear search")}
    </button>
  );

  // Figures read as money and counts: 50000 is ₦50,000's number, set with
  // the separators a reader expects.
  const show = (col: Column<T>, raw: unknown) => {
    const value = String(raw ?? "");
    if (!value) return null;
    if (col.date) return fmt.date(value);
    // 10 of 10 points should look heavier than 2 before it is read.
    if (col.scale && /^\d+$/.test(value))
      return (
        <span className="inline-flex items-center gap-2.5">
          <span aria-hidden className="flex gap-px">
            {Array.from({ length: col.scale }, (_, i) => (
              <span
                key={i}
                className={`h-3 w-[3px] rounded-[1px] ${
                  i < Number(value) ? "bg-npf-blue-mid" : "bg-npf-line"
                }`}
              />
            ))}
          </span>
          {highlight(value, terms)}
        </span>
      );
    if (col.numeric && /^\d{4,}$/.test(value))
      return highlight(Number(value).toLocaleString("en-NG"), terms);
    // "Decided by court" in the fine column is an answer, not a figure: set
    // quieter than the sums round it, so the numbers still scan as a column.
    if (col.numeric && !/^\d/.test(value))
      return (
        <span className="text-sm font-normal text-npf-steel">
          {highlight(t(value), terms)}
        </span>
      );
    return highlight(t(value), terms);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="npf-field npf-field-icon h-12 min-w-60 flex-1 rounded-full ps-5 pe-1.5">
          <SearchIcon aria-hidden className="size-5 shrink-0 text-npf-blue" />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && query) {
                e.preventDefault();
                setQuery("");
              }
            }}
            placeholder={t("Type a word, name or number")}
            aria-label={t("Search {what}", { what: t(caption) })}
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            className="[&::-webkit-search-cancel-button]:appearance-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                input.current?.focus();
              }}
              aria-label={t("Clear search")}
              className="grid size-9 shrink-0 place-items-center rounded-full text-npf-steel transition-colors hover:bg-npf-cloud hover:text-npf-ink focus-visible:outline-2 focus-visible:outline-npf-blue"
            >
              <CloseIcon className="size-4.5" />
            </button>
          ) : null}
        </div>

        <p className="npf-body text-npf-steel" aria-live="polite">
          <span className="font-semibold text-npf-blue-deep tabular-nums">
            {visible.length}
          </span>{" "}
          / <span className="tabular-nums">{rows.length}</span>
        </p>
      </div>

      {/* A phone gets each row as a card: the first column is its title and
          the rest are labelled figures, so nothing hides off the right edge. */}
      <ol className="divide-y divide-npf-hairline overflow-hidden rounded-card border border-npf-hairline bg-white md:hidden">
        {visible.map((row, i) => {
          const [head, ...rest] = columns;
          const title = show(head, row[head.key]);
          const href = head.linkKey ? (row[head.linkKey] as string) : null;
          const heading = groupAt(i);
          return (
            <Fragment key={i}>
            {heading ? (
              <li className="npf-small bg-npf-mist px-4 py-2.5 font-semibold text-npf-blue-deep">
                {heading}
              </li>
            ) : null}
            <li
              className="group/row relative flex gap-3 px-4 py-4 transition-colors has-[a]:active:bg-npf-paper"
            >
              <span className="npf-caption mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-npf-cloud text-npf-blue-ink tabular-nums">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="npf-body font-medium text-npf-blue outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-npf-blue-mid"
                  >
                    {title}
                    <span className="sr-only">
                      {" "}
                      {t("(opens in a new window)")}
                    </span>
                  </a>
                ) : (
                  <p className="npf-body font-medium text-npf-ink">{title}</p>
                )}
                <dl className="mt-2 flex flex-wrap gap-2">
                  {rest.map((col) => {
                    const value = show(col, row[col.key]);
                    return value === null ? null : (
                      <div
                        key={col.key}
                        className="npf-small inline-flex items-baseline gap-1.5 rounded-full bg-npf-cloud px-2.5 py-1"
                      >
                        <dt className="text-npf-steel">{t(col.label)}</dt>
                        <dd className="font-semibold text-npf-ink tabular-nums">
                          {value}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            </li>
            </Fragment>
          );
        })}
        {visible.length === 0 ? (
          <li className="px-5 py-12 text-center">
            <p className="npf-body text-npf-body">
              {t("Nothing matches “{query}”.", { query })}
            </p>
            {clearButton}
          </li>
        ) : null}
      </ol>

      {/* Clipped, not scrolled: overflow-clip makes no scroll box, so the head
          can still pin under the site header thirty rows down, and the
          rounded corners stay clean. The table fits from md up. */}
      <div className="overflow-clip rounded-card border border-npf-hairline bg-white max-md:hidden">
        <table style={{ minWidth }} className="w-full border-collapse">
          <caption className="sr-only">{t(caption)}</caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="npf-small sticky top-[73px] z-10 bg-npf-mist shadow-[inset_0_-1px_0_var(--color-npf-hairline)] w-14 py-3.5 ps-5 pe-2 text-start font-semibold text-npf-steel"
              >
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={col.width ? { width: col.width } : undefined}
                  className={`npf-small sticky top-[73px] z-10 bg-npf-mist px-4 py-3.5 font-semibold whitespace-nowrap text-npf-blue-deep shadow-[inset_0_-1px_0_var(--color-npf-hairline)] last:pe-5 ${col.numeric ? "text-end" : "text-start"}`}
                >
                  {t(col.label)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-npf-hairline">
            {visible.map((row, i) => (
              <Fragment key={i}>
              {groupAt(i) ? (
                <tr className="bg-npf-mist">
                  <th
                    scope="colgroup"
                    colSpan={columns.length + 1}
                    className="npf-small px-5 pt-5 pb-2.5 text-start font-semibold text-npf-blue-deep"
                  >
                    {groupAt(i)}
                  </th>
                </tr>
              ) : null}
              <tr
                // Positioned so a linked cell's link can stretch over the
                // whole row: the target is the row, not only its words.
                className="group/row relative align-top transition-colors hover:bg-npf-paper"
              >
                <td className="npf-small py-4 ps-5 pe-2 text-npf-steel tabular-nums">
                  {i + 1}
                </td>
                {columns.map((col) => {
                  const value = show(col, row[col.key]);
                  const href = col.linkKey
                    ? (row[col.linkKey] as string)
                    : null;
                  return (
                    <td
                      key={col.key}
                      className={`px-4 py-4 text-title leading-normal text-npf-ink last:pe-5 ${col.numeric ? "text-end font-semibold whitespace-nowrap tabular-nums" : ""}`}
                    >
                      {value === null ? (
                        <span aria-label={t("None")} className="text-npf-line">
                          —
                        </span>
                      ) : href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-start gap-2 font-medium text-npf-blue outline-none transition-colors group-hover/row:text-npf-blue-deep after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-npf-blue-mid"
                        >
                          <DownloadIcon
                            aria-hidden
                            className="mt-0.5 size-4.5 shrink-0 text-npf-steel transition-colors group-hover/row:text-npf-blue"
                          />
                          {value}
                          <span className="sr-only">
                            {" "}
                            {t("(opens in a new window)")}
                          </span>
                        </a>
                      ) : (
                        value
                      )}
                    </td>
                  );
                })}
              </tr>
              </Fragment>
            ))}
            {visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-14">
                  <div className="flex flex-col items-center text-center">
                    <span className="grid size-12 place-items-center rounded-full bg-npf-cloud text-npf-blue">
                      <SearchIcon className="size-5" />
                    </span>
                    <p className="npf-body mt-4 text-npf-body">
                      {t("Nothing matches “{query}”.", { query })}
                    </p>
                    {clearButton}
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
