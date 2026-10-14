"use client";

import { useId, useRef, useState } from "react";
import { useFormat, useT } from "../i18n/client";
import type { Media } from "./store";
import { CloseIcon, FileIcon, PlusIcon } from "./icons";
import { FieldNote } from "./Where";
import { useDialog } from "./useDialog";

const MB = 1024 * 1024;

/** SHA-256 of the file's bytes, as hex: the exhibit's fingerprint. */
async function fingerprint(file: File) {
  const hash = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * A small JPEG of a picked photo, for the board and the tracker. The full file
 * goes to the upload endpoint; the preview has to fit beside every other
 * record in the browser's storage, so it is kept to 480px.
 */
async function preview(file: File) {
  if (!file.type.startsWith("image/")) return undefined;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 480 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return canvas.toDataURL("image/jpeg", 0.72);
  } catch {
    return undefined;
  }
}

/** Turn picked files into records: fingerprinted, previewed, stamped. */
export async function toMedia(files: File[], by: string): Promise<Media[]> {
  const at = new Date().toISOString();
  return Promise.all(
    files.map(async (file) => ({
      id: `M-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      thumb: await preview(file),
      sha256: await fingerprint(file),
      at,
      by,
    })),
  );
}

export const sizeOf = (bytes: number) =>
  bytes >= MB ? `${(bytes / MB).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/**
 * Photos, video and documents, picked and shown as they will be kept: a
 * preview for a picture, a file row for the rest, each with its size. Used by
 * the public report form (`tone="site"`) and by officers on the console.
 */
export function MediaPicker({
  id,
  label,
  hint,
  media,
  onChange,
  by,
  max = 5,
  maxMb = 20,
  optional,
  tone = "site",
}: {
  id: string;
  label: string;
  hint?: string;
  media: Media[];
  onChange: (media: Media[]) => void;
  by: string;
  max?: number;
  maxMb?: number;
  optional?: boolean;
  tone?: "site" | "ops";
}) {
  const t = useT();
  const input = useRef<HTMLInputElement>(null);
  const [tooBig, setTooBig] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const ops = tone === "ops";

  return (
    <div>
      <p
        id={`${id}-label`}
        className={ops ? "mb-1.5 text-xs font-semibold text-ops-dim" : "npf-field-label"}
      >
        {label}
        {optional ? (
          <span className="font-normal text-npf-steel"> {t("(optional)")}</span>
        ) : null}
      </p>
      {media.length ? (
        <ul className="mb-3 grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-2">
          {media.map((m) => (
            <li
              key={m.id}
              className="relative overflow-clip rounded-chip bg-npf-cloud ring-1 ring-npf-hairline ring-inset"
            >
              <Thumb media={m} className="aspect-square" />
              <span className="block truncate px-2 py-1 text-2xs text-npf-body">
                {m.name}
              </span>
              <button
                type="button"
                onClick={() => onChange(media.filter((x) => x.id !== m.id))}
                className="absolute end-1 top-1 grid size-7 place-items-center rounded-full bg-white/90 text-npf-ink shadow-sm transition-colors hover:bg-white"
              >
                <CloseIcon aria-hidden className="size-3.5" />
                <span className="sr-only">{t("Remove {file}", { file: m.name })}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {media.length < max ? (
        <>
          <input
            ref={input}
            id={id}
            type="file"
            multiple={max > 1}
            accept="image/*,video/*,audio/*,application/pdf"
            aria-labelledby={`${id}-label`}
            aria-describedby={`${id}-hint`}
            className="sr-only"
            onChange={async (e) => {
              const picked = [...(e.target.files ?? [])];
              e.target.value = "";
              setTooBig(picked.filter((f) => f.size > maxMb * MB).map((f) => f.name));
              const ok = picked
                .filter((f) => f.size <= maxMb * MB)
                .filter((f) => !media.some((m) => m.name === f.name && m.size === f.size))
                .slice(0, max - media.length);
              if (!ok.length) return;
              setBusy(true);
              try {
                onChange([...media, ...(await toMedia(ok, by))]);
              } finally {
                setBusy(false);
              }
            }}
          />
          <label
            htmlFor={id}
            aria-busy={busy || undefined}
            className={
              ops
                ? "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-(--ops-control-radius) bg-white px-3 text-xs font-medium text-ops-text shadow-[var(--ops-control-rim),var(--ops-control-lift)] hover:bg-ops-hover has-[:focus-visible]:outline-2"
                : "npf-btn npf-btn-secondary npf-btn-sm cursor-pointer has-[:focus-visible]:outline-2"
            }
          >
            {media.length ? (
              <PlusIcon aria-hidden className="size-4" />
            ) : (
              <FileIcon aria-hidden className="size-4" />
            )}
            {busy
              ? t("Reading files…")
              : media.length
                ? t("Add another file")
                : t("Choose files")}
          </label>
        </>
      ) : null}
      <p id={`${id}-hint`} className={ops ? "mt-1.5 text-2xs text-ops-dim" : "npf-hint"}>
        {hint ??
          t("Up to {max} files, {mb} MB each. Photos, video, audio or PDF.", {
            max,
            mb: maxMb,
          })}
      </p>
      {tooBig.length ? (
        <FieldNote
          id={`${id}-size`}
          error={t("Too large to attach: {files}", { files: tooBig.join(", ") })}
        />
      ) : null}
    </div>
  );
}

/** A picture's preview, or a file mark with its type for anything else. */
export function Thumb({ media, className = "" }: { media: Media; className?: string }) {
  const kind = media.type.split("/")[0];
  if (media.thumb)
    return (
      // eslint-disable-next-line @next/next/no-img-element -- a data URL made in the browser; next/image has nothing to optimise
      <img
        src={media.thumb}
        alt=""
        className={`block w-full object-cover ${className}`}
      />
    );
  return (
    <span
      aria-hidden
      className={`grid w-full place-items-center bg-npf-mist text-npf-blue ${className}`}
    >
      <span className="grid justify-items-center gap-1">
        <FileIcon className="size-6" />
        <span className="font-mono text-2xs uppercase">
          {media.name.split(".").pop()?.slice(0, 4) || kind}
        </span>
      </span>
    </span>
  );
}

/**
 * The evidence on a record, as a strip of previews. Each opens full size with
 * who added it, when, its size and its fingerprint, which is what an officer
 * reads out when a defence lawyer asks whether the photo was changed.
 */
export function Gallery({ media }: { media: Media[] }) {
  const t = useT();
  const format = useFormat();
  const [open, setOpen] = useState<Media | null>(null);
  const ref = useDialog(!!open, () => setOpen(null));
  const titleId = useId();
  if (!media.length) return null;
  return (
    <>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-1.5">
        {media.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => setOpen(m)}
              title={m.name}
              className="block w-full overflow-clip rounded-lg bg-npf-cloud ring-1 ring-npf-hairline ring-inset transition-[box-shadow,scale] hover:ring-npf-blue-mid active:scale-[0.97]"
            >
              <Thumb media={m} className="aspect-square" />
              <span className="sr-only">{t("Open {file}", { file: m.name })}</span>
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        className="m-auto w-[min(44rem,calc(100vw-2rem))] rounded-card bg-white p-0 shadow-raised backdrop:bg-npf-night/70"
      >
        {open ? (
          <div>
            <div className="flex items-center gap-3 border-b border-npf-hairline px-5 py-3">
              <h2 id={titleId} className="min-w-0 flex-1 truncate text-sm font-semibold text-npf-ink">
                {open.name}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="grid size-9 place-items-center rounded-full text-npf-steel hover:bg-npf-cloud hover:text-npf-ink"
              >
                <CloseIcon aria-hidden className="size-4" />
                <span className="sr-only">{t("Close")}</span>
              </button>
            </div>
            <div className="bg-npf-night">
              <Thumb media={open} className="max-h-[60vh] min-h-48 object-contain" />
            </div>
            <dl className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 px-5 py-4 text-xs">
              <dt className="text-npf-steel">{t("Added by")}</dt>
              <dd className="text-npf-ink">{t(open.by)}</dd>
              <dt className="text-npf-steel">{t("Added")}</dt>
              <dd className="text-npf-ink tabular-nums">{format.dateTime(open.at)}</dd>
              <dt className="text-npf-steel">{t("Size")}</dt>
              <dd className="text-npf-ink">{sizeOf(open.size)}</dd>
              <dt className="text-npf-steel">{t("Fingerprint")}</dt>
              <dd className="font-mono text-2xs break-all text-npf-ink">
                SHA-256 {open.sha256}
              </dd>
            </dl>
            {!open.thumb ? (
              <p className="border-t border-npf-hairline px-5 py-3 text-xs text-npf-body">
                {t("The file itself is kept by the evidence store, not in this browser.")}
              </p>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
