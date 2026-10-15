"use client";

import { useId, useState } from "react";
import Link, { useRouter } from "../i18n/Link";
import { useT } from "../i18n/client";
import { signIn } from "./store";
import { AlertIcon, ArrowRight, CheckCircle } from "./icons";
import { PHONE, cleanPhone } from "./Wizard";

const NIN = /^\d{11}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Creating an account and resetting a password: the two ways into the
 * portal besides NINAuth.
 *
 * Both end in a six-digit code sent to the phone, because the phone is what
 * a Nigerian is most certain to have with them, and it is what the Force
 * texts references to.
 *
 * ponytail: no server, so no text is sent and any six digits pass. The real
 * flow is POST /auth/register and POST /auth/reset (docs/API-CONTRACT.md);
 * the NIN is checked against NIMC there, not here.
 */
export function RegisterForm() {
  const t = useT();
  const id = useId();
  const router = useRouter();
  const [step, setStep] = useState<"details" | "code">("details");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [v, setV] = useState({ name: "", nin: "", phone: "", email: "", password: "", again: "", agree: false });
  const [code, setCode] = useState("");
  const set = (k: keyof typeof v, x: string | boolean) => setV((o) => ({ ...o, [k]: x }));

  function details(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (v.name.trim().length < 3) next.name = t("Enter your full name as it is on your NIN slip.");
    if (!NIN.test(v.nin.replace(/\s+/g, ""))) next.nin = t("A NIN is eleven digits, like 12345678901.");
    if (!PHONE.test(cleanPhone(v.phone))) next.phone = t("Enter a Nigerian mobile number, like 0803 123 4567.");
    if (v.email && !EMAIL.test(v.email.trim())) next.email = t("That does not look like an email address.");
    if (v.password.length < 8) next.password = t("Passwords are at least 8 characters.");
    else if (v.password !== v.again) next.again = t("The two passwords are not the same.");
    if (!v.agree) next.agree = t("Agree to the terms to create the account.");
    setErrors(next);
    if (Object.keys(next).length) return;
    setStep("code");
  }

  function verify(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) return setErrors({ code: t("Enter the six digits from the text message.") });
    signIn({
      name: v.name.trim(),
      nin: v.nin.replace(/\s+/g, ""),
      email: v.email.trim(),
      phone: cleanPhone(v.phone),
      role: "citizen",
    });
    router.push("/app/portal/profile");
  }

  if (step === "code")
    return (
      <form noValidate onSubmit={verify} className="npf-panel max-w-xl">
        <div className="npf-panel-head">
          <h2>{t("Check your phone")}</h2>
        </div>
        <div className="grid gap-5 p-6 md:p-8">
          <p className="npf-body text-npf-body">
            {t("We sent a six-digit code to {phone}. It lasts ten minutes.", { phone: cleanPhone(v.phone) })}
          </p>
          <Field id={`${id}-code`} label={t("Code")} value={code} onChange={setCode} error={errors.code} inputMode="numeric" autoComplete="one-time-code" />
          <p className="npf-small text-npf-steel">{t("In this demonstration no text is sent; any six digits will do.")}</p>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="npf-btn npf-btn-primary">
              {t("Create my account")}
              <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
            </button>
            <button type="button" onClick={() => setStep("details")} className="npf-btn npf-btn-secondary">
              {t("Change the number")}
            </button>
          </div>
        </div>
      </form>
    );

  return (
    <form noValidate onSubmit={details} className="npf-panel max-w-2xl">
      <div className="npf-panel-head">
        <h2>{t("Your details")}</h2>
      </div>
      <div className="grid gap-5 p-6 md:grid-cols-2 md:p-8">
        <Field id={`${id}-name`} label={t("Full name")} value={v.name} onChange={(x) => set("name", x)} error={errors.name} autoComplete="name" className="md:col-span-2" />
        <Field id={`${id}-nin`} label={t("NIN")} value={v.nin} onChange={(x) => set("nin", x)} error={errors.nin} inputMode="numeric" placeholder="12345678901" />
        <Field id={`${id}-phone`} label={t("Mobile number")} value={v.phone} onChange={(x) => set("phone", x)} error={errors.phone} type="tel" autoComplete="tel" />
        <Field id={`${id}-email`} label={t("Email address")} value={v.email} onChange={(x) => set("email", x)} error={errors.email} type="email" autoComplete="email" optional className="md:col-span-2" />
        <Field id={`${id}-pw`} label={t("Password")} value={v.password} onChange={(x) => set("password", x)} error={errors.password} type="password" autoComplete="new-password" />
        <Field id={`${id}-pw2`} label={t("Password again")} value={v.again} onChange={(x) => set("again", x)} error={errors.again} type="password" autoComplete="new-password" />
        <div className="md:col-span-2">
          <label className="npf-small flex items-start gap-3 text-npf-ink">
            <input type="checkbox" checked={v.agree} onChange={(e) => set("agree", e.target.checked)} className="mt-1 size-4" />
            <span>
              {t("I agree to the")}{" "}
              <Link href="/app/home/terms-conditions" className="font-medium text-npf-blue underline underline-offset-2">
                {t("terms and conditions")}
              </Link>{" "}
              {t("and the")}{" "}
              <Link href="/app/home/privacy-policy" className="font-medium text-npf-blue underline underline-offset-2">
                {t("privacy policy")}
              </Link>
              .
            </span>
          </label>
          {errors.agree ? <Err text={errors.agree} /> : null}
        </div>
        <div className="flex flex-wrap items-center gap-4 md:col-span-2">
          <button type="submit" className="npf-btn npf-btn-primary">
            {t("Send me a code")}
            <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
          </button>
          <p className="npf-small text-npf-body">
            {t("Already have one?")}{" "}
            <Link href="/app/signin" className="font-medium text-npf-blue underline underline-offset-2">
              {t("Sign in")}
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}

export function ResetForm() {
  const t = useT();
  const id = useId();
  const [step, setStep] = useState<"who" | "code" | "done">("who");
  const [who, setWho] = useState("");
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [again, setAgain] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (step === "done")
    return (
      <div className="npf-panel max-w-xl p-6 md:p-8">
        <p className="npf-h5 flex items-center gap-3 text-npf-ok">
          <CheckCircle aria-hidden className="size-6" />
          {t("Your password has been changed")}
        </p>
        <Link href="/app/signin" className="npf-btn npf-btn-primary mt-6">
          {t("Sign in")}
          <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
        </Link>
      </div>
    );

  if (step === "code")
    return (
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const next: Record<string, string> = {};
          if (!/^\d{6}$/.test(code)) next.code = t("Enter the six digits from the text message.");
          if (pw.length < 8) next.pw = t("Passwords are at least 8 characters.");
          else if (pw !== again) next.again = t("The two passwords are not the same.");
          setErrors(next);
          if (!Object.keys(next).length) setStep("done");
        }}
        className="npf-panel max-w-xl"
      >
        <div className="npf-panel-head">
          <h2>{t("Choose a new password")}</h2>
        </div>
        <div className="grid gap-5 p-6 md:p-8">
          <p className="npf-body text-npf-body">
            {t("If an account matches, we have sent a six-digit code to the mobile number on it.")}
          </p>
          <Field id={`${id}-code`} label={t("Code")} value={code} onChange={setCode} error={errors.code} inputMode="numeric" autoComplete="one-time-code" />
          <Field id={`${id}-pw`} label={t("New password")} value={pw} onChange={setPw} error={errors.pw} type="password" autoComplete="new-password" />
          <Field id={`${id}-pw2`} label={t("Password again")} value={again} onChange={setAgain} error={errors.again} type="password" autoComplete="new-password" />
          <p className="npf-small text-npf-steel">{t("In this demonstration no text is sent; any six digits will do.")}</p>
          <div>
            <button type="submit" className="npf-btn npf-btn-primary">{t("Change password")}</button>
          </div>
        </div>
      </form>
    );

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const x = who.trim().replace(/\s+/g, "");
        if (!NIN.test(x) && !EMAIL.test(x) && !PHONE.test(cleanPhone(x)))
          return setErrors({ who: t("Enter your NIN, mobile number or email address.") });
        setErrors({});
        // The same answer whether or not an account matches, so the form
        // cannot be used to find out who has one.
        setStep("code");
      }}
      className="npf-panel max-w-xl"
    >
      <div className="npf-panel-head">
        <h2>{t("Find your account")}</h2>
      </div>
      <div className="grid gap-5 p-6 md:p-8">
        <Field id={`${id}-who`} label={t("NIN, mobile number or email")} value={who} onChange={setWho} error={errors.who} autoComplete="username" />
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="npf-btn npf-btn-primary">{t("Send me a code")}</button>
          <Link href="/app/signin" className="npf-small font-medium text-npf-blue underline underline-offset-2">
            {t("Back to sign in")}
          </Link>
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  optional,
  className = "",
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  optional?: boolean;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  const t = useT();
  return (
    <div className={className}>
      <label htmlFor={id} className="npf-field-label">
        {label}
        {optional ? <span className="font-normal text-npf-steel"> {t("(optional)")}</span> : null}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="npf-field"
        {...rest}
      />
      {error ? <Err id={`${id}-error`} text={error} /> : null}
    </div>
  );
}

function Err({ id, text }: { id?: string; text: string }) {
  return (
    <p id={id} className="npf-small mt-2 flex items-start gap-1.5 text-npf-error">
      <AlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
      {text}
    </p>
  );
}
