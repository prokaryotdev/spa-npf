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
 * screen so the next tier peeks in. Wheel and trackpad never move it: only
 * the arrows (buttons or keys), a drag on the cards, or a drag on the bar
 * under them. Every tier leads to the same place, so the one
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

  // The row only moves when asked: a drag on the cards (mouse or touch) or
  // on the bar under them. Snap is off while the finger is down so the row
  // follows it, and comes back on release to settle on a card.
  const drag = (e: React.PointerEvent<HTMLElement>, scale: number) => {
    const el = rail.current;
    if (!el || e.button !== 0) return;
    const x0 = e.clientX;
    const s0 = el.scrollLeft;
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    el.style.scrollSnapType = "none";
    const move = (ev: PointerEvent) => {
      el.scrollLeft = s0 + (ev.clientX - x0) * scale;
    };
    const up = () => {
      el.style.scrollSnapType = "";
      target.removeEventListener("pointermove", move);
    };
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", up, { once: true });
    target.addEventListener("pointercancel", up, { once: true });
  };

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
            last card stop in line with the container. The block padding
            (taken back by the margin) gives the reveal's rise and the card
            shadow room, so the clip never cuts a card's top. */}
        <ol
          ref={rail}
          onScroll={onScroll}
          onPointerDown={(e) => drag(e, -1)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") step(1);
            else if (e.key === "ArrowLeft") step(-1);
            else return;
            e.preventDefault();
          }}
          tabIndex={0}
          aria-labelledby={id}
          className="npf-rail me-[calc(50%-50vw)] mt-[calc(var(--npf-head-gap)-2rem)] -mb-8 flex cursor-grab touch-pan-y gap-(--npf-gap) overflow-hidden py-8 pe-4 select-none focus-visible:outline-offset-4 active:cursor-grabbing xl:pe-[7.5vw]"
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
              <div className="npf-tile npf-grade flex-1 p-(--npf-pad)">
                <Image
                  src={tier.image}
                  alt=""
                  fill
                  draggable={false}
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
          {/* The bar drags too; the padding makes the thin line easy to grab. */}
          <div
            aria-hidden
            onPointerDown={(e) => {
              const el = rail.current;
              if (el) drag(e, el.scrollWidth / e.currentTarget.clientWidth);
            }}
            className="-my-3 flex-1 cursor-grab touch-none py-3 active:cursor-grabbing"
          >
            <div className="h-[3px] overflow-hidden rounded-full bg-npf-blue/10">
              <span
                ref={thumb}
                className="block h-full rounded-full bg-npf-blue"
              />
            </div>
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
