import Image from "next/image";
import Link from "./i18n/Link";
import CardRail from "./components/CardRail";
import Domains from "./components/Domains";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { AlertIcon, ArrowRight, BellIcon, FileIcon } from "./components/icons";
import InitiativeCard from "./components/InitiativeCard";
import Pillars from "./components/Pillars";
import StickyBar from "./components/StickyBar";
import { getT, getLocalized } from "./i18n/server";
import {
  community as communitySource,
  quickServices as quickServicesSource,
  smartPoliceStations as smartPoliceStationsSource,
  smartPolicing as smartPolicingSource,
  storeBadges as storeBadgesSource,
} from "./content";

export default async function Home() {
  const storeBadges = await getLocalized(storeBadgesSource);
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

        {/* App download. Pitch, what you get, where to get it on the start
            side; the phone on the end side, rising out of the band's floor
            inside the brand rings so the section has one thing to look at. */}
        <section
          aria-labelledby="app"
          className="relative overflow-hidden bg-npf-blue-deep text-white"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute top-0 -right-[20%] block aspect-square w-[70%] -translate-y-1/2 rounded-full bg-[radial-gradient(#2a8fe5ba_-20%,#2a8fe524_40%,transparent_68%)] opacity-60 rtl:right-auto rtl:-left-[20%]"
          />

          <div className="npf-container relative z-10 grid gap-16 pt-20 md:pt-28 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12 lg:pt-0">
            <div className="lg:py-[150px]">
              <h2
                id="app"
                data-reveal
                className="max-w-[15ch] font-secondary text-4xl leading-[1.05] font-bold tracking-[-0.02em] text-balance lg:text-7xl"
              >
                {t("Download the Nigeria Police Force App")}
              </h2>
              <p
                data-reveal
                style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
                className="mt-5 max-w-[40ch] text-base leading-relaxed text-white/80 md:mt-6 md:text-xl md:leading-snug"
              >
                {t("Services, updates, and alerts: right in your pocket.")}
              </p>

              <ul
                data-reveal
                style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
                className="mt-10 max-w-lg divide-y divide-white/10 border-y border-white/10 md:mt-12"
              >
                {[
                  {
                    Icon: FileIcon,
                    title: t("Services"),
                    body: t("Apply, pay, and track your requests."),
                  },
                  {
                    Icon: BellIcon,
                    title: t("Updates"),
                    body: t("News and notices from the FCT Command."),
                  },
                  {
                    Icon: AlertIcon,
                    title: t("Alerts"),
                    body: t("Safety alerts the moment they go out."),
                  },
                ].map(({ Icon, title, body }) => (
                  <li key={title} className="flex items-center gap-4 py-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[0.08] text-[#8cc4f5] ring-1 ring-white/10">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block font-semibold">{title}</span>
                      <span className="block text-sm text-white/70">
                        {body}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <div
                data-reveal
                style={{ "--reveal-delay": "270ms" } as React.CSSProperties}
                className="mt-10 md:mt-12"
              >
                <h3 className="text-sm font-semibold text-white/70">
                  {t("Available on")}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {storeBadges.map((badge) => (
                    <li key={badge.label}>
                      <a
                        href="https://fct.npf.gov.ng/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg transition-transform duration-300 ease-[var(--ease-custom)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                      >
                        <Image
                          src={badge.src}
                          alt={badge.label}
                          width={badge.width}
                          height={40}
                          className="h-12 w-auto"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* The phone overhangs the band's bottom edge and is clipped by
                it, so it reads as rising out of the floor. */}
            <div
              aria-hidden
              data-reveal
              style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
              className="relative mx-auto -mb-44 w-[272px] self-end md:-mb-52 md:w-[320px] lg:-mb-28 lg:w-[360px]"
            >
              <span className="pointer-events-none absolute top-[38%] left-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(#2a8fe566_0%,transparent_62%)]" />
              {[130, 175, 220].map((size) => (
                <span
                  key={size}
                  className="pointer-events-none absolute top-[38%] left-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.09]"
                  style={{ width: `${size}%` }}
                />
              ))}
              <div className="relative rounded-[3rem] bg-[#0a1322] p-2.5 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/15">
                {/* A status-bar strip keeps the notch off the site's own
                    header in the capture. */}
                <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.5rem] bg-black">
                  <div className="absolute inset-x-0 top-10 bottom-0">
                    <Image
                      src="/img/app-preview.png"
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 360px, (min-width: 768px) 320px, 272px"
                      className="object-cover object-top"
                    />
                  </div>
                  <span className="absolute top-2.5 left-1/2 h-6 w-[88px] -translate-x-1/2 rounded-full bg-[#111]" />
                </div>
              </div>
            </div>
          </div>

          {/* Sinks the phone into the floor instead of slicing whatever line
              of the capture happens to sit on the edge. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-32 bg-[linear-gradient(to_top,var(--color-npf-blue-deep)_40%,transparent)] lg:h-48"
          />
        </section>
      </main>

      <Footer />
      <StickyBar />
    </>
  );
}
