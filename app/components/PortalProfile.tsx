"use client";

import { useState } from "react";
import { signIn, useStore, type Session } from "./store";
import { CheckCircle } from "./icons";
import { useT } from "../i18n/client";

type Errors = { email?: string; phone?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Nigerian mobile, with or without spaces: +234 803 123 4567 or 0803 123 4567. */
const PHONE = /^(?:\+234\s?|0)[789][01]\d(?:\s?\d){7}$/;

export default function PortalProfile() {
  const t = useT();
  const { session } = useStore();
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState(false);

  if (!session) return null;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    const next: Errors = {};
    if (!email) next.email = "Enter an email address.";
    else if (!EMAIL.test(email))
      next.email = "That does not look like an email address.";
    if (!phone) next.phone = "Enter a mobile number.";
    else if (!PHONE.test(phone))
      next.phone = "Use a Nigerian mobile number, like 0803 123 4567.";

    setErrors(next);
    setSaved(false);
    if (Object.keys(next).length) return;

    signIn({ ...(session as Session), email, phone });
    setSaved(true);
  }

  return (
    <div className="max-w-[560px]">
      <h2 className="mb-6 font-secondary text-2xl font-bold text-npf-blue-deep">
        {t("Profile")}
      </h2>

      <dl className="mb-8 divide-y divide-black/[0.07] rounded-2xl bg-[#F9F9F9] px-5">
        <Row label={t("Full name")} value={t(session.name)} />
        <Row label={t("NIN")} value={session.nin} />
        {session.rank ? (
          <Row label={t("Rank")} value={t(session.rank)} />
        ) : null}
        {session.station ? (
          <Row label={t("Station")} value={t(session.station)} />
        ) : null}
      </dl>
      <p className="mb-8 -mt-6 text-sm text-npf-muted">
        {t(
          "Name and NIN come from NINAuth and cannot be edited here.",
        )}
      </p>

      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
        <Field
          id="email"
          label={t("Email address")}
          type="email"
          autoComplete="email"
          defaultValue={session.email}
          error={errors.email}
        />
        <Field
          id="phone"
          label={t("Mobile number")}
          type="tel"
          autoComplete="tel"
          defaultValue={session.phone}
          error={errors.phone}
        />

        <button
          type="submit"
          className="self-start rounded-full bg-npf-blue px-6 py-3 font-medium text-white transition-colors hover:bg-npf-blue-mid"
        >
          {t("Save changes")}
        </button>

        <p aria-live="polite" className="min-h-[1.5rem] text-sm">
          {saved ? (
            <span className="inline-flex items-center gap-2 text-npf-blue-ink">
              <CheckCircle aria-hidden className="size-4" />
              {t("Saved. Updates about your requests go to these details.")}
            </span>
          ) : null}
        </p>
      </form>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4">
      <dt className="text-sm text-npf-body">{label}</dt>
      <dd className="font-secondary text-sm font-bold text-npf-ink">{value}</dd>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  ...rest
}: {
  id: string;
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const t = useT();
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-npf-ink"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-npf-ink outline-none placeholder:text-npf-muted focus:ring-2 focus:ring-npf-blue ${
          error ? "border-red-600" : "border-[#E4E2E6]"
        }`}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
          {t(error)}
        </p>
      ) : null}
    </div>
  );
}
