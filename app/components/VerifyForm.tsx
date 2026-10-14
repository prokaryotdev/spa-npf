"use client";

import { useId, useState } from "react";
import { useFormat, useT } from "../i18n/client";
import { findDocument, useStore } from "./store";
import { AlertIcon, CheckCircle, SearchIcon } from "./icons";
import { FieldNote, commandLabel } from "./Where";

/**
 * Checking a police document someone has been handed: a clearance
 * certificate at a job interview, a police report at an insurer. Forged
 * police papers are common enough that the people who receive them need a
 * way to check without phoning a station.
 *
 * Says only whether the Force issued that number, for what, when and by
 * which command. Nothing about the holder: whoever is checking already has
 * the paper, and the paper has the name.
 */
export default function VerifyForm() {
  const t = useT();
  const format = useFormat();
  const id = useId();
  const { loaded, requests } = useStore();
  const [no, setNo] = useState("");
  const [asked, setAsked] = useState("");
  const [error, setError] = useState("");
  void requests;
  const found = loaded && asked ? findDocument(asked) : undefined;

  return (
    <div className="mx-auto max-w-180 space-y-6">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!/^NPF\/\d{4}\/\d{6}$/i.test(no.trim().replace(/\s+/g, ""))) {
            setError(t("A document number looks like NPF/2026/482913."));
            return;
          }
          setError("");
          setAsked(no.trim());
        }}
        className="npf-panel"
      >
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start md:p-6">
          <div className="min-w-0 flex-1">
            <label htmlFor={`${id}-no`} className="npf-field-label">
              {t("Document number")}
            </label>
            <input
              id={`${id}-no`}
              value={no}
              onChange={(e) => setNo(e.target.value)}
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="NPF/2026/482913"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-no-error` : `${id}-no-hint`}
              className="npf-field font-mono uppercase"
            />
            <FieldNote id={`${id}-no`} error={error} hint={t("Printed at the foot of the certificate or report.")} />
          </div>
          <button type="submit" className="npf-btn npf-btn-primary sm:mt-7">
            <SearchIcon aria-hidden className="size-4.5" />
            {t("Check")}
          </button>
        </div>
      </form>

      <div aria-live="polite">
        {found === null ? (
          <div className="flex gap-4 rounded-card bg-npf-error-wash p-6">
            <AlertIcon aria-hidden className="mt-0.5 size-6 shrink-0 text-npf-error" />
            <div>
              <p className="npf-h5 text-npf-ink">{t("Not a document we issued")}</p>
              <p className="npf-small mt-1 text-npf-body">
                {t("No Nigeria Police Force document has the number {no}. Check it was typed exactly. If it was, the paper may be forged: do not rely on it, and report it to the nearest command.", { no: asked.toUpperCase() })}
              </p>
            </div>
          </div>
        ) : found ? (
          <div className="flex gap-4 rounded-card bg-npf-ok-soft p-6">
            <CheckCircle aria-hidden className="mt-0.5 size-6 shrink-0 text-npf-ok" />
            <div className="min-w-0">
              <p className="npf-h5 text-npf-ink">{t("Genuine: issued by the Nigeria Police Force")}</p>
              <dl className="npf-small mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-[10rem_minmax(0,1fr)]">
                <dt className="text-npf-steel">{t("Document")}</dt>
                <dd className="font-medium text-npf-ink">{t(found.service)}</dd>
                <dt className="text-npf-steel">{t("Number")}</dt>
                <dd className="font-mono text-npf-ink">{found.docNo}</dd>
                <dt className="text-npf-steel">{t("Issued")}</dt>
                <dd className="text-npf-ink tabular-nums">{format.date(found.docIssued ?? found.updated)}</dd>
                {found.where ? (
                  <>
                    <dt className="text-npf-steel">{t("Issued by")}</dt>
                    <dd className="text-npf-ink">{commandLabel(t, found.where.state)}</dd>
                  </>
                ) : null}
              </dl>
              <p className="npf-small mt-3 text-npf-body">
                {t("Check that the name on the paper matches the person who gave it to you.")}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
