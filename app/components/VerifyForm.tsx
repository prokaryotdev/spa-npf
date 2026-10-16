"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import Link, { useRouter } from "../i18n/Link";
import { useFormat, useT } from "../i18n/client";
import { cleanDocNo, findDocument, useStore, type TrackedRequest } from "./store";
import { AlertIcon, ArrowRight, CheckIcon, FileIcon, PhoneCallIcon, SearchIcon, ShieldIcon } from "./icons";
import { CopyRef, Tick } from "./ui";
import { FieldNote, commandLabel } from "./Where";

const SAMPLE = "NPF/2026/482913";
const FORMAT = "A document number looks like NPF/2026/482913.";

/**
 * Checking a police document someone has been handed: a clearance
 * certificate at a job interview, a police report at an insurer. Forged
 * police papers are common enough that the people who receive them need a
 * way to check without phoning a station.
 *
 * Built like the tracker: the box in the page head writes ?no=, the answer
 * under it reads it, so a portal can link straight to a checked number.
 *
 * Says only whether the Force issued that number, for what, when and by
 * which command. Nothing about the holder: whoever is checking already has
 * the paper, and the paper has the name.
 */
export function VerifyLookup() {
  const t = useT();
  const id = useId();
  const router = useRouter();
  const asked = useSearchParams().get("no") ?? "";
  const [no, setNo] = useState(asked);
  const [error, setError] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNo(asked);
  }, [asked]);

  return (
    <form
      noValidate
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const v = cleanDocNo(no);
        if (!v) return setError(FORMAT);
        setError("");
        router.push(`/app/verify?no=${encodeURIComponent(v)}`, { scroll: false });
      }}
      className="mt-8 max-w-3xl md:mt-10"
    >
      <label htmlFor={`${id}-no`} className="npf-field-label">
        {t("Document number")}
      </label>
      <div className="npf-field npf-field-icon h-16 rounded-full ps-6 pe-2 shadow-card">
        <SearchIcon aria-hidden className="size-5 shrink-0 text-npf-steel" />
        <input
          id={`${id}-no`}
          value={no}
          onChange={(e) => {
            setNo(e.target.value);
            if (error) setError("");
          }}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          placeholder={SAMPLE}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-no-error` : `${id}-no-hint`}
          className="npf-ref min-w-0 text-lg text-npf-ink uppercase placeholder:font-normal md:text-xl"
        />
        <button type="submit" className="npf-btn npf-btn-primary h-12 hover:bg-npf-blue-mid max-sm:px-4">
          {t("Check")}
        </button>
      </div>
      {error ? (
        <FieldNote id={`${id}-no`} error={error} />
      ) : (
        <p id={`${id}-no-hint`} className="npf-small mt-3 leading-8 text-npf-body">
          {t("Printed at the foot of the certificate or report.")}{" "}
          <span className="npf-ref mx-0.5 rounded-md border border-dashed border-npf-line bg-npf-cloud px-2 py-1 text-[0.8125rem] whitespace-nowrap text-npf-ink">
            {SAMPLE}
          </span>
        </p>
      )}
    </form>
  );
}

export function VerifyResult() {
  const asked = useSearchParams().get("no")?.trim() ?? "";
  const { loaded, requests } = useStore();
  // Read on every render, so a document withdrawn on the console stops verifying here at once.
  void requests;

  if (!asked) return <Guide />;
  if (!loaded) return <div aria-hidden className="h-96 animate-pulse rounded-card bg-npf-cloud" />;

  const no = cleanDocNo(asked) || asked.toUpperCase();
  const found = findDocument(no);
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:gap-8">
      <div className="min-w-0">{found ? <Genuine doc={found} /> : <NoMatch no={no} />}</div>
      <Aside genuine={!!found} />
    </div>
  );
}

/** The verdict head both answers share: navy, a seal, the answer in one word. */
function Verdict({ ok, title, line, no }: { ok: boolean; title: string; line: string; no: string }) {
  const t = useT();
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-5 bg-npf-blue-deep p-5 text-white md:p-7">
      <div className="flex min-w-0 items-start gap-4 md:gap-5">
        <span
          aria-hidden
          className={`npf-seal grid size-12 shrink-0 place-items-center rounded-full ring-4 md:size-14 ${
            ok ? "bg-npf-ok-fill ring-npf-ok-fill/30" : "bg-npf-error ring-npf-error/35"
          }`}
        >
          {ok ? <CheckIcon className="size-6 [stroke-width:2.5] md:size-7" /> : <AlertIcon className="size-6 md:size-7" />}
        </span>
        <div className="min-w-0">
          <h2 id="verify-title" className="font-secondary text-3xl leading-tight font-bold text-balance md:text-4xl">
            {t(title)}
          </h2>
          <p className="npf-small mt-1.5 text-white/80">{t(line)}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 rounded-chip border border-dashed border-white/35 bg-white/10 py-1.5 ps-4 pe-1.5">
        <span className="sr-only">{t("Document number")}: </span>
        <span className="npf-ref text-lg text-white select-all">{no}</span>
        <CopyRef value={no} className="text-white! hover:bg-white/15!" />
      </div>
    </div>
  );
}

function Genuine({ doc }: { doc: TrackedRequest }) {
  const t = useT();
  const format = useFormat();
  const issued = doc.docIssued ?? doc.updated;
  const facts = [
    { label: "Document", value: t(doc.service), strong: true },
    { label: "Issued", value: <time dateTime={issued}>{format.date(issued)}</time> },
    ...(doc.where ? [{ label: "Issued by", value: commandLabel(t, doc.where.state) }] : []),
  ];
  return (
    <section
      aria-labelledby="verify-title"
      aria-live="polite"
      className="npf-enter overflow-hidden rounded-card bg-white shadow-card ring-1 ring-npf-hairline ring-inset"
    >
      <Verdict ok title="Genuine" line="Issued by the Nigeria Police Force" no={doc.docNo ?? ""} />

      <dl className="grid gap-px bg-npf-hairline sm:grid-flow-col sm:auto-cols-fr">
        {facts.map((f) => (
          <div key={f.label} className="min-w-0 bg-white px-5 py-4 md:px-7 md:py-5">
            <dt className="npf-small text-npf-steel">{t(f.label)}</dt>
            <dd className={`npf-body mt-0.5 text-npf-ink tabular-nums ${f.strong ? "font-semibold" : ""}`}>{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="border-t border-npf-hairline bg-npf-paper p-5 md:px-7 md:py-6">
        <h3 className="npf-h5 text-npf-blue-deep">{t("Before you rely on it")}</h3>
        <ul className="mt-4 space-y-3">
          {[
            "The paper says the same document, date and command as this check.",
            "The name on the paper matches the ID of the person who gave it to you.",
          ].map((line) => (
            <li key={line} className="npf-small flex gap-3 text-npf-ink">
              <Tick />
              <span className="max-w-[60ch]">{t(line)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function NoMatch({ no }: { no: string }) {
  const t = useT();
  const steps = [
    { title: "Check every character", text: "Compare the number above with the paper, one character at a time." },
    { title: "Do not rely on the paper", text: "If the number is right, the Force did not issue it, or has withdrawn it. Do not accept it as proof of anything." },
    { title: "Tell the police", text: "Take the paper to the nearest station, or report it online. Forging a police document is a crime." },
  ];
  return (
    <section
      aria-labelledby="verify-title"
      aria-live="polite"
      className="npf-enter overflow-hidden rounded-card bg-white shadow-card ring-1 ring-npf-hairline ring-inset"
    >
      <Verdict ok={false} title="Not a document we issued" line="No Nigeria Police Force document has this number." no={no} />
      <ol className="npf-rows">
        {steps.map((s, n) => (
          <li key={s.title} className="flex gap-4 px-5 py-5 md:px-7">
            <span
              aria-hidden
              className="npf-ref grid size-7 shrink-0 place-items-center rounded-full bg-npf-chip text-sm text-npf-blue-ink"
            >
              {n + 1}
            </span>
            <div className="min-w-0">
              <h3 className="npf-body font-semibold text-npf-ink">{t(s.title)}</h3>
              <p className="npf-small mt-0.5 max-w-[62ch] text-npf-body">{t(s.text)}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-3 border-t border-npf-hairline p-5 md:px-7">
        <Link href="/app/report" className="npf-btn npf-btn-primary hover:bg-npf-blue-mid">
          {t("Report a Crime")}
          <span className="npf-btn-disc">
            <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
          </span>
        </Link>
      </div>
    </section>
  );
}

/** The side column: what a check can and cannot say, said once. */
function Aside({ genuine }: { genuine: boolean }) {
  const t = useT();
  return (
    <aside className="space-y-4 lg:sticky lg:top-28">
      <section aria-labelledby="verify-scope" className="npf-panel">
        <div className="npf-panel-head">
          <h2 id="verify-scope">{t("What a check tells you")}</h2>
        </div>
        <p className="npf-small p-5 text-npf-body">
          {t("Whether the Force issued this number, for which document, when and by which command. Never the holder's name or details: you already have the paper.")}
        </p>
      </section>
      {genuine ? null : (
        <a
          href="tel:112"
          className="npf-row-link group flex items-center gap-4 rounded-card border border-npf-hairline px-5 py-4 focus-visible:-outline-offset-2"
        >
          <span className="npf-disc">
            <PhoneCallIcon className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="npf-body block font-medium text-npf-ink tabular-nums">112</span>
            <span className="npf-small block text-npf-steel">{t("The person is with you and you feel unsafe")}</span>
          </span>
          <ArrowRight className="npf-go" />
        </a>
      )}
    </aside>
  );
}

/**
 * Before a check: where the number is printed (a miniature of the paper's
 * foot, so it is recognised) and what the answer will and will not say.
 */
function Guide() {
  const t = useT();
  const says = ["Which document it is", "The day it was issued", "The command that issued it"];
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:gap-8">
      <section aria-labelledby="verify-where" className="npf-panel">
        <div className="npf-panel-head">
          <h2 id="verify-where">{t("Where to find the number")}</h2>
        </div>
        <div className="p-5 md:p-6">
          {/* The foot of a certificate, drawn: text lines, the stamp, the number. */}
          <div aria-hidden className="relative overflow-hidden rounded-xl bg-npf-cloud px-5 pt-6 md:px-8">
            <div className="rounded-t-lg bg-white px-5 pt-5 pb-6 shadow-card md:px-7">
              <div className="space-y-2.5">
                <span className="block h-2 w-11/12 rounded-full bg-npf-hairline" />
                <span className="block h-2 w-4/5 rounded-full bg-npf-hairline" />
                <span className="block h-2 w-3/5 rounded-full bg-npf-hairline" />
              </div>
              <div className="mt-6 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-npf-steel">{t("Document number")}</p>
                  <p className="npf-ref mt-1 rounded-md bg-npf-gold-wash px-2 py-1 text-sm text-npf-ink ring-2 ring-npf-gold-soft sm:text-base">
                    {SAMPLE}
                  </p>
                </div>
                <span className="grid size-14 shrink-0 -rotate-12 place-items-center rounded-full border-2 border-dashed border-npf-blue/40 text-npf-blue/50 sm:size-16">
                  <ShieldIcon className="size-6" />
                </span>
              </div>
            </div>
          </div>
          <p className="npf-small mt-4 text-npf-body">
            {t("Printed at the foot of the certificate or report.")}{" "}
            {t("Type it with the slashes or without; spaces do not matter.")}
          </p>
        </div>
        <Link
          href="/app/signin"
          className="npf-row-link npf-small flex items-center justify-between gap-4 border-t border-npf-hairline px-5 py-4 font-medium text-npf-blue md:px-6"
        >
          {t("Your own document? Sign in to see its number.")}
          <ArrowRight aria-hidden className="npf-go" />
        </Link>
      </section>

      <section aria-labelledby="verify-scope" className="npf-panel">
        <div className="npf-panel-head">
          <h2 id="verify-scope">{t("What a check tells you")}</h2>
        </div>
        <ul className="npf-rows">
          {says.map((s) => (
            <li key={s} className="npf-small flex items-center gap-3 px-5 py-3.5 text-npf-ink md:px-6">
              <Tick />
              {t(s)}
            </li>
          ))}
          <li className="npf-small flex items-start gap-3 bg-npf-paper px-5 py-4 text-npf-body md:px-6">
            <FileIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-npf-steel" />
            {t("Never the holder's name or details. Check those against their ID.")}
          </li>
        </ul>
      </section>
    </div>
  );
}
