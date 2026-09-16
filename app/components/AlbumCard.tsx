"use client";

import Image from "next/image";
import Link from "next/link";
import type { Album } from "../content-albums";
import { useT } from "../i18n/client";

/** The tile never touches the photo list, so lists can hand it a trimmed record. */
export type AlbumCardItem = Omit<Album, "photos">;

/** One clickable album tile — used by the gallery list and the Media Hub. */
export default function AlbumCard({
  album,
  index = 0,
}: {
  album: AlbumCardItem;
  index?: number;
}) {
  const t = useT();
  return (
    <article
      data-reveal
      style={
        { "--reveal-delay": `${(index % 3) * 90}ms` } as React.CSSProperties
      }
      className="group/card"
    >
      <Link
        href={`/app/home/media/photo-gallery/${album.slug}`}
        className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-[#0C1814]"
      >
        <Image
          src={album.cover}
          alt=""
          fill
          sizes="(max-width: 768px) 92vw, 31vw"
          className="object-cover transition-transform duration-700 ease-[var(--ease-custom)] group-hover/card:scale-105"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(4,20,14,0.92))]"
        />
        <span className="absolute inset-x-0 bottom-0 block p-5 text-white">
          <span className="block text-xs text-white/80">
            <time>{t(album.date)}</time> · {t("{n} Photos", { n: album.count })}
          </span>
          <span className="mt-1 block font-secondary text-base leading-snug font-bold">
            {album.title}
          </span>
        </span>
      </Link>
    </article>
  );
}
