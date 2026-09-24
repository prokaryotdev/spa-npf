"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useReducer,
  useState,
  useSyncExternalStore,
} from "react";
import { heroSlides as heroSlidesSource } from "../content";
import ServiceSearch from "./ServiceSearch";
import { ChevronLeft, ChevronRight, PauseIcon, PlayIcon } from "./icons";
import { useT, useLocalized } from "../i18n/client";

const INTERVAL = 6000;
const REDUCED = "(prefers-reduced-motion: reduce)";
/** A round 44px control on the photograph; the hover brightens its ground. */
const control =
  "grid size-11 place-items-center rounded-full text-white transition-[background-color,scale] hover:bg-white/12 active:scale-[0.94]";
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
  // Reduced motion holds the slideshow still until the visitor moves it.
  const still = useSyncExternalStore(
    (change) => {
      const query = matchMedia(REDUCED);
      query.addEventListener("change", change);
      return () => query.removeEventListener("change", change);
    },
    () => matchMedia(REDUCED).matches,
    () => false,
  );
  const running = playing && !searching && !still;

  const go = useCallback(
    (delta: number) =>
      dispatch({ type: "go", delta, count: heroSlides.length }),
    [heroSlides.length],
  );

  // One timeout per slide. The countdown ring is a CSS animation over the
  // same interval, so the hero never re-renders while a slide is showing.
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => go(1), INTERVAL);
    return () => window.clearTimeout(id);
  }, [running, go, index]);

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
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={s.image}
              alt=""
              fill
              sizes="100vw"
              quality={85}
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
        className={`pointer-events-none absolute inset-0 z-[9] bg-black/50 backdrop-blur-lg transition-opacity duration-(--dur-media) ${
          searching ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="npf-hero-veil relative z-10 mt-auto w-full pt-24 pb-12 md:pb-6">
        <div className="npf-container">
          <div className="mx-auto w-full max-w-[832px]">
            {/* The page's one h1 names the site; the slide captions change
                every six seconds, so they are not headings. While the show
                runs they stay out of the screen reader's way, and once it is
                paused a caption the visitor moves to is read out. */}
            <h1 className="sr-only">{t("Nigeria Police Force, FCT Command")}</h1>
            <div
              aria-live={running ? "off" : "polite"}
              className="mb-6 grid min-h-[5.5rem] text-center md:mb-8"
            >
              <div
                key={index}
                className="animate-[reveal-up_var(--dur-media)_var(--ease-out)_both] self-end"
              >
                <p className="npf-display text-white [text-shadow:0_2px_24px_rgb(0_0_0/0.6)]">
                  {slide.title}
                </p>
                <p className="npf-lede mt-3 text-balance text-white/90 [text-shadow:0_1px_16px_rgb(0_0_0/0.6)]">
                  {slide.subtitle}
                </p>
              </div>
            </div>

            <div className="mx-auto mb-8 hidden max-w-[656px] lg:block">
              <ServiceSearch
                placement="up"
                // Clear of the header band, which the hero cannot paint over.
                clearance={150}
                onOpenChange={setSearching}
              />
            </div>

            {/* Previous, play/pause with its countdown, a dot per slide, next.
                Every control is a 44px target on the same white. */}
            <div className="mb-4 flex items-center justify-center gap-1 sm:gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={t("Previous slide")}
                className={control}
              >
                <ChevronLeft className="size-5" />
              </button>

              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? t("Pause slideshow") : t("Play slideshow")}
                className={`${control} relative`}
              >
                <svg
                  aria-hidden
                  viewBox="0 0 36 36"
                  className="absolute inset-2.5 -rotate-90"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    strokeWidth="3"
                    className="stroke-white/25"
                  />
                  {/* Keyed to the slide and the running state, so it restarts
                      on every change and stands full while paused. */}
                  <circle
                    key={`${index}-${running}`}
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="100.5"
                    pathLength={100.5}
                    style={
                      running
                        ? { animation: `npf-countdown ${INTERVAL}ms linear both` }
                        : undefined
                    }
                  />
                </svg>
                {playing ? (
                  <PauseIcon className="size-3.5" />
                ) : (
                  <PlayIcon className="size-3.5" />
                )}
              </button>

              <div className="flex items-center">
                {heroSlides.map((s, i) => (
                  <button
                    key={s.image}
                    type="button"
                    onClick={() => dispatch({ type: "to", index: i })}
                    aria-label={t("Go to slide {n}", { n: i + 1 })}
                    aria-current={i === index}
                    className="group grid size-7 place-items-center"
                  >
                    <span
                      className={`block size-1.5 rounded-full transition-[scale,background-color] ${
                        i === index
                          ? "scale-150 bg-npf-gold-soft"
                          : "bg-white/50 group-hover:bg-white"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => go(1)}
                aria-label={t("Next slide")}
                className={control}
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
                  ?.nextElementSibling?.scrollIntoView({
                    behavior: still ? "auto" : "smooth",
                  })
              }
              className="mx-auto hidden size-11 place-items-center md:grid"
            >
              <span className="relative block h-6 w-[17px] rounded-full border-2 border-white/50">
                <span className="absolute top-[3px] left-1 size-[5px] animate-bob rounded-full bg-white" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
