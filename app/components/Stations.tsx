"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { InitiativeCard } from "../content";
import { ArrowRight } from "./icons";
import { useT } from "../i18n/client";
import { reveal } from "./reveal";

/**
 * The station types are tiers of one Command, read from the start side:
 * headquarters, area, division, post, and the base on the water. Tall photo
 * cards with the text on them, in one row that runs off the end of the
 * screen so the next tier peeks in. The page's scroll leaves it alone: the
 * arrows move it a card at a time, and touch can still swipe it. The row
 * has no visible scrollbar. Every tier leads to the same place, so the one
 * way out lives in the head.
 */
export default function Stations({
  id,
  head,
  tiers,
}: {
  id: string;
  head: React.ReactNode;
  tiers: InitiativeCard[];
}) {
  const t = useT();
  const rail = useRef<HTMLOListElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  // The thumb is as wide as the share of the row on screen and sits where
  // that share is, written straight to its style so scrolling never
  // re-renders. React skips the edge update when neither end changed.
  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    const x = el.scrollLeft;
    const shown = el.clientWidth / el.scrollWidth;
    const max = el.scrollWidth - el.clientWidth;
    if (thumb.current) {
      thumb.current.style.width = `${shown * 100}%`;
      thumb.current.style.translate = `${max > 0 ? (x / max) * (1 / shown - 1) * 100 : 0}% 0`;
    }
    setEdge((e) => {
      const next = { start: x < 4, end: x >= max - 4 };
      return next.start === e.start && next.end === e.end ? e : next;
    });
  };
  // Size the thumb before the first scroll.
  useEffect(onScroll, []);

  const step = (dir: 1 | -1) => {
    const el = rail.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: (card.offsetWidth + gap) * dir,
      behavior: still ? "auto" : "smooth",
    });
  };

  return (
    <section
      aria-labelledby={id}
      className="npf-section overflow-x-clip bg-white"
    >
      <div className="npf-container">
        {head}

        {/* Bleeds off the end edge of the screen; the end padding lets the
            last card stop in line with the container. */}
        <ol
          ref={rail}
          onScroll={onScroll}
          tabIndex={0}
          aria-labelledby={id}
          className="npf-rail me-[calc(50%-50vw)] mt-(--npf-head-gap) flex gap-(--npf-gap) overflow-x-auto pe-4 focus-visible:outline-offset-4 xl:pe-[7.5vw]"
        >
          {/* Poster cards: the photograph is the card and the words sit on
              the night shade rising from the foot, so they read on any
              photo. Not links (every tier leads to the one place the head
              already points to), so they hold still under the pointer. */}
          {tiers.map((tier, i) => (
            <li
              key={tier.title}
              {...reveal(Math.min(i, 3))}
              className="flex aspect-[3/4] w-[76%] shrink-0 sm:w-[47%] lg:w-[36%] xl:w-[34%] 2xl:w-[31%]"
            >
              <div className="npf-tile flex-1 p-(--npf-pad)">
                <Image
                  src={tier.image}
                  alt=""
                  fill
                  sizes="(min-width: 1536px) 31vw, (min-width: 1280px) 30vw, (min-width: 1024px) 36vw, (min-width: 640px) 47vw, 76vw"
                  className="npf-tile-media"
                />
                <div aria-hidden className="npf-tile-shade" />
                <h3 className="npf-h4 text-white">{tier.title}</h3>
                <p className="npf-small mt-2.5 text-white/85">{tier.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Where you are in the row, then the way to move it. */}
        <div className="mt-(--npf-gap) flex items-center gap-6 md:gap-10">
          <div
            aria-hidden
            className="h-[3px] flex-1 overflow-hidden rounded-full bg-npf-blue/10"
          >
            <span ref={thumb} className="block h-full rounded-full bg-npf-blue" />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={edge.start}
              aria-label={t("Previous slide")}
              className="npf-icon-btn"
            >
              <ArrowRight className="size-5 -scale-x-100" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={edge.end}
              aria-label={t("Next slide")}
              className="npf-icon-btn"
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
