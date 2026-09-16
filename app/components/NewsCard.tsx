"use client";

import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "../content-news";
import { useT } from "../i18n/client";

/** One clickable news teaser — used by the news list and the Media Hub. */
export default function NewsCard({
  item,
  index = 0,
}: {
  item: NewsItem;
  index?: number;
}) {
  const t = useT();
  return (
    <article
      data-reveal
      style={
        { "--reveal-delay": `${(index % 3) * 90}ms` } as React.CSSProperties
      }
      className="group/card flex flex-col"
    >
      <Link
        href={`/app/home/media/news/${item.slug}`}
        className="flex flex-col"
      >
        {item.image ? (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#F4F8F6]">
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
        <h3 className="mt-1 font-secondary text-lg leading-snug font-bold text-dp-ink transition-colors group-hover/card:text-dp-green">
          {item.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-dp-body">
          {item.summary}
        </p>
        <span className="mt-3 text-sm font-medium text-dp-green">
          {t("Read more")}
        </span>
      </Link>
    </article>
  );
}
