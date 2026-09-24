import Image from "next/image";
import type { InitiativeCard } from "../content";
import Link from "../i18n/Link";
import { ArrowRight } from "./icons";
import { reveal } from "./reveal";

/**
 * The online services as a feature-and-pair: the wide initiative stands tall
 * on the start side, the other two stack beside it. Each tile is a real link
 * to its service; the shade comes from the initiative's own ink so the copy
 * always lands on colour.
 */
export default function ModernPolicing({
  items,
}: {
  items: InitiativeCard[];
}) {
  const feature = items.find((item) => item.wide) ?? items[0];
  const rest = items.filter((item) => item !== feature);

  return (
    <div className="grid gap-(--npf-gap) md:grid-cols-2 lg:h-[clamp(560px,46vw,700px)] lg:grid-cols-12 lg:grid-rows-2">
      <div
        {...reveal()}
        className="grid aspect-[4/5] md:col-span-2 md:aspect-[16/9] lg:col-span-7 lg:row-span-2 lg:aspect-auto"
      >
        <Tile item={feature} big />
      </div>
      {rest.map((item, i) => (
        <div
          key={item.title}
          {...reveal(i + 1)}
          className="grid aspect-[4/5] lg:col-span-5 lg:aspect-auto"
        >
          <Tile item={item} />
        </div>
      ))}
    </div>
  );
}

function Tile({ item, big = false }: { item: InitiativeCard; big?: boolean }) {
  const ink = item.theme.ink;
  return (
    <Link
      href={item.href ?? "/app/services"}
      className="npf-tile group p-(--npf-pad) focus-visible:outline-offset-4"
    >
      <Image
        src={item.image}
        alt=""
        fill
        quality={85}
        sizes={
          big
            ? "(min-width: 1024px) 58vw, 92vw"
            : "(min-width: 1024px) 42vw, (min-width: 768px) 46vw, 92vw"
        }
        className="npf-tile-media"
      />
      <span
        aria-hidden
        className="npf-tile-shade"
        style={{
          background: `linear-gradient(to top, ${ink} 0%, ${ink}cc 38%, ${ink}00 72%)`,
        }}
      />

      <span
        aria-hidden
        className="npf-btn-disc absolute end-(--npf-pad) top-(--npf-pad) size-11 bg-white text-npf-ink transition-[rotate] group-hover:-rotate-45"
      >
        <ArrowRight className="size-5 rtl:-scale-x-100" />
      </span>

      <span className="relative">
        <h3 className={`${big ? "npf-h3" : "npf-h4"} text-white`}>
          {item.title}
        </h3>
        <span
          className={`mt-3 block max-w-[44ch] text-white/85 ${big ? "npf-lede" : "npf-small line-clamp-3"}`}
        >
          {item.body}
        </span>
      </span>
    </Link>
  );
}
