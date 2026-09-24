import Image from "next/image";
import Link from "./i18n/Link";
import Domains from "./components/Domains";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import {
  ArrowRight,
  BellIcon,
  FileIcon,
  InboxIcon,
  PhoneCallIcon,
  ServicesIcon,
  ShieldIcon,
  UserCircle,
} from "./components/icons";
import { PoliceWordmark } from "./components/Wordmark";
import ModernPolicing from "./components/ModernPolicing";
import Pillars from "./components/Pillars";
import Community from "./components/Community";
import Stations from "./components/Stations";
import { getT, getLocalized } from "./i18n/server";
import {
  community as communitySource,
  quickServices as quickServicesSource,
  smartPoliceStations as smartPoliceStationsSource,
  smartPolicing as smartPolicingSource,
  storeBadges as storeBadgesSource,
} from "./content";

/** Space between a section head and the cards under it, the same everywhere. */
const BODY_GAP = "mt-10 md:mt-16";

/**
 * The head every light homepage chapter opens with: display heading on the
 * start side, lede on the end side from lg up (the heading alone left a
 * half-empty band across the widest breakpoints).
 */
function SectionHead({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
      <h2
        id={id}
        data-reveal
        className="npf-h2 text-npf-blue-deep md:max-w-[16ch]"
      >
        {title}
      </h2>
      <div
        data-reveal
        style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
        className="max-w-[568px] lg:max-w-[26rem] lg:shrink-0 lg:pb-3"
      >
        <p className="text-base leading-relaxed text-npf-body md:text-lg">
          {lede}
        </p>
        {children}
      </div>
    </header>
  );
}

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
          className="relative z-10 -mt-px bg-[linear-gradient(to_bottom,#000,var(--color-npf-night))] pb-px"
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
            corner-anchored radial read as spill from the section above, so
            the ground here starts pale and only deepens toward the tiles. */}
        <section
          aria-labelledby="smart-policing"
          className="npf-section relative overflow-hidden border-t border-npf-blue/[0.08] bg-[linear-gradient(180deg,#f6f8fc_0%,#edf2f9_55%,#e6edf7_100%)]"
        >
          {/* The brand rings from Pillars and the app band, faint and pooled
              in the bottom end corner behind the tiles, and a cool glow under the
              tiles so they sit in light rather than on a flat tint. */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-[70%] w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(44,95,168,0.16),transparent)] blur-2xl"
          />
          {[560, 860, 1160].map((size) => (
            <span
              key={size}
              aria-hidden
              className="pointer-events-none absolute end-0 bottom-0 hidden aspect-square translate-x-1/2 translate-y-1/2 rounded-full border border-npf-blue/[0.08] md:block rtl:-translate-x-1/2"
              style={{ width: size }}
            />
          ))}
          <div className="npf-container relative z-10">
            <SectionHead
              id="smart-policing"
              title={t("Leading the Way in Modern Policing")}
              lede={t(
                "We harness intelligent technologies to keep public safety responsive, smart, and always one step ahead.",
              )}
            >
              <Link
                href="/app/services"
                className="group mt-5 inline-flex items-center gap-3 rounded-full bg-npf-blue py-2 ps-6 pe-2 font-secondary font-bold text-white transition-[background-color,scale] duration-200 hover:bg-npf-blue-deep active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-npf-blue"
              >
                {t("Browse all services")}
                <span className="grid size-10 place-items-center rounded-full bg-white text-npf-blue transition-transform duration-300 ease-[var(--ease-custom)] group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1">
                  <ArrowRight className="size-[18px]" />
                </span>
              </Link>
            </SectionHead>

            <div className={BODY_GAP}>
              <ModernPolicing items={smartPolicing} />
            </div>
          </div>
        </section>

        <Domains />

        {/* Divisional Police Stations. No hairline on top: coming out of the
            night-blue Domains chapter, the change of ground is the divider.
            The tiers run as one row that its arrows move; the way out
            sits under the lede so it is seen before the rail, not after. */}
        <Stations
          id="sps"
          tiers={smartPoliceStations}
          head={
            <SectionHead
              id="sps"
              title={t("Divisional Police Stations")}
              lede={t(
                "Area Commands, Divisions and Posts: close by, always open, and staffed around the clock.",
              )}
            >
              <Link
                href="/app/home/customer-centers"
                className="group mt-7 inline-flex items-center gap-3 rounded-full bg-npf-blue py-2 ps-6 pe-2 font-secondary font-bold text-white transition-[background-color,scale] duration-200 hover:bg-npf-blue-deep active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-npf-blue"
              >
                {t("Find a station near you")}
                <span className="grid size-10 place-items-center rounded-full bg-white text-npf-blue transition-transform duration-300 ease-[var(--ease-custom)] group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1">
                  <ArrowRight className="size-[18px]" />
                </span>
              </Link>
            </SectionHead>
          }
        />

        {/* Community. The one place the page leaves the cool blues: Modern
            Policing is the technology chapter on mist, this is the people
            and heritage one on sand. */}
        <Community
          id="community"
          items={community}
          head={
            <SectionHead
              id="community"
              title={t("Shaping the Future, Side by Side")}
              lede={t(
                "Bringing communities together through education, cultural heritage, volunteer service, and dedicated support.",
              )}
            />
          }
        />

        {/* App download. Pitch and the store badges first, what you get
            under them; the whole phone on the end side, lit from behind and
            standing on its own shadow so the band has one thing to look at. */}
        <section
          aria-labelledby="app"
          className="npf-section relative isolate overflow-hidden bg-npf-blue text-white"
        >
          {/* A bright band, not a second footer: the Force's own blue, lit from the
              phone's side, with a gold hairline where it meets the footer. */}
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/25" />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-npf-gold-soft" />
          <div className="npf-container relative z-10 grid items-center gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
            <div>
              <h2
                id="app"
                data-reveal
                className="npf-h2 max-w-[15ch] text-balance"
              >
                {t("Download the Nigeria Police Force App")}
              </h2>
              <p
                data-reveal
                style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
                className="mt-5 max-w-[40ch] text-base leading-relaxed text-white/90 md:text-lg"
              >
                {t("Services, updates, and alerts: right in your pocket.")}
              </p>

              <ul
                data-reveal
                style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
                className="mt-8 flex flex-wrap gap-3 md:mt-10"
              >
                {storeBadges.map((badge) => (
                  <li key={badge.label}>
                    <a
                      href="https://fct.npf.gov.ng/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg shadow-[0_10px_24px_-12px_rgba(10,31,68,0.7)] transition-[translate,box-shadow] duration-300 ease-[var(--ease-custom)] hover:-translate-y-0.5 hover:shadow-[0_16px_28px_-12px_rgba(10,31,68,0.8)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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

            <div
              aria-hidden
              data-reveal
              style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
              className="relative mx-auto w-[240px] sm:w-[270px] lg:w-[300px] xl:w-[320px]"
            >
              {/* Light and the brand rings, centred on the phone. */}
              <span className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[240%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.42),rgba(255,255,255,0.1)_50%,transparent)]" />
              {[150, 205, 260].map((size) => (
                <span
                  key={size}
                  className="pointer-events-none absolute top-1/2 left-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.14]"
                  style={{ width: `${size}%` }}
                />
              ))}
              {/* The shadow it stands on. */}
              <span className="pointer-events-none absolute inset-x-[8%] -bottom-8 h-10 rounded-[50%] bg-[#0a1f44]/60 blur-xl" />

              {/* Side buttons. */}
              <span className="absolute top-[17%] -left-[2px] h-7 w-[3px] rounded-s-sm bg-[linear-gradient(90deg,#6b7b92,#2c3a4e)]" />
              <span className="absolute top-[23%] -left-[2px] h-12 w-[3px] rounded-s-sm bg-[linear-gradient(90deg,#6b7b92,#2c3a4e)]" />
              <span className="absolute top-[31%] -left-[2px] h-12 w-[3px] rounded-s-sm bg-[linear-gradient(90deg,#6b7b92,#2c3a4e)]" />
              <span className="absolute top-[26%] -right-[2px] h-20 w-[3px] rounded-e-sm bg-[linear-gradient(270deg,#6b7b92,#2c3a4e)]" />

              {/* Black glass in a thin metal band: the band is an inset ring,
                  so the phone's edge catches light instead of reading grey. */}
              <div className="relative rounded-[3.4rem] bg-[#05080f] p-[11px] shadow-[inset_0_0_0_1.5px_#5d6d84,inset_0_0_0_3px_#0b111c,0_50px_90px_-30px_rgba(5,15,40,0.9),0_18px_36px_-18px_rgba(5,15,40,0.6)]">
                {/* The capture's own ratio, so its headline and controls are
                    never cropped off the bottom of the screen. */}
                <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.65rem] bg-[#0d1524]">
                  {/* Status bar, in the app header's blue. */}
                  <div className="absolute inset-x-0 top-0 z-20 flex h-[42px] items-center justify-between px-[11%] text-xs sm:text-[13px] font-semibold tabular-nums">
                    <span>9:41</span>
                    <span className="flex items-center gap-1.5">
                      <svg
                        viewBox="0 0 17 11"
                        className="h-2.5 w-auto fill-white"
                      >
                        <rect x="0" y="7" width="3" height="4" rx="0.7" />
                        <rect x="4.5" y="5" width="3" height="6" rx="0.7" />
                        <rect x="9" y="2.5" width="3" height="8.5" rx="0.7" />
                        <rect x="13.5" y="0" width="3" height="11" rx="0.7" />
                      </svg>
                      <svg viewBox="0 0 26 12" className="h-3 w-auto">
                        <rect
                          x="0.5"
                          y="0.5"
                          width="22"
                          height="11"
                          rx="3"
                          fill="none"
                          stroke="white"
                          strokeOpacity="0.4"
                        />
                        <rect
                          x="2"
                          y="2"
                          width="16"
                          height="8"
                          rx="1.6"
                          fill="white"
                        />
                        <rect
                          x="23.8"
                          y="4"
                          width="1.6"
                          height="4"
                          rx="0.8"
                          fill="white"
                          fillOpacity="0.4"
                        />
                      </svg>
                    </span>
                  </div>
                  <span className="absolute top-2 left-1/2 z-10 h-[26px] w-[32%] -translate-x-1/2 rounded-full bg-black" />

                  {/* The app's home screen, drawn rather than captured: the
                      site's own services, 112 and account tabs. Sized in
                      container units so it reads the same at every phone width. */}
                  <div className="absolute inset-0 flex flex-col bg-[#f2f5fa] text-npf-ink @container">
                    <div className="bg-npf-blue px-[6cqw] pt-[calc(42px+3cqw)] pb-[12cqw] text-white">
                      <div className="flex items-center justify-between">
                        <PoliceWordmark className="h-[10cqw]" />
                        <span className="grid size-[9cqw] place-items-center rounded-full bg-white/12">
                          <BellIcon className="size-[4.6cqw]" />
                        </span>
                      </div>
                      <p className="mt-[6cqw] font-secondary text-[6.6cqw] leading-tight font-bold tracking-[-0.02em]">
                        {t("How can we help?")}
                      </p>
                    </div>

                    <div className="-mt-[7cqw] flex flex-1 flex-col gap-[4cqw] px-[5cqw]">
                      <div className="flex items-center justify-between rounded-[4cqw] bg-[#b30900] px-[5cqw] py-[3.6cqw] text-white shadow-[0_3cqw_6cqw_-3cqw_rgba(120,6,0,0.6)]">
                        <span className="flex flex-col">
                          <span className="text-[3.3cqw] font-semibold text-white/85">
                            {t("Emergency")}
                          </span>
                          <span className="font-secondary text-[8.4cqw] leading-none font-bold tabular-nums">
                            112
                          </span>
                        </span>
                        <span className="grid size-[11cqw] place-items-center rounded-full bg-white text-[#b30900]">
                          <PhoneCallIcon className="size-[5.4cqw]" />
                        </span>
                      </div>

                      <div>
                        <div className="flex items-baseline justify-between">
                          <span className="font-secondary text-[4cqw] font-bold">
                            {t("Services")}
                          </span>
                          <span className="text-[3cqw] font-semibold text-npf-blue-mid">
                            {t("See all")}
                          </span>
                        </div>
                        <ul className="mt-[2.6cqw] grid grid-cols-2 gap-[2.6cqw]">
                          {quickServices.slice(0, 4).map((service) => (
                            <li
                              key={service.title}
                              className="flex flex-col gap-[2cqw] rounded-[3.4cqw] bg-white p-[3.2cqw] shadow-[0_1cqw_3cqw_-1cqw_rgba(27,63,122,0.18)]"
                            >
                              <span className="relative block size-[9cqw]">
                                <Image
                                  src={service.icon}
                                  alt=""
                                  fill
                                  sizes="32px"
                                  className="object-contain"
                                />
                              </span>
                              <span className="line-clamp-2 min-h-[2lh] text-[3.1cqw] leading-snug font-bold">
                                {service.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="relative h-[26cqw] overflow-hidden rounded-[3.4cqw] bg-npf-night">
                        <Image
                          src="/npf/hero/fleet.jpg"
                          alt=""
                          fill
                          sizes="300px"
                          className="object-cover"
                        />
                        <span className="absolute inset-0 flex flex-col justify-end bg-[linear-gradient(to_top,rgba(10,21,38,0.9),transparent_70%)] p-[3.2cqw] text-white">
                          <span className="text-[2.6cqw] font-semibold text-npf-gold-soft">
                            {t("News")}
                          </span>
                          <span className="font-secondary text-[3.6cqw] leading-tight font-bold">
                            {t("Ready on Every Road")}
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center gap-[3cqw] rounded-[3.4cqw] bg-white p-[3.2cqw] shadow-[0_1cqw_3cqw_-1cqw_rgba(27,63,122,0.18)]">
                        <span className="grid size-[9cqw] shrink-0 place-items-center rounded-[2.4cqw] bg-npf-blue/10 text-npf-blue">
                          <FileIcon className="size-[4.8cqw]" />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="text-[2.7cqw] text-npf-muted">
                            {t("Your request")}
                          </span>
                          <span className="truncate text-[3.2cqw] font-bold">
                            {t("Certificate application")}
                          </span>
                        </span>
                        <span className="rounded-full bg-[#fdf3d7] px-[2.4cqw] py-[0.8cqw] text-[2.6cqw] font-semibold text-npf-gold">
                          {t("In review")}
                        </span>
                      </div>
                    </div>

                    {/* Tab bar, clear of the home indicator. */}
                    <nav className="grid grid-cols-4 border-t border-npf-ink/8 bg-white px-[3cqw] pt-[2.6cqw] pb-[7cqw] text-[2.5cqw] font-semibold text-npf-muted">
                      {[
                        { label: t("Home"), Icon: ShieldIcon, on: true },
                        { label: t("Services"), Icon: ServicesIcon },
                        { label: t("Requests"), Icon: InboxIcon },
                        { label: t("Profile"), Icon: UserCircle },
                      ].map(({ label, Icon, on }) => (
                        <span
                          key={label}
                          className={`flex flex-col items-center gap-[1cqw] ${on ? "text-npf-blue" : ""}`}
                        >
                          <Icon className="size-[5.4cqw]" />
                          {label}
                        </span>
                      ))}
                    </nav>
                  </div>

                  {/* Home indicator. */}
                  <span className="absolute bottom-2 left-1/2 z-10 h-1 w-[36%] -translate-x-1/2 rounded-full bg-npf-ink/80" />
                  {/* Glass. */}
                  <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08)_0%,transparent_30%)]" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
