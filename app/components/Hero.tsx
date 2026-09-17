"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { heroSlides as heroSlidesSource } from "../content";
import ServiceSearch from "./ServiceSearch";
import { ChevronLeft, ChevronRight, PauseIcon, PlayIcon } from "./icons";
import { useT, useLocalized } from "../i18n/client";

const INTERVAL = 6000;
const TICK = 100;

export default function Hero() {
  const heroSlides = useLocalized(heroSlidesSource);
  const t = useT();
  const [index, setIndex] = useState(2);
  const [playing, setPlaying] = useState(true);
  // Held down while the search panel is open, without touching the visitor's
  // own play/pause choice.
  const [searching, setSearching] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const go = useCallback(
    (delta: number) =>
      setIndex((i) => (i + delta + heroSlides.length) % heroSlides.length),
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

  const slide = heroSlides[index];

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black">
      {heroSlides.map((s, i) => (
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
            priority={i === 2}
            className="object-cover"
          />
        </div>
      ))}

      {/* Top and bottom scrims keep the nav and the caption legible. */}
      <span className="pointer-events-none absolute top-0 left-0 z-[1] h-[500px] w-full bg-gradient-to-b from-black to-[#032e1d00]" />

      {/* Dims and blurs the slideshow while the search panel is open. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-[9] bg-black/50 backdrop-blur-lg transition-opacity duration-300 ease-[var(--ease-custom)] ${
          searching ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative z-10 mt-[calc(100vh-550px)] w-full bg-gradient-to-b from-[#032e1d00] to-black pt-10 pb-16 md:mt-auto md:pb-6">
        <div className="dp-container">
          <div className="mx-auto w-full max-w-[832px]">
            <div className="mb-4 min-h-[60px] text-center md:mb-8 lg:[@media(min-height:769px)]:min-h-[80px]">
              <h1 className="mb-2 text-2xl font-semibold text-white lg:text-4xl [@media(max-height:768px)]:text-2xl">
                {slide.title}
              </h1>
              <p
                aria-live="polite"
                className="text-sm text-white lg:text-2xl [@media(max-height:768px)]:text-sm"
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
                className="grid h-8 w-5 place-items-center text-white transition-opacity hover:opacity-70"
              >
                <ChevronLeft className="size-5" />
              </button>

              <div className="relative hidden size-6 lg:block">
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
                  className="absolute inset-0 grid place-items-center text-white"
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
                    onClick={() => setIndex(i)}
                    aria-label={t("Go to slide {n}", { n: i + 1 })}
                    aria-current={i === index}
                    className="p-2.5"
                  >
                    <span
                      className={`block size-1.5 rounded-full transition-all duration-300 ease-out ${
                        i === index ? "scale-125 bg-white" : "bg-white/50"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => go(1)}
                aria-label={t("Next slide")}
                className="grid h-8 w-5 place-items-center text-white transition-opacity hover:opacity-70"
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
