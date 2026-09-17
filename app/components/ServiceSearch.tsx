"use client";

import Image from "next/image";
import Link from "../i18n/Link";
import { useRouter } from "../i18n/Link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  popularServices,
  suggest,
  type SearchHit,
  type SuggestionGroup,
} from "../search-index";
import { ClockIcon, EnterKeyIcon, SearchIcon, ServicesIcon } from "./icons";
import { useLang, useT } from "../i18n/client";
import { localize } from "../i18n/localize";

const RECENT_KEY = "dp:recent-searches";
const RECENT_MAX = 5;

/**
 * The search box on the homepage and in the header.
 *
 * It is a real combobox, not an input that posts a form: the site's 92
 * services are already in the bundle, so every keystroke can answer from
 * memory. Services are always offered first — see suggest() for why that is
 * not the same as "the top of the ranked list".
 */
export default function ServiceSearch({
  variant = "hero",
  placement = "down",
  clearance = 16,
  autoFocus = false,
  initialQuery = "",
  placeholder,
  onNavigate,
  onOpenChange,
}: {
  variant?: "hero" | "panel";
  /**
   * The homepage box sits in the bottom band of a `overflow-hidden` hero, a
   * hundred-odd pixels off the fold. A panel below it would be clipped and
   * off-screen at once, so there it grows upward into the photo instead.
   */
  placement?: "down" | "up";
  /**
   * Pixels to leave clear at the end the panel grows towards. The hero sits
   * inside a `z-10` stacking context, so its panel can never paint above the
   * fixed header however high its own z-index goes — the only fix is to stop
   * it short of one.
   */
  clearance?: number;
  autoFocus?: boolean;
  /** Seeds the box on /app/search so the query stays visible and editable. */
  initialQuery?: string;
  /** Defaults to "Search for a service", translated. */
  placeholder?: string;
  /** Lets the header overlay close itself once a suggestion is taken. */
  onNavigate?: () => void;
  /**
   * The hero pauses its slideshow while the panel is open: the caption above
   * it is an aria-live region, so an unpaused carousel interrupts a screen
   * reader mid-suggestion every six seconds.
   */
  onOpenChange?: (open: boolean) => void;
}) {
  const t = useT();
  const router = useRouter();
  const id = useId();
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const notify = useRef(onOpenChange);
  useEffect(() => {
    notify.current = onOpenChange;
  });

  // Recent searches are read the first time the panel opens, not in an effect
  // on mount: they are only ever shown inside the panel, and reading storage
  // during render would hydrate to different markup than the server sent.
  const recentRead = useRef(false);
  function openPanel() {
    setOpen(true);
    if (recentRead.current) return;
    recentRead.current = true;
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) setRecent(JSON.parse(saved).slice(0, RECENT_MAX));
    } catch {
      // A blocked or corrupt store just means no history to offer.
    }
  }

  const trimmed = query.trim();
  const lang = useLang();
  // The index itself stays English — it is keyed by slug and href — so the
  // rows are translated on the way out rather than duplicated on the way in.
  const groups = useMemo<SuggestionGroup[]>(
    () =>
      localize(
        trimmed
          ? suggest(trimmed)
          : [{ section: "Most used services", hits: popularServices }],
        lang,
      ),
    [trimmed, lang],
  );

  // One flat list behind the grouped rendering: arrow keys move through rows,
  // not through sections.
  const rows = useMemo(() => groups.flatMap((g) => g.hits), [groups]);
  const empty = Boolean(trimmed) && rows.length === 0;

  // The highlight is cleared where the query changes rather than in an effect
  // watching it, so there is no render that shows a stale row highlighted.
  function retype(next: string) {
    setQuery(next);
    setActive(-1);
    openPanel();
  }

  useEffect(() => notify.current?.(open), [open]);

  // The panel is as tall as the room it has, never taller.
  const [maxHeight, setMaxHeight] = useState(448);
  useEffect(() => {
    if (!open) return;
    const measure = () => {
      const box = root.current?.getBoundingClientRect();
      if (!box) return;
      const room =
        placement === "up"
          ? box.top - clearance - 8
          : window.innerHeight - box.bottom - clearance - 8;
      // Below ~180px a list stops being worth showing, so it overlaps a
      // little rather than collapsing to a sliver.
      setMaxHeight(Math.max(180, Math.min(room, 448)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, placement, clearance]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the highlighted row in view when the arrow keys walk past the edge.
  useEffect(() => {
    if (active < 0) return;
    list.current
      ?.querySelector(`[data-row="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function remember(term: string) {
    const next = [term, ...recent.filter((r) => r !== term)].slice(
      0,
      RECENT_MAX,
    );
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // Not worth failing a navigation over.
    }
  }

  function take(hit: SearchHit) {
    remember(hit.title);
    setOpen(false);
    setQuery("");
    onNavigate?.();
    if (hit.external) window.open(hit.href, "_blank", "noopener,noreferrer");
    else router.push(hit.href);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (active >= 0 && rows[active]) return take(rows[active]);
    if (!trimmed) return;
    remember(trimmed);
    setOpen(false);
    onNavigate?.();
    router.push(`/app/search?q=${encodeURIComponent(trimmed)}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      if (open) setOpen(false);
      else setQuery("");
      return;
    }
    if (e.key === "Tab") return setOpen(false);
    if (!rows.length) return;

    const move = (to: number) => {
      e.preventDefault();
      openPanel();
      setActive(to);
    };
    if (e.key === "ArrowDown") move(active + 1 >= rows.length ? 0 : active + 1);
    else if (e.key === "ArrowUp")
      move(active <= 0 ? rows.length - 1 : active - 1);
    else if (e.key === "Home" && open) move(0);
    else if (e.key === "End" && open) move(rows.length - 1);
  }

  const hero = variant === "hero";
  const listId = `${id}-list`;

  return (
    <div ref={root} className="relative">
      <form
        role="search"
        onSubmit={submit}
        className={`flex items-center rounded-2xl ${
          hero
            ? "gap-[11px] bg-white px-[11px]"
            : "gap-3 bg-[#F4F6FA] px-4 ring-1 ring-black/5 transition-shadow focus-within:ring-2 focus-within:ring-npf-blue"
        }`}
      >
        <SearchIcon aria-hidden className="size-6 shrink-0 text-npf-blue-ink" />
        <input
          id={`${id}-input`}
          name="q"
          type="text"
          role="combobox"
          value={query}
          autoFocus={autoFocus}
          autoComplete="off"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && active >= 0 ? `${id}-row-${active}` : undefined
          }
          aria-label={t("Search Nigeria Police Force services")}
          placeholder={placeholder ?? t("Search for a service")}
          onChange={(e) => retype(e.target.value)}
          onFocus={openPanel}
          onKeyDown={onKeyDown}
          className={`w-full flex-grow bg-transparent outline-none placeholder:text-npf-muted ${
            hero
              ? "py-5 text-sm text-npf-muted [@media(max-height:768px)]:py-3"
              : "py-4 text-base text-npf-ink"
          }`}
        />
        {trimmed ? (
          <button
            type="submit"
            className="my-2 shrink-0 rounded-xl bg-npf-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-npf-blue-mid"
          >
            {t("Search")}
          </button>
        ) : null}
      </form>

      {open ? (
        <div
          ref={list}
          style={{ maxHeight }}
          className={`npf-suggest absolute inset-x-0 z-50 overflow-y-auto rounded-2xl bg-white p-2 text-start shadow-[0_28px_60px_-24px_rgba(0,50,34,0.55)] ring-1 ring-black/10 ${
            placement === "up"
              ? "npf-suggest-up bottom-[calc(100%+8px)]"
              : "top-[calc(100%+8px)]"
          }`}
        >
          <ul id={listId} role="listbox" aria-label={t("Suggestions")}>
            {groups.map((group) => (
              <li key={group.section} role="presentation">
                <p className="px-3 pt-3 pb-1.5 text-xs font-medium tracking-[0.08em] text-npf-muted uppercase">
                  {t(group.section)}
                </p>
                <ul role="presentation">
                  {group.hits.map((hit) => {
                    const index = rows.indexOf(hit);
                    return (
                      <li
                        key={hit.section + hit.href + hit.title}
                        role="presentation"
                      >
                        <Link
                          role="option"
                          id={`${id}-row-${index}`}
                          data-row={index}
                          aria-selected={index === active}
                          href={hit.href}
                          target={hit.external ? "_blank" : undefined}
                          rel={hit.external ? "noopener noreferrer" : undefined}
                          tabIndex={-1}
                          onMouseMove={() => setActive(index)}
                          onClick={(e) => {
                            // Let the browser handle new-tab modifiers.
                            if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                            e.preventDefault();
                            take(hit);
                          }}
                          className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                            index === active
                              ? "bg-[rgba(13,160,110,0.09)]"
                              : "bg-transparent"
                          }`}
                        >
                          <Glyph hit={hit} />
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block truncate text-[15px] leading-snug font-medium ${
                                index === active
                                  ? "text-npf-blue-ink"
                                  : "text-npf-ink"
                              }`}
                            >
                              <Marked text={hit.title} query={trimmed} />
                            </span>
                            {hit.body ? (
                              <span className="mt-0.5 block truncate text-[13px] text-npf-muted">
                                {hit.body}
                              </span>
                            ) : null}
                          </span>
                          {index === active ? (
                            <EnterKeyIcon
                              aria-hidden
                              className="mt-1 size-4 shrink-0 text-npf-blue"
                            />
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>

          {empty ? (
            <p className="px-3 py-6 text-center text-sm text-npf-body">
              {t("Nothing matches")}{" "}
              <span className="font-medium text-npf-ink">“{trimmed}”</span>
              {t(". Try a shorter word, or")}{" "}
              <Link
                href="/app/services"
                onClick={() => setOpen(false)}
                className="font-medium text-npf-blue underline underline-offset-2"
              >
                {t("browse all services")}
              </Link>
              .
            </p>
          ) : null}

          {!trimmed && recent.length ? (
            <div className="mt-1 border-t border-black/[0.07] pt-2">
              <div className="flex items-center justify-between px-3 pt-1 pb-1.5">
                <p className="text-xs font-medium tracking-[0.08em] text-npf-muted uppercase">
                  {t("Recent")}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRecent([]);
                    try {
                      localStorage.removeItem(RECENT_KEY);
                    } catch {}
                  }}
                  className="text-xs text-npf-muted underline underline-offset-2 transition-colors hover:text-npf-blue"
                >
                  {t("Clear")}
                </button>
              </div>
              <ul className="pb-1">
                {recent.map((term) => (
                  <li key={term}>
                    <button
                      type="button"
                      onClick={() => retype(term)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[15px] text-npf-body transition-colors hover:bg-black/[0.04]"
                    >
                      <ClockIcon
                        aria-hidden
                        className="size-4 shrink-0 text-npf-muted"
                      />
                      <span className="truncate">{term}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {trimmed && !empty ? (
            <div className="mt-1 border-t border-black/[0.07] px-3 py-2.5">
              <button
                type="button"
                onClick={(e) => submit(e)}
                className="flex w-full items-center gap-2 text-left text-[13px] text-npf-body transition-colors hover:text-npf-blue"
              >
                <EnterKeyIcon aria-hidden className="size-4 shrink-0" />
                {t("See all results for")}
                <span className="truncate font-medium text-npf-ink">
                  “{trimmed}”
                </span>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {open && trimmed
          ? t(
              rows.length === 1
                ? "{n} suggestion for {q}"
                : "{n} suggestions for {q}",
              {
                n: rows.length,
                q: trimmed,
              },
            )
          : ""}
      </p>
    </div>
  );
}

/** A service ships its own icon; anything else falls back to the drawn set. */
function Glyph({ hit }: { hit: SearchHit }) {
  if (hit.icon)
    return (
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-[#F4F6FA]">
        <Image
          src={hit.icon}
          alt=""
          width={20}
          height={20}
          className="size-5"
        />
      </span>
    );
  return (
    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-[#F4F6FA] text-npf-blue-ink">
      <ServicesIcon className="size-4" />
    </span>
  );
}

/** Bolds the part of the title the visitor actually typed. */
function Marked({ text, query }: { text: string; query: string }) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return <>{text}</>;

  const pattern = new RegExp(
    `(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi",
  );
  return (
    <>
      {text.split(pattern).map((part, i) =>
        words.includes(part.toLowerCase()) ? (
          <mark key={i} className="bg-transparent font-bold text-inherit">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
