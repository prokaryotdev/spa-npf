"use client";

import Image from "next/image";
import { useRef } from "react";
import { domains as domainsSource } from "../content";
import { chapter, useScrollProgress } from "./useScrollProgress";
import { useLocalized, useT } from "../i18n/client";

/**
 * The headings animate letter by letter. Both languages are written in Latin
 * letters that stand alone, so one pass serves English and Hausa alike —
 * including the hooked letters, which are single characters, not pairs.
 */
function LetterStagger({ text }: { text: string }) {
  let n = 0;
  return (
    <span aria-hidden className="flex flex-wrap">
      {text.split(" ").map((word, w) => (
        <span key={w} className="me-[0.22em] flex overflow-hidden py-[0.06em]">
          {[...word].map((piece, i) => (
            <span
              key={i}
              className="inline-block animate-[letter-up_0.75s_var(--ease-custom)_both]"
              style={{ animationDelay: `${n++ * 38}ms` }}
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
      className="relative h-[300vh] bg-npf-night"
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
            {/*
              A <picture>, not next/image: a phone needs a different crop, not
              a smaller one. These slides are shot with the reading column left
              empty — on the wide file that column is the left third, on the
              tall file it is the upper two-thirds — so a narrow viewport has
              to be handed its own photograph. next/image resizes one source
              and cannot swap it, and rendering both and hiding one downloads
              both.
            */}
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet={domain.background.replace(".jpg", "-mobile.jpg")}
              />
              <img
                src={domain.background}
                alt=""
                loading="lazy"
                decoding="async"
                style={{
                  transform: `scale(${1.06 + (i === active ? progress * 0.06 : 0)})`,
                }}
                className="absolute inset-0 size-full object-cover"
              />
            </picture>
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,21,38,0.34)_0%,rgba(10,21,38,0.04)_42%,rgba(10,21,38,0.5)_100%)]"
            />
            {/* A floating patrol-vehicle cut-out used to shade the right half;
                it was Dubai Police, and no freely licensed NPF equivalent
                exists. The photograph shows the domain itself now, so the
                scrim only has to clear a reading column on the start side. */}
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(100deg,rgba(10,21,38,0.82),rgba(10,21,38,0.66))] md:bg-[linear-gradient(100deg,rgba(10,21,38,0.9)_0%,rgba(10,21,38,0.82)_46%,rgba(10,21,38,0.62)_60%,rgba(10,21,38,0.12)_80%,transparent_100%)]"
            />
          </div>
        ))}

        <div className="npf-container relative flex h-full items-center">
          {domains.map((domain, i) =>
            i === active ? (
              <div key={domain.id} className="max-w-[620px]">
                <h3
                  aria-label={domain.title}
                  className="npf-h2 mb-4 max-w-[15ch] text-white"
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
                        {/* The Air Wing's mark was the Oyoon eye, which carries
                            the Dubai Police crest; that chip stands on its
                            label until the Force has one of its own. */}
                        {"icon" in chip ? (
                          <span className="relative size-5 shrink-0">
                            <Image
                              src={chip.icon}
                              alt=""
                              fill
                              sizes="20px"
                              className="object-contain"
                            />
                          </span>
                        ) : null}
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
