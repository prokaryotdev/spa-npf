import Image from "next/image";
import type { InitiativeCard } from "../content";

/**
 * Community is the people chapter, so it leads with photographs packed as a
 * mosaic: the first piece large, the middle four as a two-by-two beside it,
 * the last as a full-width band. Words sit on the photo over a neutral night
 * shade, never a tint of the photo's own colour, and every word is shown.
 * Tiles grow to fit their text rather than clipping it. Positions are by
 * index: first is the feature, last is the band, the rest fill the square.
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
    <section
      aria-labelledby={id}
      className="npf-section border-t border-npf-gold/15 bg-npf-sand"
    >
      <div className="npf-container">
        {head}

        <div
          data-reveal
          className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-5"
        >
          {items.map((item, i) => {
            const feature = i === 0;
            const band = i === last;
            return (
              <article
                key={item.title}
                className={`relative isolate flex flex-col justify-end overflow-hidden rounded-[24px] bg-npf-night p-6 text-white ${
                  feature
                    ? "min-h-[440px] md:col-span-2 md:min-h-[480px] lg:row-span-2 lg:p-10"
                    : band
                      ? "min-h-[420px] md:col-span-2 md:min-h-[380px] lg:col-span-4 lg:p-10"
                      : "min-h-[400px]"
                }`}
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes={
                    feature || band
                      ? "(max-width: 768px) 92vw, (max-width: 1024px) 92vw, 60vw"
                      : "(max-width: 768px) 92vw, (max-width: 1024px) 46vw, 25vw"
                  }
                  className={`-z-10 object-cover ${feature ? "object-[50%_80%]" : ""}`}
                />
                {/* Neutral shade, darkest where the words are. */}
                <div
                  aria-hidden
                  className={`absolute inset-0 -z-10 ${
                    band
                      ? "bg-[linear-gradient(to_top,rgba(10,21,38,0.92)_0%,rgba(10,21,38,0.55)_45%,transparent_80%)] lg:bg-[linear-gradient(to_right,rgba(10,21,38,0.92)_0%,rgba(10,21,38,0.6)_35%,transparent_65%)] rtl:lg:bg-[linear-gradient(to_left,rgba(10,21,38,0.92)_0%,rgba(10,21,38,0.6)_35%,transparent_65%)]"
                      : "bg-[linear-gradient(to_top,rgba(10,21,38,0.94)_0%,rgba(10,21,38,0.7)_40%,transparent_78%)]"
                  }`}
                />

                <div className={band ? "lg:max-w-[46ch] lg:self-start" : ""}>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h3
                      className={`font-secondary font-bold tracking-[-0.01em] text-balance ${
                        feature || band
                          ? "text-2xl md:text-3xl"
                          : "text-xl"
                      }`}
                    >
                      {item.title}
                    </h3>
                    {item.badge ? (
                      <span className="rounded-full bg-npf-gold-soft px-2.5 py-1 font-secondary text-xs font-bold text-npf-night">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  <p
                    className={`mt-2 text-white/85 ${
                      feature || band
                        ? "max-w-[46ch] leading-relaxed md:text-lg"
                        : "text-sm leading-snug"
                    }`}
                  >
                    {item.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
