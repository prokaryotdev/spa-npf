import type { Metadata } from "next";
import NewsCard from "../../../../components/NewsCard";
import { PageShell } from "../../../../components/PageShell";
import { news as newsSource } from "../../../../content-news";
import { getT, getLocalized } from "../../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("News | Dubai Police"),
    description: t(
      "Keep informed! Browse our latest news, learn about ongoing initiatives, and see how innovation continues to drive our work.",
    ),
  };
}

export default async function NewsPage() {
  const news = await getLocalized(newsSource);
  const t = await getT();
  return (
    <PageShell
      title={t("News")}
      intro={t(
        "Keep informed! Browse our latest news, learn about ongoing initiatives, and see how innovation continues to drive our work.",
      )}
      trail={[{ label: "Media Hub", href: "/app/home/media" }]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {news.map((item, i) => (
            <NewsCard key={item.slug} item={item} index={i} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
