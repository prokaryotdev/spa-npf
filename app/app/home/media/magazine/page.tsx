import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "../../../../components/PageShell";
import { ArrowUpRight } from "../../../../components/icons";
import { magazines as magazinesSource } from "../../../../content-sub";
import { getT, getLocalized } from "../../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Magazine | Dubai Police"),
    description: t(
      "Dubai Police publications: achievements, innovations and initiatives in safety, security and community engagement.",
    ),
  };
}

export default async function MagazinePage() {
  const magazines = await getLocalized(magazinesSource);
  const t = await getT();
  return (
    <PageShell
      title={t("Magazine")}
      intro={t(
        "Dubai Police publications, issue by issue — achievements, innovations and initiatives in safety, security and community engagement.",
      )}
      trail={[{ label: "Media Hub", href: "/app/home/media" }]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {magazines.map((issue, i) => (
            <article
              key={`${issue.title}-${issue.date}`}
              data-reveal
              style={
                { "--reveal-delay": `${(i % 4) * 80}ms` } as React.CSSProperties
              }
            >
              <a
                href={issue.file ?? "#"}
                target={issue.file ? "_blank" : undefined}
                rel={issue.file ? "noopener noreferrer" : undefined}
                className="group/card block"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#F4F8F6] ring-1 ring-black/5">
                  {issue.cover ? (
                    <Image
                      src={issue.cover}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 92vw, 23vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-custom)] group-hover/card:scale-105"
                    />
                  ) : null}
                </div>
                <p className="mt-4 text-sm text-dp-muted">
                  <time>{issue.date}</time>
                  {issue.issue ? ` · Issue ${issue.issue}` : ""}
                </p>
                <h2 className="mt-1 inline-flex items-start gap-1.5 font-secondary text-base leading-snug font-bold text-dp-ink transition-colors group-hover/card:text-dp-green">
                  {issue.title}
                  {issue.file ? (
                    <ArrowUpRight
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0"
                    />
                  ) : null}
                </h2>
                {issue.kind ? (
                  <p className="mt-1 text-xs text-dp-muted">{t(issue.kind)}</p>
                ) : null}
              </a>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
