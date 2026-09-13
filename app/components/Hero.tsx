"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { heroSlides } from "../content";
import {
  ChevronLeft,
  ChevronRight,
  PauseIcon,
  PlayIcon,
  SearchIcon,
} from "./icons";

const INTERVAL = 6000;
const TICK = 100;

export default function Hero() {
  const [index, setIndex] = useState(2);
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  const go = useCallback(
    (delta: number) =>
      setIndex((i) => (i + delta + heroSlides.length) % heroSlides.length),
    [],
  );

  useEffect(() => {
    if (!playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const started = Date.now();
    const id = window.setInterval(() => {
      const done = Date.now() - started;
      if (done >= INTERVAL) return go(1);
      else setElapsed(done);
    }, TICK);
    return () => window.clearInterval(id);
  }, [playing, go, index]);

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
      <span className="pointer-events-none absolute top-0 left-0 z-[1] h-[300px] w-full bg-gradient-to-b from-black/70 to-transparent" />

      <div className="relative z-10 mt-auto w-full bg-[linear-gradient(0deg,#000_0%,#000_38%,rgba(0,0,0,0.6)_66%,transparent_100%)] pt-20 pb-14 md:pb-6 [@media(max-height:820px)]:pt-10">
        <div className="dp-container">
          <div className="mx-auto w-full max-w-[832px]">
            <div className="mb-6 min-h-[104px] text-center md:mb-8">
              <h1 className="mb-2 font-secondary text-2xl font-bold text-white lg:text-4xl">
                {slide.title}
              </h1>
              <p
                aria-live="polite"
                className="text-sm text-white/85 lg:text-2xl"
              >
                {slide.subtitle}
                {slide.readMore ? (
                  <>
                    {" "}
                    <Link
                      href="/app/home/media/news"
                      className="underline underline-offset-4 transition-colors hover:text-[#8CD1B4]"
                    >
                      Read More
                      <span className="sr-only"> about dubai police campaign</span>
                    </Link>
                  </>
                ) : null}
              </p>
            </div>

            <form
              role="search"
              action="/app/search"
              className="mx-auto mb-8 hidden max-w-[656px] items-center gap-3 rounded-2xl bg-white px-4 lg:flex"
            >
              <SearchIcon className="size-6 shrink-0 text-dp-green-ink" />
              <input
                id="homeServiceSearch"
                name="q"
                type="search"
                className="w-full flex-grow py-5 text-sm text-dp-muted outline-none placeholder:text-dp-muted"
                placeholder="Search for a service"
                aria-label="Search services"
              />
            </form>

            <div className="mb-5 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous slide"
                className="grid size-9 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
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
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="3"
                  />
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
                  aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                  className="absolute inset-0 grid place-items-center text-white"
                >
                  {playing ? (
                    <PauseIcon className="size-2.5" />
                  ) : (
                    <PlayIcon className="size-2.5" />
                  )}
                </button>
              </div>

              <div className="flex items-center">
                {heroSlides.map((s, i) => (
                  <button
                    key={s.image}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
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
                aria-label="Next slide"
                className="grid size-9 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            <div
              aria-hidden
              className="mx-auto hidden h-6 w-[17px] rounded-full border-2 border-white/50 md:block"
            >
              <span className="mt-[3px] ml-[3px] block size-[5px] animate-bob rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
