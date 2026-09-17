import Image from "next/image";
import Link from "../i18n/Link";
import Footer from "./Footer";
import Header from "./Header";
import StickyBar from "./StickyBar";
import { ArrowRight, ChevronRight } from "./icons";
import { getT } from "../i18n/server";

/** Breadcrumb + heading, the frame every inner page opens with. */
export async function PageShell({
  title,
  intro,
  trail = [],
  children,
  solidHeader = true,
  titleSize = "display",
}: {
  title: string;
  intro?: string;
  /** Steps between Home and the current page. */
  trail?: { label: string; href: string }[];
  children: React.ReactNode;
  solidHeader?: boolean;
  /** Long headlines (a news article) need a smaller h1 than a section title. */
  titleSize?: "display" | "article";
}) {
  const t = await getT();
  return (
    <>
      <Header solid={solidHeader} />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <div className="relative overflow-hidden bg-white pt-40 pb-16 md:pt-48">
          <div className="pointer-events-none absolute top-0 end-0 h-80 w-56 translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(#3c78bd66_7%,#22599e33_40%,#22599e00_70%)] opacity-70 md:size-[1000px] md:opacity-60" />

          <div className="npf-container relative">
            <nav aria-label={t("Breadcrumb")} className="mb-6">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-npf-body">
                <li className="flex items-center gap-1">
                  <Link
                    href="/"
                    className="transition-colors hover:text-npf-blue"
                  >
                    {t("Home")}
                  </Link>
                  <ChevronRight aria-hidden className="size-4 opacity-50" />
                </li>
                {trail.map((step) => (
                  <li key={step.href} className="flex items-center gap-1">
                    <Link
                      href={step.href}
                      className="transition-colors hover:text-npf-blue"
                    >
                      {t(step.label)}
                    </Link>
                    <ChevronRight aria-hidden className="size-4 opacity-50" />
                  </li>
                ))}
                <li
                  aria-current="page"
                  className="max-w-[46ch] truncate font-medium text-npf-ink"
                >
                  {t(title)}
                </li>
              </ol>
            </nav>

            <h1
              className={`font-secondary leading-[1.15] font-bold text-npf-blue-deep ${
                titleSize === "article"
                  ? "max-w-[22ch] text-3xl lg:text-5xl"
                  : "text-4xl lg:text-7xl"
              }`}
            >
              {t(title)}
            </h1>
            {intro ? (
              <p className="mt-5 max-w-[70ch] text-base text-neutral-700 md:text-xl">
                {t(intro)}
              </p>
            ) : null}
          </div>
        </div>

        {children}
      </main>
      <Footer />
      <StickyBar />
    </>
  );
}

/** A headed block of service facts. Shared by every service-detail page. */
export function Panel({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 font-secondary text-xl font-bold text-npf-blue-deep md:text-2xl">
        {heading}
      </h2>
      {children}
    </section>
  );
}

/**
 * The tile Open Data and Information are both built from: photo, title, a line
 * of explanation, and a link out.
 */
export async function LinkCard({
  card,
}: {
  card: {
    title: string;
    body: string;
    cta: string;
    image: string;
    href: string;
  };
}) {
  const t = await getT();
  const external = card.href.startsWith("http");
  return (
    <article className="group/card overflow-hidden rounded-3xl bg-white shadow-[0_24px_40px_-28px_rgba(0,60,40,0.5)] ring-1 ring-black/5 transition-transform duration-500 ease-[var(--ease-custom)] md:hover:-translate-y-2">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={card.image}
          alt=""
          fill
          sizes="(max-width: 768px) 92vw, 46vw"
          className="object-cover transition-transform duration-700 ease-[var(--ease-custom)] group-hover/card:scale-105"
        />
      </div>
      <div className="flex flex-col gap-3 p-6 lg:p-8">
        <h2 className="font-secondary text-xl font-bold text-npf-blue-deep md:text-2xl">
          {t(card.title)}
        </h2>
        <p className="text-sm leading-relaxed text-npf-body md:text-base">
          {t(card.body)}
        </p>
        <Link
          href={card.href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="mt-1 inline-flex items-center gap-2 self-start rounded-full bg-npf-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-npf-blue-mid"
        >
          {t(card.cta)}
          <ArrowRight className="size-4" />
          {external ? (
            <span className="sr-only"> {t("(opens in a new window)")}</span>
          ) : null}
        </Link>
      </div>
    </article>
  );
}

type LegalItem = {
  type: string;
  text?: string;
  intro?: string;
  items?: string[];
  link?: { href: string; label: string };
  afterText?: string;
};

/** The body shared by Privacy Policy, Terms and the Service Agreement. */
export async function LegalSections({
  sections,
}: {
  sections: { title: string; content: LegalItem[] }[];
}) {
  const t = await getT();
  return (
    <section className="bg-white pb-24">
      <div className="npf-container grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
        <nav
          aria-label={t("On this page")}
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <h2 className="mb-3 font-secondary text-sm font-bold tracking-wide text-npf-muted uppercase">
            {t("On this page")}
          </h2>
          <ol className="space-y-2 text-sm">
            {sections.map((s) => (
              <li key={s.title}>
                <a
                  href={`#${slug(s.title)}`}
                  className="text-npf-body transition-colors hover:text-npf-blue"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-[75ch]">
          {sections.map((s) => (
            <section
              key={s.title}
              className="mb-10 scroll-mt-32"
              id={slug(s.title)}
            >
              <h2 className="mb-4 font-secondary text-2xl font-bold text-npf-blue-deep">
                {s.title}
              </h2>
              {s.content.map((item, i) =>
                item.type === "list" ? (
                  <div key={i}>
                    {item.intro ? (
                      <p className="mb-3 text-base leading-relaxed text-npf-body">
                        {item.intro}
                      </p>
                    ) : null}
                    <ul className="mb-4 space-y-2">
                      {(item.items ?? []).map((li) => (
                        <li
                          key={li}
                          className="relative ps-6 text-base leading-relaxed text-npf-body before:absolute before:top-[0.6em] before:start-0 before:size-2 before:rounded-full before:bg-npf-blue"
                        >
                          {li}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p
                    key={i}
                    className="mb-4 text-base leading-relaxed text-npf-body"
                  >
                    {item.text}
                    {item.link ? (
                      <a
                        href={item.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-npf-blue underline underline-offset-2"
                      >
                        {item.link.label}
                      </a>
                    ) : null}
                    {item.afterText}
                  </p>
                ),
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
