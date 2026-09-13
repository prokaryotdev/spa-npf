"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, SearchIcon } from "./icons";

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
}) {
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
      return columns.some((c) =>
        String(row[c.key] ?? "").toLowerCase().includes(q),
      );
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
  }, [rows, columns, query, sort, group, filterKey]);

  const pages = Math.max(1, Math.ceil(visible.length / PAGE));
  const current = Math.min(page, pages - 1);
  const slice = visible.slice(current * PAGE, current * PAGE + PAGE);

  const reset = () => setPage(0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-dp-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              reset();
            }}
            placeholder="Search"
            aria-label={`Search ${caption}`}
            className="w-full rounded-full border border-[#E4E2E6] bg-white py-3 pr-4 pl-12 text-sm text-dp-ink outline-none placeholder:text-dp-muted focus:border-dp-green"
          />
        </div>

        {groups.length > 1 ? (
          <div className="relative">
            <label htmlFor="tableGroup" className="sr-only">
              Filter by category
            </label>
            <select
              id="tableGroup"
              value={group}
              onChange={(e) => {
                setGroup(e.target.value);
                reset();
              }}
              className="appearance-none rounded-full border border-[#E4E2E6] bg-white py-3 pr-10 pl-5 text-sm text-dp-ink outline-none focus:border-dp-green"
            >
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g === "All" ? "All categories" : g}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-dp-muted"
            />
          </div>
        ) : null}

        <p className="text-sm text-dp-muted" aria-live="polite">
          {visible.length} of {rows.length}
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl ring-1 ring-black/5">
        <table
          style={{ minWidth }}
          className="w-full border-collapse bg-white text-left"
        >
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-[#F4F8F6]">
              <th scope="col" className="px-4 py-4 text-sm font-medium text-dp-body">
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
                    className={`px-4 py-4 text-sm font-medium text-dp-body ${col.numeric ? "text-right" : ""}`}
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
                      className="inline-flex items-center gap-1.5 transition-colors hover:text-dp-green"
                    >
                      {col.label}
                      <ChevronDown
                        aria-hidden
                        className={`size-4 transition-transform ${
                          active
                            ? sort.dir === -1
                              ? "rotate-180 text-dp-green"
                              : "text-dp-green"
                            : "opacity-35"
                        }`}
                      />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {slice.map((row, i) => (
              <tr
                key={current * PAGE + i}
                className="border-t border-black/5 align-top transition-colors hover:bg-[#F9FBFA]"
              >
                <td className="px-4 py-4 text-sm text-dp-muted tabular-nums">
                  {current * PAGE + i + 1}
                </td>
                {columns.map((col) => {
                  const value = String(row[col.key] ?? "—");
                  const href = col.linkKey ? (row[col.linkKey] as string) : null;
                  return (
                    <td
                      key={col.key}
                      className={`px-4 py-4 text-sm text-dp-ink ${col.numeric ? "text-right tabular-nums" : ""}`}
                    >
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-dp-green underline-offset-4 transition-colors hover:text-dp-green-deep hover:underline"
                        >
                          {value}
                          <span className="sr-only"> (opens in a new window)</span>
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
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-16 text-center text-sm text-dp-muted"
                >
                  Nothing matches “{query}”.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {pages > 1 ? (
        <div className="mt-6 flex items-center justify-end gap-2">
          <span className="me-2 text-sm text-dp-muted">
            Page {current + 1} of {pages}
          </span>
          <button
            type="button"
            onClick={() => setPage(current - 1)}
            disabled={current === 0}
            aria-label="Previous page"
            className="grid size-11 place-items-center rounded-[32px] bg-[#EBEBEC] text-[#4B4C4D] transition-all hover:bg-[#4A445914] active:rounded-xl disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setPage(current + 1)}
            disabled={current >= pages - 1}
            aria-label="Next page"
            className="grid size-11 place-items-center rounded-[32px] bg-[#EBEBEC] text-[#4B4C4D] transition-all hover:bg-[#4A445914] active:rounded-xl disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
