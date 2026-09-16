"use client";

import Image from "next/image";
import { useRef } from "react";
import { domains as domainsSource } from "../content";
import { chapter, useScrollProgress } from "./useScrollProgress";
import { useLang, useLocalized, useT } from "../i18n/client";

/**
 * The original animates these headings letter by letter; so does this one —
 * in Latin. Arabic letters join, and putting each one in its own box breaks
 * every ligature and leaves a row of isolated forms, so Arabic staggers by
 * word instead. Same entrance, script the reader recognises.
 */
function LetterStagger({ text }: { text: string }) {
  const joined = useLang() === "ar";
  let n = 0;
  return (
    <span aria-hidden className="flex flex-wrap">
      {text.split(" ").map((word, w) => (
        <span key={w} className="me-[0.22em] flex overflow-hidden py-[0.06em]">
          {(joined ? [word] : [...word]).map((piece, i) => (
            <span
              key={i}
              className="inline-block animate-[letter-up_0.75s_var(--ease-custom)_both]"
              style={{ animationDelay: `${n++ * (joined ? 90 : 38)}ms` }}
            >
              {piece}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

export default function Domains() {
  const domains = useLocalized(domainsSource);
  const t = useT();
  const section = useRef<HTMLElement>(null);
  const progress = useScrollProgress(section);
  const active = chapter(progress, domains.length);

  return (
    <section
      ref={section}
      aria-labelledby="domains"
      className="relative h-[300vh] bg-black"
    >
      <h2 id="domains" className="sr-only">
        {t("Protection across sea, land and sky")}
      </h2>

      <div className="sticky top-0 h-screen overflow-hidden">
        {domains.map((domain, i) => (
          <div
            key={domain.id}
            aria-hidden={i !== active}
            className={`absolute inset-0 transition-opacity duration-700 ease-[var(--ease-custom)] ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={domain.background}
              alt=""
              fill
              sizes="100vw"
              style={{
                transform: `scale(${1.06 + (i === active ? progress * 0.06 : 0)})`,
              }}
              className="object-cover"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.06)_42%,rgba(0,0,0,0.65)_100%)]"
            />
            {/* The vehicle owns the right half so the copy keeps a clear column. */}
            <div className="absolute inset-y-0 end-0 w-full md:w-[62%]">
              <Image
                src={domain.subject}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 62vw"
                className="object-contain object-bottom md:object-right"
              />
            </div>
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(100deg,rgba(3,12,9,0.94)_0%,rgba(3,12,9,0.76)_32%,rgba(3,12,9,0.1)_64%,transparent_80%)]"
            />
          </div>
        ))}

        <div className="dp-container relative flex h-full items-center">
          {domains.map((domain, i) =>
            i === active ? (
              <div key={domain.id} className="max-w-[620px]">
                <h3
                  aria-label={domain.title}
                  className="mb-4 max-w-[15ch] font-secondary text-4xl leading-none font-bold text-white sm:text-5xl lg:text-6xl"
                >
                  <LetterStagger text={domain.title} />
                </h3>
                {domain.lead ? (
                  <p className="mb-3 animate-[reveal-up_0.8s_var(--ease-custom)_0.25s_both] font-secondary text-lg font-bold text-white md:text-2xl">
                    {domain.lead}
                  </p>
                ) : null}
                <p className="animate-[reveal-up_0.8s_var(--ease-custom)_0.35s_both] text-base text-white/85 md:text-lg">
                  {domain.body}
                </p>
                <ul className="mt-7 flex flex-wrap gap-3">
                  {domain.chips.map((chip, c) => (
                    <li
                      key={chip.label}
                      className="animate-[reveal-up_0.7s_var(--ease-custom)_both]"
                      style={{ animationDelay: `${450 + c * 90}ms` }}
                    >
                      {/* A label, not a control — nothing to click through to. */}
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md">
                        <span className="relative size-5 shrink-0">
                          <Image
                            src={chip.icon}
                            alt=""
                            fill
                            sizes="20px"
                            className="object-contain"
                          />
                        </span>
                        {chip.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null,
          )}
        </div>
      </div>
    </section>
  );
}
