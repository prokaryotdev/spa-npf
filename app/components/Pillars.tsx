"use client";

import Image from "next/image";
import { useRef } from "react";
import { pillars as pillarsSource } from "../content";
import { chapter, useScrollProgress } from "./useScrollProgress";
import { useT, useLocalized } from "../i18n/client";

// The frame is drawn in a 100-unit box so the arc length is a known number.
const R = 48;
const ARC = 2 * Math.PI * R;

/**
 * The signature chapter: the section pins for three screens while Safe,
 * Secure and Together hand off one at a time and the portrait inside the
 * ring changes with them. The ring's arc is the reader's place in the pin.
 */
export default function Pillars() {
  const pillars = useLocalized(pillarsSource);
  const t = useT();
  const section = useRef<HTMLElement>(null);
  const progress = useScrollProgress(section);
  const active = chapter(progress, pillars.length);
  // Where the arc's leading end sits; rounded so server and client agree.
  const tip = (fn: (a: number) => number) =>
    +(50 + R * fn(progress * 2 * Math.PI)).toFixed(3);

  // Land just inside chapter i of the pin.
  const goTo = (i: number) => {
    const el = section.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: el.offsetTop + span * ((i + 0.08) / pillars.length),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <section
      ref={section}
      aria-labelledby="pillars"
      className="relative h-[320vh] bg-white"
    >
      <h2 id="pillars" className="sr-only">
        {t("Safe, Secure, Together")}
      </h2>

      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="npf-container relative">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="order-2 lg:order-1 lg:col-span-6">
              {/* Every chapter shares one grid cell, so the block is as tall
                  as its longest line in any language, never a guessed height. */}
              <div className="grid text-center md:text-start">
                {pillars.map((pillar, i) => (
                  <div
                    key={pillar.word}
                    aria-hidden={i !== active}
                    className={`[grid-area:1/1] transition-[opacity,transform,filter] duration-700 ease-[var(--ease-custom)] ${
                      i === active
                        ? "translate-y-0 opacity-100 blur-0"
                        : i < active
                          ? "pointer-events-none -translate-y-8 opacity-0 blur-[2px]"
                          : "pointer-events-none translate-y-8 opacity-0 blur-[2px]"
                    }`}
                  >
                    <p className="font-secondary text-6xl leading-none font-bold tracking-[-0.03em] text-npf-blue-deep sm:text-7xl 2xl:text-8xl">
                      {pillar.word}
                    </p>
                    <p className="mx-auto mt-5 max-w-[28ch] font-secondary text-lg leading-snug text-npf-body md:mx-0 lg:mt-6 lg:text-2xl">
                      {pillar.line}
                    </p>
                  </div>
                ))}
              </div>

              {/* Each rule fills with the reader's scroll through its own
                  chapter, and a tap jumps straight to that chapter. */}
              <ol className="mt-8 flex justify-center gap-2 md:-mx-2 md:justify-start lg:mt-12 lg:gap-6">
                {pillars.map((pillar, i) => (
                  <li key={pillar.word}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={i === active || undefined}
                      className="group block cursor-pointer rounded-md px-2 py-3 text-start outline-offset-4 focus-visible:outline-2 focus-visible:outline-npf-blue-mid"
                    >
                      <span
                        aria-hidden
                        className="block h-0.5 w-full overflow-hidden rounded-full bg-npf-blue-mid/15 transition-colors group-hover:bg-npf-blue-mid/30"
                      >
                        <span
                          className="block h-full origin-left bg-npf-blue-mid"
                          style={{
                            transform: `scaleX(${Math.min(1, Math.max(0, progress * pillars.length - i))})`,
                          }}
                        />
                      </span>
                      <span
                        className={`mt-3 block font-secondary text-sm leading-none font-bold tracking-[0.14em] uppercase transition-colors duration-500 ${
                          i === active
                            ? "text-npf-blue-mid"
                            : "text-npf-muted group-hover:text-npf-blue-mid"
                        }`}
                      >
                        {pillar.word}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-6">
              <div className="relative mx-auto aspect-square w-full max-w-[min(300px,42svh)] sm:max-w-[min(440px,48svh)] lg:max-w-[min(520px,70svh)]">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-[22%] rounded-full bg-[radial-gradient(closest-side,#2c5fa81f,#2c5fa800)]"
                />
                <svg
                  aria-hidden
                  viewBox="0 0 100 100"
                  className="absolute inset-0 size-full -rotate-90 overflow-visible"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r={R}
                    fill="none"
                    strokeWidth="0.5"
                    className="stroke-npf-blue-mid/15"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={R}
                    fill="none"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    strokeDasharray={ARC}
                    strokeDashoffset={ARC * (1 - progress)}
                    className="stroke-npf-blue-mid"
                  />
                  {/* Where each chapter begins on the ring. */}
                  {pillars.map((pillar, i) => {
                    const a = (i / pillars.length) * 2 * Math.PI;
                    return (
                      <circle
                        key={pillar.word}
                        cx={+(50 + R * Math.cos(a)).toFixed(3)}
                        cy={+(50 + R * Math.sin(a)).toFixed(3)}
                        r="1.4"
                        strokeWidth="0.6"
                        className={`transition-[fill] duration-500 ${
                          i <= active
                            ? "fill-npf-blue-mid stroke-white"
                            : "fill-white stroke-npf-blue-mid/30"
                        }`}
                      />
                    );
                  })}
                  {/* The pen tip: a soft halo riding the arc's leading end. */}
                  <circle
                    cx={tip(Math.cos)}
                    cy={tip(Math.sin)}
                    r="3.2"
                    className="fill-npf-blue-mid/15"
                  />
                  <circle
                    cx={tip(Math.cos)}
                    cy={tip(Math.sin)}
                    r="1.3"
                    className="fill-npf-blue-mid"
                  />
                </svg>

                <div className="absolute inset-[7%] overflow-hidden rounded-full bg-npf-blue-deep/5 shadow-[0_24px_48px_-20px_rgba(20,49,95,0.45)]">
                  {pillars.map((pillar, i) => (
                    <Image
                      key={pillar.portrait}
                      src={pillar.portrait}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 480px, 300px"
                      className={`object-cover transition-[opacity,transform,filter] duration-700 ease-[var(--ease-custom)] ${
                        i === active
                          ? "scale-100 opacity-100 blur-0"
                          : "scale-105 opacity-0 blur-sm"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
