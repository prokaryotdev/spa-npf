"use client";

import { useState } from "react";
import { ArrowUpRight } from "./icons";

type Errors = { email?: string; password?: string };

/**
 * ponytail: validation only — there is no account backend behind this site, so
 * a valid submission says so instead of pretending to sign anyone in. Point the
 * submit handler at a real endpoint when one exists.
 */
export default function SignInForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    const next: Errors = {};
    if (!email) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      next.email = "That does not look like an email address.";
    if (!password) next.password = "Enter your password.";
    else if (password.length < 8)
      next.password = "Passwords are at least 8 characters.";

    setErrors(next);
    setSubmitted(Object.keys(next).length === 0);
  }

  return (
    <div className="grid max-w-[900px] gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <h2 className="font-secondary text-2xl font-bold text-dp-green-deep">
          Sign in with UAE PASS
        </h2>
        <p className="mt-3 text-base leading-relaxed text-dp-body">
          UAE PASS is the national digital identity. It is the fastest way in —
          no separate Dubai Police account needed.
        </p>
        <a
          href="https://selfcare.uaepass.ae/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-dp-green px-6 py-3 font-medium text-white transition-colors hover:bg-dp-green-mid"
        >
          Continue with UAE PASS
          <ArrowUpRight aria-hidden className="size-4" />
          <span className="sr-only"> (opens in a new window)</span>
        </a>
      </div>

      <div>
        <h2 className="font-secondary text-2xl font-bold text-dp-green-deep">
          Or use your Dubai Police account
        </h2>

        <form noValidate onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-dp-ink"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full rounded-lg border bg-white px-4 py-3 text-dp-ink outline-none placeholder:text-dp-muted focus:ring-2 focus:ring-dp-green ${
                errors.email ? "border-red-600" : "border-[#E4E2E6]"
              }`}
              placeholder="you@example.com"
            />
            {errors.email ? (
              <p id="email-error" className="mt-1.5 text-sm text-red-700">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-dp-ink"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`w-full rounded-lg border bg-white px-4 py-3 text-dp-ink outline-none focus:ring-2 focus:ring-dp-green ${
                errors.password ? "border-red-600" : "border-[#E4E2E6]"
              }`}
            />
            {errors.password ? (
              <p id="password-error" className="mt-1.5 text-sm text-red-700">
                {errors.password}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className="rounded-full bg-dp-green px-6 py-3 font-medium text-white transition-colors hover:bg-dp-green-mid"
          >
            Sign in
          </button>

          <p aria-live="polite" className="min-h-[1.5rem] text-sm">
            {submitted ? (
              <span className="text-dp-green-ink">
                Details accepted. Accounts are not connected in this build, so
                there is nothing to sign in to yet.
              </span>
            ) : null}
          </p>
        </form>
      </div>
    </div>
  );
}
