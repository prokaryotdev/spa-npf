"use client";

import { useId, useState } from "react";
import {
  AlertIcon,
  ArrowRight,
  CheckIcon,
  HeartIcon,
  IdeaIcon,
} from "./icons";
import Link from "../i18n/Link";
import { ChoiceCard } from "./Wizard";
import { useT } from "../i18n/client";

type Kind = { title: string; description: string };
type Errors = { name?: string; email?: string; message?: string };

/**
 * The CMS icon paths are dead, so each kind gets one of ours, by position in
 * content-footer's list (titles arrive translated, so they can't be keys):
 * suggestion, remark, complaint.
 */
const ICONS = [IdeaIcon, HeartIcon, AlertIcon];
const COMPLAINT = 2;

/**
 * The three feedback kinds are one submission with a type on it, so they are a
 * radio group rather than three separate forms.
 *
 * ponytail: validation only — nothing receives this yet. Point `onSubmit` at a
 * real endpoint when there is one.
 */
export default function FeedbackForm({
  kinds,
  notice,
}: {
  kinds: readonly Kind[];
  notice: string;
}) {
  const t = useT();
  const id = useId();
  const [pick, setPick] = useState(0);
  const chosen = kinds[pick];
  const kind = chosen?.title ?? "";
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = "Tell us your name.";
    if (!email) next.email = "We need an email address to reply to.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      next.email = "That does not look like an email address.";
    if (!message) next.message = "Tell us what happened.";
    else if (message.length < 20)
      next.message = "A little more detail helps — 20 characters or more.";

    setErrors(next);
    if (Object.keys(next).length) return;
    setSent(true);
    e.currentTarget.reset();
  }

  if (sent) {
    return (
      <div
        role="status"
        className="mt-6 flex flex-col items-center rounded-card border border-npf-hairline bg-white px-6 py-12 text-center"
      >
        <span className="grid size-14 place-items-center rounded-full bg-npf-ok-soft text-npf-ok">
          <CheckIcon className="size-7" />
        </span>
        <h3 className="npf-h4 mt-5 max-w-[30ch] text-npf-blue-deep">
          {t("Thank you — your {kind} has been recorded", {
            kind: t(kind).toLowerCase(),
          })}
        </h3>
        <p className="npf-body mt-2 max-w-[52ch] text-npf-body">
          {t(
            "A member of the team will be in touch by email. Reference numbers are issued once the service is connected.",
          )}
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="npf-btn npf-btn-secondary mt-6"
        >
          {t("Send another")}
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="npf-panel mt-6"
    >
      {/* Drawn with the report form's own choice cards, so a citizen who has
          reported a crime already knows how this one works. One per row, each
          saying what it is for, so no translated title is squeezed. */}
      <fieldset className="border-0 px-5 pt-6 md:px-8 md:pt-8">
        <legend className="npf-h5 float-left w-full text-npf-ink">
          {t("What would you like to share?")}
        </legend>
        <div className="clear-left grid gap-3 pt-4">
          {kinds.map((k, i) => (
            <ChoiceCard
              key={k.title}
              name="kind"
              value={k.title}
              checked={pick === i}
              onChange={() => setPick(i)}
              title={k.title}
              hint={k.description}
              Icon={ICONS[i]}
            />
          ))}
        </div>
        {pick === COMPLAINT ? (
          <p
            aria-live="polite"
            className="npf-small mt-4 flex items-start gap-2.5 rounded-chip bg-npf-mist px-4 py-3 text-npf-body"
          >
            <AlertIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-npf-blue-ink" />
            <span>
              {t("About how a police officer behaved?")}{" "}
              <Link
                href="/app/services/leaders-at-your-service"
                className="font-medium text-npf-blue underline underline-offset-2 hover:text-npf-blue-deep"
              >
                {t("The Complaint Response Unit takes those.")}
              </Link>
            </span>
          </p>
        ) : null}
      </fieldset>

      <div className="mt-7 grid grid-cols-1 gap-5 border-t border-npf-hairline px-5 pt-6 pb-7 md:grid-cols-2 md:px-8 md:pb-8 xl:grid-cols-3">
        <Field
          id={`${id}-name`}
          name="name"
          label={t("Your name")}
          autoComplete="name"
          error={errors.name}
        />
        <Field
          id={`${id}-email`}
          name="email"
          type="email"
          label={t("Email address")}
          autoComplete="email"
          error={errors.email}
        />
        <Field
          id={`${id}-phone`}
          name="phone"
          type="tel"
          label={t("Phone number (optional)")}
          autoComplete="tel"
          className="md:col-span-2 xl:col-span-1"
        />

        <div className="md:col-span-2 xl:col-span-3">
          <label htmlFor={`${id}-message`} className="npf-field-label">
            {t("Your {kind}", { kind: t(kind).toLowerCase() })}
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={6}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={
              errors.message ? `${id}-message-error` : undefined
            }
            className="npf-field"
          />
          {errors.message ? (
            <FieldError id={`${id}-message-error`}>
              {t(errors.message)}
            </FieldError>
          ) : null}
        </div>
      </div>

      {/* The law comes before the button, read as a warning in its own
          right: a plain headline anyone can take in, the citation under it. */}
      <div className="border-t border-npf-hairline px-5 pt-6 pb-7 md:px-8 md:pb-8">
        <div
          role="note"
          className="flex items-start gap-4 rounded-card bg-npf-gold-wash px-4 py-4 ring-1 ring-npf-gold-soft/70 ring-inset md:px-5"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-npf-warn ring-1 ring-npf-gold-soft ring-inset">
            <AlertIcon aria-hidden className="size-5" />
          </span>
          <p className="min-w-0">
            <strong className="npf-h5 block text-npf-ink">
              {t("Only tell us what is true")}
            </strong>
            <span className="npf-small mt-1 block text-npf-body">{notice}</span>
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="npf-small text-npf-steel">{t("We reply by email.")}</p>
          <button type="submit" className="npf-btn npf-btn-primary hover:bg-npf-blue-mid max-sm:w-full">
            {t("Send")}
            <span className="npf-btn-disc">
              <ArrowRight className="npf-arrow size-4 rtl:-scale-x-100" />
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}

function FieldError({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <p id={id} className="npf-small mt-2 flex items-start gap-1.5 text-npf-error">
      <AlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
      {children}
    </p>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  error,
  className = "",
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  error?: string;
  className?: string;
}) {
  const t = useT();
  return (
    <div className={className}>
      <label htmlFor={id} className="npf-field-label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="npf-field"
      />
      {error ? <FieldError id={`${id}-error`}>{t(error)}</FieldError> : null}
    </div>
  );
}
