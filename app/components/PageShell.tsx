import Link from "../i18n/Link";
import Footer from "./Footer";
import Header from "./Header";
import RevealObserver from "./RevealObserver";
import { ArrowRight } from "./icons";
import { getT } from "../i18n/server";
import { Tick } from "./ui";

export { Tick };
export { HelpCard, type HelpRow } from "./HelpCard";

/** Breadcrumb + heading, the frame every inner page opens with. */
export async function PageShell({
  title,
  intro,
  trail = [],
  children,
  solidHeader = true,
  titleSize = "display",
  lead,
  compact = false,
  showEmergency = true,
}: {
  title: string;
  intro?: string;
  /** Steps between Home and the current page. */
  trail?: { label: string; href: string }[];
  children: React.ReactNode;
  solidHeader?: boolean;
  /** Long headlines (a news article) need a smaller h1 than a section title. */
  titleSize?: "display" | "article";
  /** Under the intro, in the heading's column (the catalogue's search). */
  lead?: React.ReactNode;
  /** A task page (the report form): a shorter head, so the work starts sooner. */
  compact?: boolean;
  /** False where the page itself lists the emergency lines (Contact Us). */
  showEmergency?: boolean;
}) {
  const t = await getT();
  const crumb = "transition-colors hover:text-npf-blue";
  return (
    <>
      <Header solid={solidHeader} />
      {/* A white page into a white footer: the rule marks where one ends. */}
      <main
        id="main-content"
        tabIndex={-1}
        className="border-b border-npf-hairline outline-none"
      >
        <div
          className={`relative bg-white ${
            compact ? "pt-36 pb-10 md:pt-40 md:pb-12" : "pt-40 pb-16 md:pt-48"
          }`}
        >
          {/* The glow is clipped in its own box, not the head's, so a `lead`
              with a drop-down (the search box's suggestions) can hang out of
              the head over the page below. */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-0 end-0 h-80 w-56 translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(#3c78bd66_7%,#22599e33_40%,#22599e00_70%)] opacity-70 [mask-image:linear-gradient(to_bottom,#000_65%,transparent_90%)] md:size-250 md:opacity-60" />
          </div>

          <div className="npf-container npf-page-in relative">
            <nav aria-label={t("Breadcrumb")} className="mb-6 print:hidden">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-npf-body">
                <li className="flex items-center gap-1">
                  <Link href="/" className={crumb}>
                    {t("Home")}
                  </Link>
                  <ArrowRight
                    aria-hidden
                    className="size-3.5 opacity-50 rtl:-scale-x-100"
                  />
                </li>
                {trail.map((step) => (
                  <li key={step.href} className="flex items-center gap-1">
                    <Link href={step.href} className={crumb}>
                      {t(step.label)}
                    </Link>
                    <ArrowRight
                      aria-hidden
                      className="size-3.5 opacity-50 rtl:-scale-x-100"
                    />
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
              className={`font-secondary leading-display font-bold text-npf-blue-deep ${
                titleSize === "article"
                  ? "max-w-[22ch] text-3xl lg:text-5xl"
                  : compact
                    ? "text-4xl lg:text-6xl"
                    : "text-4xl lg:text-7xl"
              }`}
            >
              {t(title)}
            </h1>
            {intro ? (
              <p className="mt-5 max-w-[70ch] text-base text-npf-body md:text-xl">
                {t(intro)}
              </p>
            ) : null}
            {lead}
          </div>
        </div>

        {children}
      </main>
      <RevealObserver />
      <Footer showEmergency={showEmergency} />
    </>
  );
}

/**
 * The short answers under a page's heading: what it costs, how long, who
 * for. One bordered, tinted strip across the column; each answer's column
 * starts from its own width and shares out the rest. The labels name each answer, so there is no icon beside
 * them to decode. The grid's own colour shows through a 1px gap as the
 * rule, which holds for any count of cells in any number of rows.
 */
export function Facts({
  facts,
  className = "",
}: {
  facts: { label: string; value: React.ReactNode }[];
  /** Columns below `md`, where the strip stacks: `max-md:grid-cols-2`. */
  className?: string;
}) {
  return (
    <dl
      className={`mt-8 grid max-w-full gap-px overflow-hidden rounded-card border border-npf-line bg-npf-line md:mt-10 md:grid-flow-col ${className}`}
    >
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="min-w-0 bg-npf-mist px-6 py-4 md:px-12 md:py-6"
        >
          <dt className="npf-small font-medium text-npf-steel">{fact.label}</dt>
          <dd className="npf-h5 mt-1 text-npf-blue-deep tabular-nums">
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

