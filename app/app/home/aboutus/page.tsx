import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import StickyBar from "../../../components/StickyBar";
import { ArrowRight } from "../../../components/icons";
import { aboutUs as aboutUsSource } from "../../../content-pages";
import { getT, getLocalized } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("About Us | Dubai Police"),
    description: t(aboutUsSource.heroCaption),
  };
}

export default async function AboutUsPage() {
  const aboutUs = await getLocalized(aboutUsSource);
  const t = await getT();
  return (
    <>
      {/* The hero here is pale, so the transparent treatment would wash out. */}
      <Header solid />
      <main id="main-content" tabIndex={-1} className="outline-none">
        {/* The title is set twice — filled behind the model, outlined in front —
 which is how the original layers them. */}
        <section className="relative h-screen min-h-[660px] w-full overflow-hidden bg-[#EAF3EE]">
          <h1 className="pointer-events-none absolute top-[32%] left-0 z-10 w-full -translate-y-1/2 text-center font-secondary text-[15vw] leading-none font-bold text-[#00301F] sm:text-[110px] md:text-[150px] xl:text-[200px]">
            {aboutUs.title}
          </h1>

          <div className="absolute bottom-[21%] left-1/2 z-20 w-[min(92%,900px)] -translate-x-1/2">
            <Image
              src={aboutUs.heroImage}
              alt="A model of Naif Fort, where Dubai Police began"
              width={1385}
              height={700}
              priority
              sizes="(max-width: 900px) 92vw, 900px"
              className="h-auto max-h-[42vh] w-full object-contain"
            />
          </div>

          <span
            aria-hidden
            className="pointer-events-none absolute top-[32%] left-0 z-30 w-full -translate-y-1/2 text-center font-secondary text-[15vw] leading-none font-bold text-transparent sm:text-[110px] md:text-[150px] xl:text-[200px]"
            style={{ WebkitTextStroke: "1.5px rgba(0,48,31,0.5)" }}
          >
            {aboutUs.title}
          </span>

          <p className="absolute inset-x-0 bottom-10 z-40 mx-auto max-w-2xl px-4 text-center font-secondary text-sm font-bold text-[#0d2a1e] md:text-base xl:text-lg">
            {aboutUs.heroCaption}
          </p>
        </section>

        {/* History */}
        <section className="relative overflow-hidden bg-black py-24 text-white lg:py-[140px]">
          <Image
            src={aboutUs.history.image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div className="dp-container relative">
            <h2
              data-reveal
              className="max-w-[22ch] font-secondary text-3xl leading-tight font-bold lg:text-6xl"
            >
              {aboutUs.history.heading}
            </h2>
            <p
              data-reveal
              className="mt-6 max-w-[65ch] text-base leading-relaxed text-white/85 md:text-xl"
            >
              {aboutUs.history.body}
            </p>
          </div>
        </section>

        {/* The journey film */}
        <section className="relative h-screen overflow-hidden bg-[#04140E]">
          <video
            className="absolute inset-0 size-full object-cover opacity-70"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-label={t("Dubai Police through the years")}
          >
            <source src={aboutUs.journey.video} type="video/webm" />
          </video>
          <span
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,20,14,0.6),rgba(4,20,14,0.15)_45%,rgba(4,20,14,0.85))]"
          />
          <div className="dp-container relative flex h-full items-center">
            <h2 className="font-secondary text-4xl leading-[1.15] font-bold text-white lg:text-7xl">
              {aboutUs.journey.lines.map((line, i) => (
                <span
                  key={line}
                  data-reveal
                  className="block"
                  style={
                    { "--reveal-delay": `${i * 120}ms` } as React.CSSProperties
                  }
                >
                  {line}
                </span>
              ))}
            </h2>
          </div>
        </section>

        {/* Strategy */}
        <section className="relative overflow-hidden bg-white py-24 lg:py-[140px]">
          <div className="dp-container">
            <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <h2
                  data-reveal
                  className="font-secondary text-4xl font-bold text-dp-green-deep lg:text-6xl"
                >
                  {aboutUs.strategy.heading}
                </h2>
                <div
                  data-reveal
                  className="relative mt-8 aspect-[4/3] overflow-hidden rounded-3xl"
                >
                  <Image
                    src={aboutUs.strategy.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 92vw, 46vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <ol className="space-y-6">
                {aboutUs.strategy.points.map((point, i) => (
                  <li
                    key={point}
                    data-reveal
                    style={
                      { "--reveal-delay": `${i * 70}ms` } as React.CSSProperties
                    }
                    className="flex gap-4 border-b border-black/10 pb-6 last:border-0"
                  >
                    <span className="font-secondary text-lg font-bold text-dp-green tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-base leading-relaxed text-dp-body md:text-lg">
                      {point}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Vision, Mission, Values */}
        <section className="bg-white pb-24 lg:pb-[140px]">
          <div className="dp-container grid gap-8 lg:grid-cols-3">
            {aboutUs.pillars.map((pillar, i) => (
              <article
                key={pillar.heading}
                data-reveal
                style={
                  { "--reveal-delay": `${i * 110}ms` } as React.CSSProperties
                }
                className="group/card relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl p-8 text-white"
              >
                <Image
                  src={pillar.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 92vw, 31vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-custom)] group-hover/card:scale-105"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,36,24,0.1)_40%,rgba(4,36,24,0.92))]"
                />
                <div className="relative">
                  <h2 className="mb-3 font-secondary text-2xl font-bold lg:text-3xl">
                    {pillar.heading}
                  </h2>
                  <p className="text-sm leading-relaxed text-white/90 md:text-base">
                    {pillar.body}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="dp-container mt-12">
            <Link
              href={aboutUs.structureLink.href}
              className="inline-flex items-center gap-2 rounded-full bg-dp-green px-6 py-3.5 font-medium text-white transition-colors hover:bg-dp-green-mid"
            >
              {aboutUs.structureLink.label}
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <StickyBar />
    </>
  );
}
