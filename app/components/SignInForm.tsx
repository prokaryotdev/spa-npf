"use client";

import Link from "../i18n/Link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "../i18n/Link";
import { useEffect, useState } from "react";
import { signIn, useStore, type Session } from "./store";
import {
  AlertIcon,
  ArrowRight,
  CheckIcon,
  ShieldIcon,
  UserCircle,
} from "./icons";
import { useT } from "../i18n/client";

type Errors = { nin?: string; password?: string };

/** The sample account NINAuth hands back in this build. */
const CITIZEN: Session = {
  name: "Chinedu Okafor",
  nin: "12345678901",
  email: "chinedu.okafor@example.ng",
  phone: "+234 803 123 4567",
  role: "citizen",
};

const OFFICER: Session = {
  name: "Insp. Ngozi Aliyu",
  nin: "76543210987",
  email: "n.aliyu@npf.gov.ng",
  phone: "+234 803 987 6543",
  role: "officer",
  rank: "Inspector",
  station: "Wuse Police Station",
};

/** A National Identification Number is eleven digits; spaces are tolerated. */
const NIN = /^\d{11}$/;

export default function SignInForm() {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const { session, loaded } = useStore();
  const [errors, setErrors] = useState<Errors>({});

  const next = params.get("next");
  const target = (role: Session["role"]) =>
    next ?? (role === "officer" ? "/app/police" : "/app/portal");

  // Landing here with a live session means the visitor followed an old link;
  // send them where they were going rather than asking again.
  useEffect(() => {
    if (loaded && session) router.replace(target(session.role));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, session]);

  function enter(account: Session) {
    signIn(account);
    router.push(target(account.role));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nin = String(data.get("nin") ?? "").trim();
    const password = String(data.get("password") ?? "");

    const next: Errors = {};
    if (!nin) next.nin = "Enter your NIN.";
    else if (!NIN.test(nin.replace(/\s+/g, "")))
      next.nin = "A NIN is eleven digits, like 12345678901.";
    if (!password) next.password = "Enter your password.";
    else if (password.length < 8)
      next.password = "Passwords are at least 8 characters.";

    setErrors(next);
    if (Object.keys(next).length) return;
    enter({ ...CITIZEN, nin });
  }

  return (
    <div className="max-w-260">
      <div className="grid items-start gap-6 lg:grid-cols-2">
        {/* The fast way in leads, raised like the service page's action. */}
        <section className="rounded-card bg-white p-6 shadow-card ring-1 ring-npf-hairline ring-inset md:p-8">
          <span className="grid size-14 place-items-center rounded-full bg-npf-blue text-white">
            <UserCircle aria-hidden className="size-7" />
          </span>
          <h2 className="npf-h4 mt-6 text-npf-blue-deep">
            {t("Sign in with NINAuth")}
          </h2>
          <p className="npf-body mt-2 text-npf-body">
            {t(
              "NINAuth is the national digital identity, and the fastest way in — no separate Nigeria Police Force account needed.",
            )}
          </p>
          <ul className="npf-small mt-6 space-y-2.5 text-npf-ink">
            {[
              "Track your requests",
              "Settle fines",
              "Keep your documents",
            ].map((line) => (
              <li key={line} className="flex items-center gap-2.5">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-npf-blue text-white">
                  <CheckIcon aria-hidden className="size-3" />
                </span>
                {t(line)}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => enter(CITIZEN)}
            className="npf-btn npf-btn-primary mt-8 w-full"
          >
            {t("Continue with NINAuth")}
            <span className="npf-btn-disc">
              <ArrowRight
                aria-hidden
                className="npf-arrow size-4 rtl:-scale-x-100"
              />
            </span>
          </button>
          <p className="npf-small mt-3 text-center text-npf-steel">
            {t("Opens the sample account for {name}.", {
              name: t(CITIZEN.name),
            })}
          </p>
        </section>

        <form noValidate onSubmit={onSubmit} className="npf-panel">
          <div className="npf-panel-head">
            <h2>{t("Or use your Nigeria Police Force account")}</h2>
          </div>
          <div className="flex flex-col gap-5 p-6 md:p-8">
            <Field
              id="nin"
              label={t("NIN")}
              placeholder="12345678901"
              autoComplete="username"
              inputMode="numeric"
              error={errors.nin}
            />
            <Field
              id="password"
              label={t("Password")}
              type="password"
              autoComplete="current-password"
              error={errors.password}
            />
            <button type="submit" className="npf-btn npf-btn-secondary mt-1 w-full">
              {t("Sign in")}
            </button>
          </div>
          <p className="npf-small border-t border-npf-hairline bg-npf-paper px-6 py-4 text-npf-body md:px-8">
            {t(
              "No account yet? Every Nigeria Police Force service is listed on the",
            )}{" "}
            <Link
              href="/app/services"
              className="font-medium text-npf-blue underline underline-offset-2 hover:text-npf-blue-deep"
            >
              {t("services page")}
            </Link>
            {t(", and most can be started with NINAuth alone.")}
          </p>
        </form>
      </div>

      {/* Officers: the console, in the Force's own navy. */}
      <section className="npf-on-night mt-6 flex flex-wrap items-center gap-x-5 gap-y-4 rounded-card bg-npf-blue-deep px-6 py-5 text-white md:px-8">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/10 text-npf-gold-soft">
          <ShieldIcon aria-hidden className="size-6" />
        </span>
        <div className="min-w-0 flex-1 basis-64">
          <h2 className="npf-h5">{t("Nigeria Police Force personnel")}</h2>
          <p className="npf-small mt-1 text-white/75">
            {t(
              "Officers reach the operations console with their force credentials.",
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => enter(OFFICER)}
          className="npf-btn npf-btn-secondary npf-btn-sm"
        >
          {t("Open the operations console")}
          <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
        </button>
      </section>
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
          {error}
        </p>
      ) : null}
    </div>
  );
}
