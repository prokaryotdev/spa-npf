"use client";

import Image from "next/image";
import { useRef } from "react";
import { pillars as pillarsSource } from "../content";
import { chapter, useScrollProgress } from "./useScrollProgress";
import { useT, useLocalized } from "../i18n/client";

const bloom =
  "pointer-events-none absolute rounded-full bg-[radial-gradient(#3c78bd66_7%,#22599e33_40%,#22599e00_70%)]";

/**
 * The signature chapter: the section pins for three screens while Smart,
 * Secure and Together hand off one at a time and the portrait behind the
 * ring changes with them.
 */
export default function Pillars() {
  const pillars = useLocalized(pillarsSource);
  const t = useT();
  const section = useRef<HTMLElement>(null);
  const progress = useScrollProgress(section);
  const active = chapter(progress, pillars.length);

  const portraits = pillars.map((pillar, i) => (
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
        className="object-cover"
      />
    </span>
  ));

  return (
    <section
      ref={section}
      aria-labelledby="pillars"
      className="relative h-[320vh] bg-white"
    >
      <h2 id="pillars" className="sr-only">
        {t("Safe, Secure, Together")}
      </h2>

      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div
          className={`${bloom} bottom-0 left-0 h-80 w-56 -translate-x-1/2 translate-y-1/2 opacity-70 md:size-[1200px] md:opacity-60`}
        />
        <div
          className={`${bloom} top-1/2 right-0 h-72 w-56 translate-x-1/2 -translate-y-1/2 opacity-70 md:top-0 md:size-[1200px] md:opacity-60`}
        />

        <div className="npf-container relative">
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
                    <p className="font-secondary text-6xl leading-[1.1] font-bold text-npf-blue-deep lg:text-8xl 2xl:text-9xl">
                      {pillar.word}
                    </p>
                    <p className="mx-auto mt-4 max-w-[320px] font-secondary text-base text-neutral-600 md:mx-0 md:max-w-none md:font-light lg:text-2xl">
                      {pillar.line}
                    </p>
                  </div>
                ))}
              </div>

              {/*
               * Chapter marker. It used to hang in the outer gutter, where it
               * only existed above 1280px and read as a stray list. Sitting
               * under the standing word it belongs to the copy, works at every
               * width, and the filling rule shows how far through the pin the
               * reader is rather than only which word is up.
               */}
              <ol className="mt-8 flex items-stretch justify-center gap-6 md:justify-start lg:mt-12 lg:gap-10">
                {pillars.map((pillar, i) => (
                  <li key={pillar.word} aria-current={i === active || undefined}>
                    <span
                      aria-hidden
                      className="block h-px w-full bg-npf-blue-mid/20"
                    >
                      <span
                        className={`block h-px origin-left bg-npf-blue-mid transition-transform duration-700 ease-[var(--ease-custom)] ${
                          i <= active ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </span>
                    <span
                      className={`mt-3 block font-secondary text-sm leading-none font-bold tracking-[0.14em] text-npf-blue-mid uppercase transition-opacity duration-500 lg:text-base ${
                        i === active ? "opacity-100" : "opacity-30"
                      }`}
                    >
                      {pillar.word}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-5">
              <div className="relative mx-auto aspect-square w-full max-w-[520px]">
                <div className="relative aspect-square w-full">
                  <Image
                    src="/img/assets-home/static/ring12.svg"
                    alt=""
                    fill
                    sizes="520px"
                    style={{ transform: `rotate(${progress * 180 - 90}deg)` }}
                    className="object-contain opacity-70"
                  />
                  {portraits}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
