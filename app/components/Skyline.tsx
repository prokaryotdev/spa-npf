"use client";

import Image from "next/image";
import { useRef } from "react";
import { useScrollProgress } from "./useScrollProgress";
import { useT } from "../i18n/client";

/** The closing shot: sky, city, boat, patrol car and drone all drift at their
 * own rate as the section passes, the way the original parallaxes them. */
export default function Skyline() {
  const t = useT();
  const section = useRef<HTMLElement>(null);
  const p = useScrollProgress(section);

  return (
    <section
      ref={section}
      aria-labelledby="finale"
      className="relative h-[200vh] bg-[#081e16] text-white"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute top-0 left-0 h-[82%] w-full bg-[#081612]">
          <Image
            src="/img/assets-home/static/smart/Sky-2.jpg"
            alt=""
            fill
            sizes="100vw"
            style={{ transform: `scale(${1.2 + p * 0.12})` }}
            className="object-cover"
          />
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <h2
            id="finale"
            className="absolute bottom-[41%] z-10 w-full text-center font-secondary text-[16vw] leading-[0.82] font-bold tracking-[-0.08em] uppercase md:text-[11vw] md:leading-[0.76] md:tracking-[-0.05em]"
          >
            <span className="sr-only">{t("Smart, Secure, Together")}</span>
            {[
              ["#B7FCDF", "#8CD1B4", "Smart"],
              ["#8CD1B4", "#478E70", "Secure"],
              ["#478E70", "#196042", "Together"],
            ].map(([from, to, word], i) => (
              <span key={word} aria-hidden className="block overflow-hidden">
                <span
                  className="block"
                  style={{
                    backgroundImage: `linear-gradient(180deg, ${from}, ${to})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    transform: `translateY(${Math.max(0, 1 - p * 3 + i * 0.16) * 100}%)`,
                  }}
                >
                  {t(word)}
                </span>
              </span>
            ))}
          </h2>

          <div
            className="absolute bottom-[42%] left-[47.4%] z-20 w-[9.5%] sm:left-[49.4%] sm:w-[4.5%]"
            style={{ transform: `translateY(${p * -26}px)` }}
          >
            <Image
              src="/img/assets-home/static/smart/khalifa.webp"
              alt=""
              width={50}
              height={385}
              className="h-auto w-full"
            />
          </div>

          <div className="relative aspect-[3840/3096] w-full sm:aspect-[3840/1446]">
            <Image
              src="/img/dashboard/CItyBGFinal.png"
              alt="The Dubai skyline at dusk"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div
            className="absolute bottom-[29%] left-[61%] z-20 w-[33%] sm:bottom-[21%] sm:w-[24%]"
            style={{ transform: `translateX(${-16 + p * 26}%) scale(0.85)` }}
          >
            <Image
              src="/img/assets-home/static/smart/Boat.webp"
              alt=""
              width={305}
              height={170}
              className="h-auto w-full"
            />
          </div>
        </div>

        <div
          className="absolute bottom-[14%] -left-[10%] z-20 w-[60%] sm:bottom-[4%] sm:left-0 sm:w-[49%]"
          style={{ transform: `translateX(${28 - p * 22}%) scale(0.85)` }}
        >
          <Image
            src="/img/assets-home/static/smart/Ghiath.webp"
            alt=""
            width={305}
            height={119}
            className="h-auto w-full"
          />
        </div>

        <div
          className="absolute bottom-[78%] left-[43%] z-20 w-[14%]"
          style={{ transform: `translate(${p * 34 - 12}%, ${p * -18}px)` }}
        >
          <Image
            src="/img/assets-home/static/smart/Drone.webp"
            alt=""
            width={475}
            height={170}
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
