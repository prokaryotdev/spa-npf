"use client";

import { useEffect, useId, useRef, useState } from "react";
import { filterBy } from "../search-text";
import { CheckIcon, SearchIcon } from "./icons";

export type PickerItem = {
  value: string;
  label: string;
  /** A quiet second line: where a unit is, who is on it. */
  hint?: string;
  /** A mark before the label, in a status colour. */
  dot?: string;
  /** A figure at the row's end: a command's waiting count. */
  badge?: React.ReactNode;
};
export type PickerGroup = { label?: string; items: PickerItem[] };

/**
 * The console's pop-up menu: the command in view, the unit to dispatch.
 *
 * A native <select> cannot carry a second line, a status dot or a live count
 * in its rows, and those are what the officer is choosing by. So this is a
 * button that opens a popover (top layer, so a panel never clips it; light
 * dismiss and Escape come with the platform). It opens under its trigger and
 * flips above when the screen runs out. Arrow keys walk the rows; with a
 * search box, typing narrows them and Enter takes the first.
 */
export default function OpsPicker({
  label,
  trigger,
  triggerClassName,
  groups,
  value,
  onPick,
  search,
  empty,
  width = "18rem",
  active,
}: {
  /** The menu's accessible name. */
  label: string;
  /** Marks the trigger as holding a choice (data-active). */
  active?: boolean;
  trigger: React.ReactNode;
  triggerClassName: string;
  groups: PickerGroup[];
  value?: string | null;
  onPick: (value: string) => void;
  /** Placeholder for a search box; no box without it. */
  search?: string;
  /** What a search that leaves nothing says. */
  empty?: string;
  width?: string;
}) {
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // One search over every row, so a slip is judged against the whole list,
  // and a zone's name finds its commands.
  const hits = new Set(
    filterBy(
      groups.flatMap((g) => g.items.map((item) => ({ item, group: g.label ?? "" }))),
      query,
      ({ item, group }) => `${item.label} ${item.hint ?? ""} ${group}`,
    ).map(({ item }) => item),
  );
  const shown = groups
    .map((g) => ({ ...g, items: g.items.filter((i) => hits.has(i)) }))
    .filter((g) => g.items.length);

  // The panel is pinned to where the trigger was: if the page under it moves,
  // it closes. A scroll inside the panel's own list is not the page moving.
  useEffect(() => {
    if (!open) return;
    const el = panel.current;
    const close = (e: Event) => {
      if (!(e.target instanceof Node && el?.contains(e.target))) el?.hidePopover();
    };
    addEventListener("scroll", close, { capture: true, passive: true });
    addEventListener("resize", close);
    return () => {
      removeEventListener("scroll", close, { capture: true });
      removeEventListener("resize", close);
    };
  }, [open]);

  const rows = () =>
    [...(panel.current?.querySelectorAll<HTMLButtonElement>("[data-row]") ?? [])];

  /** Puts the panel under the trigger, or over it when there is no room. */
  const place = () => {
    const at = button.current?.getBoundingClientRect();
    const el = panel.current;
    if (!at || !el) return;
    const gap = 6;
    const h = el.offsetHeight;
    const w = el.offsetWidth;
    const below = at.bottom + gap + h <= innerHeight - 8 || at.top < h + gap;
    el.style.top = `${below ? at.bottom + gap : at.top - gap - h}px`;
    el.style.left = `${Math.max(8, Math.min(at.left, innerWidth - w - 8))}px`;
    el.style.transformOrigin = below ? "top left" : "bottom left";
  };

  // A search that shortens the list re-seats a panel hung above its trigger.
  useEffect(() => {
    if (open) place();
  });

  const show = () => {
    const el = panel.current;
    if (!el) return;
    setQuery("");
    el.showPopover();
    place();
    // A search box takes the keys first; without one, the current row does.
    requestAnimationFrame(() => {
      if (field.current) field.current.focus();
      else
        (rows().find((r) => r.getAttribute("aria-pressed") === "true") ?? rows()[0])?.focus();
    });
  };

  const pick = (v: string) => {
    panel.current?.hidePopover();
    button.current?.focus();
    onPick(v);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const list = rows();
    const at = list.indexOf(document.activeElement as HTMLButtonElement);
    const go = (i: number) => {
      e.preventDefault();
      list[(i + list.length) % list.length]?.focus();
    };
    if (e.key === "ArrowDown") go(at + 1);
    else if (e.key === "ArrowUp") go(at < 0 ? list.length - 1 : at - 1);
    else if (e.key === "Home" && at >= 0) go(0);
    else if (e.key === "End" && at >= 0) go(list.length - 1);
    else if (e.key === "Enter" && at < 0 && list[0]) {
      e.preventDefault();
      list[0].click();
    } else if (at >= 0 && field.current && e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      // Typing on a row goes on into the search box.
      field.current.focus();
    }
  };

  return (
    <>
      {/* The trigger names itself from its own text (with any sr-only
          words the caller puts in it), so the current choice is heard. */}
      <button
        ref={button}
        type="button"
        data-active={active ? "" : undefined}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => (open ? panel.current?.hidePopover() : show())}
        className={triggerClassName}
      >
        {trigger}
      </button>
      <div
        ref={panel}
        id={id}
        popover="auto"
        role="dialog"
        aria-label={label}
        onToggle={(e) => setOpen(e.newState === "open")}
        onKeyDown={onKey}
        style={{ width }}
        className="npf-ops-pop m-0 max-w-[calc(100vw-1rem)] overflow-hidden rounded-[0.625rem] border-0 bg-white p-0 text-npf-ink"
      >
        {search ? (
          <div className="flex h-11 items-center gap-2.5 border-b border-ops-line-soft px-3 transition-colors focus-within:border-npf-blue-mid">
            <SearchIcon aria-hidden className="size-4 shrink-0 text-npf-steel" />
            <input
              ref={field}
              type="search"
              aria-label={search}
              placeholder={search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              /* The row is the field: its hairline turns Force blue on
                 focus, so the input draws no box of its own. */
              className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none focus-visible:outline-none! [&::-webkit-search-cancel-button]:hidden"
            />
          </div>
        ) : null}
        <div className="max-h-[min(26rem,60dvh)] overflow-y-auto overscroll-contain p-1">
          {shown.length ? (
            shown.map((g, gi) => (
              <div
                key={g.label ?? gi}
                role="group"
                aria-label={g.label}
                className={gi ? "mt-1 border-t border-ops-line-soft pt-1" : ""}
              >
                {g.label ? (
                  <p aria-hidden className="px-2.5 pt-1.5 pb-1 text-2xs font-semibold text-npf-steel">
                    {g.label}
                  </p>
                ) : null}
                {g.items.map((item) => {
                  const on = item.value === (value ?? "");
                  return (
                    <button
                      key={item.value}
                      type="button"
                      data-row=""
                      aria-pressed={on}
                      onClick={() => pick(item.value)}
                      className={`flex w-full items-center gap-2.5 rounded-md px-2.5 text-start outline-none transition-colors duration-100 hover:bg-npf-chip focus-visible:bg-npf-chip focus-visible:-outline-offset-2! ${
                        item.hint ? "min-h-11 py-1.5" : "min-h-9"
                      }`}
                    >
                      {item.dot ? (
                        <span
                          aria-hidden
                          className="size-2 shrink-0 rounded-full"
                          style={{ background: item.dot }}
                        />
                      ) : null}
                      <span className="min-w-0 flex-1 leading-tight">
                        <span
                          className={`block truncate text-sm ${on ? "font-semibold text-npf-blue" : "font-medium"}`}
                        >
                          {item.label}
                        </span>
                        {item.hint ? (
                          <span className="mt-0.5 block truncate text-xs text-npf-steel">
                            {item.hint}
                          </span>
                        ) : null}
                      </span>
                      {item.badge}
                      {on ? (
                        <CheckIcon aria-hidden className="size-4 shrink-0 text-npf-blue" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))
          ) : (
            <p className="px-2.5 py-3 text-sm text-npf-steel">{empty}</p>
          )}
        </div>
      </div>
    </>
  );
}
