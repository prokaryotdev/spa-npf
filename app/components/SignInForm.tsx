"use client";

import Link from "../i18n/Link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "../i18n/Link";
import { useEffect, useState } from "react";
import { signIn, useStore, type Session } from "./store";
import { ArrowRight, ShieldIcon, UserCircle } from "./icons";
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
    <div className="max-w-[900px]">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-secondary text-2xl font-bold text-npf-blue-deep">
            {t("Sign in with NINAuth")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-npf-body">
            {t(
              "NINAuth is the national digital identity, and the fastest way in — no separate Nigeria Police Force account needed.",
            )}
          </p>
          <button
            type="button"
            onClick={() => enter(CITIZEN)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-npf-blue px-6 py-3 font-medium text-white transition-colors hover:bg-npf-blue-mid"
          >
            <UserCircle aria-hidden className="size-5" />
            {t("Continue with NINAuth")}
            <ArrowRight aria-hidden className="size-4" />
          </button>
          <p className="mt-3 text-sm text-npf-muted">
            {t("Opens the sample account for {name}.", {
              name: t(CITIZEN.name),
            })}
          </p>

          <div className="mt-10 rounded-2xl bg-[#F4F6FA] px-5 py-4">
            <h3 className="flex items-center gap-2 font-secondary text-base font-bold text-npf-blue-deep">
              <ShieldIcon aria-hidden className="size-5" />
              {t("Nigeria Police Force personnel")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-npf-body">
              {t(
                "Officers reach the operations console with their force credentials.",
              )}
            </p>
            <button
              type="button"
              onClick={() => enter(OFFICER)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-npf-blue-ink ring-1 ring-npf-blue/25 transition-colors hover:bg-[#E8EEF8]"
            >
              {t("Open the operations console")}
              <ArrowRight aria-hidden className="size-4" />
            </button>
          </div>
        </div>

        <div>
          <h2 className="font-secondary text-2xl font-bold text-npf-blue-deep">
            {t("Or use your Nigeria Police Force account")}
          </h2>

          <form
            noValidate
            onSubmit={onSubmit}
            className="mt-6 flex flex-col gap-5"
          >
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

            <button
              type="submit"
              className="rounded-full bg-npf-blue px-6 py-3 font-medium text-white transition-colors hover:bg-npf-blue-mid"
            >
              {t("Sign in")}
            </button>

            <p className="text-sm text-npf-muted">
              {t("No account yet? Every Nigeria Police Force service is listed on the")}{" "}
              <Link
                href="/app/services"
                className="font-medium text-npf-blue underline underline-offset-2"
              >
                {t("services page")}
              </Link>
              {t(", and most can be started with NINAuth alone.")}
            </p>
          </form>
        </div>
      </div>
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
          {error}
        </p>
      ) : null}
    </div>
  );
}
