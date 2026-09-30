"use client";

import { useId, useState } from "react";
import {
  AlertIcon,
  ArrowRight,
  CheckIcon,
  HeartIcon,
  IdeaIcon,
} from "./icons";
import { useT } from "../i18n/client";

type Kind = { title: string; description: string };
type Errors = { name?: string; email?: string; message?: string };

/** The CMS icon paths are dead, so map the kind to one of our own icons. */
const ICONS: Record<string, (p: { className?: string }) => React.ReactElement> =
  {
    Suggestion: IdeaIcon,
    Remark: HeartIcon,
    Complaint: AlertIcon,
  };

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
  const [kind, setKind] = useState(kinds[0]?.title ?? "");
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
      className="mt-6 overflow-hidden rounded-card border border-npf-hairline bg-white"
    >
      <fieldset className="border-0 p-5 md:p-6">
        <legend className="npf-h5 float-left mb-4 w-full text-npf-ink">
          {t("What would you like to share?")}
        </legend>
        <div className="clear-left grid grid-cols-1 gap-3 sm:grid-cols-3">
          {kinds.map((k) => {
            const active = kind === k.title;
            const Icon = ICONS[k.title];
            return (
              <label
                key={k.title}
                className={`relative flex cursor-pointer flex-col rounded-card p-4 ring-inset transition-[background-color,box-shadow] duration-(--dur-hover) has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-npf-blue-mid ${
                  active
                    ? "bg-npf-mist ring-2 ring-npf-blue"
                    : "ring-1 ring-npf-hairline hover:bg-npf-paper"
                }`}
              >
                <input
                  type="radio"
                  name="kind"
                  value={k.title}
                  checked={active}
                  onChange={() => setKind(k.title)}
                  className="sr-only"
                />
                <span className="flex items-center justify-between gap-3">
                  <span
                    className={`grid size-10 place-items-center rounded-full transition-colors ${
                      active
                        ? "bg-npf-blue text-white"
                        : "bg-npf-cloud text-npf-blue-ink"
                    }`}
                  >
                    {Icon ? <Icon className="size-5" /> : null}
                  </span>
                  {/* The radio, drawn: a ring that fills when chosen. */}
                  <span
                    aria-hidden
                    className={`grid size-5 place-items-center rounded-full transition-colors ${
                      active
                        ? "bg-npf-blue"
                        : "ring-1 ring-[color-mix(in_srgb,var(--color-npf-ink)_25%,transparent)] ring-inset"
                    }`}
                  >
                    <span
                      className={`size-2 rounded-full bg-white transition-transform duration-(--dur-hover) ${active ? "scale-100" : "scale-0"}`}
                    />
                  </span>
                </span>
                <span className="npf-h5 mt-3 text-npf-blue-deep">
                  {k.title}
                </span>
                <span className="npf-small mt-1 text-npf-body">
                  {k.description}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-5 border-t border-npf-hairline p-5 md:grid-cols-2 md:p-6">
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
          className="md:col-span-2"
        />

        <div className="md:col-span-2">
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

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-npf-hairline bg-npf-paper p-5 md:px-6">
        <p className="npf-small flex min-w-0 flex-1 basis-80 items-start gap-2.5 text-npf-body">
          <AlertIcon
            aria-hidden
            className="mt-0.5 size-4 shrink-0 text-npf-warn"
          />
          {notice}
        </p>
        <button type="submit" className="npf-btn npf-btn-primary">
          {t("Send")}
          <span className="npf-btn-disc">
            <ArrowRight className="npf-arrow size-4 rtl:-scale-x-100" />
          </span>
        </button>
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
