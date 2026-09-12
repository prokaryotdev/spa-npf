"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "./icons";

/**
 * A scroll-snapped card rail with the site's paired arrow controls, which
 * disable at each end. Scrolling is native; the buttons just nudge it.
 */
export default function CardRail({
  children,
  label,
  className = "",
  showControls = true,
}: {
  children: React.ReactNode;
  /** Names the rail for the arrow buttons, e.g. "SPS". */
  label: string;
  className?: string;
  showControls?: boolean;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const nudge = (direction: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  const arrow =
    "grid size-11 place-items-center rounded-[32px] bg-[#EBEBEC] text-[#4B4C4D] transition-all duration-300 ease-[var(--ease-custom)] hover:bg-[#4A445914] active:rounded-xl disabled:pointer-events-none disabled:opacity-40 md:size-14";

  return (
    <div className={className}>
      <div
        ref={rail}
        onScroll={sync}
        className="dp-rail -mx-4 flex gap-6 overflow-x-auto px-4 pb-6"
      >
        {children}
      </div>

      {showControls ? (
        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={atStart}
            aria-label={`Show previous ${label} item`}
            className={arrow}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={atEnd}
            aria-label={`Show next ${label} item`}
            className={arrow}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
