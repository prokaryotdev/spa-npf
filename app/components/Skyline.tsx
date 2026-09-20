"use client";

import Image from "next/image";
import { useRef } from "react";
import { useScrollProgress } from "./useScrollProgress";
import { useT } from "../i18n/client";

/**
 * The closing shot: dusk settling over Abuja while the three words rise out
 * of the ridge line one after another.
 *
 * It used to parallax five floating cut-outs — a tower, a marina, a boat, a
 * patrol car, a drone — every one of them Dubai. They are gone rather than
 * re-sourced, so the photograph carries the frame on its own and the push-in
 * against the rising words is the one authored moment left.
 */
export default function Skyline() {
  const t = useT();
  const section = useRef<HTMLElement>(null);
  const p = useScrollProgress(section);

  return (
    <section
      ref={section}
      aria-labelledby="finale"
      className="relative h-[200vh] bg-[#081426] text-white"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <Image
          src="/img/assets-home/static/smart/Sky-2.jpg"
          alt="Dusk over Abuja, the lights of the city coming on below the hills"
          fill
          sizes="100vw"
          style={{ transform: `scale(${1.06 + p * 0.1})` }}
          className="object-cover object-center"
        />

        {/* The city half of the photograph is busy and lit; the type needs its
            own ground, and the navy is the section's own colour. */}
        <span
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,20,38,0.35)_0%,rgba(8,20,38,0.15)_28%,rgba(8,20,38,0.78)_62%,rgba(8,20,38,0.96)_100%)]"
        />

        <h2
          id="finale"
          className="absolute inset-x-0 bottom-[8%] z-10 px-4 text-center font-secondary text-[14.5vw] leading-[0.88] font-bold tracking-[-0.04em] text-white uppercase md:bottom-[7%] md:px-0 md:text-[11.5vw] md:leading-[0.82] md:tracking-[-0.03em]"
        >
          <span className="sr-only">{t("Safe, Secure, Together")}</span>
          {["Safe", "Secure", "Together"].map((word, i) => (
            <span key={word} aria-hidden className="block overflow-hidden">
              <span
                className="block will-change-transform"
                style={{
                  transform: `translateY(${Math.max(0, 1 - p * 3 + i * 0.16) * 100}%)`,
                }}
              >
                {t(word)}
              </span>
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
