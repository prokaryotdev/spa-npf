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
import { terms } from "../search-text";
import { highlight } from "./DataTable";
import {
  ArrowDown,
  ArrowUpRight,
  ClockIcon,
  CloseIcon,
  EnterKeyIcon,
  SearchIcon,
  ServicesIcon,
} from "./icons";
import { useLang, useT } from "../i18n/client";
import { localize } from "../i18n/localize";

const RECENT_KEY = "dp:recent-searches";
const RECENT_MAX = 5;

/** Only shown where there is a keyboard to press them. */
const FINE = "hidden [@media(pointer:fine)]:flex";
const kbd =
  "inline-grid h-5.5 min-w-5.5 place-items-center rounded-[5px] bg-white px-1 font-sans text-2xs font-medium text-npf-ink shadow-[0_1px_0_var(--color-npf-line)] ring-1 ring-npf-line ring-inset";

/**
 * The search box on the homepage, in the header sheet and on /app/search.
 *
 * It is a real combobox, not an input that posts a form: the site's 92
 * services are already in the bundle, so every keystroke can answer from
 * memory. Services are always offered first — see suggest() for why that is
 * not the same as "the top of the ranked list".
 *
 * `hero` sits on the photograph, `panel` on a white page; both float their
 * suggestions over what is below. `sheet` is the header's search: the box
 * and its suggestions are one card, the list part of it rather than over it,
 * so nothing can clip it and it is never closed while the sheet is up.
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
  onClose,
}: {
  variant?: "hero" | "panel" | "sheet";
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
  /** The sheet's own close button. */
  onClose?: () => void;
}) {
  const t = useT();
  const router = useRouter();
  const id = useId();
  const sheet = variant === "sheet";
  const [query, setQuery] = useState(initialQuery);
  const [shown, setShown] = useState(false);
  const open = sheet || shown;
  const [active, setActive] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const notify = useRef(onOpenChange);
  useEffect(() => {
    notify.current = onOpenChange;
  });

  // Recent searches are read the first time the panel opens, not during
  // render: they are only ever shown inside the panel, and reading storage
  // during render would hydrate to different markup than the server sent.
  const recentRead = useRef(false);
  function openPanel() {
    setShown(true);
    if (recentRead.current) return;
    recentRead.current = true;
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) setRecent(JSON.parse(saved).slice(0, RECENT_MAX));
    } catch {
      // A blocked or corrupt store just means no history to offer.
    }
  }
  // The sheet is open from its first frame, so it reads them on mount.
  useEffect(() => {
    if (sheet) openPanel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet]);

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

  // A floating panel is as tall as the room it has, never taller.
  const [maxHeight, setMaxHeight] = useState(480);
  useEffect(() => {
    if (!open || sheet) return;
    const measure = () => {
      const box = root.current?.getBoundingClientRect();
      if (!box) return;
      const room =
        placement === "up"
          ? box.top - clearance - 8
          : window.innerHeight - box.bottom - clearance - 8;
      // Below ~220px a list stops being worth showing, so it overlaps a
      // little rather than collapsing to a sliver.
      setMaxHeight(Math.max(220, Math.min(room, 480)));
    };
    measure();
    // A box low on a short screen scrolls up far enough for a useful list,
    // rather than opening one that runs off the bottom.
    const box = root.current?.getBoundingClientRect();
    if (box && placement === "down") {
      const short = 320 - (window.innerHeight - box.bottom - clearance);
      if (short > 0) window.scrollBy({ top: Math.min(short, box.top - 96) });
    }
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [open, sheet, placement, clearance]);

  useEffect(() => {
    if (!open || sheet) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setShown(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, sheet]);

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
    setShown(false);
    setQuery("");
    onNavigate?.();
    if (hit.external) window.open(hit.href, "_blank", "noopener,noreferrer");
    else router.push(hit.href);
  }

  function submit(e: React.FormEvent | React.MouseEvent) {
    e.preventDefault();
    if (open && active >= 0 && rows[active]) return take(rows[active]);
    if (!trimmed) return input.current?.focus();
    remember(trimmed);
    setShown(false);
    onNavigate?.();
    router.push(`/app/search?q=${encodeURIComponent(trimmed)}`);
  }

  function clear() {
    retype("");
    input.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      // The sheet's <dialog> closes itself on Escape.
      if (sheet) return;
      if (shown) setShown(false);
      else setQuery("");
      return;
    }
    if (e.key === "Tab") return sheet ? undefined : setShown(false);
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

  const listId = `${id}-list`;

  const field = (
    <input
      ref={input}
      id={`${id}-input`}
      name="q"
      type="text"
      role="combobox"
      enterKeyHint="search"
      value={query}
      autoFocus={autoFocus}
      autoComplete="off"
      spellCheck={false}
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
      className="h-full min-w-0 flex-1 bg-transparent text-base text-npf-ink caret-npf-blue outline-none placeholder:text-npf-muted focus-visible:outline-none md:text-lg"
    />
  );

  const clearButton = trimmed ? (
    <button
      type="button"
      onClick={clear}
      aria-label={t("Clear search")}
      className="grid size-9 shrink-0 place-items-center rounded-full text-npf-steel transition-[background-color,color,scale] hover:bg-npf-ink/[0.06] hover:text-npf-ink active:scale-[0.94]"
    >
      <CloseIcon className="size-4.5" />
    </button>
  ) : null;

  const body = (
    <>
      <ul id={listId} role="listbox" aria-label={t("Suggestions")}>
        {groups.map((group) => (
          <li key={group.section} role="presentation" className="pb-1">
            <p className="px-3 pt-3 pb-1.5 text-meta font-medium text-npf-steel">
              {t(group.section)}
            </p>
            <ul role="presentation">
              {group.hits.map((hit) => {
                const index = rows.indexOf(hit);
                const on = index === active;
                return (
                  <li
                    key={hit.section + hit.href + hit.title}
                    role="presentation"
                  >
                    <Link
                      role="option"
                      id={`${id}-row-${index}`}
                      data-row={index}
                      aria-selected={on}
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
                      className={`flex items-center gap-3.5 rounded-chip px-3 py-2.5 transition-colors duration-(--dur-hover) ${
                        on ? "bg-npf-mist" : "bg-transparent"
                      }`}
                    >
                      <Glyph hit={hit} on={on} />
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-title leading-snug font-medium transition-colors duration-(--dur-hover) ${
                            on ? "text-npf-blue-ink" : "text-npf-ink"
                          }`}
                        >
                          <Marked text={hit.title} query={trimmed} />
                        </span>
                        {hit.body ? (
                          <span className="mt-0.5 block truncate text-meta text-npf-body">
                            {hit.body}
                          </span>
                        ) : null}
                      </span>
                      {hit.external ? (
                        <ArrowUpRight
                          aria-hidden
                          className="size-4 shrink-0 text-npf-steel"
                        />
                      ) : on ? (
                        <EnterKeyIcon
                          aria-hidden
                          className="size-4 shrink-0 text-npf-blue"
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
        <div className="flex items-start gap-3.5 px-3 py-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-chip bg-npf-chip text-npf-blue">
            <SearchIcon className="size-4.5" />
          </span>
          <p className="min-w-0 text-sm text-npf-body">
            <span className="block font-medium break-words text-npf-ink">
              {t("Nothing matches")} “{trimmed}”
            </span>
            {t("Try a shorter word, or")}{" "}
            <Link
              href="/app/services"
              onClick={() => {
                setShown(false);
                onNavigate?.();
              }}
              className="font-medium text-npf-blue underline underline-offset-3"
            >
              {t("browse all services")}
            </Link>
            .
          </p>
        </div>
      ) : null}

      {!trimmed && recent.length ? (
        <div className="mt-1 border-t border-npf-hairline pt-1">
          <div className="flex items-center justify-between px-3 pt-3 pb-1.5">
            <p className="text-meta font-medium text-npf-steel">
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
              className="rounded-chip px-1.5 py-0.5 text-meta text-npf-steel underline underline-offset-3 transition-colors hover:text-npf-blue"
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
                  className="flex w-full items-center gap-3.5 rounded-chip px-3 py-2 text-start text-title text-npf-body transition-colors hover:bg-npf-cloud hover:text-npf-ink"
                >
                  <span className="grid size-9 shrink-0 place-items-center">
                    <ClockIcon aria-hidden className="size-4 text-npf-steel" />
                  </span>
                  <span className="truncate">{term}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );

  // What the keyboard does, and the way through to every result.
  const foot = (
    <div className="flex items-center justify-between gap-4 border-t border-npf-hairline bg-npf-cloud px-4 py-2.5 text-meta text-npf-body">
      <span className={`${FINE} items-center gap-4`}>
        <span className="flex items-center gap-1.5">
          <kbd className={kbd}>
            <ArrowDown className="size-3 rotate-180" />
          </kbd>
          <kbd className={kbd}>
            <ArrowDown className="size-3" />
          </kbd>
          {t("to move")}
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className={kbd}>
            <EnterKeyIcon className="size-3" />
          </kbd>
          {t("to open")}
        </span>
        {sheet ? (
          <span className="flex items-center gap-1.5">
            <kbd className={kbd}>Esc</kbd>
            {t("to close")}
          </span>
        ) : null}
      </span>
      {trimmed && !empty ? (
        <button
          type="button"
          onClick={submit}
          className="group ms-auto flex min-w-0 items-center gap-1.5 font-medium text-npf-blue transition-colors hover:text-npf-blue-deep"
        >
          <span className="truncate">
            {t("See all results for")} “{trimmed}”
          </span>
          <ArrowDown className="size-3.5 shrink-0 -rotate-90 transition-transform group-hover:translate-x-0.5 rtl:rotate-90 rtl:group-hover:-translate-x-0.5" />
        </button>
      ) : null}
    </div>
  );
  // On a touch screen with nothing typed the foot has nothing to say.
  const footHidden = !trimmed || empty ? FINE : "flex";

  const live = (
    <p aria-live="polite" className="sr-only">
      {open && trimmed
        ? t(
            rows.length === 1
              ? "{n} suggestion for {q}"
              : "{n} suggestions for {q}",
            { n: rows.length, q: trimmed },
          )
        : ""}
    </p>
  );

  if (sheet)
    return (
      <div
        ref={root}
        className="flex min-h-0 flex-col overflow-hidden rounded-card bg-white shadow-raised ring-1 ring-npf-night/10"
      >
        <form
          role="search"
          onSubmit={submit}
          className="flex h-16 shrink-0 items-center gap-3 border-b border-npf-hairline ps-5 pe-3 md:h-18"
        >
          <SearchIcon aria-hidden className="size-5.5 shrink-0 text-npf-blue" />
          {field}
          {clearButton}
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 shrink-0 items-center rounded-chip px-2 text-sm font-medium text-npf-blue transition-[background-color,color,scale] hover:bg-npf-ink/[0.06] hover:text-npf-blue-deep active:scale-[0.94]"
          >
            <span className={FINE}>
              <kbd className={kbd}>Esc</kbd>
              <span className="sr-only">{t("Close")}</span>
            </span>
            <span className="[@media(pointer:fine)]:hidden">{t("Close")}</span>
          </button>
        </form>
        <div
          ref={list}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 [scrollbar-color:var(--color-npf-line)_transparent] [scrollbar-width:thin]"
        >
          {body}
        </div>
        <div className={`${footHidden} shrink-0 flex-col`}>{foot}</div>
        {live}
      </div>
    );

  const hero = variant === "hero";
  return (
    <div ref={root} className="relative">
      <form
        role="search"
        onSubmit={submit}
        className={`flex items-center gap-3 rounded-full bg-white ps-5 pe-2 transition-shadow md:ps-6 ${
          hero
            ? "h-16 shadow-raised ring-1 ring-white/40 focus-within:ring-2 focus-within:ring-npf-gold-soft [@media(max-height:768px)]:h-14"
            : "h-15 shadow-card ring-1 ring-npf-hairline ring-inset focus-within:ring-2 focus-within:ring-npf-blue-mid"
        }`}
      >
        <SearchIcon aria-hidden className="size-5.5 shrink-0 text-npf-blue" />
        {field}
        {clearButton}
        <button
          type="submit"
          className={`npf-btn npf-btn-primary shrink-0 ${hero ? "h-12 [@media(max-height:768px)]:h-10" : "h-11"}`}
        >
          {t("Search")}
        </button>
      </form>

      {open ? (
        <div
          style={{ maxHeight }}
          className={`npf-suggest absolute inset-x-0 z-50 flex flex-col overflow-hidden rounded-card bg-white text-start shadow-raised ring-1 ring-npf-hairline ${
            placement === "up"
              ? "npf-suggest-up bottom-[calc(100%+10px)]"
              : "top-[calc(100%+10px)]"
          }`}
        >
          <div
            ref={list}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 [scrollbar-color:var(--color-npf-line)_transparent] [scrollbar-width:thin]"
          >
            {body}
          </div>
          <div className={`${footHidden} shrink-0 flex-col`}>{foot}</div>
        </div>
      ) : null}
      {live}
    </div>
  );
}

/** A service ships its own icon; anything else falls back to the drawn set. */
function Glyph({ hit, on }: { hit: SearchHit; on: boolean }) {
  return (
    <span
      className={`grid size-9 shrink-0 place-items-center rounded-chip transition-colors duration-(--dur-hover) ${
        on ? "bg-white ring-1 ring-npf-line ring-inset" : "bg-npf-cloud"
      } text-npf-blue-ink`}
    >
      {hit.icon ? (
        <Image src={hit.icon} alt="" width={20} height={20} className="size-5" />
      ) : (
        <ServicesIcon className="size-4.5" />
      )}
    </span>
  );
}

/** Bolds the part of the title the visitor typed, so "kasa" lights "Ƙasa". */
function Marked({ text, query }: { text: string; query: string }) {
  return <>{highlight(text, terms(query), "bg-transparent font-bold text-inherit")}</>;
}
