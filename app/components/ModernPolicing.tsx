import Image from "next/image";
import type { InitiativeCard } from "../content";
import Link from "../i18n/Link";
import { ArrowRight } from "./icons";

/**
 * Modern Policing as a feature-and-pair rather than a third copy of the 2 + 1
 * card mosaic: the wide initiative stands tall on the start side, the other
 * two stack beside it. Each tile is a real link to its service; the scrim
 * comes from the initiative's own ink so the copy always lands on colour.
 */
export default function ModernPolicing({
  items,
}: {
  items: InitiativeCard[];
}) {
  const feature = items.find((item) => item.wide) ?? items[0];
  const rest = items.filter((item) => item !== feature);

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:h-[clamp(560px,46vw,700px)] lg:grid-cols-12 lg:grid-rows-2">
      <Tile
        item={feature}
        big
        className="aspect-[4/5] md:col-span-2 md:aspect-[16/9] lg:col-span-7 lg:row-span-2 lg:aspect-auto"
      />
      {rest.map((item, i) => (
        <Tile
          key={item.title}
          item={item}
          delay={(i + 1) * 110}
          className="aspect-[4/5] md:aspect-[4/5] lg:col-span-5 lg:aspect-auto"
        />
      ))}
    </div>
  );
}

function Tile({
  item,
  big = false,
  delay = 0,
  className,
}: {
  item: InitiativeCard;
  big?: boolean;
  delay?: number;
  className: string;
}) {
  const ink = item.theme.ink;
  return (
    <Link
      href={item.href ?? "/app/services"}
      data-reveal
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={`group relative flex flex-col justify-end overflow-hidden rounded-[28px] bg-npf-night p-6 text-white shadow-[0_30px_40px_-24px_rgba(10,21,38,0.45)] transition-[translate,box-shadow] duration-500 ease-[var(--ease-custom)] md:hover:-translate-y-1.5 md:hover:shadow-[0_44px_56px_-28px_rgba(10,21,38,0.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-npf-blue md:p-8 ${big ? "lg:p-12" : ""} ${className}`}
    >
      <Image
        src={item.image}
        alt=""
        fill
        quality={100}
        sizes={
          big
            ? "(min-width: 1024px) 58vw, 92vw"
            : "(min-width: 1024px) 42vw, (min-width: 768px) 46vw, 92vw"
        }
        className="object-cover transition-transform duration-700 ease-[var(--ease-custom)] group-hover:scale-105"
      />
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${ink}00 20%, ${ink}cc 62%, ${ink} 100%)`,
        }}
      />

      {/* A light hairline so the dark photos keep a crisp edge on the pale ground. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[28px] ring-1 ring-white/15 ring-inset"
      />

      <span
        aria-hidden
        className="absolute end-6 top-6 grid size-11 place-items-center rounded-full bg-white text-npf-ink transition-transform duration-500 ease-[var(--ease-custom)] group-hover:-rotate-45 md:end-8 md:top-8 rtl:group-hover:rotate-45"
      >
        <ArrowRight className="size-5 rtl:-scale-x-100" />
      </span>

      <span className="relative">
        <h3
          className={`font-secondary leading-tight font-bold ${big ? "text-3xl md:text-4xl lg:text-5xl" : "text-2xl md:text-3xl"}`}
        >
          {item.title}
        </h3>
        <span
          className={`mt-3 block text-white/85 ${big ? "max-w-[44ch] text-base md:text-lg" : "line-clamp-2 max-w-[40ch] text-sm md:text-base"}`}
        >
          {item.body}
        </span>
      </span>
    </Link>
  );
}
