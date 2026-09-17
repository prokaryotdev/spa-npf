"use client";

import Link from "../i18n/Link";
import { useStore } from "./store";
import { Empty } from "./ui";
import { seedDocuments as seedDocumentsSource } from "../content-account";
import { ArrowRight, DownloadIcon, FileIcon } from "./icons";
import { useFormat, useLocalized, useT } from "../i18n/client";

export default function PortalDocuments() {
  const seedDocuments = useLocalized(seedDocumentsSource);
  const t = useT();
  const format = useFormat();
  const { requests } = useStore();

  // A document exists because a request finished. Anything completed after the
  // seeds were written gets a row too, so a request you complete in this
  // session does not vanish from here.
  const issued = [
    ...seedDocuments,
    ...requests
      .filter(
        (r) =>
          r.status === "Completed" &&
          !seedDocuments.some((d) => d.request === r.id),
      )
      .map((r) => ({
        id: `DOC-${r.id.split("-").pop()}`,
        name: r.service,
        issued: r.updated,
        expires: null as string | null,
        request: r.id,
      })),
  ].sort((a, b) => b.issued.localeCompare(a.issued));

  return (
    <div>
      <h2 className="mb-6 font-secondary text-2xl font-bold text-dp-green-deep">
        {t("Documents")}
      </h2>

      {issued.length ? (
        <ul className="space-y-3">
          {issued.map((doc) => (
            <li
              key={doc.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl px-5 py-4 ring-1 ring-black/[0.07]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#F4F8F6] text-dp-green-ink">
                <FileIcon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-secondary text-base font-bold text-dp-ink">
                  {t(doc.name)}
                </p>
                <p className="mt-0.5 text-sm text-dp-muted tabular-nums">
                  {t("{ref} · issued {date}", {
                    ref: doc.id,
                    date: format.date(doc.issued),
                  })}
                  {doc.expires
                    ? ` · ${t("valid to {date}", { date: format.date(doc.expires) })}`
                    : ""}
                </p>
              </div>
              {/* ponytail: no file to hand over in this build, so the control
                  says what it would do rather than downloading an empty PDF. */}
              <button
                type="button"
                disabled
                title={t("Downloads are not available in this rebuild")}
                className="inline-flex shrink-0 cursor-not-allowed items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-dp-muted ring-1 ring-black/10"
              >
                <DownloadIcon aria-hidden className="size-4" />
                {t("Download")}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <Empty
          title={t("No documents yet")}
          body={t(
            "Certificates, permits and receipts appear here as soon as a request is approved.",
          )}
          action={
            <Link
              href="/app/services"
              className="inline-flex items-center gap-2 rounded-full bg-dp-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dp-green-mid"
            >
              {t("Browse services")}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          }
        />
      )}
    </div>
  );
}
