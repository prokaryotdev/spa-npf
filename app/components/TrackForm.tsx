"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import Link, { useRouter } from "../i18n/Link";
import { useFormat, useT } from "../i18n/client";
import {
  addToReport,
  cleanRef,
  findReference,
  useStore,
  type Incident,
  type Media,
  type RequestStatus,
  type TrackedRequest,
} from "./store";
import { AlertIcon, ArrowRight, CheckIcon, ChevronDown, ClockIcon, SearchIcon } from "./icons";
import { MediaPicker } from "./media";
import { CopyRef } from "./ui";
import { FieldNote, RouteCard, line } from "./Where";

const PATTERN = /^NPF-[\dA-Z-]{4,}$/i;
const FORMAT = "A reference looks like NPF-4418 or NPF-2026-1234.";

/** The stages each kind of reference passes through, as the tracker names them. */
const REPORT_STAGES = [
  "Received by the command",
  "Officers assigned",
  "Officers attending",
  "Under investigation",
  "Charged to court",
  "Case closed",
];
const REQUEST_STAGES = ["Submitted", "In Review", "Completed"];

/**
 * The public tracker, in two halves that share the address bar: the box in
 * the page head writes ?ref=, the answer under it reads it. So a reference
 * can be bookmarked, shared, or followed straight from a receipt.
 */
export function TrackLookup() {
  const t = useT();
  const id = useId();
  const router = useRouter();
  const asked = useSearchParams().get("ref") ?? "";
  const [ref, setRef] = useState(asked);
  const [error, setError] = useState("");

  // A link from a receipt, or back and forward through earlier lookups.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRef(asked);
  }, [asked]);

  return (
    <form
      noValidate
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        // However it was typed or pasted ("npf 4418", "4418", "#4418"),
        // looked up and shown in the shape the receipts print.
        const v = cleanRef(ref);
        if (!PATTERN.test(v)) return setError(FORMAT);
        setError("");
        router.push(`/app/track?ref=${encodeURIComponent(v)}`, { scroll: false });
      }}
      className="mt-8 max-w-3xl md:mt-10"
    >
      <label htmlFor={`${id}-ref`} className="npf-field-label">
        {t("Reference number")}
      </label>
      <div className="npf-field npf-field-icon h-16 rounded-full ps-6 pe-2 shadow-card">
        <SearchIcon aria-hidden className="size-5 shrink-0 text-npf-steel" />
        <input
          id={`${id}-ref`}
          value={ref}
          onChange={(e) => {
            setRef(e.target.value);
            if (error) setError("");
          }}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          placeholder="NPF-4418"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-ref-error` : `${id}-ref-hint`}
          className="npf-ref text-lg text-npf-ink uppercase placeholder:font-normal md:text-xl"
        />
        <button type="submit" className="npf-btn npf-btn-primary h-12 hover:bg-npf-blue-mid max-sm:px-4">
          {t("Find")}
        </button>
      </div>
      {error ? (
        <FieldNote id={`${id}-ref`} error={error} />
      ) : (
        // The two shapes drawn as the receipts draw them, so they are recognised.
        <p id={`${id}-ref-hint`} className="npf-small mt-3 leading-8 text-npf-body">
          {t(FORMAT)
            .split(/(NPF-[\d-]*\d)/)
            .map((part, n) =>
              n % 2 ? (
                <span
                  key={n}
                  className="npf-ref mx-0.5 rounded-md border border-dashed border-npf-line bg-npf-cloud px-2 py-1 text-[0.8125rem] whitespace-nowrap text-npf-ink"
                >
                  {part}
                </span>
              ) : (
                part
              ),
            )}
        </p>
      )}
    </form>
  );
}

/** One stage of a reference's journey; `at` is known only once reached. */
type Step = { label: string; at: string | null; done: boolean };
type Tone = "ok" | "review" | "warn" | "error" | "quiet";

const TONE_NODE: Record<Tone, string> = {
  ok: "bg-npf-ok text-white",
  review: "bg-npf-blue text-white shadow-[0_0_0_4px_var(--color-npf-chip)]",
  warn: "bg-npf-warn text-white shadow-[0_0_0_4px_var(--color-npf-gold-wash)]",
  error: "bg-npf-error text-white shadow-[0_0_0_4px_var(--color-npf-error-wash)]",
  quiet: "bg-npf-blue text-white shadow-[0_0_0_4px_var(--color-npf-chip)]",
};
const TONE_BAR: Record<Tone, string> = {
  ok: "bg-npf-ok",
  review: "bg-npf-blue",
  warn: "bg-npf-warn",
  error: "bg-npf-error",
  quiet: "bg-npf-blue",
};
/**
 * The status dot on the Force-blue head, in tones that hold on navy. Work in
 * hand breathes, so a case still moving does not look like one that stopped.
 */
const TONE_DOT: Record<Tone, string> = {
  ok: "bg-npf-ok-fill",
  review: "bg-white motion-safe:animate-pulse",
  warn: "bg-npf-gold-soft",
  error: "bg-npf-alert-soft",
  quiet: "bg-white motion-safe:animate-pulse",
};
const REQUEST_TONE: Record<RequestStatus, Tone> = {
  Submitted: "quiet",
  "In Review": "review",
  "Action Needed": "warn",
  Completed: "ok",
  Rejected: "error",
};

export function TrackResult() {
  const t = useT();
  const asked = useSearchParams().get("ref")?.trim() ?? "";
  const { loaded, requests, incidents } = useStore();

  // Read on every render, so a status moved on the console shows here at once.
  void requests;
  void incidents;

  if (!asked) return <Guide />;
  if (!loaded)
    return <div aria-hidden className="h-96 animate-pulse rounded-card bg-npf-cloud" />;

  const found = findReference(asked);
  // A crime report shows as a report even when the reporter's account holds
  // a request under the same number: the report says more.
  if (found.incident) return <ReportResult key={found.incident.id} incident={found.incident} />;
  if (found.request) return <RequestResult request={found.request} />;
  return (
    <div className="space-y-6">
      <p
        role="status"
        className="npf-body flex max-w-3xl items-start gap-3 rounded-card bg-npf-gold-wash p-5 text-npf-ink md:p-6"
      >
        <AlertIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-npf-warn" />
        <span>
          {t("Nothing matches {ref}. Check the number, or contact the command you reported to.", {
            ref: cleanRef(asked) || asked.toUpperCase(),
          })}
        </span>
      </p>
      <Guide />
    </div>
  );
}

/**
 * Before a search, and after one that missed: where the number is printed,
 * drawn as the two receipts draw it, and the stages the tracker will show.
 */
function Guide() {
  const t = useT();
  const kinds = [
    {
      receipt: t("Report received"),
      sample: "NPF-4418",
      title: t("A crime report"),
      text: t("On the receipt when you report it. Signed in, it is also kept in your account."),
      stages: REPORT_STAGES,
    },
    {
      receipt: t("Application sent"),
      sample: "NPF-2026-1234",
      title: t("A service application"),
      text: t("On the screen when you apply, in your email, and in your account."),
      stages: REQUEST_STAGES,
    },
  ];
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:gap-8">
      <section aria-labelledby="track-where" className="npf-panel">
        <div className="npf-panel-head">
          <h2 id="track-where">{t("Where to find your reference")}</h2>
        </div>
        <ul className="grid gap-px bg-npf-hairline sm:grid-cols-2">
          {kinds.map((k) => (
            <li key={k.sample} className="bg-white p-5 md:p-6">
              {/* A miniature of the receipt itself: the screen people will have seen. */}
              <div aria-hidden className="rounded-xl bg-npf-cloud px-4 pt-5 pb-4 text-center">
                <span className="mx-auto grid size-8 place-items-center rounded-full bg-npf-ok-soft text-npf-ok">
                  <CheckIcon className="size-4" />
                </span>
                <p className="mt-2 font-secondary text-sm font-bold text-npf-blue-deep">{k.receipt}</p>
                <p className="mt-0.5 text-xs text-npf-body">{t("Your reference number")}</p>
                <p className="npf-ref mt-2 inline-block rounded-md border border-dashed border-npf-line bg-white px-3 py-1.5 text-base text-npf-ink">
                  {k.sample}
                </p>
              </div>
              <h3 className="npf-h5 mt-4 text-npf-blue-deep">{k.title}</h3>
              <p className="npf-small mt-1 text-npf-body">{k.text}</p>
            </li>
          ))}
        </ul>
        <Link
          href="/app/signin"
          className="npf-row-link npf-small flex items-center justify-between gap-4 border-t border-npf-hairline px-5 py-4 font-medium text-npf-blue md:px-6"
        >
          {t("Lost it? Sign in to see everything you have sent.")}
          <ArrowRight aria-hidden className="npf-go" />
        </Link>
      </section>

      <section aria-labelledby="track-stages" className="npf-panel">
        <div className="npf-panel-head">
          <h2 id="track-stages">{t("The stages you will see")}</h2>
        </div>
        <div className="npf-rows">
          {kinds.map((k) => (
            <div key={k.sample} className="p-5 md:p-6">
              <h3 className="npf-small font-semibold text-npf-ink">{k.title}</h3>
              <ol className="mt-3 space-y-2.5">
                {k.stages.map((s, n) => (
                  <li key={s} className="npf-small flex items-center gap-3 text-npf-body">
                    <span
                      aria-hidden
                      className="npf-ref grid size-6 shrink-0 place-items-center rounded-full bg-npf-chip text-xs text-npf-blue-ink"
                    >
                      {n + 1}
                    </span>
                    {t(s)}
                  </li>
                ))}
              </ol>
            </div>
          ))}
          <p className="npf-small flex items-start gap-2.5 bg-npf-paper p-5 text-npf-body md:px-6">
            <ClockIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-npf-steel" />
            {t("This page updates as soon as the command moves it on.")}
          </p>
        </div>
      </section>
    </div>
  );
}

/** The stages as a row (wide screens) or a column (inside the phone's disclosure). */
function Stages({ steps, tone, current, row }: { steps: Step[]; tone: Tone; current: number; row?: boolean }) {
  const t = useT();
  const format = useFormat();
  return (
    <ol className={row ? "grid auto-cols-fr grid-flow-col" : "grid"}>
      {steps.map((step, n) => {
        const last = n === steps.length - 1;
        const now = n === current;
        return (
          <li key={step.label} className={`relative flex ${row ? "flex-col gap-3 pe-3" : "gap-4 pb-5 last:pb-0"}`}>
            {/* The thread to the next stage: green where both ends are reached. */}
            {!last ? (
              <span
                aria-hidden
                className={`absolute rounded-full ${
                  row ? "start-11 end-2 top-[15px] h-0.5" : "start-[15px] top-10 bottom-1 w-0.5"
                } ${steps[n + 1].done ? "bg-npf-ok/45" : "bg-npf-hairline"}`}
              />
            ) : null}
            <span
              aria-hidden
              className={`relative grid size-8 shrink-0 place-items-center rounded-full ${
                now ? TONE_NODE[tone] : step.done ? "bg-npf-ok-soft text-npf-ok" : "bg-white ring-1 ring-npf-line ring-inset"
              }`}
            >
              {step.done && (!now || tone === "ok") ? (
                <CheckIcon className="size-4" />
              ) : now ? (
                <span className="size-2 rounded-full bg-white" />
              ) : null}
            </span>
            <span className={`npf-small min-w-0 ${row ? "" : "pt-1"}`}>
              <span
                className={`block ${row ? "min-h-10" : ""} ${
                  now ? "font-semibold text-npf-ink" : step.done ? "font-medium text-npf-ink" : "text-npf-steel"
                }`}
              >
                {t(step.label)}
              </span>
              {step.at ? (
                <time dateTime={step.at} className="block text-npf-steel tabular-nums">
                  {format.dateTime(step.at)}
                </time>
              ) : null}
              <span className="sr-only">{now ? t("(current)") : step.done ? t("Done") : t("Not yet")}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * The answer, said once and big on a Force-blue head: what it is, where it
 * has got to and since when. Then every stage, and what comes next.
 */
function StatusCard({
  title,
  reference,
  status,
  since,
  tone,
  steps,
  next,
  children,
}: {
  title: string;
  reference: string;
  status: string;
  since: string;
  tone: Tone;
  steps: Step[];
  /** What happens next, or the one thing the reader has to do. */
  next?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const t = useT();
  const format = useFormat();
  const current = steps.findLastIndex((s) => s.done);
  return (
    <section
      aria-labelledby="track-title"
      className="npf-enter overflow-hidden rounded-card bg-white shadow-card ring-1 ring-npf-hairline ring-inset"
    >
      <div className="relative flex flex-wrap items-start justify-between gap-x-6 gap-y-5 bg-npf-blue-deep p-5 text-white md:p-7">
        <div className="min-w-0" aria-live="polite">
          <h2 id="track-title" className="font-secondary text-base font-bold text-white/80 md:text-lg">
            {t(title)}
          </h2>
          <p className="mt-2 flex items-center gap-3 font-secondary text-3xl leading-tight font-bold md:text-4xl">
            <span aria-hidden className={`size-3 shrink-0 rounded-full ring-4 ring-white/15 ${TONE_DOT[tone]}`} />
            {t(status)}
          </p>
          <p className="npf-small mt-2 text-white/80 tabular-nums">
            {t("Stage {n} of {total}", { n: String(current + 1), total: String(steps.length) })}
            <span aria-hidden className="mx-2 text-white/40">·</span>
            {t("since {time}", { time: format.dateTime(since) })}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-chip border border-dashed border-white/35 bg-white/10 py-1.5 ps-4 pe-1.5">
          <span className="npf-ref text-lg text-white select-all">{reference}</span>
          <CopyRef value={reference} className="text-white! hover:bg-white/15!" />
        </div>
      </div>

      {/* Phones: the progress as one bar, every stage a tap away. */}
      <div className="border-b border-npf-hairline p-5 lg:hidden">
        <div aria-hidden className="flex gap-1.5">
          {steps.map((s, n) => (
            <span
              key={s.label}
              className={`h-1.5 flex-1 rounded-full ${n === current ? TONE_BAR[tone] : s.done ? "bg-npf-ok/55" : "bg-npf-hairline"}`}
            />
          ))}
        </div>
        <details className="group mt-4">
          <summary className="npf-small flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-npf-blue [&::-webkit-details-marker]:hidden">
            {t("All stages")}
            <ChevronDown aria-hidden className="size-4 transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <div className="pt-5">
            <Stages steps={steps} tone={tone} current={current} />
          </div>
        </details>
      </div>
      <div className="hidden border-b border-npf-hairline p-7 lg:block">
        <Stages row steps={steps} tone={tone} current={current} />
      </div>

      {next}
      {children}
    </section>
  );
}

/** The line under the stages: what comes next, said plainly. */
function NextUp({ step }: { step?: Step }) {
  const t = useT();
  if (!step) return null;
  return (
    <div className="flex items-start gap-3 p-5 md:px-7">
      <span aria-hidden className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-npf-chip text-npf-blue-ink">
        <ArrowRight className="size-4 rtl:-scale-x-100" />
      </span>
      <div className="min-w-0">
        <p className="npf-body font-semibold text-npf-ink">{t("Next: {step}", { step: t(step.label) })}</p>
        <p className="npf-small mt-0.5 text-npf-body">{t("This page updates as soon as the command moves it on.")}</p>
      </div>
    </div>
  );
}

/** Main column and a side column that holds still while the main one scrolls. */
function Layout({ main, side }: { main: React.ReactNode; side: React.ReactNode }) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:gap-8">
      <div className="min-w-0 space-y-6">{main}</div>
      <div className="space-y-4 lg:sticky lg:top-28">{side}</div>
    </div>
  );
}

function RequestResult({ request }: { request: TrackedRequest }) {
  const t = useT();
  const format = useFormat();
  const tone = REQUEST_TONE[request.status];
  const final = request.status === "Completed" || request.status === "Rejected";
  const history = request.timeline.slice().sort((a, b) => a.at.localeCompare(b.at));
  const steps: Step[] = [
    { label: "Submitted", at: request.submitted, done: true },
    {
      label: "In Review",
      at:
        request.status === "Submitted"
          ? null
          : (history.find((h) => /review/i.test(h.label))?.at ?? history[1]?.at ?? request.updated),
      done: request.status !== "Submitted",
    },
    {
      label: request.status === "Rejected" ? "Rejected" : "Completed",
      at: final ? request.updated : null,
      done: final,
    },
  ];
  const note = request.note ? t(request.note) : null;
  const next =
    request.status === "Action Needed" ? (
      <div className="flex flex-wrap items-center justify-between gap-4 bg-npf-gold-wash p-5 md:px-7">
        <p className="npf-body flex min-w-0 flex-1 basis-64 items-start gap-3 text-npf-ink">
          <AlertIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-npf-warn" />
          <span>{note}</span>
        </p>
        <Link href="/app/signin" className="npf-btn npf-btn-primary hover:bg-npf-blue-mid">
          {t("Sign in")}
          <span className="npf-btn-disc">
            <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
          </span>
        </Link>
      </div>
    ) : final ? (
      note ? (
        <p className={`npf-body p-5 text-npf-ink md:px-7 ${request.status === "Rejected" ? "bg-npf-error-wash" : "bg-npf-ok-soft"}`}>
          {note}
        </p>
      ) : null
    ) : (
      <NextUp step={steps.find((s) => !s.done)} />
    );
  return (
    <Layout
      main={
        <>
          <StatusCard
            title={request.service}
            reference={request.id}
            status={request.status}
            since={request.updated}
            tone={tone}
            steps={steps}
            next={next}
          />
          <section aria-labelledby="track-history" className="npf-panel">
            <div className="npf-panel-head">
              <h2 id="track-history">{t("History")}</h2>
            </div>
            <ol className="npf-rows">
              {history.reverse().map((s) => (
                <li key={s.at + s.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4 md:px-6">
                  <time dateTime={s.at} className="npf-small text-npf-steel tabular-nums">
                    {format.dateTime(s.at)}
                  </time>
                  <span className="npf-small text-npf-ink">
                    <span className="block font-semibold">{t(s.label)}</span>
                    {s.note ? <span className="text-npf-body">{line(t, s.note, s.vars, request.where)}</span> : null}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </>
      }
      side={request.where ? <RouteCard filed where={request.where} /> : null}
    />
  );
}

/**
 * A crime report, as its reporter is entitled to see it: where it has got
 * to, the crime reference once there is a case, what the investigator has
 * chosen to tell them, and a way to add what they remember later. Never the
 * unit, the officers' names, the suspects or the desk's log.
 */
function ReportResult({ incident }: { incident: Incident }) {
  const t = useT();
  const format = useFormat();
  const { cases } = useStore();
  const file = cases.find((c) => c.id === incident.caseId);

  const stages: { label: string; at: string | null }[] = [
    { label: "Received by the command", at: incident.reported },
    { label: "Officers assigned", at: incident.dispatched },
    { label: "Officers attending", at: incident.onScene },
    ...(file
      ? [
          { label: "Under investigation", at: file.opened },
          {
            label: "Charged to court",
            at:
              file.stage === "Charged to court" || (file.stage === "Closed" && file.result === "Convicted")
                ? (file.log.find((l) => l.vars?.stage === "Charged to court")?.at ?? file.updated)
                : null,
          },
          { label: "Case closed", at: file.stage === "Closed" ? file.updated : null },
        ]
      : [{ label: "Case closed", at: incident.closed }]),
  ];
  const steps = stages.map((s) => ({ ...s, done: !!s.at }));
  const reached = steps.filter((s) => s.done).at(-1) ?? steps[0];
  const done = reached.label === "Case closed";

  return (
    <Layout
      main={
        <>
          <StatusCard
            title={incident.kind}
            reference={incident.id}
            status={reached.label}
            since={reached.at ?? incident.reported}
            tone={done ? "ok" : "review"}
            steps={steps}
            next={done ? null : <NextUp step={steps.find((s) => !s.done)} />}
          >
            {file ? (
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-npf-hairline bg-npf-paper px-5 py-4 md:px-7">
                <p className="npf-small max-w-[52ch] text-npf-body">
                  {t("Crime reference")}{" "}
                  <span className="npf-ref text-npf-ink select-all">{file.id}</span>.{" "}
                  {t("Quote it to your insurer or your bank if they ask for a police report.")}
                </p>
                <CopyRef value={file.id} />
              </div>
            ) : null}
          </StatusCard>

          {file?.updates.length ? (
            <section aria-labelledby="track-updates" className="npf-panel">
              <div className="npf-panel-head">
                <h2 id="track-updates">{t("Updates from the investigator")}</h2>
              </div>
              <ol className="npf-rows">
                {file.updates
                  .slice()
                  .reverse()
                  .map((u) => (
                    <li key={u.at} className="px-5 py-4 md:px-6">
                      <time dateTime={u.at} className="npf-small block text-npf-steel tabular-nums">
                        {format.dateTime(u.at)}
                      </time>
                      <p className="npf-body mt-1 max-w-[65ch] text-npf-ink">{t(u.text)}</p>
                    </li>
                  ))}
              </ol>
            </section>
          ) : null}
        </>
      }
      side={
        <>
          <RouteCard filed where={incident.where} />
          {!done ? <AddInformation reference={incident.id} /> : null}
        </>
      }
    />
  );
}

/**
 * Something remembered later, a photo found on a phone: added to the same
 * report, so it reaches the officers on the call and the investigator.
 */
function AddInformation({ reference }: { reference: string }) {
  const t = useT();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [media, setMedia] = useState<Media[]>([]);
  const [sent, setSent] = useState(false);
  if (sent)
    return (
      <p role="status" className="npf-small flex items-start gap-3 rounded-card bg-npf-ok-soft p-5 text-npf-ok">
        <CheckIcon aria-hidden className="size-5 shrink-0" />
        {t("Added to {ref}. The officers handling it can see it now.", { ref: reference })}
      </p>
    );
  return (
    <section aria-labelledby={`${id}-head`} className="npf-panel">
      <div className="npf-panel-head">
        <h2 id={`${id}-head`}>{t("Add information to this report")}</h2>
      </div>
      {open ? (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim() && !media.length) return;
            if (addToReport(reference, text.trim(), media)) setSent(true);
          }}
          className="grid gap-5 p-5"
        >
          <div>
            <label htmlFor={`${id}-text`} className="npf-field-label">
              {t("What you want to add")}
            </label>
            <textarea
              id={`${id}-text`}
              rows={4}
              maxLength={2000}
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-describedby={`${id}-text-hint`}
              className="npf-field"
            />
            <p id={`${id}-text-hint`} className="npf-hint">
              {t("Something you remembered, a name, a plate number, where they went.")}
            </p>
          </div>
          <MediaPicker id={`${id}-media`} optional label={t("Photos, video or documents")} media={media} onChange={setMedia} by="Reporter" />
          <button type="submit" disabled={!text.trim() && !media.length} className="npf-btn npf-btn-primary w-full hover:bg-npf-blue-mid">
            {t("Add to the report")}
          </button>
        </form>
      ) : (
        <div className="space-y-4 p-5">
          <p className="npf-small text-npf-body">
            {t("Remembered something, or found a photo? Add it here and it goes to the officers handling it.")}
          </p>
          <button type="button" onClick={() => setOpen(true)} className="npf-btn npf-btn-secondary npf-btn-sm w-full">
            {t("Add")}
          </button>
        </div>
      )}
    </section>
  );
}
