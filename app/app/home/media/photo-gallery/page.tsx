import type { Metadata } from "next";
import AlbumCard from "../../../../components/AlbumCard";
import { PageShell } from "../../../../components/PageShell";
import { photoAlbums } from "../../../../content-albums";

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
            <AlbumCard key={album.slug} album={album} index={i} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
