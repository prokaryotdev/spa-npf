"use client";

import Image from "next/image";
import { useRef } from "react";
import { careers as careersSource } from "../content";
import { chapter, useScrollProgress } from "./useScrollProgress";
import { useT, useLocalized } from "../i18n/client";

/**
 * Two recruitment panels scroll past a card pinned on the right, which slides
 * in from off-screen as the chapter opens.
 */
export default function Careers() {
  const careers = useLocalized(careersSource);
  const t = useT();
  const section = useRef<HTMLElement>(null);
  const progress = useScrollProgress(section);
  const active = chapter(progress, careers.length);
  const slideIn = Math.min(1, progress / 0.18);

  return (
    <section
      ref={section}
      aria-labelledby="careers"
      className="relative bg-white"
    >
      <h2 id="careers" className="sr-only">
        {t("Careers at Dubai Police")}
      </h2>

      <div
        aria-hidden
        className="pointer-events-none absolute top-16 left-0 w-full overflow-hidden [contain:paint]"
      >
        <div className="flex w-max animate-marquee whitespace-nowrap motion-reduce:animate-none">
          {[0, 1].map((n) => (
            <span
              key={n}
              className="px-6 font-secondary text-[18vw] leading-none font-bold text-transparent"
              style={{ WebkitTextStroke: "1px rgba(4,120,87,0.18)" }}
            >
              {t("Dubai Police · Dubai Police ·")}
            </span>
          ))}
        </div>
      </div>

      {/* The pinned card, desktop only — on mobile each panel carries its own. */}
      <div className="pointer-events-none absolute inset-y-0 end-0 hidden w-[46%] max-w-[600px] sm:block">
        <div
          className="sticky top-0 flex h-screen items-center"
          style={{
            transform: `translateX(${(1 - slideIn) * 100}%)`,
          }}
        >
          <div className="relative aspect-[575/844] w-full overflow-hidden rounded-s-3xl bg-black md:rounded-s-[48px]">
            {careers.map((job, i) => (
              <Image
                key={job.image}
                src={job.image}
                alt=""
                fill
                sizes="46vw"
                className={`object-cover transition-opacity duration-700 ease-[var(--ease-custom)] ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="dp-container relative">
        {careers.map((job) => (
          <div
            key={job.title}
            className="flex min-h-screen items-center py-24 sm:py-0"
          >
            <div className="w-full max-w-[430px] md:max-w-[580px] xl:max-w-[720px]">
              <div className="relative mb-8 aspect-[575/430] w-full overflow-hidden rounded-3xl bg-black sm:hidden">
                <Image
                  src={job.image}
                  alt=""
                  fill
                  sizes="92vw"
                  className="object-cover"
                />
              </div>
              <h3
                data-reveal
                className="mb-5 font-secondary text-3xl font-bold text-dp-green-deep sm:text-5xl lg:text-7xl"
              >
                {job.title}
              </h3>
              {job.lead ? (
                <p
                  data-reveal
                  className="mb-2 w-full max-w-[500px] font-secondary text-xl leading-snug font-bold text-[#233234] lg:text-4xl"
                >
                  {job.lead}
                </p>
              ) : null}
              <p
                data-reveal
                className="font-secondary text-xl leading-snug font-bold text-[#233234] lg:text-[32px]"
              >
                {job.bodyBefore}
                <a
                  href={job.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dp-green-deep underline underline-offset-4 transition-colors hover:text-dp-green"
                >
                  {job.linkLabel}
                  <span className="sr-only">
                    {" "}
                    {t("(opens in a new window)")}
                  </span>
                </a>
                {job.bodyAfter}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
