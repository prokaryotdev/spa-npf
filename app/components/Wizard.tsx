"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useT } from "../i18n/client";
import { ArrowLeft, ArrowRight, CheckIcon, CloseIcon, FileIcon } from "./icons";
import { FieldNote } from "./Where";

/**
 * The pieces every multi-step form on the site is built from: the step list,
 * the panel a step lives in, choice cards, chips, a file picker and the
 * read-back before sending. The report form and the service application
 * share them, so a citizen who has done one has learnt the other.
 */

/** The steps, as a list: done ones ticked and reachable, the rest ahead. */
export function StepList({
  steps,
  current,
  onPick,
}: {
  steps: string[];
  current: number;
  onPick: (i: number) => void;
}) {
  const t = useT();
  return (
    <>
      {/* A phone gets one line and a bar; the rail is a desk's. */}
      <div className="lg:hidden">
        <p className="npf-small flex items-baseline justify-between gap-3 text-npf-body">
          <span className="font-medium text-npf-ink">{t(steps[current])}</span>
          <span className="tabular-nums">
            {t("Step {n} of {total}", { n: current + 1, total: steps.length })}
          </span>
        </p>
        <div
          aria-hidden
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-npf-cloud"
        >
          <div
            className="h-full rounded-full bg-npf-blue transition-[width] duration-(--dur-media) ease-(--ease-out)"
            style={{ width: `${((current + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <nav
        aria-label={t("Steps")}
        className="hidden rounded-card bg-white p-2 ring-1 ring-npf-hairline ring-inset lg:block"
      >
        <div className="px-3 pt-3 pb-4">
          <p className="npf-small font-medium text-npf-ink tabular-nums">
            {t("Step {n} of {total}", { n: current + 1, total: steps.length })}
          </p>
          <div aria-hidden className="mt-2.5 flex gap-1">
            {steps.map((label, i) => (
              <span
                key={label}
                className={`h-1 flex-1 rounded-full transition-colors duration-(--dur-media) ease-(--ease-out) ${
                  i < current
                    ? "bg-npf-ok"
                    : i === current
                      ? "bg-npf-blue"
                      : "bg-npf-cloud"
                }`}
              />
            ))}
          </div>
        </div>
        <ol className="space-y-1 border-t border-npf-hairline pt-2">
          {steps.map((label, i) => {
            const done = i < current;
            const here = i === current;
            return (
              <li key={label} className="relative">
                {/* The thread from this step to the next: green once passed. */}
                {i < steps.length - 1 ? (
                  <span
                    aria-hidden
                    className={`absolute start-[25px] top-[38px] h-6 w-0.5 rounded-full transition-colors duration-(--dur-media) ${
                      done ? "bg-npf-ok/45" : "bg-npf-hairline"
                    }`}
                  />
                ) : null}
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => onPick(i)}
                  aria-current={here ? "step" : undefined}
                  className={`relative flex min-h-12 w-full items-center gap-3 rounded-chip px-3 text-start text-sm transition-colors duration-(--dur-hover) ${
                    here
                      ? "bg-npf-mist font-semibold text-npf-blue-deep"
                      : done
                        ? "text-npf-ink hover:bg-npf-paper"
                        : "cursor-default text-npf-steel"
                  }`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums transition-colors duration-(--dur-hover) ${
                      here
                        ? "bg-npf-blue text-white shadow-[0_0_0_4px_var(--color-npf-chip)]"
                        : done
                          ? "bg-npf-ok-soft text-npf-ok"
                          : "bg-white text-npf-steel ring-1 ring-npf-hairline ring-inset"
                    }`}
                  >
                    {done ? (
                      <CheckIcon aria-hidden className="size-3.5" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  {t(label)}
                  {done ? <span className="sr-only">{t("(done)")}</span> : null}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/**
 * One step. Its heading takes focus when the step opens, so a screen reader
 * hears where it now is and the keyboard starts from the top of it.
 */
export function StepPanel({
  title,
  intro,
  step,
  children,
  onBack,
  onNext,
  nextLabel,
  busy,
  tone = "brand",
}: {
  title: string;
  intro?: string;
  step: number;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  busy?: boolean;
  tone?: "brand" | "alert";
}) {
  const t = useT();
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => {
    // Not on first paint: the page heading leads there, not the step.
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus({ preventScroll: true });
    // The whole panel, not the heading: under the sticky site header the
    // heading's own top lands behind it on a phone.
    heading.current?.closest("form")?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [step]);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onNext?.();
      }}
      className="npf-panel scroll-mt-28 animate-[npf-page-in_var(--dur-reveal)_var(--ease-out)] md:scroll-mt-36"
    >
      <div className="px-5 pt-6 md:px-8 md:pt-8">
        <h2
          ref={heading}
          tabIndex={-1}
          className="npf-h4 scroll-mt-32 text-npf-blue-deep outline-none"
        >
          {title}
        </h2>
        {intro ? (
          <p className="npf-body mt-2 max-w-[62ch] text-npf-body">{intro}</p>
        ) : null}
      </div>
      <div className="space-y-7 px-5 pt-6 pb-7 md:px-8 md:pb-8">{children}</div>
      {onNext || onBack ? (
        <div className="flex flex-wrap-reverse items-center justify-between gap-3 border-t border-npf-hairline bg-npf-paper px-5 py-4 md:px-8">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="npf-btn npf-btn-ghost npf-btn-sm -ms-3 text-npf-blue"
            >
              <ArrowLeft aria-hidden className="size-4 rtl:-scale-x-100" />
              {t("Back")}
            </button>
          ) : (
            <span />
          )}
          {onNext ? (
            <button
              type="submit"
              disabled={busy}
              className={`npf-btn ${tone === "alert" ? "npf-btn-alert" : "npf-btn-primary hover:bg-npf-blue-mid"} max-sm:w-full`}
            >
              {nextLabel ?? t("Continue")}
              <span className="npf-btn-disc">
                <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
              </span>
            </button>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

/** A radio drawn as a card: a title, a line under it, a ring when chosen. */
export function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  title,
  hint,
  tone = "brand",
  Icon,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: string;
  hint?: string;
  tone?: "brand" | "alert";
  /** A glyph for the few big either/or questions; long lists stay plain. */
  Icon?: (p: { className?: string }) => React.ReactNode;
}) {
  const ring =
    tone === "alert"
      ? checked
        ? "bg-npf-error-wash ring-2 ring-npf-alert"
        : "ring-1 ring-npf-hairline hover:bg-npf-paper hover:ring-npf-alert/40"
      : checked
        ? "bg-npf-mist ring-2 ring-npf-blue"
        : "ring-1 ring-npf-hairline hover:bg-npf-paper hover:ring-npf-blue-mid/45";
  return (
    <label
      className={`relative flex cursor-pointer items-start rounded-card ${Icon ? "gap-4 p-4 md:p-5" : "gap-3 px-4 py-3.5 sm:p-4"} ring-inset transition-[background-color,box-shadow,scale] duration-(--dur-hover) ease-(--ease-out) active:scale-[0.99] active:duration-(--dur-press) has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-npf-blue-mid ${ring}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      {Icon ? (
        <span
          aria-hidden
          className={`grid size-11 shrink-0 place-items-center rounded-chip transition-colors duration-(--dur-hover) ${
            tone === "alert"
              ? checked
                ? "bg-npf-alert text-white"
                : "bg-npf-error-wash text-npf-alert-deep"
              : checked
                ? "bg-npf-blue text-white"
                : "bg-npf-cloud text-npf-blue-ink"
          }`}
        >
          <Icon className="size-5.5" />
        </span>
      ) : (
        <Dot checked={checked} tone={tone} />
      )}
      <span className={`min-w-0 flex-1 ${Icon ? "pt-0.5" : ""}`}>
        <span className="npf-h5 block leading-snug text-npf-ink">{title}</span>
        {hint ? (
          <span className="npf-small mt-0.5 block text-npf-body">{hint}</span>
        ) : null}
      </span>
      {Icon ? <Dot checked={checked} tone={tone} /> : null}
    </label>
  );
}

function Dot({ checked, tone }: { checked: boolean; tone: "brand" | "alert" }) {
  return (
    <span
      aria-hidden
      className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full transition-colors ${
        checked
          ? tone === "alert"
            ? "bg-npf-alert"
            : "bg-npf-blue"
          : "ring-1 ring-[color-mix(in_srgb,var(--color-npf-ink)_25%,transparent)] ring-inset"
      }`}
    >
      <span
        className={`size-2 rounded-full bg-white transition-transform duration-(--dur-hover) ${checked ? "scale-100" : "scale-0"}`}
      />
    </span>
  );
}

/** A short radio group drawn as pills: Yes / No / Not sure. */
export function Chips({
  legend,
  name,
  options,
  value,
  onChange,
  error,
}: {
  legend: string;
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const id = useId();
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="npf-field-label">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o.value;
          return (
            <label
              key={o.value}
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 text-sm font-medium ring-inset transition-[background-color,color,box-shadow,scale] duration-(--dur-hover) ease-(--ease-out) active:scale-[0.97] active:duration-(--dur-press) has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-npf-blue-mid ${
                on
                  ? "bg-npf-blue text-white ring-1 ring-npf-blue"
                  : "bg-white text-npf-ink ring-1 ring-npf-hairline hover:bg-npf-paper hover:ring-npf-blue-mid/45"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={on}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
      <FieldNote id={id} error={error} />
    </fieldset>
  );
}

/** A labelled text input or textarea in the site's field. */
export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  multiline,
  optional,
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  multiline?: boolean;
  optional?: boolean;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "id"
>) {
  const t = useT();
  const described = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="npf-field-label">
        {label}
        {optional ? (
          <span className="font-normal text-npf-steel"> {t("(optional)")}</span>
        ) : null}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={described}
          rows={5}
          placeholder={rest.placeholder}
          maxLength={rest.maxLength}
          className="npf-field"
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={described}
          className="npf-field"
          {...rest}
        />
      )}
      <FieldNote id={id} error={error} hint={hint} />
    </div>
  );
}

const MB = 1024 * 1024;

/**
 * Files, picked and listed by name. The files themselves stay in the
 * browser in this build; the API takes them as an upload (see
 * docs/API-CONTRACT.md) and the form sends their names until then.
 */
export function FilePicker({
  id,
  label,
  hint,
  files,
  onChange,
  max = 5,
  maxMb = 20,
  accept = "image/*,video/*,audio/*,application/pdf",
  optional,
  error,
}: {
  id: string;
  label: string;
  hint?: string;
  files: string[];
  onChange: (files: string[]) => void;
  max?: number;
  maxMb?: number;
  accept?: string;
  optional?: boolean;
  error?: string;
}) {
  const t = useT();
  const input = useRef<HTMLInputElement>(null);
  const [tooBig, setTooBig] = useState<string[]>([]);
  return (
    <div>
      <p className="npf-field-label" id={`${id}-label`}>
        {label}
        {optional ? (
          <span className="font-normal text-npf-steel"> {t("(optional)")}</span>
        ) : null}
      </p>
      {files.length ? (
        <ul className="mb-3 divide-y divide-npf-hairline overflow-hidden rounded-chip border border-npf-hairline">
          {files.map((f) => (
            <li key={f} className="flex items-center gap-3 px-3 py-2.5 text-sm">
              <FileIcon
                aria-hidden
                className="size-4.5 shrink-0 text-npf-blue"
              />
              <span className="min-w-0 flex-1 truncate text-npf-ink">{f}</span>
              <button
                type="button"
                onClick={() => onChange(files.filter((x) => x !== f))}
                className="grid size-9 shrink-0 place-items-center rounded-full text-npf-steel transition-colors hover:bg-npf-cloud hover:text-npf-ink"
              >
                <CloseIcon aria-hidden className="size-4" />
                <span className="sr-only">
                  {t("Remove {file}", { file: f })}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {files.length < max ? (
        <>
          <input
            ref={input}
            id={id}
            type="file"
            multiple={max > 1}
            accept={accept}
            aria-labelledby={`${id}-label`}
            aria-describedby={`${id}-hint`}
            className="sr-only"
            onChange={(e) => {
              const picked = [...(e.target.files ?? [])];
              setTooBig(
                picked.filter((f) => f.size > maxMb * MB).map((f) => f.name),
              );
              const ok = picked
                .filter((f) => f.size <= maxMb * MB)
                .map((f) => f.name)
                .filter((n) => !files.includes(n));
              onChange([...files, ...ok].slice(0, max));
              e.target.value = "";
            }}
          />
          <label
            htmlFor={id}
            className="npf-btn npf-btn-secondary npf-btn-sm cursor-pointer has-[:focus-visible]:outline-2"
          >
            <FileIcon aria-hidden className="size-4" />
            {files.length ? t("Add another file") : t("Choose files")}
          </label>
        </>
      ) : null}
      <p id={`${id}-hint`} className="npf-hint">
        {hint ??
          t("Up to {max} files, {mb} MB each. Photos, video, audio or PDF.", {
            max,
            mb: maxMb,
          })}
      </p>
      {tooBig.length ? (
        <FieldNote
          id={`${id}-size`}
          error={t("Too large to attach: {files}", {
            files: tooBig.join(", "),
          })}
        />
      ) : null}
      <FieldNote id={id} error={error} />
    </div>
  );
}

/** The read-back before sending: each section with a way back to change it. */
export function Review({
  sections,
  onEdit,
}: {
  sections: { title: string; step: number; rows: [string, string][] }[];
  onEdit: (step: number) => void;
}) {
  const t = useT();
  return (
    <div className="divide-y divide-npf-hairline overflow-hidden rounded-card border border-npf-hairline">
      {sections.map((s) => (
        <section key={s.title} className="px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="npf-h5 text-npf-blue-deep">{s.title}</h3>
            <button
              type="button"
              onClick={() => onEdit(s.step)}
              className="npf-small -my-2 inline-flex min-h-10 items-center rounded-full px-2 font-medium text-npf-blue underline-offset-4 hover:underline"
            >
              {t("Change")}
              <span className="sr-only"> {s.title}</span>
            </button>
          </div>
          <dl className="mt-2 grid gap-x-6 gap-y-2 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
            {s.rows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="npf-small text-npf-steel">{k}</dt>
                <dd className="npf-small break-words whitespace-pre-line text-npf-ink">
                  {v || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

/** A tick box with its sentence, for declarations. */
export function Declare({
  checked,
  onChange,
  children,
  error,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  error?: string;
}) {
  const id = useId();
  return (
    <div>
      <label
        className={`flex cursor-pointer items-start gap-3 rounded-card p-4 ring-inset has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-npf-blue-mid ${
          error
            ? "ring-2 ring-npf-error"
            : "bg-npf-paper ring-1 ring-npf-hairline"
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="sr-only"
        />
        <span
          aria-hidden
          className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md transition-colors ${
            checked
              ? "bg-npf-blue text-white"
              : "bg-white ring-1 ring-[color-mix(in_srgb,var(--color-npf-ink)_30%,transparent)] ring-inset"
          }`}
        >
          {checked ? <CheckIcon className="size-3.5" /> : null}
        </span>
        <span className="npf-small text-npf-ink">{children}</span>
      </label>
      <FieldNote id={id} error={error} />
    </div>
  );
}

/** Nigerian mobile numbers: 080…, +234 80…, with spaces or dashes. */
export const PHONE = /^(?:\+?234|0)[789][01]\d{8}$/;
export const cleanPhone = (s: string) => s.replace(/[\s-]/g, "");

/** Move focus to the first field marked invalid, after the render. */
export function focusFirstError() {
  requestAnimationFrame(() => {
    // A field marked invalid, or else the first choice in the group whose
    // error line is showing (radio cards carry the error on the group).
    const field = document.querySelector<HTMLElement>('[aria-invalid="true"]');
    const line = document.querySelector<HTMLElement>("form .text-npf-error");
    const el =
      field ?? line?.closest("fieldset")?.querySelector<HTMLElement>("input");
    el?.focus();
    (el?.closest("label") ?? el)?.scrollIntoView({ block: "center" });
  });
}
