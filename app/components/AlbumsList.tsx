"use client";

import { useMemo, useState } from "react";
import AlbumCard, { type AlbumCardItem } from "./AlbumCard";
import ListControls, { compare, type Sort } from "./ListControls";

export default function AlbumsList({ albums }: { albums: AlbumCardItem[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("newest");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return albums
      .filter((a) => !q || `${a.title} ${a.description}`.toLowerCase().includes(q))
      .sort(compare(sort, (a) => a.date));
  }, [albums, query, sort]);

  return (
    <>
      <ListControls
        noun="albums"
        query={query}
        onQuery={setQuery}
        sort={sort}
        onSort={setSort}
        shown={shown.length}
        total={albums.length}
      />

      {shown.length ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((album, i) => (
            <AlbumCard key={album.slug} album={album} index={i} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-[#F4F8F6] p-8 text-base text-dp-body">
          No albums match that. Try a shorter search.
        </p>
      )}
    </>
  );
}
