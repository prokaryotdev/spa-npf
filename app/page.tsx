import Image from "next/image";
import Link from "next/link";
import CardRail from "./components/CardRail";
import Careers from "./components/Careers";
import Domains from "./components/Domains";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import InitiativeCard from "./components/InitiativeCard";
import Pillars from "./components/Pillars";
import Skyline from "./components/Skyline";
import StickyBar from "./components/StickyBar";
import { ArrowRight } from "./components/icons";
import {
  appStores,
  community,
  quickServices,
  smartPoliceStations,
  smartPolicing,
} from "./content";

/** The soft green bloom that sits behind the light sections. */
const bloom =
  "bg-[radial-gradient(#3cbd6b75_7%,#22c55e38_40%,#22c55e00_70%)] rounded-full pointer-events-none absolute";

export default function Home() {
  return (
    <>
      <Header />

      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />

        {/* Four routes into the service catalogue, riding the seam below the hero. */}
        <section
          aria-labelledby="quick-services"
          className="relative z-10 -mt-px bg-black pb-px"
        >
          <h2 id="quick-services" className="sr-only">
            Popular services
          </h2>
          <div className="dp-container">
            <div className="grid grid-cols-2 gap-2 pt-4 sm:grid-cols-3 lg:flex lg:pt-9">
              {quickServices.map((service) => (
                <button
                  key={service.title}
                  type="button"
                  className="group h-full w-full grow rounded-xl bg-white p-3 pt-4 text-start duration-500 ease-[var(--ease-custom)] will-change-transform lg:h-[242px] lg:rounded-t-2xl lg:rounded-b-none lg:pb-20 md:hover:-translate-y-[30px]"
                >
                  <span className="relative mx-auto mb-2 block aspect-square w-[60px]">
                    <Image
                      src={service.icon}
                      alt=""
                      fill
                      sizes="60px"
                      className="object-contain transition-transform duration-500 ease-[var(--ease-custom)] group-hover:scale-110"
                    />
                  </span>
                  <span className="mx-auto flex min-h-[42px] max-w-[17ch] items-center justify-center text-center font-secondary text-sm leading-normal font-bold text-dp-ink">
                    {service.title}
                  </span>
                  <span className="mx-auto block max-w-[210px] text-center text-sm text-dp-muted lg:text-base lg:leading-tight">
                    {service.body}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <Pillars />

        {/* Leading the Way in Smart Policing */}
        <section
          aria-labelledby="smart-policing"
          className="relative overflow-hidden bg-white pt-[70px] pb-16 lg:py-[150px]"
        >
          <div className={`${bloom} top-0 left-0 h-80 w-56 -translate-x-1/2 -translate-y-1/2 opacity-70 md:size-[1200px] md:opacity-60`} />
          <Image
            src="/img/assets-home/static/cloud.png"
            alt=""
            width={800}
            height={358}
            className="pointer-events-none absolute top-[2%] left-1/2 z-20 w-[800px] opacity-[0.06]"
          />

          <div className="dp-container relative z-10">
            <h2
              id="smart-policing"
              data-reveal
              className="mb-4 font-secondary text-4xl leading-[1.2] font-bold text-dp-green-deep md:max-w-[20ch] lg:mb-6 lg:text-7xl 2xl:text-8xl"
            >
              Leading the Way in Smart Policing
            </h2>
            <p
              data-reveal
              className="max-w-[568px] text-sm text-neutral-700 md:text-2xl"
            >
              We harness intelligent technologies to keep public safety
              responsive, smart, and always one step ahead.
            </p>

            <CardRail label="smart policing" className="mt-10 md:hidden">
              {smartPolicing.map((card) => (
                <InitiativeCard
                  key={card.title}
                  card={card}
                  className="w-[84vw] max-w-[420px] shrink-0"
                />
              ))}
            </CardRail>

            <div className="mt-10 hidden grid-cols-2 gap-6 md:mt-32 md:grid md:gap-12">
              {smartPolicing.map((card, i) => (
                <div
                  key={card.title}
                  data-reveal
                  style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
                  className={card.wide ? "col-span-2" : undefined}
                >
                  <InitiativeCard card={card} shape={card.wide ? "wide" : "square"} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <Domains />

        {/* Smart Police Stations */}
        <section
          aria-labelledby="sps"
          className="relative overflow-hidden bg-white pt-[70px] pb-16 lg:py-[150px]"
        >
          <div className={`${bloom} top-0 right-0 h-80 w-56 translate-x-1/2 -translate-y-1/2 opacity-70 md:size-[1200px] md:opacity-60`} />

          <div className="dp-container relative z-10">
            <h2
              id="sps"
              data-reveal
              className="mb-4 font-secondary text-4xl leading-[1.2] font-bold text-dp-green-deep md:max-w-[20ch] lg:mb-6 lg:text-7xl 2xl:text-8xl"
            >
              Smart Police Stations
            </h2>
            <p
              data-reveal
              className="max-w-[640px] text-sm text-neutral-700 md:text-2xl"
            >
              Smart Police Stations (SPS): Smart, Practical, Secure, and around
              the clock.
            </p>
            <Link
              href="/app/home/aboutus"
              data-reveal
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-dp-green px-6 py-3 font-medium text-white transition-colors hover:bg-dp-green-mid"
            >
              Our Brand Story
              <ArrowRight className="size-5" />
            </Link>

            <CardRail label="SPS" className="mt-10 md:mt-20">
              {smartPoliceStations.map((card) => (
                <InitiativeCard
                  key={card.title}
                  card={card}
                  shape="tall"
                  className="w-[84vw] max-w-[420px] shrink-0 md:w-[400px] md:max-w-none lg:w-[460px]"
                />
              ))}
            </CardRail>
          </div>
        </section>

        {/* Community */}
        <section
          aria-labelledby="community"
          className="relative overflow-hidden bg-white pt-[70px] pb-16 lg:py-[150px]"
        >
          <div className={`${bloom} bottom-0 left-0 h-80 w-56 -translate-x-1/2 translate-y-1/2 opacity-70 md:size-[1200px] md:opacity-60`} />

          <div className="dp-container relative z-10">
            <h2
              id="community"
              data-reveal
              className="mb-4 font-secondary text-4xl leading-[1.2] font-bold text-dp-green-deep md:max-w-[16ch] lg:mb-6 lg:text-7xl 2xl:text-8xl"
            >
              Shaping the Future, Side by Side
            </h2>
            <p
              data-reveal
              className="max-w-[640px] text-sm text-neutral-700 md:text-2xl"
            >
              Bringing communities together through education, cultural
              heritage, volunteer service, and dedicated support.
            </p>

            <CardRail label="community" className="mt-10 md:hidden">
              {community.map((card) => (
                <InitiativeCard
                  key={card.title}
                  card={card}
                  className="w-[84vw] max-w-[420px] shrink-0"
                />
              ))}
            </CardRail>

            <div className="mt-10 hidden grid-cols-2 gap-8 md:mt-32 md:grid">
              {community.map((card, i) => (
                <div
                  key={card.title}
                  data-reveal
                  style={{ "--reveal-delay": `${(i % 2) * 110}ms` } as React.CSSProperties}
                  className={card.wide ? "col-span-2" : undefined}
                >
                  <InitiativeCard card={card} shape={card.wide ? "wide" : "square"} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Media Hub */}
        <section
          aria-labelledby="media-hub"
          className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-t from-[#0C1814] to-[#1E312A] py-24 text-white md:py-[150px]"
        >
          <div className="dp-container relative">
            <div className="relative mx-auto max-w-[900px]">
              <Image
                src="/img/assets-home/static/home-media/shape-img.svg"
                alt=""
                width={380}
                height={380}
                data-reveal
                className="absolute -top-[28%] -left-[26%] z-10 w-[50%] md:w-[35%]"
              />
              <Image
                src="/img/assets-home/static/home-media/shape-play.svg"
                alt=""
                width={380}
                height={380}
                data-reveal
                className="absolute -right-[15%] -bottom-[30%] z-10 w-[50%] md:w-[35%]"
              />
              <div
                data-reveal
                className="relative aspect-[326/367] overflow-hidden rounded-3xl md:aspect-[1085/642]"
              >
                <Image
                  src="/cms/70_years_of_Dubai_Police_Visual_V1_Website_V1_d1499023bc.jpeg"
                  alt="Dubai Police media coverage"
                  fill
                  sizes="900px"
                  className="object-cover"
                />
                <span className="absolute inset-0 bg-gradient-to-b from-zinc-900/30 to-neutral-950" />
                <span className="absolute inset-0 hidden bg-[linear-gradient(100deg,rgba(9,24,21,0.95)_0%,rgba(9,24,21,0.7)_40%,transparent_72%)] md:block" />
              </div>
            </div>

            <div className="relative z-20 mt-10 max-w-[750px] md:absolute md:top-1/2 md:left-[6%] md:mt-0 md:-translate-y-1/2">
              <h2
                id="media-hub"
                data-reveal
                className="mb-3 max-w-[14ch] font-secondary text-5xl font-bold sm:text-7xl md:mb-5 2xl:text-8xl"
              >
                Dubai Police Media Hub
              </h2>
              <p
                data-reveal
                className="mb-6 max-w-[500px] font-secondary text-base font-bold md:text-3xl"
              >
                Explore Our News, Events, and Media Highlights in One Place.
              </p>
              <Link
                href="/app/home/media"
                className="inline-flex items-center gap-2 rounded-full bg-dp-green px-6 py-3.5 font-medium text-white transition-colors hover:bg-dp-green-mid"
              >
                Visit the Media Hub
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
        </section>

        <Careers />

        {/* App download */}
        <section
          aria-labelledby="app"
          className="relative flex items-center overflow-hidden bg-[#091815] py-16 text-white md:min-h-screen md:py-[120px] 2xl:py-[150px]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-[38%] left-1/2 w-[55%] -translate-x-1/2"
          >
            <div className="relative aspect-square">
              <Image
                src="/img/assets-home/static/Ring.svg"
                alt=""
                fill
                sizes="60vw"
                className="animate-[spin_90s_linear_infinite] object-contain opacity-10 motion-reduce:animate-none"
              />
              <Image
                src="/img/assets-home/static/Ring2.svg"
                alt=""
                fill
                sizes="60vw"
                className="animate-[spin_70s_linear_infinite_reverse] scale-[1.2] object-contain opacity-10 motion-reduce:animate-none"
              />
            </div>
          </div>
          <span
            aria-hidden
            className="pointer-events-none absolute top-0 -right-[25%] block aspect-square w-[50%] -translate-y-1/2 rounded-full bg-[radial-gradient(#00e599ba_-20%,#00e59924_40%,transparent_68%)] opacity-65"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-0 -left-[25%] block aspect-square w-[70%] translate-y-1/2 rounded-full bg-[radial-gradient(#00e599ba_-20%,#00e59924_40%,transparent_68%)] opacity-65"
          />

          <div className="dp-container relative z-10 max-w-[1276px] text-center">
            <h2
              id="app"
              data-reveal
              className="mx-auto max-w-[1100px] font-secondary text-3xl leading-tight font-bold lg:text-7xl"
            >
              Download the Dubai Police App
            </h2>
            <p
              data-reveal
              className="mx-auto mt-4 max-w-5xl font-secondary text-lg font-bold md:mt-6 md:text-3xl"
            >
              Services, updates, and alerts: right in your pocket.
            </p>
            <div data-reveal className="mt-10 lg:mt-16">
              <h3 className="mb-4 font-secondary text-sm font-bold md:text-3xl">
                Available on
              </h3>
              <ul className="flex flex-wrap justify-center gap-2 md:gap-3">
                {appStores.map((store) => (
                  <li key={store.label}>
                    <a
                      href="https://www.dubaipolice.gov.ae/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block h-[42px] w-[132px] rounded-lg bg-black px-4 py-1.5 transition-transform duration-300 hover:-translate-y-1 md:h-[52px] md:w-[166px]"
                    >
                      <Image
                        src={store.icon}
                        alt={store.label}
                        fill
                        sizes="166px"
                        className="object-contain p-2"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <Skyline />
      </main>

      <Footer />
      <StickyBar />
    </>
  );
}
