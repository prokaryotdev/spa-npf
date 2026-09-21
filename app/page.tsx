import Image from "next/image";
import Link from "./i18n/Link";
import CardRail from "./components/CardRail";
import Domains from "./components/Domains";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { ArrowRight } from "./components/icons";
import InitiativeCard from "./components/InitiativeCard";
import Pillars from "./components/Pillars";
import Skyline from "./components/Skyline";
import StickyBar from "./components/StickyBar";
import { getT, getLocalized } from "./i18n/server";
import {
  appStores as appStoresSource,
  community as communitySource,
  quickServices as quickServicesSource,
  smartPoliceStations as smartPoliceStationsSource,
  smartPolicing as smartPolicingSource,
} from "./content";

export default async function Home() {
  const appStores = await getLocalized(appStoresSource);
  const community = await getLocalized(communitySource);
  const quickServices = await getLocalized(quickServicesSource);
  const smartPoliceStations = await getLocalized(smartPoliceStationsSource);
  const smartPolicing = await getLocalized(smartPolicingSource);
  const t = await getT();
  return (
    <>
      <Header />

      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />

        {/* Four routes into the service catalogue, riding the seam below the hero. */}
        <section
          aria-labelledby="quick-services"
          className="relative z-10 -mt-px bg-[linear-gradient(to_bottom,#000_0%,#020407_28%,#04070e_58%,#060b16_100%)] pb-px"
        >
          <h2 id="quick-services" className="sr-only">
            {t("Popular services")}
          </h2>
          <div className="npf-container">
            <div className="grid grid-cols-2 gap-2 pt-4 sm:grid-cols-3 lg:flex lg:pt-9">
              {quickServices.map((service) => (
                <Link
                  key={service.title}
                  href={service.href}
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
                  <span className="mx-auto flex min-h-[42px] max-w-[17ch] items-center justify-center text-center font-secondary text-sm leading-normal font-bold text-npf-ink">
                    {service.title}
                  </span>
                  <span className="mx-auto block max-w-[210px] text-center text-sm text-npf-muted lg:text-base lg:leading-tight">
                    {service.body}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Pillars />

        {/* Leading the Way in Modern Policing.

            Its own surface, not a bloom bleeding down from Pillars: the
            corner-anchored radial read as spill from the section above, and a
            flat tint separates the two chapters without a decoration. */}
        <section
          aria-labelledby="smart-policing"
          className="relative overflow-hidden border-t border-npf-blue/[0.08] bg-[#f4f7fb] pt-[70px] pb-16 lg:py-[150px]"
        >
          <div className="npf-container relative z-10">
            {/* Heading and lede sit side by side from lg up: the heading alone
                left a half-empty band across the widest breakpoints. */}
            <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
              <h2
                id="smart-policing"
                data-reveal
                className="font-secondary text-4xl leading-[1.05] font-bold tracking-[-0.02em] text-balance text-npf-blue-deep md:max-w-[16ch] lg:text-7xl 2xl:text-8xl"
              >
                {t("Leading the Way in Modern Policing")}
              </h2>
              <div
                data-reveal
                style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
                className="max-w-[568px] lg:max-w-[26rem] lg:shrink-0 lg:pb-3"
              >
                <p className="text-sm leading-relaxed text-neutral-700 md:text-xl">
                  {t(
                    "We harness intelligent technologies to keep public safety responsive, smart, and always one step ahead.",
                  )}
                </p>
                <Link
                  href="/app/services"
                  className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-npf-blue transition-colors hover:text-npf-blue-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-npf-blue"
                >
                  {t("Browse all services")}
                  <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-custom)] group-hover:translate-x-1 rtl:-scale-x-100" />
                </Link>
              </div>
            </header>

            <CardRail label={t("modern policing")} className="mt-10 md:hidden">
              {smartPolicing.map((card) => (
                <InitiativeCard
                  key={card.title}
                  card={card}
                  className="w-[84vw] max-w-[420px] shrink-0"
                />
              ))}
            </CardRail>

            <div className="mt-12 hidden grid-cols-2 gap-6 md:mt-20 md:grid md:gap-8 lg:gap-12">
              {smartPolicing.map((card, i) => (
                <div
                  key={card.title}
                  data-reveal
                  style={
                    { "--reveal-delay": `${i * 110}ms` } as React.CSSProperties
                  }
                  className={card.wide ? "col-span-2" : undefined}
                >
                  <InitiativeCard
                    card={card}
                    shape={card.wide ? "wide" : "square"}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <Domains />

        {/* Divisional Police Stations */}
        <section
          aria-labelledby="sps"
          className="relative overflow-hidden border-t border-npf-blue/[0.08] bg-white pt-[70px] pb-16 lg:py-[150px]"
        >
          <div className="npf-container relative z-10">
            <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
              <h2
                id="sps"
                data-reveal
                className="font-secondary text-4xl leading-[1.05] font-bold tracking-[-0.02em] text-balance text-npf-blue-deep md:max-w-[16ch] lg:text-7xl 2xl:text-8xl"
              >
                {t("Divisional Police Stations")}
              </h2>
              <p
                data-reveal
                style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
                className="max-w-[568px] text-sm leading-relaxed text-neutral-700 md:text-xl lg:max-w-[26rem] lg:shrink-0 lg:pb-3"
              >
                {t(
                  "Area Commands, Divisions and Posts: close by, always open, and staffed around the clock.",
                )}
              </p>
            </header>
            <CardRail label={t("SPS")} className="mt-12 md:mt-20">
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
          className="relative overflow-hidden border-t border-npf-blue/[0.08] bg-[#f4f7fb] pt-[70px] pb-16 lg:py-[150px]"
        >
          <div className="npf-container relative z-10">
            <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
              <h2
                id="community"
                data-reveal
                className="font-secondary text-4xl leading-[1.05] font-bold tracking-[-0.02em] text-balance text-npf-blue-deep md:max-w-[16ch] lg:text-7xl 2xl:text-8xl"
              >
                {t("Shaping the Future, Side by Side")}
              </h2>
              <p
                data-reveal
                style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
                className="max-w-[568px] text-sm leading-relaxed text-neutral-700 md:text-xl lg:max-w-[26rem] lg:shrink-0 lg:pb-3"
              >
                {t(
                  "Bringing communities together through education, cultural heritage, volunteer service, and dedicated support.",
                )}
              </p>
            </header>

            <CardRail label={t("community")} className="mt-12 md:hidden">
              {community.map((card) => (
                <InitiativeCard
                  key={card.title}
                  card={card}
                  className="w-[84vw] max-w-[420px] shrink-0"
                />
              ))}
            </CardRail>

            <div className="mt-12 hidden grid-cols-2 gap-8 md:mt-20 md:grid md:gap-8 lg:gap-12">
              {community.map((card, i) => (
                <div
                  key={card.title}
                  data-reveal
                  style={
                    {
                      "--reveal-delay": `${(i % 2) * 110}ms`,
                    } as React.CSSProperties
                  }
                  className={card.wide ? "col-span-2" : undefined}
                >
                  <InitiativeCard
                    card={card}
                    shape={card.wide ? "wide" : "square"}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App download */}
        <section
          aria-labelledby="app"
          className="relative flex items-center overflow-hidden bg-npf-blue-deep py-16 text-white md:min-h-screen md:py-[120px] 2xl:py-[150px]"
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
            className="pointer-events-none absolute top-0 -right-[25%] block aspect-square w-[50%] -translate-y-1/2 rounded-full bg-[radial-gradient(#2a8fe5ba_-20%,#2a8fe524_40%,transparent_68%)] opacity-65"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-0 -left-[25%] block aspect-square w-[70%] translate-y-1/2 rounded-full bg-[radial-gradient(#2a8fe5ba_-20%,#2a8fe524_40%,transparent_68%)] opacity-65"
          />

          <div className="npf-container relative z-10 max-w-[1276px] text-center">
            <h2
              id="app"
              data-reveal
              className="mx-auto max-w-[1100px] font-secondary text-3xl leading-tight font-bold lg:text-7xl"
            >
              {t("Download the Nigeria Police Force App")}
            </h2>
            <p
              data-reveal
              className="mx-auto mt-4 max-w-5xl font-secondary text-lg font-bold md:mt-6 md:text-3xl"
            >
              {t("Services, updates, and alerts: right in your pocket.")}
            </p>
            <div data-reveal className="mt-10 lg:mt-16">
              <h3 className="mb-4 font-secondary text-sm font-bold md:text-3xl">
                {t("Available on")}
              </h3>
              <ul className="flex flex-wrap justify-center gap-2 md:gap-3">
                {appStores.map((store) => (
                  <li key={store.label}>
                    <a
                      href="https://fct.npf.gov.ng/"
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
