import Image from "next/image";
import Link from "../i18n/Link";
import Footer from "./Footer";
import Header from "./Header";
import RevealObserver from "./RevealObserver";
import {
  ArrowRight,
  ArrowUpRight,
  CheckIcon,
  ChevronRight,
  InboxIcon,
} from "./icons";
import { getT } from "../i18n/server";

/** Breadcrumb + heading, the frame every inner page opens with. */
export async function PageShell({
  title,
  intro,
  trail = [],
  children,
  solidHeader = true,
  titleSize = "display",
  lead,
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
        <div className="relative overflow-hidden bg-white pt-40 pb-16 md:pt-48">
          <div className="pointer-events-none absolute top-0 end-0 h-80 w-56 translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(#3c78bd66_7%,#22599e33_40%,#22599e00_70%)] opacity-70 [mask-image:linear-gradient(to_bottom,#000_65%,transparent_90%)] md:size-250 md:opacity-60" />

          <div className="npf-container npf-page-in relative">
            <nav aria-label={t("Breadcrumb")} className="mb-6">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-npf-body">
                <li className="flex items-center gap-1">
                  <Link href="/" className={crumb}>
                    {t("Home")}
                  </Link>
                  <ChevronRight
                    aria-hidden
                    className="size-4 opacity-50 rtl:-scale-x-100"
                  />
                </li>
                {trail.map((step) => (
                  <li key={step.href} className="flex items-center gap-1">
                    <Link href={step.href} className={crumb}>
                      {t(step.label)}
                    </Link>
                    <ChevronRight
                      aria-hidden
                      className="size-4 opacity-50 rtl:-scale-x-100"
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
      <Footer />
    </>
  );
}

/**
 * The tile Information is built from: photo, title, a line of explanation.
 * The whole card is the link, so the target is the card, not a small pill at
 * its foot; the cards in a row share a height and their arrows a baseline.
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
    <Link
      href={card.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="npf-link-card group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-npf-cloud">
        <Image
          src={card.image}
          alt=""
          fill
          sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 30vw"
          // The three cards are the first thing under the heading.
          loading="eager"
          className="object-cover transition-transform duration-(--dur-media) ease-(--ease-out) group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 lg:p-7">
        <h2 className="npf-h4 text-npf-blue-deep transition-colors group-hover:text-npf-blue">
          {t(card.title)}
        </h2>
        <p className="npf-body mt-2 mb-6 text-npf-body">{t(card.body)}</p>
        <span className="npf-small mt-auto flex items-center justify-between gap-3 border-t border-npf-hairline pt-4 font-medium text-npf-blue">
          {t(card.cta)}
          {external ? (
            <ArrowUpRight className="npf-go" />
          ) : (
            <ArrowRight className="npf-go" />
          )}
          {external ? (
            <span className="sr-only"> {t("(opens in a new window)")}</span>
          ) : null}
        </span>
      </div>
    </Link>
  );
}

export type HelpRow = {
  Icon: (props: { className?: string }) => React.ReactNode;
  label: string;
  /** Who answers, or the address itself: the line under the action. */
  note?: string;
  href: string;
};

/**
 * The help card every rail ends with. Help is not the page's action, so it
 * does not borrow the action card's buttons: each way to reach us is a row,
 * drawn like "How you receive it", with the whole row as the target and the
 * number or address in plain sight before anyone presses.
 */
export async function HelpCard({
  title,
  intro,
  rows,
  className = "",
}: {
  title: string;
  intro?: string;
  rows: HelpRow[];
  className?: string;
}) {
  return (
    <section
      aria-label={title}
      className={`overflow-hidden rounded-card bg-white shadow-card ring-1 ring-npf-hairline ring-inset ${className}`}
    >
      <div className="px-5 pt-5 pb-4">
        <h2 className="npf-h5 text-npf-blue-deep">{title}</h2>
        {intro ? (
          <p className="npf-small mt-1 text-npf-body">{intro}</p>
        ) : null}
      </div>
      {rows.length ? (
        <ul className="divide-y divide-npf-hairline border-t border-npf-hairline">
          {rows.map((row) => {
            const body = (
              <>
                <span className="npf-disc">
                  <row.Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="npf-body block truncate font-medium text-npf-ink tabular-nums transition-colors group-hover:text-npf-blue">
                    {row.label}
                  </span>
                  {row.note ? (
                    <span className="npf-small block truncate text-npf-steel">
                      {row.note}
                    </span>
                  ) : null}
                </span>
                <ArrowRight className="npf-go" />
              </>
            );
            const cls =
              "npf-row-link group flex items-center gap-4 px-5 py-4 focus-visible:-outline-offset-2 active:bg-npf-cloud";
            return (
              <li key={row.href}>
                {/^(tel|mailto):/.test(row.href) ? (
                  <a href={row.href} className={cls}>
                    {body}
                  </a>
                ) : (
                  <Link href={row.href} className={cls}>
                    {body}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
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
    <section className="bg-white pb-(--npf-section-y)">
      <div className="npf-container grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
        {/* A long document keeps its contents in reach: numbered, so a
            clause can be quoted back by number. */}
        {/* As on the service page: the contents ride along with the
            reading, and help waits at the rail foot where the reading ends. */}
        <aside className="max-lg:contents lg:flex lg:flex-col">
          <div className="lg:flex-1">
            <nav
              aria-labelledby="toc"
              className="overflow-hidden rounded-card border border-npf-hairline lg:sticky lg:top-28"
            >
              <h2
                id="toc"
                className="npf-h5 border-b border-npf-hairline bg-npf-mist px-5 py-3.5 text-npf-blue-deep"
              >
                {t("On this page")}
              </h2>
              <ol className="max-h-[calc(100dvh-14rem)] overflow-y-auto py-2 max-lg:max-h-none">
                {sections.map((s, i) => (
                  <li key={s.title}>
                    <a
                      href={`#${slug(s.title)}`}
                      className="npf-small group flex items-start gap-3 px-5 py-2 text-npf-body transition-colors hover:bg-npf-paper hover:text-npf-blue"
                    >
                      <span className="npf-caption mt-px grid size-5.5 shrink-0 place-items-center rounded-full bg-npf-cloud text-npf-blue-ink tabular-nums transition-colors group-hover:bg-npf-chip">
                        {i + 1}
                      </span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          <HelpCard
            className="order-last lg:mt-10"
            title={t("Questions about this page?")}
            rows={[
              {
                Icon: InboxIcon,
                label: "mail@npf.gov.ng",
                href: "mailto:mail@npf.gov.ng",
              },
            ]}
          />
        </aside>

        <div className="min-w-0 max-w-[46rem] [&>section+section]:mt-12 [&>section+section]:border-t [&>section+section]:border-npf-hairline [&>section+section]:pt-12">
          {sections.map((s, i) => (
            <section
              key={s.title}
              className="scroll-mt-28"
              id={slug(s.title)}
              aria-labelledby={`${slug(s.title)}-h`}
            >
              <h2
                id={`${slug(s.title)}-h`}
                className="npf-h3 flex items-baseline gap-3 text-npf-blue-deep"
              >
                <span className="npf-body shrink-0 font-semibold text-npf-steel tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.title}
              </h2>
              <div className="mt-5 space-y-4">
                {s.content.map((item, j) =>
                  item.type === "list" ? (
                    <div key={j}>
                      {item.intro ? (
                        <p className="npf-body mb-3 text-npf-body">
                          {item.intro}
                        </p>
                      ) : null}
                      <ul className="divide-y divide-npf-hairline rounded-card border border-npf-hairline">
                        {(item.items ?? []).map((li) => (
                          <li
                            key={li}
                            className="npf-body flex items-start gap-3 px-5 py-3.5 text-npf-ink"
                          >
                            <span className="mt-[0.2em] grid size-5 shrink-0 place-items-center rounded-full bg-npf-blue text-white">
                              <CheckIcon className="size-3" />
                            </span>
                            <span>{li}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p key={j} className="npf-body text-npf-body">
                      {item.text}
                      {item.link ? (
                        <a
                          href={item.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-npf-blue underline underline-offset-2 hover:text-npf-blue-deep"
                        >
                          {item.link.label}
                        </a>
                      ) : null}
                      {item.afterText}
                    </p>
                  ),
                )}
              </div>
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
