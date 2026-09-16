"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, useStore, type Session } from "./store";
import { AlertIcon, ArrowRight, ShieldIcon, UserCircle } from "./icons";
import { useT } from "../i18n/client";

type Errors = { emiratesId?: string; password?: string };

/** The sample account UAE PASS hands back in this build. */
const CITIZEN: Session = {
  name: "Khalid Al Mansoori",
  emiratesId: "784-1989-1234567-1",
  email: "khalid.almansoori@example.ae",
  phone: "+971 50 123 4567",
  role: "citizen",
};

const OFFICER: Session = {
  name: "Lt. Noura Bin Haider",
  emiratesId: "784-1991-7654321-3",
  email: "n.binhaider@dubaipolice.gov.ae",
  phone: "+971 50 987 6543",
  role: "officer",
  rank: "Lieutenant",
  station: "Al Barsha Police Station",
};

/** Emirates ID: 784-YYYY-NNNNNNN-C, dashes optional. */
const EID = /^784-?\d{4}-?\d{7}-?\d$/;

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
    const emiratesId = String(data.get("emiratesId") ?? "").trim();
    const password = String(data.get("password") ?? "");

    const next: Errors = {};
    if (!emiratesId) next.emiratesId = "Enter your Emirates ID number.";
    else if (!EID.test(emiratesId))
      next.emiratesId = "An Emirates ID looks like 784-1989-1234567-1.";
    if (!password) next.password = "Enter your password.";
    else if (password.length < 8)
      next.password = "Passwords are at least 8 characters.";

    setErrors(next);
    if (Object.keys(next).length) return;
    enter({ ...CITIZEN, emiratesId });
  }

  return (
    <div className="max-w-[900px]">
      <p className="mb-8 flex items-start gap-3 rounded-2xl bg-[#FFF7E6] px-5 py-4 text-sm leading-relaxed text-[#6b4a00]">
        <AlertIcon aria-hidden className="mt-0.5 size-5 shrink-0" />
        <span>
          {t(
            "This is a rebuild of the Dubai Police website, not the real one. There is no account system behind it: signing in opens a sample account stored in this browser, and anything you submit stays on this device. Never enter a real Emirates ID or password here.",
          )}
        </span>
      </p>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-secondary text-2xl font-bold text-dp-green-deep">
            {t("Sign in with UAE PASS")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-dp-body">
            {t(
              "UAE PASS is the national digital identity, and the fastest way in — no separate Dubai Police account needed.",
            )}
          </p>
          <button
            type="button"
            onClick={() => enter(CITIZEN)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-dp-green px-6 py-3 font-medium text-white transition-colors hover:bg-dp-green-mid"
          >
            <UserCircle aria-hidden className="size-5" />
            {t("Continue with UAE PASS")}
            <ArrowRight aria-hidden className="size-4" />
          </button>
          <p className="mt-3 text-sm text-dp-muted">
            {t("Opens the sample account for {name}.", {
              name: t(CITIZEN.name),
            })}
          </p>

          <div className="mt-10 rounded-2xl bg-[#F4F8F6] px-5 py-4">
            <h3 className="flex items-center gap-2 font-secondary text-base font-bold text-dp-green-deep">
              <ShieldIcon aria-hidden className="size-5" />
              {t("Dubai Police personnel")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-dp-body">
              {t(
                "Officers reach the operations console with their force credentials.",
              )}
            </p>
            <button
              type="button"
              onClick={() => enter(OFFICER)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-dp-green-ink ring-1 ring-dp-green/25 transition-colors hover:bg-[#e7f6f1]"
            >
              {t("Open the operations console")}
              <ArrowRight aria-hidden className="size-4" />
            </button>
          </div>
        </div>

        <div>
          <h2 className="font-secondary text-2xl font-bold text-dp-green-deep">
            {t("Or use your Dubai Police account")}
          </h2>

          <form
            noValidate
            onSubmit={onSubmit}
            className="mt-6 flex flex-col gap-5"
          >
            <Field
              id="emiratesId"
              label={t("Emirates ID number")}
              placeholder="784-1989-1234567-1"
              autoComplete="username"
              inputMode="numeric"
              error={errors.emiratesId}
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
              className="rounded-full bg-dp-green px-6 py-3 font-medium text-white transition-colors hover:bg-dp-green-mid"
            >
              {t("Sign in")}
            </button>

            <p className="text-sm text-dp-muted">
              {t("No account yet? Every Dubai Police service is listed on the")}{" "}
              <Link
                href="/app/services"
                className="font-medium text-dp-green underline underline-offset-2"
              >
                {t("services page")}
              </Link>
              {t(", and most can be started with UAE PASS alone.")}
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
        className="mb-1.5 block text-sm font-medium text-dp-ink"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-dp-ink outline-none placeholder:text-dp-muted focus:ring-2 focus:ring-dp-green ${
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
