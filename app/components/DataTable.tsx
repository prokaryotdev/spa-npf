"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ChevronDown,
  ClockIcon,
  CloseIcon,
  FileIcon,
  SearchIcon,
} from "./icons";
import { useT } from "../i18n/client";
import { escape, fold, near, split } from "../search-text";

export type Column<T> = {
  key: keyof T & string;
  label: string;
  /** Right-align and use tabular figures. */
  numeric?: boolean;
  /** Render the cell as a link to the value at this key. */
  linkKey?: keyof T & string;
  linkLabel?: string;
  width?: string;
};

// "50,000" and "50 000" are one number, the way the rows store it.
const words = (query: string) =>
  split(fold(query.replace(/(\d)[,\s](?=\d{3}\b)/g, "$1")));

/**
 * Marks every place a search word lands in a cell. The cell is folded a
 * character at a time so a match found in "ƙasa" or "50000" lights up the
 * "Ƙasa" or "50,000" the reader actually sees.
 */
function highlight(text: string, terms: string[]): ReactNode {
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
        <mark
          key={start}
          className="rounded-[3px] bg-npf-gold-wash text-inherit shadow-[0_0_0_1px_var(--color-npf-gold-soft)] [box-decoration-break:clone]"
        >
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
 * The searchable, sortable table the Information pages are built on. Every
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
  updated,
}: {
  rows: readonly T[];
  columns: Column<T>[];
  /** Column to offer as a category filter, when the data has one. */
  filterKey?: keyof T & string;
  caption: string;
  /**
   * Width below which the table scrolls sideways. Tables of short values can
   * sit well under this and stay fully readable on a phone.
   */
  minWidth?: string;
  /** When the figures were last checked, shown under the table. */
  updated?: string;
}) {
  const t = useT();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [group, setGroup] = useState("All");
  const input = useRef<HTMLInputElement>(null);

  const groups = useMemo(() => {
    if (!filterKey) return [];
    return [
      "All",
      ...[...new Set(rows.map((r) => String(r[filterKey] ?? "")))]
        .filter(Boolean)
        .sort(),
    ];
  }, [rows, filterKey]);

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

    let out = index
      .filter((r) => {
        if (
          filterKey &&
          group !== "All" &&
          String(r.row[filterKey]) !== group
        )
          return false;
        return terms.every((w, i) => matches(r, w, i));
      })
      .map((r) => ({ row: r.row, score: terms.length ? rank(r) : 0 }))
      // Stable, so equal matches keep the order the table was written in.
      .sort((a, b) => b.score - a.score)
      .map((r) => r.row);
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      out = [...out].sort((a, b) => {
        const av = a[sort.key];
        const bv = b[sort.key];
        if (col?.numeric) {
          return (Number(av) - Number(bv)) * sort.dir;
        }
        return String(av ?? "").localeCompare(String(bv ?? "")) * sort.dir;
      });
    }
    return out;
  }, [index, columns, terms, sort, group, filterKey]);

  const clearButton = (
    <button
      type="button"
      onClick={() => {
        setQuery("");
        setGroup("All");
        input.current?.focus();
      }}
      className="npf-small mt-3 font-semibold text-npf-blue underline underline-offset-4 hover:text-npf-blue-deep"
    >
      {t("Clear filters")}
    </button>
  );

  // Figures read as money and counts: 50000 is ₦50,000's number, set with
  // the separators a reader expects.
  const show = (col: Column<T>, raw: unknown) => {
    const value = String(raw ?? "");
    if (!value) return null;
    if (col.numeric && /^\d{4,}$/.test(value))
      return highlight(Number(value).toLocaleString("en-NG"), terms);
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

        {groups.length > 1 ? (
          <span className="npf-select-wrap">
            <label htmlFor="tableGroup" className="sr-only">
              {t("Filter by category")}
            </label>
            <select
              id="tableGroup"
              value={group}
              data-active={group !== "All" ? "" : undefined}
              onChange={(e) => setGroup(e.target.value)}
              className="npf-select h-12"
            >
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g === "All" ? t("All categories") : t(g)}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden className="npf-select-arrow" />
          </span>
        ) : null}

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
          return (
            <li key={i} className="flex gap-3 px-4 py-4">
              <span className="npf-caption mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-npf-cloud text-npf-blue-ink tabular-nums">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="npf-body font-medium text-npf-blue underline-offset-4 hover:underline"
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

      <div className="overflow-x-auto rounded-card border border-npf-hairline bg-white max-md:hidden">
        <table style={{ minWidth }} className="w-full border-collapse">
          <caption className="sr-only">{t(caption)}</caption>
          <thead>
            <tr className="border-b border-npf-hairline bg-npf-mist">
              <th
                scope="col"
                className="npf-small w-14 py-3.5 ps-5 pe-2 text-start font-semibold text-npf-steel"
              >
                #
              </th>
              {columns.map((col) => {
                const active = sort?.key === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={
                      active
                        ? sort.dir === 1
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    style={col.width ? { width: col.width } : undefined}
                    className={`npf-small px-4 py-2 font-semibold text-npf-blue-deep last:pe-5 ${col.numeric ? "text-end" : "text-start"}`}
                  >
                    <button
                      type="button"
                      // Up, down, then off — back to best match first.
                      onClick={() =>
                        setSort(
                          !active
                            ? { key: col.key, dir: 1 }
                            : sort.dir === 1
                              ? { key: col.key, dir: -1 }
                              : null,
                        )
                      }
                      // The sorted column reads as a raised chip on the mist
                      // header, so which column is in charge is plain at a
                      // glance, not only from a small arrow.
                      className={`group -mx-2.5 inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 whitespace-nowrap transition-[background-color,color,box-shadow,scale] duration-(--dur-hover) ease-(--ease-out) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-npf-blue-mid active:scale-[0.97] ${
                        active
                          ? "bg-white text-npf-blue shadow-[0_1px_2px_rgb(26_35_56/0.08),0_0_0_1px_var(--color-npf-hairline)]"
                          : "hover:bg-white/70 hover:text-npf-blue"
                      } ${col.numeric ? "flex-row-reverse" : ""}`}
                    >
                      {t(col.label)}
                      <span
                        aria-hidden
                        className={`grid size-5 shrink-0 place-items-center rounded-full transition-colors duration-(--dur-hover) ${
                          active ? "bg-npf-mist" : ""
                        }`}
                      >
                        <ArrowDown
                          className={`size-3.5 transition-[rotate,opacity] duration-200 ease-(--ease-out) ${
                            active
                              ? sort.dir === -1
                                ? "rotate-180"
                                : ""
                              : "opacity-30 group-hover:opacity-70 group-focus-visible:opacity-70"
                          }`}
                        />
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-npf-hairline">
            {visible.map((row, i) => (
              <tr
                key={i}
                className="align-top transition-colors hover:bg-npf-paper"
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
                          className="group inline-flex items-start gap-2 font-medium text-npf-blue underline-offset-4 transition-colors hover:text-npf-blue-deep hover:underline"
                        >
                          <FileIcon
                            aria-hidden
                            className="mt-0.5 size-4.5 shrink-0 text-npf-steel transition-colors group-hover:text-npf-blue"
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

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        {updated ? (
          <p className="npf-small inline-flex items-center gap-2 text-npf-steel">
            <ClockIcon aria-hidden className="size-4" />
            {updated}
          </p>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
