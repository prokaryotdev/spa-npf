import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AlbumCard from "../../../../../components/AlbumCard";
import { PageShell } from "../../../../../components/PageShell";
import PhotoLightbox from "../../../../../components/PhotoLightbox";
import { ArrowRight } from "../../../../../components/icons";
import { photoAlbums } from "../../../../../content-albums";

export function generateStaticParams() {
  return photoAlbums.map((album) => ({ slug: album.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const album = photoAlbums.find((a) => a.slug === slug);
  if (!album) return { title: "Photo Gallery | Dubai Police" };
  return {
    title: `${album.title} | Dubai Police`,
    description:
      album.description || `${album.count} photos from ${album.title}.`,
    openGraph: { title: album.title, images: [album.cover] },
  };
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const album = photoAlbums.find((a) => a.slug === slug);
  if (!album) notFound();

  const more = photoAlbums.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <PageShell
      title={album.title}
      titleSize="article"
      intro={album.description || undefined}
      trail={[
        { label: "Media Hub", href: "/app/home/media" },
        { label: "Photo Gallery", href: "/app/home/media/photo-gallery" },
      ]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container">
          <p className="mb-8 text-sm text-dp-muted">
            <time dateTime={album.date}>{album.date}</time> · {album.count}{" "}
            {album.count === 1 ? "photo" : "photos"}
          </p>

          <PhotoLightbox photos={album.photos} title={album.title} />

          <Link
            href="/app/home/media/photo-gallery"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-dp-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dp-green-mid"
          >
            All albums
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {more.length ? (
        <section aria-labelledby="more-albums" className="bg-[#F4F8F6] py-20">
          <div className="dp-container">
            <h2
              id="more-albums"
              className="mb-8 font-secondary text-2xl font-bold text-dp-green-deep md:text-4xl"
            >
              More albums
            </h2>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {more.map((a, i) => (
                <AlbumCard key={a.slug} album={a} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
