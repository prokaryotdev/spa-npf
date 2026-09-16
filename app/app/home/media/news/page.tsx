import type { Metadata } from "next";
import NewsCard from "../../../../components/NewsCard";
import { PageShell } from "../../../../components/PageShell";
import { news } from "../../../../content-news";

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
            <NewsCard key={item.slug} item={item} index={i} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
