"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { InitiativeCard } from "../content";
import { ArrowRight } from "./icons";
import { useT } from "../i18n/client";

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

  // White with a hairline ring at rest, filled brand blue on hover with the
  // arrow nudging the way it points, pressed in on click. Disabled drops to
  // a faint ring and icon rather than fading the whole button.
  const arrow =
    "group/arrow grid size-14 place-items-center rounded-full bg-white text-npf-blue-deep ring-1 ring-npf-ink/15 ring-inset transition-[background-color,color,box-shadow,scale] duration-200 ease-[var(--ease-custom)] hover:bg-npf-blue hover:text-white hover:ring-npf-blue active:scale-[0.94] disabled:pointer-events-none disabled:text-npf-ink/25 disabled:ring-npf-ink/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-npf-blue";
  const icon =
    "size-[22px] transition-transform duration-300 ease-[var(--ease-custom)]";

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
          className="npf-rail me-[calc(50%-50vw)] mt-10 flex gap-4 overflow-x-auto md:mt-12 pe-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-npf-blue md:gap-6 xl:pe-[7.5vw]"
        >
          {/* Poster cards: the photograph is the card, and the text sits
              on a night-blue fade rising from the bottom edge, so it reads
              on any photo. */}
          {tiers.map((tier) => (
            <li
              key={tier.title}
              className="group relative isolate flex aspect-[3/4] w-[76%] shrink-0 flex-col justify-end overflow-hidden rounded-[24px] bg-npf-night text-white sm:w-[47%] lg:w-[36%] xl:w-[34%] 2xl:w-[31%]"
            >
              <Image
                src={tier.image}
                alt=""
                fill
                sizes="(min-width: 1536px) 31vw, (min-width: 1280px) 30vw, (min-width: 1024px) 36vw, (min-width: 640px) 47vw, 76vw"
                className="-z-10 object-cover transition-transform duration-700 ease-[var(--ease-custom)] group-hover:scale-[1.05]"
              />
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--color-npf-night)_0%,rgb(10_21_38/0.85)_32%,rgb(10_21_38/0.3)_52%,rgb(10_21_38/0)_66%)]"
              />
              <div className="p-6 md:p-8">
                <h3 className="font-secondary text-2xl font-bold tracking-[-0.02em] text-balance md:text-[26px]">
                  {tier.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-pretty text-white/80">
                  {tier.body}
                </p>
              </div>
              {/* A hairline edge, so the dark card doesn't smear into the
                  photo's own dark corners. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-white/10 ring-inset"
              />
            </li>
          ))}
        </ol>

        {/* Where you are in the row, then the way to move it. */}
        <div className="mt-8 flex items-center gap-6 md:mt-10 md:gap-10">
          <div
            aria-hidden
            className="h-[3px] flex-1 overflow-hidden rounded-full bg-npf-blue/10"
          >
            <span
              ref={thumb}
              className="block h-full rounded-full bg-npf-blue transition-[translate] duration-150 ease-out"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={edge.start}
              aria-label={t("Previous slide")}
              className={arrow}
            >
              <ArrowRight
                className={`${icon} -scale-x-100 group-hover/arrow:-translate-x-0.5`}
              />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={edge.end}
              aria-label={t("Next slide")}
              className={arrow}
            >
              <ArrowRight
                className={`${icon} group-hover/arrow:translate-x-0.5`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
