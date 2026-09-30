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
      <h2 className="npf-h3 text-npf-blue-deep">{t("Documents")}</h2>
      {issued.length ? (
        <p className="npf-body mt-2 max-w-[60ch] text-npf-body">
          {t(
            "Certificates, permits and receipts appear here as soon as a request is approved.",
          )}
        </p>
      ) : null}

      {issued.length ? (
        <ul className="mt-6 divide-y divide-npf-hairline overflow-hidden rounded-card border border-npf-hairline bg-white">
          {issued.map((doc) => (
            <li
              key={doc.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4"
            >
              {/* A page with a folded corner: a document, at a glance. */}
              <span className="relative grid h-12 w-10 shrink-0 place-items-center rounded-[0.375rem] bg-npf-cloud text-npf-blue-ink [clip-path:polygon(0_0,70%_0,100%_22%,100%_100%,0_100%)]">
                <FileIcon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="npf-h5 text-npf-ink">
                  {t(doc.name)}
                </p>
                <p className="npf-small mt-0.5 text-npf-steel tabular-nums">
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
                className="npf-btn npf-btn-secondary npf-btn-sm !opacity-60"
              >
                <DownloadIcon aria-hidden className="size-4" />
                {t("Download")}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6">
          <Empty
            icon={<FileIcon className="size-6" />}
            title={t("No documents yet")}
            body={t(
              "Certificates, permits and receipts appear here as soon as a request is approved.",
            )}
            action={
              <Link href="/app/services" className="npf-btn npf-btn-primary">
                {t("Browse services")}
                <span className="npf-btn-disc">
                  <ArrowRight
                    aria-hidden
                    className="npf-arrow size-4 rtl:-scale-x-100"
                  />
                </span>
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
}
