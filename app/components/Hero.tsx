"use client";

import Image from "next/image";
import { useCallback, useEffect, useReducer, useState } from "react";
import { heroSlides as heroSlidesSource } from "../content";
import ServiceSearch from "./ServiceSearch";
import { ChevronLeft, ChevronRight, PauseIcon, PlayIcon } from "./icons";
import { useT, useLocalized } from "../i18n/client";

const INTERVAL = 6000;
const TICK = 100;
/** The slide the carousel opens on. */
const FIRST = 2;

/**
 * Which slide is showing, and which slides exist in the DOM at all.
 *
 * All five used to render at once, and because each is absolutely positioned
 * across the whole viewport the browser counts every one as visible — so
 * next/image's laziness never applied and the homepage opened by fetching
 * 1.1MB of photographs in order to show one of them.
 *
 * The two facts live in one reducer because they change together and must not
 * disagree: a slide is added the moment it becomes current, and never removed,
 * because the slide being left still has to fade out.
 */
type State = { index: number; shown: number[] };
type Action =
  | { type: "go"; delta: number; count: number }
  | { type: "to"; index: number }
  /** The slide after the current one, fetched ahead of the crossfade. */
  | { type: "preload"; index: number };

function reducer(state: State, action: Action): State {
  const index =
    action.type === "go"
      ? (state.index + action.delta + action.count) % action.count
      : action.type === "to"
        ? action.index
        : state.index;
  const add = action.type === "preload" ? action.index : index;
  const shown = state.shown.includes(add) ? state.shown : [...state.shown, add];
  return index === state.index && shown === state.shown
    ? state
    : { index, shown };
}

export default function Hero() {
  const heroSlides = useLocalized(heroSlidesSource);
  const t = useT();
  const [{ index, shown }, dispatch] = useReducer(reducer, {
    index: FIRST,
    shown: [FIRST],
  });
  const [playing, setPlaying] = useState(true);
  // Held down while the search panel is open, without touching the visitor's
  // own play/pause choice.
  const [searching, setSearching] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const go = useCallback(
    (delta: number) =>
      dispatch({ type: "go", delta, count: heroSlides.length }),
    [heroSlides.length],
  );

  useEffect(() => {
    if (!playing || searching) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const started = Date.now();
    const id = window.setInterval(() => {
      const done = Date.now() - started;
      if (done >= INTERVAL) return go(1);
      else setElapsed(done);
    }, TICK);
    return () => window.clearInterval(id);
  }, [playing, searching, go, index]);

  // A beat later rather than alongside, so the second photograph does not
  // compete with the first paint. The interval is six seconds, which leaves
  // four and a half to have it ready for the crossfade.
  const next = (index + 1) % heroSlides.length;
  useEffect(() => {
    if (shown.includes(next)) return;
    const id = window.setTimeout(
      () => dispatch({ type: "preload", index: next }),
      1500,
    );
    return () => window.clearTimeout(id);
  }, [next, shown]);

  const slide = heroSlides[index];

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black">
      {heroSlides.map((s, i) =>
        !shown.includes(i) ? null : (
          <div
            key={s.image}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-[var(--ease-custom)] ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={s.image}
              alt=""
              fill
              sizes="100vw"
              quality={100}
              priority={i === FIRST}
              /*
               * `shown` already decides which slides exist at all, so every
               * one rendered here is a slide we have committed to showing.
               * Left lazy, the fetch waits on a viewport trigger that never
               * fires in time for a crossfade running off a six-second timer,
               * and the hero goes black for the seconds the photograph takes
               * to arrive.
               */
              loading={i === FIRST ? undefined : "eager"}
              className="object-cover"
            />
          </div>
        ),
      )}

      {/*
        Scrims keep the wordmark and the caption legible. Both used to be a
        linear ramp out of solid black — 500px from the top, and the full
        height of the caption block from the bottom — so on anything but a
        very tall desktop the two met in the middle and painted the
        photograph out completely. They are now eased black stops sized to the
        thing each one actually protects, and the slide shows between them.
      */}
      <span className="pointer-events-none absolute top-0 left-0 z-[1] h-[240px] w-full bg-[linear-gradient(to_bottom,rgba(0,0,0,0.72),rgba(0,0,0,0.60)_14%,rgba(0,0,0,0.44)_30%,rgba(0,0,0,0.28)_48%,rgba(0,0,0,0.15)_64%,rgba(0,0,0,0.06)_80%,rgba(0,0,0,0)_100%)]" />

      {/*
        Cinema vignette: pulls the eye to the middle of the slide and stops the
        corners competing with the wordmark and the controls.
      */}
      <span className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_88%_72%_at_50%_40%,transparent_32%,rgba(0,0,0,0.10)_52%,rgba(0,0,0,0.24)_70%,rgba(0,0,0,0.42)_86%,rgba(0,0,0,0.58))]" />

      {/* Dims and blurs the slideshow while the search panel is open. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-[9] bg-black/50 backdrop-blur-lg transition-opacity duration-300 ease-[var(--ease-custom)] ${
          searching ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="npf-hero-veil relative z-10 mt-auto w-full pt-24 pb-16 md:pb-6">
        <div className="npf-container">
          <div className="mx-auto w-full max-w-[832px]">
            <div
              aria-live="polite"
              className="mb-4 min-h-[76px] text-center md:mb-8 lg:[@media(min-height:769px)]:min-h-[104px]"
            >
              <h1 className="mb-3 text-[28px] leading-tight font-semibold tracking-tight text-balance text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.85)] md:text-4xl lg:text-5xl [@media(max-height:768px)]:text-3xl">
                {slide.title}
              </h1>
              <p
                className="text-base text-balance text-white/90 [text-shadow:0_1px_16px_rgba(0,0,0,0.8)] lg:text-xl [@media(max-height:768px)]:text-sm"
              >
                {slide.subtitle}
              </p>
            </div>

            <div className="mx-auto mb-8 hidden max-w-[656px] lg:block [@media(max-height:768px)]:max-w-[556px]">
              <ServiceSearch
                placement="up"
                // Clear of the header band, which the hero cannot paint over.
                clearance={150}
                onOpenChange={setSearching}
              />
            </div>

            <div className="mb-5 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={t("Previous slide")}
                className="grid size-11 place-items-center text-white transition-opacity hover:opacity-70"
              >
                <ChevronLeft className="size-5" />
              </button>

              <div className="relative size-6 shrink-0">
                <svg
                  aria-hidden
                  viewBox="0 0 36 36"
                  className="size-full -rotate-90"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="100.5"
                    strokeDashoffset={100.5 * (1 - elapsed / INTERVAL)}
                    className="transition-[stroke-dashoffset] duration-100 ease-linear"
                    pathLength={100.5}
                  />
                </svg>
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={
                    playing ? t("Pause slideshow") : t("Play slideshow")
                  }
                  className="absolute inset-0 grid place-items-center text-white transition-opacity hover:opacity-70"
                >
                  {playing ? (
                    <PauseIcon className="size-[17px]" />
                  ) : (
                    <PlayIcon className="size-[17px]" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1">
                {heroSlides.map((s, i) => (
                  <button
                    key={s.image}
                    type="button"
                    onClick={() => dispatch({ type: "to", index: i })}
                    aria-label={t("Go to slide {n}", { n: i + 1 })}
                    aria-current={i === index}
                    className="p-2.5"
                  >
                    <span
                      className={`block size-1.5 rounded-full transition-all duration-300 ease-out ${
                        i === index ? "scale-125 bg-npf-gold-soft" : "bg-white/50"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => go(1)}
                aria-label={t("Next slide")}
                className="grid size-11 place-items-center text-white transition-opacity hover:opacity-70"
              >
                <ChevronRight className="size-5" />
              </button>

            </div>

            <button
              type="button"
              aria-label={t("Scroll to next section")}
              onClick={(e) =>
                e.currentTarget
                  .closest("section")
                  ?.nextElementSibling?.scrollIntoView({ behavior: "smooth" })
              }
              className="relative mx-auto hidden h-6 w-[17px] rounded-full border-2 border-white/50 p-0 md:block"
            >
              <span className="absolute top-[3px] left-1 size-[5px] animate-bob rounded-full bg-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
