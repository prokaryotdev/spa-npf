import Link from "../i18n/Link";
import { getT } from "../i18n/server";
import { HelpCard, Tick } from "./PageShell";
import { ArrowRight, FileIcon, InboxIcon, PersonIcon, ShieldIcon } from "./icons";

type LegalItem = {
  type: string;
  text?: string;
  intro?: string;
  items?: string[];
  link?: { href: string; label: string };
  afterText?: string;
};
type Section = { title: string; content: LegalItem[] };

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** The three documents, each with the line its own page opens with. */
const DOCS = [
  {
    href: "/app/home/privacy-policy",
    title: "Privacy Policy",
    intro:
      "How Nigeria Police Force collects, uses, stores and protects the data you share on this website.",
    Icon: ShieldIcon,
  },
  {
    href: "/app/home/terms-conditions",
    title: "Terms & Conditions",
    intro:
      "The terms that govern your use of the Nigeria Police Force website and its electronic services.",
    Icon: FileIcon,
  },
  {
    href: "/app/home/customer-service-agreement",
    title: "Customer Service Agreement",
    intro:
      "What you can expect from Nigeria Police Force at every counter, and what we ask of you in return.",
    Icon: PersonIcon,
  },
];

/** "Government Records and Retention: …" — a short lead-in reads as a label. */
function Paragraph({ item }: { item: LegalItem }) {
  const text = item.text ?? "";
  const cut = text.indexOf(": ");
  const lead = cut > 0 && cut < 48 && !text.slice(0, cut).includes(".") ? cut : -1;
  return (
    <p className="npf-body max-w-[68ch] text-npf-body">
      {lead > 0 ? (
        <>
          <strong className="font-semibold text-npf-ink">{text.slice(0, lead + 1)}</strong>{" "}
          {text.slice(lead + 2)}
        </>
      ) : (
        text
      )}
      {item.link ? (
        <a
          href={item.link.href}
          {...(/^https?:/.test(item.link.href)
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="font-medium text-npf-blue underline decoration-npf-blue/40 underline-offset-3 transition-colors hover:text-npf-blue-deep hover:decoration-current"
        >
          {item.link.label}
        </a>
      ) : null}
      {item.afterText}
    </p>
  );
}

/**
 * The body of all three legal pages. Each clause is its own ruled card, its
 * number and title on a mist bar (the sitemap's groups), so a long policy
 * reads as a set of separate undertakings rather than one wall of text. The
 * numbered contents ride beside it; the other two documents close it.
 */
export async function LegalSections({
  current,
  sections,
}: {
  current: string;
  sections: Section[];
}) {
  const t = await getT();
  const items = sections.map((s) => ({ id: slug(s.title), title: s.title }));
  const others = DOCS.filter((d) => d.href !== current);
  return (
    <section className="bg-white pb-(--npf-section-y)">
      <div className="npf-container grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16">
        {/* Help waits beside the reading; on a phone, at its end. */}
        <aside className="max-lg:contents print:hidden">
          <div className="space-y-6 max-lg:contents">
            <HelpCard
              className="max-lg:order-last"
              title={t("Questions about this page?")}
              rows={[{ Icon: InboxIcon, label: "mail@npf.gov.ng", href: "mailto:mail@npf.gov.ng" }]}
            />
          </div>
        </aside>

        <div className="min-w-0 space-y-6">
          {sections.map((s, i) => (
            <section
              key={s.title}
              id={items[i].id}
              aria-labelledby={`${items[i].id}-h`}
              className="scroll-mt-28 overflow-hidden rounded-card border border-npf-line bg-white"
            >
              <h2
                id={`${items[i].id}-h`}
                className="npf-h4 flex items-start gap-4 border-b border-npf-line bg-npf-mist px-6 py-4 text-npf-blue-deep md:px-8 md:py-5"
              >
                <span className="npf-caption mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white text-npf-blue-ink tabular-nums">
                  {i + 1}
                </span>
                <span>{s.title}</span>
              </h2>
              <div className="space-y-4 px-6 py-6 md:px-8">
                {s.content.map((item, j) => {
                  if (item.type !== "list") return <Paragraph key={j} item={item} />;
                  // Rows run edge to edge, one undertaking each; flush with
                  // the card's own rim where they open or close it.
                  const top = j === 0 && !item.intro;
                  const bottom = j === s.content.length - 1;
                  return (
                    <div key={j} className={`${top ? "-mt-6" : ""} ${bottom ? "-mb-6" : ""}`}>
                      {item.intro ? <p className="npf-body mb-4 text-npf-body">{item.intro}</p> : null}
                      <ul
                        className={`-mx-6 divide-y divide-npf-hairline border-npf-hairline md:-mx-8 ${top ? "" : "border-t"} ${bottom ? "" : "border-b"}`}
                      >
                        {(item.items ?? []).map((li) => (
                          <li
                            key={li}
                            className="npf-body flex items-start gap-3 px-6 py-4 text-npf-ink md:px-8"
                          >
                            <Tick />
                            <span>{li}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          <nav
            aria-labelledby="legal-more"
            className="border-t border-npf-hairline pt-10 !mt-12 print:hidden"
          >
            <h2 id="legal-more" className="npf-h5 text-npf-blue-deep">
              {t("Legal documents")}
            </h2>
            <ul className="mt-5 grid gap-(--npf-gap) md:grid-cols-2">
              {others.map((doc) => (
                <li key={doc.href}>
                  <Link
                    href={doc.href}
                    className="npf-link-card group flex h-full items-center gap-4 p-5"
                  >
                    <span className="npf-disc">
                      <doc.Icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="npf-body block font-semibold text-npf-ink transition-colors group-hover:text-npf-blue">
                        {t(doc.title)}
                      </span>
                      <span className="npf-small block text-npf-steel">{t(doc.intro)}</span>
                    </span>
                    <ArrowRight className="npf-go" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
