"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { InitiativeCard } from "../content";
import Link from "../i18n/Link";
import { ArrowRight } from "./icons";
import { useT } from "../i18n/client";

/**
 * The station types are tiers of one Command, read top down: headquarters,
 * area, division, post, and the base on the water. Every tier's text is on
 * the page, nothing hides behind a click. From lg the photograph holds still
 * beside the text and changes to the tier crossing the middle of the screen,
 * so scrolling walks down the chain of command. Below lg each tier carries
 * its own photo. Every tier leads to the same place, so there is one way out.
 */
export default function Stations({
  id,
  head,
  tiers,
}: {
  id: string;
  head: React.ReactNode;
  tiers: InitiativeCard[];
}) {
  const t = useT();
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = [...(list.current?.children ?? [])];
    // A zero-height band across the middle of the viewport: whichever tier
    // is crossing it is the one being read.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(items.indexOf(entry.target));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-labelledby={id} className="npf-section bg-white">
      <div className="npf-container">
        {head}

        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-16">
          {/* The stage: every photo stacked, the current tier's settles in
              so a change reads as a change of place, not a flash. */}
          <div aria-hidden className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-24 h-[min(680px,calc(100svh-9rem))] overflow-hidden rounded-[32px] bg-npf-night shadow-[0_40px_60px_-36px_rgba(10,21,38,0.55)]">
              {tiers.map((tier, i) => (
                <Image
                  key={tier.title}
                  src={tier.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 46vw, 1px"
                  className={`object-cover transition-[opacity,scale] duration-[900ms] ease-[var(--ease-custom)] ${
                    i === active
                      ? "scale-100 opacity-100"
                      : "scale-[1.06] opacity-0"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 xl:col-span-5 xl:col-start-8">
            <ol ref={list}>
              {tiers.map((tier, i) => {
                const current = i === active;
                return (
                  <li
                    key={tier.title}
                    className="border-t border-npf-ink/10 py-8 first:border-t-0 first:pt-0 md:py-10 lg:flex lg:min-h-[52svh] lg:flex-col lg:justify-center lg:first:pt-10"
                  >
                    <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-[24px] bg-npf-night lg:hidden">
                      <Image
                        src={tier.image}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 92vw, 1px"
                        className="object-cover"
                      />
                    </div>
                    <h3
                      className={`mb-3 font-secondary text-2xl font-bold tracking-[-0.02em] transition-colors duration-500 md:text-3xl lg:text-4xl text-npf-blue-deep ${current ? "" : "lg:text-npf-muted"}`}
                    >
                      {tier.title}
                    </h3>
                    <p
                      className={`max-w-[52ch] leading-relaxed transition-colors duration-500 md:text-lg text-npf-body ${current ? "" : "lg:text-npf-muted"}`}
                    >
                      {tier.body}
                    </p>
                  </li>
                );
              })}
            </ol>

            <Link
              href="/app/home/customer-centers"
              className="group mt-4 inline-flex items-center gap-3 rounded-full bg-npf-blue py-2 ps-6 pe-2 font-secondary font-bold text-white transition-[background-color,scale] duration-200 hover:bg-npf-blue-deep active:scale-[0.97] lg:mt-0"
            >
              {t("Find a station near you")}
              <span className="grid size-10 place-items-center rounded-full bg-white text-npf-blue transition-transform duration-300 ease-[var(--ease-custom)] group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1">
                <ArrowRight className="size-[18px]" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
