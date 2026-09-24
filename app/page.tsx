import Image from "next/image";
import Link from "./i18n/Link";
import AppPreview from "./components/AppPreview";
import Community from "./components/Community";
import Domains from "./components/Domains";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import {
  ArrowRight,
  FileIcon,
  InboxIcon,
  PhoneCallIcon,
} from "./components/icons";
import ModernPolicing from "./components/ModernPolicing";
import Pillars from "./components/Pillars";
import RevealObserver from "./components/RevealObserver";
import { reveal } from "./components/reveal";
import Stations from "./components/Stations";
import { getT, getLocalized } from "./i18n/server";
import {
  community as communitySource,
  quickServices as quickServicesSource,
  smartPoliceStations as smartPoliceStationsSource,
  smartPolicing as smartPolicingSource,
  storeBadges as storeBadgesSource,
} from "./content";

/**
 * The head every light chapter opens with: the heading on the start side,
 * the lede and the chapter's one action on the end side from lg up, so the
 * widest screens have no half-empty band beside a lone heading.
 */
function SectionHead({
  id,
  title,
  lede,
  action,
}: {
  id: string;
  title: string;
  lede: string;
  action?: { href: string; label: string };
}) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
      <h2 id={id} {...reveal()} className="npf-h2 text-npf-blue-deep md:max-w-[16ch]">
        {title}
      </h2>
      <div {...reveal(1)} className="max-w-[36rem] lg:max-w-[26rem] lg:shrink-0 lg:pb-2">
        <p className="npf-lede text-npf-body">{lede}</p>
        {action ? (
          <Link href={action.href} className="npf-btn npf-btn-primary mt-6">
            {action.label}
            <span className="npf-btn-disc">
              <ArrowRight className="npf-arrow size-[18px] rtl:-scale-x-100" />
            </span>
          </Link>
        ) : null}
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

  const appPerks = [
    { Icon: PhoneCallIcon, label: t("Call 112 in one tap") },
    { Icon: FileIcon, label: t("Apply for certificates and permits") },
    { Icon: InboxIcon, label: t("Follow every request to the end") },
  ];

  return (
    <>
      <Header />
      <RevealObserver />

      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />

        {/* The five ways in, on the dark seam under the hero, so the first
            thing past the photograph is what you came to do. Wide screens stand
            them on the floor with square feet, tabs rising out of the white
            page below. */}
        <section
          aria-labelledby="quick-services"
          className="relative -mt-px bg-linear-to-b from-black to-npf-night pt-2 pb-(--npf-head-gap) lg:pb-0"
        >
          <h2 id="quick-services" className="sr-only">
            {t("Popular services")}
          </h2>
          <ul className="npf-container grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-2">
            {quickServices.map((service, i) => (
              <li
                key={service.title}
                {...reveal(i)}
                className="grid last:col-span-2 sm:last:col-span-1"
              >
                <Link
                  href={service.href}
                  className="npf-card group flex flex-col items-center px-4 pt-6 pb-5 text-center focus-visible:outline-offset-4 focus-visible:outline-npf-gold-soft md:px-5 md:pt-7 md:pb-6 lg:min-h-[242px] lg:rounded-b-none lg:pt-8 lg:pb-10 lg:shadow-none"
                >
                  <span className="relative block size-14 shrink-0 transition-[scale] duration-(--dur-hover) ease-(--ease-out) group-hover:scale-110">
                    <Image
                      src={service.icon}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-contain"
                    />
                  </span>
                  {/* Two lines tall whatever the title (three on the narrow five-up
                      row, where the longest title needs it), so a one-line title and
                      a two-line one start their text on the same line. */}
                  <span className="npf-h5 mt-4 flex min-h-[2lh] items-center lg:max-[1400px]:min-h-[3lh] justify-center text-balance text-npf-ink">
                    {service.title}
                  </span>
                  <span className="npf-small mt-2 hidden max-w-[24ch] text-pretty text-npf-steel sm:block">
                    {service.body}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Pillars />

        {/* The online services. White flows down from the pillars into a
            pale mist, so the two chapters read as one page, not two blocks. */}
        <section
          aria-labelledby="smart-policing"
          className="npf-section relative overflow-hidden bg-linear-to-b from-white to-npf-mist"
        >
          {/* The brand rings from the app band, faint and pooled in the
              bottom end corner behind the tiles, and a cool glow under the
              tiles so they sit in light rather than on a flat tint. */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-[70%] w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-npf-blue-mid)_14%,transparent),transparent)]"
          />
          {[560, 860, 1160].map((size) => (
            <span
              key={size}
              aria-hidden
              className="pointer-events-none absolute end-0 bottom-0 hidden aspect-square translate-x-1/2 translate-y-1/2 rounded-full border border-npf-blue/[0.08] md:block"
              style={{ width: size }}
            />
          ))}
          <div className="npf-container relative">
            <SectionHead
              id="smart-policing"
              title={t("Get help online, without the queue")}
              lede={t(
                "Report cybercrime, recover lost property and share security information from your phone or computer.",
              )}
              action={{ href: "/app/services", label: t("Browse all services") }}
            />
            <div className="mt-(--npf-head-gap)">
              <ModernPolicing items={smartPolicing} />
            </div>
          </div>
        </section>

        <Domains />

        {/* Out of the night-blue sea, land and sky chapter, the change of
            ground is the divider. */}
        <Stations
          id="sps"
          tiers={smartPoliceStations}
          head={
            <SectionHead
              id="sps"
              title={t("A station close to you")}
              lede={t(
                "From Command Headquarters in Garki to posts in the rural wards, every station takes reports and is staffed around the clock.",
              )}
              action={{
                href: "/app/home/customer-centers",
                label: t("Find a station near you"),
              }}
            />
          }
        />

        {/* The people chapter: the one place the page leaves the cool blues
            for the crest's gold, thinned to sand. */}
        <Community
          id="community"
          items={community}
          head={
            <SectionHead
              id="community"
              title={t("Policing with the community, not just for it")}
              lede={t(
                "Committees, volunteers, schools, sport and heritage: the ways the Force and the people of the FCT work side by side.",
              )}
            />
          }
        />

        {/* The app. The pitch, what it does and the stores on the start side;
            the phone on the end side, lit from behind, so the band has one
            thing to look at. A gold seam hands over to the white footer. */}
        <section
          aria-labelledby="app"
          className="npf-section relative isolate overflow-hidden bg-npf-blue text-white"
        >
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-npf-gold-soft" />
          <div className="npf-container relative grid items-center gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
            <div>
              <h2 id="app" {...reveal()} className="npf-h2 max-w-[15ch]">
                {t("The Nigeria Police Force, in your pocket")}
              </h2>
              <p {...reveal(1)} className="npf-lede mt-5 max-w-[40ch] text-white/85">
                {t(
                  "Call 112, apply for certificates and follow your requests, all from one app.",
                )}
              </p>

              <ul {...reveal(2)} className="mt-8 flex flex-col gap-4">
                {appPerks.map(({ Icon, label }) => (
                  <li key={label} className="npf-body flex items-center gap-3 font-medium">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/12 text-npf-gold-soft">
                      <Icon className="size-[18px]" />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>

              <ul {...reveal(3)} className="mt-10 flex flex-wrap gap-3">
                {storeBadges.map((badge) => (
                  <li key={badge.label}>
                    <a
                      href="https://fct.npf.gov.ng/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-chip shadow-card transition-[translate] hover:-translate-y-0.5 focus-visible:outline-offset-4 focus-visible:outline-white"
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

            <div {...reveal(2)}>
              <AppPreview services={quickServices} t={t} />
            </div>
          </div>
        </section>
      </main>

      {/* The app band above already offers the stores. */}
      <Footer showApps={false} />
    </>
  );
}
