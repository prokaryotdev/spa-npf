"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { domains as domainsSource } from "../content";
import { scrollToProgress, useScrollProgress } from "./useScrollProgress";
import { useLocalized, useT } from "../i18n/client";

/**
 * The headings animate letter by letter. Both languages are written in Latin
 * letters that stand alone, so one pass serves English and Hausa alike,
 * including the hooked letters, which are single characters, not pairs.
 * The animation class is only present while `play` is true, so adding it
 * replays the entrance each time a chapter comes back.
 */
function LetterStagger({ text, play }: { text: string; play: boolean }) {
  let n = 0;
  return (
    <span aria-hidden className="flex flex-wrap">
      {text.split(" ").map((word, w) => (
        <span key={w} className="me-[0.22em] flex overflow-hidden py-[0.06em]">
          {[...word].map((piece, i) => (
            <span
              key={i}
              className={`inline-block ${play ? "animate-[letter-up_var(--dur-media)_var(--ease-out)_both]" : ""}`}
              style={{ animationDelay: `${n++ * 32}ms` }}
            >
              {piece}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Land, water and sky. The section pins while each photograph rises over the
 * one beneath it, and the words hand over with it.
 *
 * Everything that follows the scroll is a transform written straight onto
 * its element each frame: a scene rises by translating its layer up, and the
 * picture inside lags behind by translating back down, so the new scene
 * reads as coming up from below rather than sliding over. Nothing is
 * clipped, blurred or re-rendered per frame.
 */
export default function Domains() {
  const domains = useLocalized(domainsSource);
  const t = useT();
  const n = domains.length;
  const section = useRef<HTMLElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const words = useRef<HTMLDivElement>(null);
  const climb = useRef<HTMLSpanElement>(null);

  // Each photograph after the first rises across a window centred on its
  // chapter's start: ground, then water, then sky.
  const rise = (i: number, p: number) =>
    i === 0 ? 1 : clamp01((p * n - i + 0.25) / 0.5);

  const active = useScrollProgress(section, n, (p) => {
    layers.current.forEach((layer, i) => {
      if (!layer) return;
      const down = 1 - rise(i, p);
      const [inner, horizon] = layer.children as unknown as HTMLElement[];
      layer.style.transform = `translate3d(0, ${down * 100}%, 0)`;
      inner.style.transform = `translate3d(0, ${down * -72}%, 0) scale(${1.04 + p * 0.06})`;
      // A rising scene casts its shadow up onto the one it covers.
      const moving = down > 0 && down < 1;
      horizon.style.opacity = moving ? "1" : "0";
      layer.style.boxShadow = moving ? "0 -32px 72px rgb(3 8 18 / 0.55)" : "none";
    });
    // The words on screen leave as the next photograph starts to rise, and
    // are gone by the time it is half up, when the next chapter's arrive.
    const now = Math.min(n - 1, Math.floor(p * n));
    const leave = now < n - 1 ? clamp01(rise(now + 1, p) * 2) : 0;
    if (words.current) {
      words.current.style.opacity = String(1 - leave);
      words.current.style.transform = `translate3d(0, ${leave * -24}px, 0)`;
    }
    if (climb.current) climb.current.style.transform = `scaleY(${p})`;
  });

  return (
    <section
      ref={section}
      aria-labelledby="domains"
      className="relative h-[300vh] bg-npf-night"
    >
      <h2 id="domains" className="sr-only">
        {t("Protection across land, water and sky")}
      </h2>

      <div className="sticky top-0 h-svh overflow-hidden">
        {domains.map((domain, i) => (
          <div
            key={domain.id}
            ref={(el) => {
              layers.current[i] = el;
            }}
            aria-hidden
            className="absolute inset-0 overflow-hidden will-change-transform"
            style={
              {
                "--shade": domain.shade,
                transform: i ? "translate3d(0, 100%, 0)" : undefined,
              } as CSSProperties
            }
          >
            <div className="absolute inset-0">
              {/*
                A <picture>, not next/image: a phone needs a different crop,
                not a smaller one. These slides are shot with the reading
                column left empty (the left third on the wide file, the upper
                two-thirds on the tall one), so a narrow viewport is handed
                its own photograph.
              */}
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet={domain.background.replace(".jpg", "-mobile.jpg")}
                />
                <img
                  src={domain.background}
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="absolute inset-0 size-full object-cover"
                />
              </picture>
              <span aria-hidden className="npf-domain-shade" />
            </div>
            {/* The horizon riding the rising edge: light caught on the seam,
                strongest mid-frame and gone at the sides. */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.55)_35%,rgb(255_255_255/0.55)_65%,transparent)] opacity-0"
            />
          </div>
        ))}

        {/* The photographs run to the top edge, behind the fixed header, so
            no bare band shows as the section scrolls in. The words centre in
            what the header leaves. */}
        <div className="npf-container relative flex h-full items-start pt-28 md:items-center md:pt-18 short:items-center short:pt-16">
          {/* Every chapter shares one grid cell, so the column keeps the
              height of its longest chapter and the heading never jumps. */}
          <div ref={words} className="grid max-w-[34rem] pe-10 md:pe-0 short:max-w-[40rem]">
            {domains.map((domain, i) => {
              const on = i === active;
              // Lines follow the heading's letters on the reveal stagger.
              const enter = (step: number) => ({
                className: on
                  ? "animate-[reveal-up_var(--dur-reveal)_var(--ease-out)_both]"
                  : "",
                style: {
                  animationDelay: `calc(200ms + var(--reveal-step) * ${step})`,
                },
              });
              return (
                <div
                  key={domain.id}
                  aria-hidden={!on}
                  className={`[grid-area:1/1] ${on ? "" : "invisible"}`}
                >
                  <h3
                    aria-label={domain.title}
                    className="npf-h2 mb-4 max-w-[15ch] text-white short:mb-2"
                  >
                    <LetterStagger text={domain.title} play={on} />
                  </h3>
                  {domain.lead ? (
                    <p
                      style={enter(0).style}
                      className={`npf-h4 mb-3 text-white short:mb-1 ${enter(0).className}`}
                    >
                      {domain.lead}
                    </p>
                  ) : null}
                  <p
                    style={enter(1).style}
                    className={`npf-lede max-w-[44ch] text-white/85 short:max-w-[60ch] short:leading-normal ${enter(1).className}`}
                  >
                    {domain.body}
                  </p>
                  {/* The units working this domain: labels, not controls, so
                      they sit as a list under a rule rather than as buttons.
                      The icons are drawn grey for light grounds, hence the
                      invert. */}
                  <ul
                    style={enter(2).style}
                    className={`mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/20 pt-5 short:mt-4 short:pt-3 ${enter(2).className}`}
                  >
                    {domain.chips.map((chip) => (
                      <li
                        key={chip.label}
                        className="npf-small flex items-center gap-2 font-medium text-white"
                      >
                        <span className="relative size-4 shrink-0">
                          <Image
                            src={chip.icon}
                            alt=""
                            fill
                            sizes="16px"
                            className="object-contain brightness-0 invert"
                          />
                        </span>
                        {chip.label}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* A rail: ground at the foot, sky at the top, and a line
            that climbs with the reader. The heading already names the
            chapter, so the rail stays dots; a pointer or keyboard landing on
            a dot names it. A tap jumps to that domain. */}
        <div className="absolute end-0 top-18 bottom-0 flex items-center pe-3 md:pe-8">
          <ol className="relative flex h-[min(36svh,280px)] flex-col-reverse justify-between">
            <span
              aria-hidden
              className="absolute inset-y-3 end-[11.5px] w-px bg-white/25"
            >
              <span
                ref={climb}
                className="block size-full origin-bottom scale-y-0 bg-white"
              />
            </span>
            {domains.map((domain, i) => (
              <li key={domain.id} className="relative">
                <button
                  type="button"
                  onClick={() =>
                    scrollToProgress(section.current, (i + 0.3) / n)
                  }
                  aria-current={i === active || undefined}
                  aria-label={domain.title}
                  className="group relative grid size-6 cursor-pointer place-items-center rounded-full outline-offset-2 focus-visible:outline-white"
                >
                  <span
                    aria-hidden
                    className="npf-caption pointer-events-none absolute end-full me-2 translate-x-1 rounded-chip bg-npf-night/80 px-2.5 py-1.5 whitespace-nowrap text-white opacity-0 backdrop-blur-sm transition-[opacity,translate] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 rtl:-translate-x-1"
                  >
                    {domain.title}
                  </span>
                  <span
                    aria-hidden
                    className={`size-2 rounded-full transition-[background-color,box-shadow,scale] duration-(--dur-media) group-hover:scale-125 ${
                      i <= active ? "bg-white" : "bg-white/40"
                    } ${i === active ? "ring-[5px] ring-white/25" : "ring-0"}`}
                  />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
