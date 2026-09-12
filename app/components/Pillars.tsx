"use client";

import Image from "next/image";
import { useRef } from "react";
import { pillars } from "../content";
import { chapter, useScrollProgress } from "./useScrollProgress";

const bloom =
  "pointer-events-none absolute rounded-full bg-[radial-gradient(#3cbd6b75_7%,#22c55e38_40%,#22c55e00_70%)]";

/**
 * The signature chapter: the section pins for three screens while Smart,
 * Secure and Together hand off one at a time and the portrait behind the
 * ring changes with them.
 */
export default function Pillars() {
  const section = useRef<HTMLElement>(null);
  const progress = useScrollProgress(section);
  const active = chapter(progress, pillars.length);

  return (
    <section
      ref={section}
      aria-labelledby="pillars"
      className="relative h-[320vh] bg-white"
    >
      <h2 id="pillars" className="sr-only">
        Smart, Secure, Together
      </h2>

      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div
          className={`${bloom} bottom-0 left-0 h-80 w-56 -translate-x-1/2 translate-y-1/2 opacity-70 md:size-[1200px] md:opacity-60`}
        />
        <div
          className={`${bloom} top-1/2 right-0 h-72 w-56 translate-x-1/2 -translate-y-1/2 opacity-70 md:top-0 md:size-[1200px] md:opacity-60`}
        />

        {/* Chapter marker in the outer gutter, the way the original tracks place. */}
        <ol className="pointer-events-none absolute top-1/2 left-6 hidden -translate-y-1/2 xl:block 2xl:left-10">
          {pillars.map((pillar, i) => (
            <li
              key={pillar.word}
              aria-current={i === active || undefined}
              className={`font-secondary text-lg leading-[1.5] font-bold text-dp-green-mid transition-opacity duration-500 ${
                i === active ? "opacity-100" : "opacity-25"
              }`}
            >
              {pillar.word}
            </li>
          ))}
        </ol>

        <div className="dp-container relative">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="order-2 lg:order-1 lg:col-span-7">
              <div className="relative min-h-[200px] text-center md:text-left lg:min-h-[280px]">
                {pillars.map((pillar, i) => (
                  <div
                    key={pillar.word}
                    aria-hidden={i !== active}
                    className={`absolute inset-x-0 top-0 transition-all duration-700 ease-[var(--ease-custom)] ${
                      i === active
                        ? "translate-y-0 opacity-100"
                        : i < active
                          ? "pointer-events-none -translate-y-10 opacity-0"
                          : "pointer-events-none translate-y-10 opacity-0"
                    }`}
                  >
                    <p className="font-secondary text-6xl leading-[1.1] font-bold text-dp-green-deep lg:text-8xl 2xl:text-9xl">
                      {pillar.word}
                    </p>
                    <p className="mx-auto mt-4 max-w-[320px] font-secondary text-base text-neutral-600 md:mx-0 md:max-w-none md:font-light lg:text-2xl">
                      {pillar.line}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-5">
              <div className="relative mx-auto aspect-square w-full max-w-[520px]">
                <Image
                  src="/img/assets-home/static/ring12.svg"
                  alt=""
                  fill
                  sizes="520px"
                  style={{ transform: `rotate(${progress * 180 - 90}deg)` }}
                  className="object-contain opacity-70"
                />
                {pillars.map((pillar, i) => (
                  <span
                    key={pillar.portrait}
                    className={`absolute inset-[9%] overflow-hidden rounded-full transition-[opacity,filter,transform] duration-700 ease-[var(--ease-custom)] ${
                      i === active
                        ? "scale-100 opacity-100 blur-0"
                        : "scale-90 opacity-0 blur-sm"
                    }`}
                  >
                    <Image
                      src={pillar.portrait}
                      alt=""
                      fill
                      sizes="480px"
                      className="object-contain"
                    />
                  </span>
                ))}

                {/* A diagonal white wash lifts the standing line off the portrait,
                    the same trick the original uses over this block. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(124deg,#ffffff_18%,rgba(255,255,255,0.75)_44%,transparent_68%)]"
                />
                <div className="absolute top-1/2 left-0 max-w-[64%] -translate-y-1/2 ps-[6%] text-left">
                  <p className="mb-3 font-secondary text-base leading-snug font-bold text-[#414651] md:text-2xl">
                    Together, We Build a Smart and Secure Dubai
                  </p>
                  <p className="font-secondary text-xs font-bold text-[#313a35] md:text-base">
                    With you, For you. Protecting, Connecting, and Innovating.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
