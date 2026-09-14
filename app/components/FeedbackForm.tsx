"use client";

import { useId, useState } from "react";
import { AlertIcon, ArrowRight, HeartIcon, IdeaIcon } from "./icons";

type Kind = { title: string; description: string };
type Errors = { name?: string; email?: string; message?: string };

/** The CMS icon paths are dead, so map the kind to one of our own icons. */
const ICONS: Record<string, (p: { className?: string }) => React.ReactElement> = {
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
        className="mt-8 rounded-3xl bg-[#e7f6f1] p-8 md:p-10"
      >
        <h3 className="font-secondary text-xl font-bold text-dp-green-deep">
          Thank you — your {kind.toLowerCase()} has been recorded
        </h3>
        <p className="mt-2 max-w-[60ch] text-base text-dp-body">
          A member of the team will be in touch by email. Reference numbers are
          issued once the service is connected.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-dp-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dp-green-mid"
        >
          Send another
          <ArrowRight className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="mt-8">
      <fieldset className="border-0 p-0">
        <legend className="mb-4 font-secondary text-lg font-bold text-dp-green-deep">
          What would you like to share?
        </legend>
        <div className="grid gap-4 md:grid-cols-3">
          {kinds.map((k) => {
            const active = kind === k.title;
            const Icon = ICONS[k.title];
            return (
              <label
                key={k.title}
                className={`flex cursor-pointer flex-col rounded-3xl bg-white p-6 ring-1 transition-colors has-[:focus-visible]:ring-2 ${
                  active
                    ? "bg-[#F4F8F6] ring-2 ring-dp-green"
                    : "ring-black/5 hover:bg-[#F9FBFA]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="kind"
                    value={k.title}
                    checked={active}
                    onChange={() => setKind(k.title)}
                    className="size-4 accent-[#00925b]"
                  />
                  {Icon ? <Icon className="size-7 shrink-0 text-dp-green" /> : null}
                  <span className="font-secondary text-lg font-bold text-dp-green-deep">
                    {k.title}
                  </span>
                </span>
                <span className="mt-2 text-sm leading-relaxed text-dp-body">
                  {k.description}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 grid max-w-[760px] gap-5 md:grid-cols-2">
        <Field
          id={`${id}-name`}
          name="name"
          label="Your name"
          autoComplete="name"
          error={errors.name}
        />
        <Field
          id={`${id}-email`}
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
          error={errors.email}
        />
        <Field
          id={`${id}-phone`}
          name="phone"
          type="tel"
          label="Phone number (optional)"
          autoComplete="tel"
          className="md:col-span-2"
        />

        <div className="md:col-span-2">
          <label
            htmlFor={`${id}-message`}
            className="mb-1.5 block text-sm font-medium text-dp-ink"
          >
            Your {kind.toLowerCase()}
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={6}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? `${id}-message-error` : undefined}
            className={`w-full rounded-lg border bg-white px-4 py-3 text-dp-ink outline-none focus:ring-2 focus:ring-dp-green ${
              errors.message ? "border-red-600" : "border-[#E4E2E6]"
            }`}
          />
          {errors.message ? (
            <p id={`${id}-message-error`} className="mt-1.5 text-sm text-red-700">
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>

      <p className="mt-6 max-w-[70ch] rounded-2xl bg-[#FFF6E8] p-4 text-sm text-dp-body">
        {notice}
      </p>

      <button
        type="submit"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-dp-green px-6 py-3 font-medium text-white transition-colors hover:bg-dp-green-mid"
      >
        Send
        <ArrowRight className="size-4" />
      </button>
    </form>
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
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-dp-ink">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-dp-ink outline-none focus:ring-2 focus:ring-dp-green ${
          error ? "border-red-600" : "border-[#E4E2E6]"
        }`}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
