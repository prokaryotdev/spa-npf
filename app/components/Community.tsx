import Image from "next/image";
import type { InitiativeCard } from "../content";
import { reveal } from "./reveal";

/**
 * Community is the people chapter, so it leads with photographs packed as a
 * mosaic: the first piece large, the middle four as a two-by-two beside it,
 * the last as a full-width band. Words sit on the photo over the neutral
 * night shade, and every word is shown: tiles grow to fit their text rather
 * than clipping it. Positions are by index: first is the feature, last is
 * the band, the rest fill the square.
 */
export default function Community({
  id,
  head,
  items,
}: {
  id: string;
  head: React.ReactNode;
  items: InitiativeCard[];
}) {
  const last = items.length - 1;

  return (
    <section aria-labelledby={id} className="npf-section border-t border-npf-gold/20 bg-npf-sand">
      <div className="npf-container">
        {head}

        <div className="mt-(--npf-head-gap) grid gap-(--npf-gap) md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const feature = i === 0;
            const band = i === last;
            const large = feature || band;
            return (
              <div
                key={item.title}
                {...reveal(band ? 1 : Math.min(i, 3))}
                className={`grid ${
                  feature
                    ? "min-h-[440px] md:col-span-2 md:min-h-[480px] lg:row-span-2"
                    : band
                      ? "min-h-[400px] md:col-span-2 lg:col-span-4"
                      : "min-h-[380px]"
                }`}
              >
                <article className="npf-tile p-(--npf-pad)">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes={
                      large
                        ? "(min-width: 1024px) 60vw, 92vw"
                        : "(min-width: 1024px) 25vw, (min-width: 768px) 46vw, 92vw"
                    }
                    className={`npf-tile-media ${feature ? "object-[50%_80%]" : ""}`}
                  />
                  {/* On the wide band the words sit on the start side, so the
                      shade runs across instead of up. */}
                  <div
                    aria-hidden
                    className={`npf-tile-shade ${
                      band
                        ? "lg:bg-[linear-gradient(to_right,rgb(10_21_38/0.92)_0%,rgb(10_21_38/0.6)_35%,transparent_65%)]"
                        : ""
                    }`}
                  />

                  <div className={band ? "lg:max-w-[46ch]" : ""}>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h3 className={`${large ? "npf-h3" : "npf-h4"} text-white`}>
                        {item.title}
                      </h3>
                      {item.badge ? (
                        <span className="npf-caption rounded-full bg-npf-gold-soft px-2.5 py-1 text-npf-night">
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                    <p
                      className={`mt-2.5 max-w-[46ch] text-white/85 ${large ? "npf-lede" : "npf-small"}`}
                    >
                      {item.body}
                    </p>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
