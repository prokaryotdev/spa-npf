"use client";

import Image from "next/image";
import { useRef } from "react";
import { pillars as pillarsSource } from "../content";
import { scrollToProgress, useScrollProgress } from "./useScrollProgress";
import { useT, useLocalized } from "../i18n/client";

// The frame is drawn in a 100-unit box so the arc length is a known number.
const R = 48;
const ARC = 2 * Math.PI * R;
// One sky per chapter, crossfaded as the chapters hand off: cool dawn for
// Safe, a deeper steel blue for Secure, the gold of the crest for Together,
// whose floor settles into the cream the services section opens on.
const SKIES = [
  "radial-gradient(60% 70% at 85% 20%, color-mix(in srgb, var(--color-npf-blue-mid) 30%, transparent), transparent 70%), radial-gradient(80% 70% at 0% 100%, color-mix(in srgb, #7fb2ff 26%, transparent), transparent 75%), linear-gradient(160deg, #f7faff, var(--color-npf-mist))",
  "radial-gradient(65% 75% at 80% 30%, color-mix(in srgb, var(--color-npf-blue) 34%, transparent), transparent 70%), radial-gradient(70% 60% at 0% 100%, color-mix(in srgb, #7fb2ff 24%, transparent), transparent 70%), linear-gradient(200deg, #e9f0fb, #f6f8fc)",
  "linear-gradient(to bottom, transparent 65%, #fbf8f1), radial-gradient(60% 70% at 80% 25%, color-mix(in srgb, var(--color-npf-gold-soft) 55%, transparent), transparent 70%), radial-gradient(80% 70% at 0% 100%, color-mix(in srgb, #f3a86b 22%, transparent), transparent 75%), linear-gradient(170deg, var(--color-npf-gold-wash), #fbf8f1)",
];

const at = (fn: (a: number) => number, p: number) =>
  (50 + R * fn(p * 2 * Math.PI)).toFixed(3);

/**
 * The signature chapter: the section pins for three screens while Safe,
 * Secure and Together hand off one at a time and the portrait inside the
 * ring changes with them. The ring's arc is the reader's place in the pin.
 *
 * The arc, its tip and the tab rules follow the scroll by having their
 * attributes written directly each frame; only the chapter change goes
 * through React.
 */
export default function Pillars() {
  const pillars = useLocalized(pillarsSource);
  const t = useT();
  const n = pillars.length;
  const section = useRef<HTMLElement>(null);
  const arc = useRef<SVGCircleElement>(null);
  const tip = useRef<SVGGElement>(null);
  const rules = useRef<(HTMLSpanElement | null)[]>([]);

  const active = useScrollProgress(section, n, (p) => {
    arc.current?.setAttribute("stroke-dashoffset", String(ARC * (1 - p)));
    tip.current?.setAttribute(
      "transform",
      `translate(${at(Math.cos, p)} ${at(Math.sin, p)})`,
    );
    rules.current.forEach((rule, i) => {
      if (rule)
        rule.style.transform = `scaleX(${Math.min(1, Math.max(0, p * n - i))})`;
    });
  });

  return (
    <section
      ref={section}
      aria-labelledby="pillars"
      className="relative h-[320vh] bg-npf-mist"
    >
      <h2 id="pillars" className="sr-only">
        {t("Safe, Secure, Together")}
      </h2>

      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        {SKIES.map((sky, i) => (
          <span
            key={sky}
            aria-hidden
            style={{ backgroundImage: sky }}
            className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="npf-container relative pt-18 short:pt-16">
          <div className="grid items-center gap-8 short:grid-cols-12 short:gap-6 lg:grid-cols-12 lg:gap-10">
            <div className="order-2 short:order-1 short:col-span-7 lg:order-1 lg:col-span-6">
              {/* Every chapter shares one grid cell, so the block is as tall
                  as its longest line in any language, never a guessed height. */}
              <div className="grid text-center short:text-start md:text-start">
                {pillars.map((pillar, i) => (
                  <div
                    key={pillar.word}
                    aria-hidden={i !== active}
                    className={`[grid-area:1/1] transition-[opacity,translate] duration-(--dur-media) ease-out ${
                      i === active
                        ? "opacity-100"
                        : i < active
                          ? "pointer-events-none -translate-y-6 opacity-0"
                          : "pointer-events-none translate-y-6 opacity-0"
                    }`}
                  >
                    <p className="npf-display-xl text-npf-blue-deep">
                      {pillar.word}
                    </p>
                    <p className="npf-lede mx-auto mt-5 max-w-[28ch] text-npf-body short:mx-0 short:mt-3 md:mx-0 lg:mt-6">
                      {pillar.line}
                    </p>
                  </div>
                ))}
              </div>

              {/* Each rule fills with the reader's scroll through its own
                  chapter, and a tap jumps straight to that chapter. */}
              <ol className="mt-8 flex justify-center gap-2 short:-mx-2 short:mt-4 short:justify-start md:-mx-2 md:justify-start lg:mt-12 lg:gap-6">
                {pillars.map((pillar, i) => (
                  <li key={pillar.word}>
                    <button
                      type="button"
                      onClick={() =>
                        scrollToProgress(section.current, (i + 0.08) / n)
                      }
                      aria-current={i === active || undefined}
                      className="group block min-h-11 cursor-pointer rounded-chip px-2 py-3 text-start"
                    >
                      <span
                        aria-hidden
                        className="block h-1 w-full overflow-hidden rounded-full bg-npf-blue-mid/15 transition-colors group-hover:bg-npf-blue-mid/30"
                      >
                        <span
                          ref={(el) => {
                            rules.current[i] = el;
                          }}
                          className="block h-full origin-left scale-x-0 bg-linear-to-r from-[#5b9bff] to-npf-blue-deep rtl:origin-right rtl:bg-linear-to-l"
                        />
                      </span>
                      <span
                        className={`npf-label mt-3 block transition-colors ${
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

            <div className="order-1 short:order-2 short:col-span-5 lg:order-2 lg:col-span-6">
              <div className="relative mx-auto aspect-square w-full max-w-[min(300px,38svh)] sm:max-w-[min(440px,48svh)] short:max-w-[min(260px,62svh)] lg:max-w-[min(520px,70svh)]">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-[22%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,white_80%,transparent),transparent)]"
                />
                <svg
                  aria-hidden
                  viewBox="0 0 100 100"
                  className="absolute inset-0 size-full -rotate-90 overflow-visible"
                >
                  <defs>
                    <linearGradient id="pillars-arc" gradientUnits="userSpaceOnUse" x1="0" y1="100" x2="100" y2="0">
                      <stop offset="0" stopColor="#5b9bff" />
                      <stop offset="0.5" stopColor="var(--color-npf-blue-mid)" />
                      <stop offset="1" stopColor="var(--color-npf-blue-deep)" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="50"
                    cy="50"
                    r={R}
                    fill="none"
                    strokeWidth="0.5"
                    className="stroke-npf-blue-mid/15"
                  />
                  <circle
                    ref={arc}
                    cx="50"
                    cy="50"
                    r={R}
                    fill="none"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeDasharray={ARC}
                    strokeDashoffset={ARC}
                    stroke="url(#pillars-arc)"
                  />
                  {/* Where each chapter begins on the ring. */}
                  {pillars.map((pillar, i) => (
                    <circle
                      key={pillar.word}
                      cx={at(Math.cos, i / n)}
                      cy={at(Math.sin, i / n)}
                      r="1.4"
                      strokeWidth="0.6"
                      className={`transition-[fill,stroke] ${
                        i <= active
                          ? "fill-npf-blue-mid stroke-white"
                          : "fill-white stroke-npf-blue-mid/30"
                      }`}
                    />
                  ))}
                  {/* The pen tip: a soft halo riding the arc's leading end. */}
                  <g ref={tip} transform={`translate(${at(Math.cos, 0)} 50)`}>
                    <circle r="3.2" className="fill-npf-blue-mid/15" />
                    <circle r="1.3" className="fill-npf-blue-mid" />
                  </g>
                </svg>

                <div className="absolute inset-[7%] overflow-hidden rounded-full bg-npf-mist shadow-[0_0_0_6px_white,0_30px_60px_-20px_color-mix(in_srgb,var(--color-npf-blue-deep)_45%,transparent)]">
                  {pillars.map((pillar, i) => (
                    <Image
                      key={pillar.portrait}
                      src={pillar.portrait}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 480px, (min-width: 640px) 400px, 300px"
                      className={`object-cover transition-[opacity,scale] duration-(--dur-media) ease-out ${
                        i === active ? "opacity-100" : "scale-105 opacity-0"
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
