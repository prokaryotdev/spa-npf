"use client";

import { useId } from "react";
import { SearchIcon } from "./icons";

export type Sort = "newest" | "oldest" | "az";

const SORTS: { value: Sort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "az", label: "A – Z" },
];

/** Search, sort and an optional category filter, shared by the long lists. */
export default function ListControls({
  noun,
  query,
  onQuery,
  sort,
  onSort,
  categories,
  category,
  onCategory,
  shown,
  total,
}: {
  /** Plural, lower case: "events", "albums". Used in the label and the count. */
  noun: string;
  query: string;
  onQuery: (value: string) => void;
  sort: Sort;
  onSort: (value: Sort) => void;
  categories?: string[];
  category?: string;
  onCategory?: (value: string) => void;
  shown: number;
  total: number;
}) {
  const id = useId();

  return (
    <div className="mb-10">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[240px] flex-1">
          <label
            htmlFor={`${id}-q`}
            className="mb-1.5 block text-sm font-medium text-dp-ink"
          >
            Search {noun}
          </label>
          <div className="flex items-center gap-3 rounded-xl bg-[#F4F8F6] px-4 ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-dp-green">
            <SearchIcon aria-hidden className="size-5 shrink-0 text-dp-green-ink" />
            <input
              id={`${id}-q`}
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder={`Filter by name`}
              className="w-full bg-transparent py-3 text-base text-dp-ink outline-none placeholder:text-dp-muted"
            />
          </div>
        </div>

        {categories?.length && onCategory ? (
          <div>
            <label
              htmlFor={`${id}-cat`}
              className="mb-1.5 block text-sm font-medium text-dp-ink"
            >
              Type
            </label>
            <select
              id={`${id}-cat`}
              value={category}
              onChange={(e) => onCategory(e.target.value)}
              className="rounded-xl bg-[#F4F8F6] px-4 py-3 text-base text-dp-ink ring-1 ring-black/5 outline-none focus:ring-2 focus:ring-dp-green"
            >
              <option value="">All types</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <label
            htmlFor={`${id}-sort`}
            className="mb-1.5 block text-sm font-medium text-dp-ink"
          >
            Sort by
          </label>
          <select
            id={`${id}-sort`}
            value={sort}
            onChange={(e) => onSort(e.target.value as Sort)}
            className="rounded-xl bg-[#F4F8F6] px-4 py-3 text-base text-dp-ink ring-1 ring-black/5 outline-none focus:ring-2 focus:ring-dp-green"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p aria-live="polite" className="mt-4 text-sm text-dp-muted">
        Showing {shown} of {total} {noun}
      </p>
    </div>
  );
}

/** The comparator behind the three sort options. */
export function compare<T extends { title: string }>(
  sort: Sort,
  date: (item: T) => string,
) {
  return (a: T, b: T) => {
    if (sort === "az") return a.title.localeCompare(b.title);
    const diff = date(a).localeCompare(date(b));
    return sort === "oldest" ? diff : -diff;
  };
}
