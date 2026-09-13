import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "../../../../components/PageShell";
import { photoAlbums } from "../../../../content-sub";

export const metadata: Metadata = {
  title: "Photo Gallery | Dubai Police",
  description:
    "Photo albums from Dubai Police ceremonies, exhibitions and community events.",
};

export default function PhotoGalleryPage() {
  return (
    <PageShell
      title="Photo Gallery"
      intro="Ceremonies, exhibitions and community moments, collected album by album."
      trail={[{ label: "Media Hub", href: "/app/home/media" }]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {photoAlbums.map((album, i) => (
            <article
              key={album.title}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}
              className="group/card relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#0C1814]"
            >
              {album.cover ? (
                <Image
                  src={album.cover}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 92vw, 31vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-custom)] group-hover/card:scale-105"
                />
              ) : null}
              <span
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(4,20,14,0.92))]"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-xs text-white/80">
                  <time>{album.date}</time> · {album.count} Photos
                </p>
                <h2 className="mt-1 font-secondary text-base leading-snug font-bold">
                  {album.title}
                </h2>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
