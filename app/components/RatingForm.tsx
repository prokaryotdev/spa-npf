"use client";

import { useId, useState } from "react";
import { AlertIcon, ArrowDown, ArrowRight, CheckIcon, StarIcon } from "./icons";
import { useT } from "../i18n/client";

type Option = { slug: string; name: string };
type Group = { label: string; options: Option[] };
type Errors = { service?: string; score?: string };

/** One word per score, so the choice never rests on counting stars. */
const SCORES = ["Very poor", "Poor", "Okay", "Good", "Very good"];

/**
 * A rating is one service, one score and, if they like, a few words. No name
 * or email: it is anonymous, and anyone who wants a reply has Contact Us.
 *
 * ponytail: validation only — nothing receives this yet. Point `onSubmit` at a
 * real endpoint when there is one.
 */
export default function RatingForm({
  groups,
  initial = "",
}: {
  groups: Group[];
  /** A slug from ?service=, so a service page can link straight here. */
  initial?: string;
}) {
  const t = useT();
  const id = useId();
  const [service, setService] = useState(initial);
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const shown = hover || score;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Errors = {};
    if (!service) next.service = "Pick the service you used.";
    if (!score) next.score = "Pick a score from 1 to 5.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSent(true);
  }

  if (sent) {
    const name =
      groups.flatMap((g) => g.options).find((o) => o.slug === service)?.name ??
      "";
    return (
      <div
        role="status"
        className="flex flex-col items-center rounded-card border border-npf-hairline bg-white px-6 py-12 text-center"
      >
        <span className="grid size-14 place-items-center rounded-full bg-npf-ok-soft text-npf-ok">
          <CheckIcon className="size-7" />
        </span>
        <h2 className="npf-h4 mt-5 max-w-[30ch] text-npf-blue-deep">
          {t("Thank you for rating {service}", { service: name })}
        </h2>
        <p className="npf-body mt-2 max-w-[52ch] text-npf-body">
          {t(
            "You gave it {score} out of 5. Ratings show the Force which services need work.",
            { score: String(score) },
          )}
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setService("");
            setScore(0);
          }}
          className="npf-btn npf-btn-secondary mt-6"
        >
          {t("Rate another service")}
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="npf-panel">
      <div className="px-5 pt-6 md:px-8 md:pt-8">
        <label htmlFor={`${id}-service`} className="npf-h5 block text-npf-ink">
          {t("Which service did you use?")}
        </label>
        <span className="npf-select-wrap mt-4 w-full">
          <select
            id={`${id}-service`}
            value={service}
            onChange={(e) => setService(e.target.value)}
            aria-invalid={errors.service ? true : undefined}
            aria-describedby={errors.service ? `${id}-service-error` : undefined}
            className="npf-select h-12 w-full min-w-0 bg-white"
          >
            <option value="">{t("Choose a service")}</option>
            {groups.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.options.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ArrowDown aria-hidden className="npf-select-arrow" />
        </span>
        {errors.service ? (
          <FieldError id={`${id}-service-error`}>{t(errors.service)}</FieldError>
        ) : null}
      </div>

      <fieldset
        aria-describedby={errors.score ? `${id}-score-error` : undefined}
        className="mt-7 border-0 border-t border-npf-hairline px-5 pt-6 md:px-8"
      >
        <legend className="npf-h5 float-left w-full text-npf-ink">
          {t("How was it?")}
        </legend>
        {/* Stars fill up to the one under the pointer, then settle back on
            the choice; the word under each is the label, so a score is
            never read from colour or count alone. */}
        <div
          className="clear-left grid grid-cols-5 gap-2 pt-4 sm:gap-3"
          onMouseLeave={() => setHover(0)}
        >
          {SCORES.map((word, i) => {
            const n = i + 1;
            const lit = n <= shown;
            return (
              <label
                key={word}
                onMouseEnter={() => setHover(n)}
                className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-card px-1 py-3 text-center ring-inset transition-[background-color,box-shadow,scale] duration-(--dur-hover) ease-(--ease-out) active:scale-[0.97] active:duration-(--dur-press) has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-npf-blue-mid sm:py-4 ${
                  score === n
                    ? "bg-npf-mist ring-2 ring-npf-blue"
                    : "ring-1 ring-npf-hairline hover:bg-npf-paper"
                }`}
              >
                <input
                  type="radio"
                  name="score"
                  value={n}
                  checked={score === n}
                  onChange={() => setScore(n)}
                  className="sr-only"
                />
                <StarIcon
                  className={`size-7 transition-[color,fill,scale] duration-(--dur-hover) ease-(--ease-out) sm:size-8 ${
                    lit
                      ? "scale-105 fill-npf-gold-soft text-npf-gold"
                      : "fill-transparent text-npf-steel/60"
                  }`}
                />
                <span className="font-secondary text-lg leading-none font-bold text-npf-ink tabular-nums">
                  {n}
                </span>
                <span className="text-2xs leading-tight text-pretty text-npf-body sm:text-sm">
                  {t(word)}
                </span>
              </label>
            );
          })}
        </div>
        {errors.score ? (
          <FieldError id={`${id}-score-error`}>{t(errors.score)}</FieldError>
        ) : null}
      </fieldset>

      <div className="mt-7 border-t border-npf-hairline px-5 pt-6 md:px-8">
        <label htmlFor={`${id}-comment`} className="npf-field-label">
          {t("Tell us more (optional)")}
        </label>
        <p id={`${id}-comment-hint`} className="npf-small -mt-1 mb-2 text-npf-steel">
          {t("What went well, or what should change. Leave out names and reference numbers.")}
        </p>
        <textarea
          id={`${id}-comment`}
          name="comment"
          rows={4}
          maxLength={1000}
          aria-describedby={`${id}-comment-hint`}
          className="npf-field"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-npf-hairline px-5 pt-6 pb-7 md:px-8 md:pb-8">
        <p className="npf-small text-npf-steel">
          {t("Your rating is anonymous.")}
        </p>
        <button type="submit" className="npf-btn npf-btn-primary max-sm:w-full">
          {t("Send rating")}
          <span className="npf-btn-disc">
            <ArrowRight className="npf-arrow size-4 rtl:-scale-x-100" />
          </span>
        </button>
      </div>
    </form>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="npf-small mt-2 flex items-start gap-1.5 text-npf-error">
      <AlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
      {children}
    </p>
  );
}
