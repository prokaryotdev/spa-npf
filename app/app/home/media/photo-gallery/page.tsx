import type { Metadata } from "next";
import AlbumsList from "../../../../components/AlbumsList";
import { PageShell } from "../../../../components/PageShell";
import { photoAlbums } from "../../../../content-albums";
import { getLocalized, getT } from "../../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Photo Gallery | Dubai Police"),
    description: t(
      "Photo albums from Dubai Police ceremonies, exhibitions and community events.",
    ),
  };
}

// Filtering happens in the browser, so only the tile fields cross over — the
// 172 photo paths stay here rather than bloating the page payload.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured to drop
const tiles = photoAlbums.map(({ photos, ...tile }) => tile);

export default async function PhotoGalleryPage() {
  const t = await getT();
  const albums = await getLocalized(tiles);
  return (
    <PageShell
      title={t("Photo Gallery")}
      intro={t(
        "Ceremonies, exhibitions and community moments, collected album by album.",
      )}
      trail={[{ label: "Media Hub", href: "/app/home/media" }]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container">
          <AlbumsList albums={albums} />
        </div>
      </section>
    </PageShell>
  );
}
