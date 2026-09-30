"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClockIcon,
  FileIcon,
  SearchIcon,
} from "./icons";
import { useT } from "../i18n/client";

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

const PAGE = 15;

/**
 * The searchable, sortable, paged table the Information pages are built on.
 * Everything runs on the rows already in the page — there is no query to make.
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
  const [page, setPage] = useState(0);

  const groups = useMemo(() => {
    if (!filterKey) return [];
    return [
      "All",
      ...[...new Set(rows.map((r) => String(r[filterKey] ?? "")))]
        .filter(Boolean)
        .sort(),
    ];
  }, [rows, filterKey]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = rows.filter((row) => {
      if (filterKey && group !== "All" && String(row[filterKey]) !== group)
        return false;
      if (!q) return true;
      // Both languages, so an Hausa reader can search the table they see.
      return columns.some((c) => {
        const value = String(row[c.key] ?? "");
        return `${value} ${t(value)}`.toLowerCase().includes(q);
      });
    });
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
  }, [rows, columns, query, sort, group, filterKey, t]);

  const pages = Math.max(1, Math.ceil(visible.length / PAGE));
  const current = Math.min(page, pages - 1);
  const slice = visible.slice(current * PAGE, current * PAGE + PAGE);

  const reset = () => setPage(0);

  // Figures read as money and counts: 50000 is ₦50,000's number, set with
  // the separators a reader expects.
  const show = (col: Column<T>, raw: unknown) => {
    const value = String(raw ?? "");
    if (!value) return null;
    if (col.numeric && /^\d{4,}$/.test(value))
      return Number(value).toLocaleString("en-NG");
    return t(value);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="npf-field npf-field-icon h-12 min-w-60 flex-1 rounded-full ps-5">
          <SearchIcon aria-hidden className="size-5 shrink-0 text-npf-blue" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              reset();
            }}
            placeholder={t("Search")}
            aria-label={t("Search {what}", { what: t(caption) })}
          />
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
              onChange={(e) => {
                setGroup(e.target.value);
                reset();
              }}
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
        {slice.map((row, i) => {
          const [head, ...rest] = columns;
          const title = show(head, row[head.key]);
          const href = head.linkKey ? (row[head.linkKey] as string) : null;
          return (
            <li key={current * PAGE + i} className="flex gap-3 px-4 py-4">
              <span className="npf-caption mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-npf-cloud text-npf-blue-ink tabular-nums">
                {current * PAGE + i + 1}
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
        {slice.length === 0 ? (
          <li className="px-5 py-12 text-center">
            <p className="npf-body text-npf-body">
              {t("Nothing matches “{query}”.", { query })}
            </p>
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
                      onClick={() => {
                        setSort(
                          active
                            ? { key: col.key, dir: sort.dir === 1 ? -1 : 1 }
                            : { key: col.key, dir: 1 },
                        );
                        reset();
                      }}
                      className={`group -mx-2 inline-flex min-h-10 items-center gap-1.5 rounded-chip px-2 transition-colors hover:bg-white/70 hover:text-npf-blue ${col.numeric ? "flex-row-reverse text-end" : "text-start"}`}
                    >
                      {t(col.label)}
                      <ChevronDown
                        aria-hidden
                        className={`size-4 shrink-0 transition-[rotate,opacity] duration-(--dur-hover) ${
                          active
                            ? sort.dir === -1
                              ? "rotate-180 text-npf-blue"
                              : "text-npf-blue"
                            : "opacity-35 group-hover:opacity-70"
                        }`}
                      />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-npf-hairline">
            {slice.map((row, i) => (
              <tr
                key={current * PAGE + i}
                className="align-top transition-colors hover:bg-npf-paper"
              >
                <td className="npf-small py-4 ps-5 pe-2 text-npf-steel tabular-nums">
                  {current * PAGE + i + 1}
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
            {slice.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-14">
                  <div className="flex flex-col items-center text-center">
                    <span className="grid size-12 place-items-center rounded-full bg-npf-cloud text-npf-blue">
                      <SearchIcon className="size-5" />
                    </span>
                    <p className="npf-body mt-4 text-npf-body">
                      {t("Nothing matches “{query}”.", { query })}
                    </p>
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
        {pages > 1 ? (
          <div className="flex items-center gap-2">
            <span className="npf-small me-2 text-npf-steel tabular-nums">
              {t("Page {page} of {pages}", { page: current + 1, pages })}
            </span>
            <button
              type="button"
              onClick={() => setPage(current - 1)}
              disabled={current === 0}
              aria-label={t("Previous page")}
              className="npf-icon-btn"
            >
              <ChevronLeft className="size-5 rtl:-scale-x-100" />
            </button>
            <button
              type="button"
              onClick={() => setPage(current + 1)}
              disabled={current >= pages - 1}
              aria-label={t("Next page")}
              className="npf-icon-btn"
            >
              <ChevronRight className="size-5 rtl:-scale-x-100" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
