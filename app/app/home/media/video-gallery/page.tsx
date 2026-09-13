import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "../../../../components/PageShell";
import { PlayIcon } from "../../../../components/icons";
import { videos } from "../../../../content-sub";

export const metadata: Metadata = {
  title: "Video Gallery | Dubai Police",
  description:
    "Policing today, shaping tomorrow. Major operations, next-generation technologies, and moments from our community.",
};

export default function VideoGalleryPage() {
  return (
    <PageShell
      title="Video Gallery"
      intro="Policing today, shaping tomorrow. Explore major operations, next-generation technologies, and memorable moments from our community."
      trail={[{ label: "Media Hub", href: "/app/home/media" }]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {videos.map((video, i) => (
            <article
              key={video.youtube || video.title}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}
            >
              <a
                href={video.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="group/card block"
              >
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#0C1814]">
                  {video.id ? (
                    <Image
                      src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                      alt=""
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 92vw, 31vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-custom)] group-hover/card:scale-105"
                    />
                  ) : null}
                  <span
                    aria-hidden
                    className="absolute inset-0 grid place-items-center bg-black/25 transition-colors group-hover/card:bg-black/10"
                  >
                    <span className="grid size-14 place-items-center rounded-full bg-dp-green text-white">
                      <PlayIcon className="size-6" />
                    </span>
                  </span>
                </div>
                <time className="mt-4 block text-sm text-dp-muted">
                  {video.date}
                </time>
                <h2 className="mt-1 font-secondary text-lg leading-snug font-bold text-dp-ink transition-colors group-hover/card:text-dp-green">
                  {video.title}
                </h2>
                <span className="sr-only"> (opens on YouTube in a new window)</span>
              </a>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
