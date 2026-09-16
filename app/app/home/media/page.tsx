import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AlbumCard from "../../../components/AlbumCard";
import CardRail from "../../../components/CardRail";
import NewsCard from "../../../components/NewsCard";
import { PageShell } from "../../../components/PageShell";
import { ArrowRight, PlayIcon } from "../../../components/icons";
import { photoAlbums as photoAlbumsSource } from "../../../content-albums";
import { events as eventsSource } from "../../../content-events";
import { news as newsSource } from "../../../content-news";
import { mediaHub as mediaHubSource } from "../../../content-pages";
import { getT, getLocalized } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Media Hub | Dubai Police"),
    description: t(mediaHubSource.intro),
  };
}

export default async function MediaPage() {
  const photoAlbums = await getLocalized(photoAlbumsSource);
  const events = await getLocalized(eventsSource);
  const news = await getLocalized(newsSource);
  const mediaHub = await getLocalized(mediaHubSource);
  const t = await getT();
  return (
    <PageShell title={mediaHub.title} intro={mediaHub.intro} trail={[]}>
      {/* Campaigns */}
      <section aria-labelledby="campaigns" className="bg-white pb-20">
        <div className="dp-container">
          <h2
            id="campaigns"
            className="mb-8 font-secondary text-2xl font-bold text-dp-green-deep md:text-4xl"
          >
            {t("Campaigns")}
          </h2>
          <CardRail label={t("campaign")}>
            {mediaHub.campaigns.map((campaign) => (
              <article
                key={campaign.title}
                className="relative aspect-[16/10] w-[84vw] max-w-[560px] shrink-0 overflow-hidden rounded-3xl md:w-[520px]"
              >
                <Image
                  src={campaign.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 84vw, 520px"
                  className="object-cover"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(4,20,14,0.9))]"
                />
                <h3 className="absolute inset-x-0 bottom-0 p-6 font-secondary text-lg font-bold text-white md:text-2xl">
                  {campaign.title}
                </h3>
              </article>
            ))}
          </CardRail>
        </div>
      </section>

      {/* Events */}
      <section aria-labelledby="events" className="bg-[#F4F8F6] py-20">
        <div className="dp-container">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2
              id="events"
              className="font-secondary text-2xl font-bold text-dp-green-deep md:text-4xl"
            >
              {t("Events")}
            </h2>
            <Link
              href="/app/home/media/events"
              className="inline-flex items-center gap-2 text-sm font-medium text-dp-green transition-colors hover:text-dp-green-deep"
            >
              {t("Explore All Events")}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <CardRail label={t("event")}>
            {events.slice(0, 6).map((event) => (
              <article
                key={event.slug}
                className="group/card w-[74vw] max-w-[320px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_20px_36px_-28px_rgba(0,60,40,0.6)] md:w-[300px]"
              >
                <Link href={`/app/home/media/events/${event.slug}`}>
                  <div className="relative aspect-[4/3] bg-[#F4F8F6]">
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 74vw, 300px"
                        className="object-contain p-4"
                      />
                    ) : null}
                    {event.type ? (
                      <span className="absolute top-3 start-3 rounded-full bg-[#e7f6f1] px-3 py-1 text-xs font-medium text-dp-green-ink">
                        {t(event.type)}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2 p-5">
                    <h3 className="line-clamp-2 min-h-[3rem] font-secondary text-base font-bold text-dp-ink transition-colors group-hover/card:text-dp-green">
                      {event.title}
                    </h3>
                    <time className="text-sm text-dp-muted">{event.from}</time>
                    <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-dp-green">
                      {t("View Details")}
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </CardRail>
        </div>
      </section>

      {/* News */}
      <section aria-labelledby="news" className="bg-white py-20">
        <div className="dp-container">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h2
              id="news"
              className="font-secondary text-2xl font-bold text-dp-green-deep md:text-4xl"
            >
              {t("News")}
            </h2>
            <Link
              href="/app/home/media/news"
              className="inline-flex items-center gap-2 text-sm font-medium text-dp-green transition-colors hover:text-dp-green-deep"
            >
              {t("View All")}
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="mb-10 max-w-[70ch] text-base text-dp-body md:text-lg">
            {mediaHub.news.intro}
          </p>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {news.slice(0, 3).map((item, i) => (
              <NewsCard key={item.slug} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Video gallery */}
      <section
        aria-labelledby="videos"
        className="relative overflow-hidden bg-gradient-to-t from-[#0C1814] to-[#1E312A] py-20 text-white"
      >
        <div className="dp-container flex flex-col items-start gap-6">
          <span className="grid size-16 place-items-center rounded-full bg-dp-green">
            <PlayIcon className="size-6" />
          </span>
          <h2
            id="videos"
            className="font-secondary text-3xl font-bold md:text-5xl"
          >
            {mediaHub.videos.heading}
          </h2>
          <p className="max-w-[60ch] text-base text-white/85 md:text-xl">
            {mediaHub.videos.body}
          </p>
          <Link
            href="/app/home/media/video-gallery"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-dp-green-deep transition-colors hover:bg-white/90"
          >
            {mediaHub.videos.cta}
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>

      {/* Photos */}
      <section aria-labelledby="photos" className="bg-white py-20">
        <div className="dp-container">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2
              id="photos"
              className="font-secondary text-2xl font-bold text-dp-green-deep md:text-4xl"
            >
              {mediaHub.photos.heading}
            </h2>
            <Link
              href="/app/home/media/photo-gallery"
              className="inline-flex items-center gap-2 text-sm font-medium text-dp-green transition-colors hover:text-dp-green-deep"
            >
              {mediaHub.photos.cta}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {photoAlbums.slice(0, 3).map((album, i) => (
              <AlbumCard key={album.slug} album={album} index={i} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
