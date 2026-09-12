import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import InitiativeCard from "./components/InitiativeCard";
import StickyBar from "./components/StickyBar";
import { ArrowRight } from "./components/icons";
import {
  appStores,
  careers,
  community,
  domains,
  pillars,
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

        {/* Smart / Secure / Together */}
        <section
          aria-labelledby="pillars"
          className="relative overflow-hidden bg-white py-24 lg:py-[150px]"
        >
          <div className={`${bloom} bottom-0 left-0 h-80 w-56 -translate-x-1/2 translate-y-1/2 opacity-70 md:size-[1200px] md:opacity-60`} />
          <div className={`${bloom} top-1/2 right-0 h-72 w-56 translate-x-1/2 -translate-y-1/2 opacity-70 md:top-0 md:size-[1200px] md:opacity-60`} />

          <div className="dp-container relative">
            <div className="grid items-center gap-14 lg:grid-cols-12">
              <div className="order-2 lg:order-1 lg:col-span-7">
                <h2 id="pillars" className="sr-only">
                  Smart, Secure, Together
                </h2>
                <ul className="space-y-6 text-center md:text-left">
                  {pillars.map((pillar, i) => (
                    <li
                      key={pillar.word}
                      data-reveal
                      style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
                    >
                      <p className="font-secondary text-5xl leading-[1.1] font-bold text-dp-green-deep lg:text-8xl 2xl:text-9xl">
                        {pillar.word}
                      </p>
                      <p className="mx-auto max-w-[320px] font-secondary text-base text-neutral-600 md:mx-0 md:max-w-none md:font-light lg:text-2xl">
                        {pillar.line}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-1 lg:order-2 lg:col-span-5">
                <div className="relative mx-auto aspect-square w-full max-w-[560px]">
                  <Image
                    src="/img/assets-home/static/ring12.svg"
                    alt=""
                    fill
                    sizes="560px"
                    className="animate-[spin_60s_linear_infinite] object-contain opacity-70 motion-reduce:animate-none"
                  />
                  {pillars.map((pillar, i) => (
                    <span
                      key={pillar.portrait}
                      data-portrait={i + 1}
                      className="absolute inset-[9%] overflow-hidden rounded-full"
                    >
                      <Image
                        src={pillar.portrait}
                        alt=""
                        fill
                        sizes="480px"
                        className="object-contain"
                      />
                    </span>
                  ))}
                </div>
                <div
                  data-reveal
                  className="mx-auto mt-8 max-w-[450px] text-center md:text-left"
                >
                  <p className="mb-5 font-secondary text-lg font-bold text-[#414651] md:mb-8 md:text-3xl md:leading-10">
                    Together, We Build a Smart and Secure Dubai
                  </p>
                  <p className="font-secondary text-sm font-bold text-[#313a35] lg:text-xl">
                    With you, For you. Protecting, Connecting, and Innovating.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

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

            <div className="dp-rail mt-10 flex gap-6 overflow-x-auto pb-6 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
              {smartPolicing.map((card, i) => (
                <div
                  key={card.title}
                  data-reveal
                  style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
                  className="w-[84vw] max-w-[420px] shrink-0 md:w-auto md:max-w-none"
                >
                  <InitiativeCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sea, land and sky */}
        <section aria-labelledby="domains" className="bg-black">
          <h2 id="domains" className="sr-only">
            Protection across sea, land and sky
          </h2>
          {domains.map((domain) => (
            <div
              key={domain.id}
              className="relative flex min-h-[92svh] items-end overflow-hidden"
            >
              <Image
                src={domain.background}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.08)_40%,rgba(0,0,0,0.7)_100%)]"
              />
              {/* The vehicle holds the right half so the copy keeps a clear column. */}
              <div className="absolute inset-y-0 right-0 w-full md:w-[62%]">
                <Image
                  src={domain.subject}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 62vw"
                  className="object-contain object-bottom md:object-right-bottom"
                />
              </div>
              <span
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(100deg,rgba(3,12,9,0.94)_0%,rgba(3,12,9,0.78)_34%,rgba(3,12,9,0.12)_66%,transparent_82%)]"
              />

              <div className="dp-container relative z-10 pt-40 pb-24">
                <div className="max-w-[620px]" data-reveal>
                  <h3 className="mb-4 max-w-[15ch] font-secondary text-4xl leading-none font-bold text-white sm:text-5xl">
                    {domain.title}
                  </h3>
                  {domain.lead ? (
                    <p className="mb-3 font-secondary text-lg font-bold text-white md:text-2xl">
                      {domain.lead}
                    </p>
                  ) : null}
                  <p className="text-base text-white/85 md:text-lg">
                    {domain.body}
                  </p>
                  <ul className="mt-7 flex flex-wrap gap-3">
                    {domain.chips.map((chip) => (
                      <li key={chip.label}>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
                        >
                          <span className="relative size-5 shrink-0">
                            <Image
                              src={chip.icon}
                              alt=""
                              fill
                              sizes="20px"
                              className="object-contain"
                            />
                          </span>
                          {chip.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </section>

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

            <div className="dp-rail mt-10 flex gap-6 overflow-x-auto pb-6">
              {smartPoliceStations.map((card) => (
                <InitiativeCard
                  key={card.title}
                  card={card}
                  className="w-[84vw] max-w-[420px] shrink-0 md:w-[440px] md:max-w-none lg:w-[520px]"
                />
              ))}
            </div>
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

            <div className="dp-rail mt-10 flex gap-6 overflow-x-auto pb-6">
              {community.map((card) => (
                <InitiativeCard
                  key={card.title}
                  card={card}
                  className="w-[84vw] max-w-[420px] shrink-0 md:w-[440px] md:max-w-none lg:w-[520px]"
                />
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
                  src="/cms/images_479d38045b.jpg"
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

        {/* Careers */}
        <section
          aria-labelledby="careers"
          className="relative overflow-hidden bg-white py-24 lg:py-[150px]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute top-12 left-0 w-full overflow-hidden [contain:paint]"
          >
            <div className="flex w-max animate-marquee whitespace-nowrap motion-reduce:animate-none">
              {[0, 1].map((n) => (
                <span
                  key={n}
                  className="px-6 font-secondary text-[18vw] leading-none font-bold text-transparent"
                  style={{ WebkitTextStroke: "1px rgba(4,120,87,0.18)" }}
                >
                  Dubai Police · Dubai Police ·
                </span>
              ))}
            </div>
          </div>

          <div className="dp-container relative z-10">
            <h2 id="careers" className="sr-only">
              Careers at Dubai Police
            </h2>
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
              {careers.map((job) => (
                <div key={job.title} className="flex flex-col gap-8" data-reveal>
                  <div className="relative aspect-[575/500] w-full overflow-hidden rounded-3xl bg-black md:rounded-[48px]">
                    <Image
                      src={job.image}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 92vw, 46vw"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="mb-5 font-secondary text-3xl font-bold text-dp-green-deep sm:text-5xl lg:text-6xl">
                      {job.title}
                    </h3>
                    {job.lead ? (
                      <p className="mb-2 max-w-[500px] font-secondary text-lg leading-snug font-bold text-[#233234] lg:text-3xl">
                        {job.lead}
                      </p>
                    ) : null}
                    <p className="font-secondary text-lg leading-snug font-bold text-[#233234] lg:text-2xl">
                      {job.bodyBefore}
                      <a
                        href={job.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dp-green-deep underline underline-offset-4 transition-colors hover:text-dp-green"
                      >
                        {job.linkLabel}
                        <span className="sr-only"> (opens in a new window)</span>
                      </a>
                      {job.bodyAfter}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

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

        {/* Skyline finale */}
        <section
          aria-labelledby="finale"
          className="relative min-h-[70vh] overflow-hidden bg-[#081e16] px-4 py-[150px] text-white md:min-h-screen"
        >
          <div className="absolute top-0 left-0 h-[82%] w-full bg-[#081612]">
            <Image
              src="/img/assets-home/static/smart/Sky-2.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="absolute bottom-0 left-0 w-full">
            <h2
              id="finale"
              className="absolute bottom-[41%] z-10 w-full text-center font-secondary text-[21vw] leading-[0.76] font-bold tracking-[-0.05em] uppercase md:text-[11vw]"
            >
              <span className="sr-only">Smart, Secure, Together</span>
              <span aria-hidden className="block overflow-hidden">
                <span className="block bg-gradient-to-b from-[#B7FCDF] to-[#8CD1B4] bg-clip-text text-transparent">
                  Smart
                </span>
              </span>
              <span aria-hidden className="block overflow-hidden">
                <span className="block bg-gradient-to-b from-[#8CD1B4] to-[#478E70] bg-clip-text text-transparent">
                  Secure
                </span>
              </span>
              <span aria-hidden className="block overflow-hidden">
                <span className="block bg-gradient-to-b from-[#478E70] to-[#196042] bg-clip-text text-transparent">
                  Together
                </span>
              </span>
            </h2>

            <div className="absolute bottom-[42%] left-[47.4%] z-20 w-[9.5%] sm:left-[49.4%] sm:w-[4.5%]">
              <Image
                src="/img/assets-home/static/smart/khalifa.webp"
                alt=""
                width={50}
                height={385}
                className="h-auto w-full"
              />
            </div>

            <div className="relative aspect-[3840/3096] w-full sm:aspect-[3840/1446]">
              <Image
                src="/img/dashboard/CItyBGFinal.png"
                alt="The Dubai skyline at dusk"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>

            <div className="absolute bottom-[29%] left-[61%] z-20 w-[33%] sm:bottom-[21%] sm:w-[24%]">
              <Image
                src="/img/assets-home/static/smart/Boat.webp"
                alt=""
                width={305}
                height={170}
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className="absolute bottom-[14%] -left-[10%] z-20 w-[60%] sm:bottom-[4%] sm:left-0 sm:w-[49%]">
            <Image
              src="/img/assets-home/static/smart/Ghiath.webp"
              alt=""
              width={305}
              height={119}
              className="h-auto w-full"
            />
          </div>

          <div className="absolute bottom-[82%] left-[43%] z-20 w-[14%]">
            <Image
              src="/img/assets-home/static/smart/Drone.webp"
              alt=""
              width={475}
              height={170}
              className="h-auto w-full"
            />
          </div>
        </section>
      </main>

      <Footer />
      <StickyBar />
    </>
  );
}
