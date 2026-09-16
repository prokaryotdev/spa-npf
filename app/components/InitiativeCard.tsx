"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import type { InitiativeCard as Card } from "../content";
import { ArrowRight } from "./icons";
import { useT } from "../i18n/client";

/**
 * The site's one card shape: full-bleed photo, a triple gradient scrim driven by
 * the card's own ink colour, the initiative logo top-left, and the copy stacked
 * at the base. Shared by Smart Policing, Smart Police Stations and Community.
 */
/** The three card ratios the site uses; mobile is always 330/530. */
const shapes = {
  square: "aspect-[330/530] md:aspect-[800/750]",
  wide: "aspect-[330/530] md:aspect-[1650/750]",
  tall: "aspect-[330/530] md:aspect-[640/890]",
};

export default function InitiativeCard({
  card,
  shape = "square",
  className = "",
}: {
  card: Card;
  shape?: keyof typeof shapes;
  className?: string;
}) {
  const t = useT();
  const { ink, tint, edge, shadow } = card.theme;
  const scrim = `linear-gradient(180deg, ${ink}0d 58%, ${ink} 100%), linear-gradient(45deg, ${ink}05 74%, ${ink}bf 106%), linear-gradient(322deg, ${ink}05 63%, ${ink}bf 103%)`;

  return (
    <article
      style={
        {
          "--ink": ink,
          "--tint": tint,
          "--edge": edge,
          boxShadow: `0 40px 30px -20px ${shadow}`,
        } as CSSProperties
      }
      className={`group/card relative flex ${shapes[shape]} flex-col justify-between overflow-hidden rounded-[32px] p-6 duration-500 ease-[var(--ease-custom)] md:hover:-translate-y-2.5 lg:p-10 ${className}`}
    >
      <Image
        src={card.image}
        alt=""
        fill
        sizes={
          shape === "wide"
            ? "(max-width: 768px) 84vw, 92vw"
            : "(max-width: 768px) 84vw, 46vw"
        }
        className="object-cover transition-transform duration-700 ease-[var(--ease-custom)] group-hover/card:scale-105"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: scrim }}
      />

      <div className="relative z-10 mb-10 flex w-full items-start justify-between gap-4">
        <div
          className={`relative ${card.logoIsWide ? "h-10 w-[170px] md:h-14 md:w-[190px]" : "h-12 w-12 md:h-16 md:w-16"}`}
        >
          <Image
            src={card.logo}
            alt={t("{name} logo", { name: card.title })}
            fill
            sizes="190px"
            className="object-contain object-left-top"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {card.badge ? (
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              {card.badge}
            </span>
          ) : null}
          <span className="inline-flex items-center rounded-full bg-white p-0.5 text-black transition-all duration-500 ease-[var(--ease-custom)]">
            <span className="max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap transition-all duration-500 ease-[var(--ease-custom)] group-hover/card:max-w-[7.5rem] group-hover/card:ps-3">
              {t("More Details")}
            </span>
            <span className="grid size-8 place-items-center rounded-full bg-white md:size-10">
              <ArrowRight className="size-[18px]" />
            </span>
          </span>
        </div>
      </div>

      <div
        className={`relative z-10 ${shape === "wide" ? "md:max-w-[52ch]" : ""}`}
      >
        <span
          className="mb-3 inline-block rounded-full border px-2 py-0.5 text-xs font-medium"
          style={{ background: tint, borderColor: edge, color: ink }}
        >
          {t("Initiative")}
        </span>
        <h3 className="mb-2 font-secondary text-xl leading-normal font-bold text-white md:text-2xl">
          {card.title}
        </h3>
        <p className="line-clamp-3 text-xs leading-snug text-white/90 md:text-base">
          {card.body}
        </p>

        {card.tags.length || card.more ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 md:mt-6">
            {card.tags.map((tag) => (
              <span
                key={tag.label}
                className="inline-flex items-center rounded-full border border-neutral-400 bg-[#F9F9F9] px-3 py-3 font-secondary text-[10px] leading-tight font-bold text-[#4B4C4D] shadow-[0_4px_4px_rgba(0,0,0,0.25)] md:px-4 md:text-xs xl:px-6"
              >
                {tag.icon ? (
                  <span className="relative me-2 size-3.5 shrink-0 md:size-5">
                    <Image
                      src={tag.icon}
                      alt=""
                      fill
                      sizes="20px"
                      className="object-contain"
                    />
                  </span>
                ) : null}
                {t(tag.label)}
              </span>
            ))}
            {card.more ? (
              <span className="px-3 py-3 text-sm text-white/80">
                {t("+{n} more", { n: card.more })}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
