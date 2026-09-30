"use client";

import { useState } from "react";
import { signIn, useStore, type Session } from "./store";
import { AlertIcon, CheckCircle, InboxIcon, ShieldIcon } from "./icons";
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
    <div className="max-w-160 space-y-6">
      <h2 className="npf-h3 text-npf-blue-deep">{t("Profile")}</h2>

      <section className="npf-panel">
        <div className="npf-panel-head">
          <h3 className="flex items-center gap-2.5">
            <ShieldIcon aria-hidden className="size-5" />
            {t("Identity")}
          </h3>
        </div>
        <dl className="divide-y divide-npf-hairline">
          <Row label={t("Full name")} value={t(session.name)} />
          <Row label={t("NIN")} value={session.nin} />
          {session.rank ? (
            <Row label={t("Rank")} value={t(session.rank)} />
          ) : null}
          {session.station ? (
            <Row label={t("Station")} value={t(session.station)} />
          ) : null}
        </dl>
        <p className="npf-small border-t border-npf-hairline bg-npf-paper px-5 py-3 text-npf-steel">
          {t("Name and NIN come from NINAuth and cannot be edited here.")}
        </p>
      </section>

      <form noValidate onSubmit={onSubmit} className="npf-panel">
        <div className="npf-panel-head">
          <h3 className="flex items-center gap-2.5">
            <InboxIcon aria-hidden className="size-5" />
            {t("Contact details")}
          </h3>
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-2">
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
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-npf-hairline px-5 py-4">
          <button type="submit" className="npf-btn npf-btn-primary npf-btn-sm">
            {t("Save changes")}
          </button>
          <p aria-live="polite" className="npf-small">
            {saved ? (
              <span className="inline-flex items-center gap-2 font-medium text-npf-ok">
                <CheckCircle aria-hidden className="size-4" />
                {t("Saved. Updates about your requests go to these details.")}
              </span>
            ) : null}
          </p>
        </div>
      </form>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      <dt className="npf-small text-npf-steel">{label}</dt>
      <dd className="npf-body font-semibold text-npf-ink tabular-nums">
        {value}
      </dd>
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
      <label htmlFor={id} className="npf-field-label">
        {label}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="npf-field"
        {...rest}
      />
      {error ? (
        <p
          id={`${id}-error`}
          className="npf-small mt-2 flex items-start gap-1.5 text-npf-error"
        >
          <AlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
          {t(error)}
        </p>
      ) : null}
    </div>
  );
}
