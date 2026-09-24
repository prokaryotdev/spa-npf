"use client";

import Image from "next/image";
import { useRef } from "react";
import { domains as domainsSource } from "../content";
import { chapter, useScrollProgress } from "./useScrollProgress";
import { useLocalized, useT } from "../i18n/client";

/**
 * The headings animate letter by letter. Both languages are written in Latin
 * letters that stand alone, so one pass serves English and Hausa alike —
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
              className={`inline-block ${play ? "animate-[letter-up_0.75s_var(--ease-custom)_both]" : ""}`}
              style={{ animationDelay: `${n++ * 38}ms` }}
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

export default function Domains() {
  const domains = useLocalized(domainsSource);
  const t = useT();
  const section = useRef<HTMLElement>(null);
  const progress = useScrollProgress(section);
  const n = domains.length;
  const active = chapter(progress, n);

  // Each photograph after the first rises over the one beneath it across a
  // window centred on its chapter's start: water, then ground, then sky.
  const rise = (i: number) =>
    i === 0 ? 1 : clamp01((progress * n - i + 0.25) / 0.5);

  // The words on screen leave as the next photograph starts to rise, and are
  // gone by the time it is half up — when the next chapter's words arrive.
  const leave = active < n - 1 ? clamp01(rise(active + 1) * 2) : 0;

  // Land where chapter i's photograph has fully risen.
  const goTo = (i: number) => {
    const el = section.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: el.offsetTop + span * ((i + 0.3) / n),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <section
      ref={section}
      aria-labelledby="domains"
      className="relative h-[300vh] bg-npf-night"
    >
      <h2 id="domains" className="sr-only">
        {t("Protection across sea, land and sky")}
      </h2>

      <div className="sticky top-0 h-svh overflow-hidden">
        {domains.map((domain, i) => {
          const r = rise(i);
          return (
            <div
              key={domain.id}
              aria-hidden
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(${(1 - r) * 100}% 0 0 0)` }}
            >
              {/*
                A <picture>, not next/image: a phone needs a different crop, not
                a smaller one. These slides are shot with the reading column left
                empty — on the wide file that column is the left third, on the
                tall file it is the upper two-thirds — so a narrow viewport has
                to be handed its own photograph. next/image resizes one source
                and cannot swap it, and rendering both and hiding one downloads
                both.
              */}
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet={domain.background.replace(".jpg", "-mobile.jpg")}
                />
                {/* The picture lags its rising edge, so the new scene reads
                    as coming up from below rather than sliding over. */}
                <img
                  src={domain.background}
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  style={{
                    transform: `translateY(${(1 - r) * 28}%) scale(${1.04 + progress * 0.06})`,
                  }}
                  className="absolute inset-0 size-full object-cover will-change-transform"
                />
              </picture>
              {/* Only the reading column is shaded; the rest of the frame is
                  the photograph as shot. */}
              <span
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,12,24,0.86)_0%,rgba(6,12,24,0.62)_42%,rgba(6,12,24,0)_72%)] md:bg-[linear-gradient(90deg,rgba(6,12,24,0.86)_0%,rgba(6,12,24,0.7)_30%,rgba(6,12,24,0.22)_50%,rgba(6,12,24,0)_64%)]"
              />
              {/* The horizon line riding the rising edge. */}
              {r > 0 && r < 1 ? (
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-white/60"
                />
              ) : null}
            </div>
          );
        })}

        <div className="npf-container relative flex h-full items-start pt-28 md:items-center md:pt-0">
          {/* Every chapter shares one grid cell, so the column keeps the
              height of its longest chapter and the heading never jumps. */}
          <div
            className="grid max-w-[34rem] pe-10 will-change-[opacity,transform,filter] md:pe-0"
            style={{
              opacity: 1 - leave,
              transform: `translateY(${leave * -24}px)`,
              filter: leave ? `blur(${leave * 6}px)` : undefined,
            }}
          >
            {domains.map((domain, i) => {
              const on = i === active;
              return (
                <div
                  key={domain.id}
                  aria-hidden={!on}
                  className={`[grid-area:1/1] ${on ? "" : "invisible"}`}
                >
                  <h3
                    aria-label={domain.title}
                    className="npf-h2 mb-4 max-w-[15ch] text-white"
                  >
                    <LetterStagger text={domain.title} play={on} />
                  </h3>
                  {domain.lead ? (
                    <p
                      className={`mb-3 font-secondary text-lg font-bold text-white md:text-2xl ${on ? "animate-[reveal-up_0.8s_var(--ease-custom)_0.25s_both]" : ""}`}
                    >
                      {domain.lead}
                    </p>
                  ) : null}
                  <p
                    className={`max-w-[44ch] text-base text-white/85 md:text-lg ${on ? "animate-[reveal-up_0.8s_var(--ease-custom)_0.35s_both]" : ""}`}
                  >
                    {domain.body}
                  </p>
                  {/* The units working this domain: labels, not controls, so
                      they sit as a list under a rule rather than as buttons.
                      The icons are drawn grey for light grounds, hence the
                      invert. */}
                  <ul
                    className={`mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/20 pt-5 ${on ? "animate-[reveal-up_0.7s_var(--ease-custom)_0.45s_both]" : ""}`}
                  >
                    {domain.chips.map((chip) => (
                      <li
                        key={chip.label}
                        className="flex items-center gap-2 text-sm font-medium text-white"
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

        {/* An altitude rail: water at the foot, sky at the top, and a line
            that climbs with the reader. The heading already names the
            chapter, so the rail stays dots; a pointer or keyboard landing on
            a dot names it. A tap jumps to that domain. */}
        <div className="absolute inset-y-0 end-0 flex items-center pe-3 md:pe-8">
          <ol className="relative flex h-[min(36svh,280px)] flex-col-reverse justify-between">
            <span
              aria-hidden
              className="absolute inset-y-3 end-[11.5px] w-px bg-white/25"
            >
              <span
                className="block size-full origin-bottom bg-white"
                style={{ transform: `scaleY(${progress})` }}
              />
            </span>
            {domains.map((domain, i) => (
              <li key={domain.id} className="relative">
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === active || undefined}
                  aria-label={domain.title}
                  className="group relative grid size-6 cursor-pointer place-items-center rounded-full outline-offset-2 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute end-full me-2 translate-x-1 rounded-md bg-npf-night/80 px-2.5 py-1.5 font-secondary text-xs font-bold whitespace-nowrap text-white opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-200 ease-[var(--ease-custom)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 rtl:-translate-x-1"
                  >
                    {domain.title}
                  </span>
                  <span
                    aria-hidden
                    className={`size-2 rounded-full transition-[background-color,box-shadow,scale] duration-500 ease-[var(--ease-custom)] group-hover:scale-125 ${
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
