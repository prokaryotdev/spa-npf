import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "../../../../components/PageShell";
import { news } from "../../../../content-sub";

export const metadata: Metadata = {
  title: "News | Dubai Police",
  description:
    "Keep informed! Browse our latest news, learn about ongoing initiatives, and see how innovation continues to drive our work.",
};

export default function NewsPage() {
  return (
    <PageShell
      title="News"
      intro="Keep informed! Browse our latest news, learn about ongoing initiatives, and see how innovation continues to drive our work."
      trail={[{ label: "Media Hub", href: "/app/home/media" }]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {news.map((item, i) => (
            <article
              key={item.title}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}
              className="group/card flex flex-col"
            >
              {item.image ? (
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 92vw, 31vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-custom)] group-hover/card:scale-105"
                  />
                </div>
              ) : null}
              <time className="mt-4 text-sm text-dp-muted">{item.date}</time>
              <h2 className="mt-1 font-secondary text-lg leading-snug font-bold text-dp-ink">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-dp-body">
                {item.summary}
              </p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
