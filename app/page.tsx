import Image from "next/image";
import Link from "./i18n/Link";
import Domains from "./components/Domains";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { AlertIcon, ArrowRight, BellIcon, FileIcon } from "./components/icons";
import ModernPolicing from "./components/ModernPolicing";
import Pillars from "./components/Pillars";
import Community from "./components/Community";
import Stations from "./components/Stations";
import StickyBar from "./components/StickyBar";
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
                className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-npf-blue transition-colors hover:text-npf-blue-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-npf-blue"
              >
                {t("Browse all services")}
                <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-custom)] group-hover:translate-x-1 rtl:-scale-x-100" />
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
            The tiers read as one list beside a single photo stage. */}
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
            />
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
          className="npf-section relative overflow-hidden bg-[linear-gradient(180deg,var(--color-npf-blue-deep)_0%,#0f2547_100%)] text-white"
        >
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
                className="mt-5 max-w-[40ch] text-base leading-relaxed text-white/80 md:text-lg"
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
