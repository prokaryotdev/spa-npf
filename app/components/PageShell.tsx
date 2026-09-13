import Image from "next/image";
import Link from "next/link";
import Footer from "./Footer";
import Header from "./Header";
import StickyBar from "./StickyBar";
import { ArrowRight, ChevronRight } from "./icons";

/** Breadcrumb + heading, the frame every inner page opens with. */
export function PageShell({
  title,
  intro,
  trail = [],
  children,
  solidHeader = true,
}: {
  title: string;
  intro?: string;
  /** Steps between Home and the current page. */
  trail?: { label: string; href: string }[];
  children: React.ReactNode;
  solidHeader?: boolean;
}) {
  return (
    <>
      <Header solid={solidHeader} />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <div className="relative overflow-hidden bg-white pt-40 pb-16 md:pt-48">
          <div className="pointer-events-none absolute top-0 right-0 h-80 w-56 translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(#3cbd6b75_7%,#22c55e38_40%,#22c55e00_70%)] opacity-70 md:size-[1000px] md:opacity-60" />

          <div className="dp-container relative">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-dp-body">
                <li className="flex items-center gap-1">
                  <Link href="/" className="transition-colors hover:text-dp-green">
                    Home
                  </Link>
                  <ChevronRight aria-hidden className="size-4 opacity-50" />
                </li>
                {trail.map((step) => (
                  <li key={step.href} className="flex items-center gap-1">
                    <Link
                      href={step.href}
                      className="transition-colors hover:text-dp-green"
                    >
                      {step.label}
                    </Link>
                    <ChevronRight aria-hidden className="size-4 opacity-50" />
                  </li>
                ))}
                <li aria-current="page" className="font-medium text-dp-ink">
                  {title}
                </li>
              </ol>
            </nav>

            <h1 className="font-secondary text-4xl leading-[1.15] font-bold text-dp-green-deep lg:text-7xl">
              {title}
            </h1>
            {intro ? (
              <p className="mt-5 max-w-[70ch] text-base text-neutral-700 md:text-xl">
                {intro}
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

/**
 * The tile Open Data and Information are both built from: photo, title, a line
 * of explanation, and a link out.
 */
export function LinkCard({
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
        <h2 className="font-secondary text-xl font-bold text-dp-green-deep md:text-2xl">
          {card.title}
        </h2>
        <p className="text-sm leading-relaxed text-dp-body md:text-base">
          {card.body}
        </p>
        <Link
          href={card.href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="mt-1 inline-flex items-center gap-2 self-start rounded-full bg-dp-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dp-green-mid"
        >
          {card.cta}
          <ArrowRight className="size-4" />
          {external ? (
            <span className="sr-only"> (opens in a new window)</span>
          ) : null}
        </Link>
      </div>
    </article>
  );
}
