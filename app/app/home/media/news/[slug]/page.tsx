import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import NewsCard from "../../../../../components/NewsCard";
import { PageShell } from "../../../../../components/PageShell";
import { ArrowRight } from "../../../../../components/icons";
import { news as newsSource } from "../../../../../content-news";
import { getT, getLocalized } from "../../../../../i18n/server";

export function generateStaticParams() {
  return newsSource.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getT();
  const source = newsSource.find((n) => n.slug === slug);
  if (!source) return { title: t("News | Dubai Police") };
  const item = await getLocalized(source);
  return {
    title: t("{name} | Dubai Police", { name: item.title }),
    description: item.summary,
    openGraph: {
      title: item.title,
      description: item.summary,
      images: item.image ? [item.image] : undefined,
      type: "article",
      publishedTime: item.date,
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const news = await getLocalized(newsSource);
  const t = await getT();
  const { slug } = await params;
  const index = news.findIndex((n) => n.slug === slug);
  if (index === -1) notFound();

  const item = news[index];
  const more = news.filter((n) => n.slug !== slug).slice(0, 3);

  return (
    <PageShell
      title={item.title}
      titleSize="article"
      trail={[
        { label: "Media Hub", href: "/app/home/media" },
        { label: "News", href: "/app/home/media/news" },
      ]}
    >
      <article className="bg-white pb-24">
        <div className="dp-container">
          <p className="text-sm text-dp-muted">
            <time dateTime={item.date}>{item.date}</time>
          </p>

          {item.image ? (
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl bg-[#F4F8F6]">
              <Image
                src={item.image}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 1100px"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="mt-10 max-w-[75ch]">
            {item.body.map((paragraph, i) => (
              <p
                key={i}
                className={`mb-5 leading-relaxed text-dp-body ${
                  i === 0 ? "text-lg md:text-xl" : "text-base"
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <Link
            href="/app/home/media/news"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-dp-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dp-green-mid"
          >
            {t("All news")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </article>

      {more.length ? (
        <section aria-labelledby="more-news" className="bg-[#F4F8F6] py-20">
          <div className="dp-container">
            <h2
              id="more-news"
              className="mb-8 font-secondary text-2xl font-bold text-dp-green-deep md:text-4xl"
            >
              {t("More news")}
            </h2>
            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
              {more.map((n, i) => (
                <NewsCard key={n.slug} item={n} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
