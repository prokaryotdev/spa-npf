"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, CloseIcon } from "./icons";

/**
 * The album grid plus a full-size viewer. Built on <dialog>, so the browser
 * supplies the modal backdrop, focus trap and Escape-to-close; only the arrow
 * keys need wiring.
 */
export default function PhotoLightbox({
  photos,
  title,
}: {
  photos: readonly string[];
  title: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  const step = useCallback(
    (delta: number) =>
      setOpen((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open === null) {
      if (el.open) el.close();
      return;
    }
    if (!el.open) el.showModal();
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, i) => (
          <li key={photo}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo ${i + 1} of ${photos.length}`}
              className="group/photo relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#F4F8F6]"
            >
              <Image
                src={photo}
                alt=""
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease-custom)] group-hover/photo:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        aria-label={title}
        className="m-auto max-h-none max-w-none bg-transparent p-0"
      >
        {open !== null ? (
          <div className="flex h-[100dvh] w-[100vw] flex-col items-center justify-center gap-4 p-4">
            <div className="relative h-[70vh] w-full max-w-[1200px]">
              <Image
                src={photos[open]}
                alt=""
                fill
                sizes="100vw"
                priority
                className="object-contain"
              />
            </div>

            <div className="flex items-center gap-4 text-white">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="grid size-11 place-items-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
              >
                <ChevronLeft className="size-5" />
              </button>
              <p aria-live="polite" className="text-sm tabular-nums">
                {open + 1} / {photos.length}
              </p>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="grid size-11 place-items-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
