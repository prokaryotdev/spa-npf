"use client";

import Link from "../i18n/Link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "../i18n/Link";
import { useEffect, useState } from "react";
import { signIn, useStore, type Post, type Session } from "./store";
import { POSTS, ZONAL_COMMANDS, postOf, zonalCommand } from "../content-records";
import {
  AlertIcon,
  ArrowRight,
  ChevronDown,
} from "./icons";
import { useT } from "../i18n/client";
import { STATES } from "../geo";
import { commandLabel, divisionLabel } from "./Where";

type Errors = { nin?: string; password?: string };

/** The sample account NINAuth hands back in this build. */
const CITIZEN: Session = {
  name: "Chinedu Okafor",
  nin: "12345678901",
  email: "chinedu.okafor@example.ng",
  phone: "+234 803 123 4567",
  role: "citizen",
};

/**
 * The desk an officer signs in to: their post, and the command (and, for a
 * Divisional Police Officer, the division) it answers for. The real sign-in
 * reads all three from the officer's posting record, not a menu.
 */
function deskSession(post: Post, command: string, division: string, zone: string): Session {
  const def = postOf(post);
  const cmd = command === "FCT" ? "FCT" : command;
  const station = {
    control: `${cmd} Command Control Room`,
    dpo: `${division} Division, ${cmd}`,
    investigator: `State CID, ${cmd} Command`,
    custody: `Custody, ${cmd} Command Headquarters`,
    commander: `${cmd} Command Headquarters`,
    zone: `${zonalCommand(zone)?.name ?? ""} Headquarters`,
    hq: "Force Operations, Force Headquarters, Abuja",
  }[post];
  return {
    name: def.officer.name,
    nin: "76543210987",
    email: "duty.desk@npf.gov.ng",
    phone: "+234 803 987 6543",
    role: "officer",
    rank: def.officer.rank,
    serviceNo: def.officer.serviceNo,
    post,
    station,
    ...(def.scope === "national" || def.scope === "zone" ? {} : { command }),
    ...(def.scope === "zone" ? { zone } : {}),
    ...(def.scope === "division" ? { division } : {}),
  };
}

/** A National Identification Number is eleven digits; spaces are tolerated. */
const NIN = /^\d{11}$/;

const LINK = "font-medium text-npf-blue underline underline-offset-2 hover:text-npf-blue-deep";

/**
 * Where a sign-in lands: ?next= if a guard sent the visitor here, else the
 * home of the role. Arriving already signed in to this page's role means an
 * old link; carry on rather than ask again.
 */
function useEntry(role: Session["role"]) {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const { session, loaded } = useStore();
  const target = next ?? (role === "officer" ? "/app/police" : "/app/portal");

  useEffect(() => {
    if (loaded && session?.role === role) router.replace(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, session]);

  return (account: Session) => {
    signIn(account);
    router.push(target);
  };
}

const CARD = "overflow-hidden rounded-card bg-white shadow-card ring-1 ring-npf-hairline ring-inset";

/** The public sign-in: NINAuth leads, the Force account follows. */
export default function SignInForm() {
  const t = useT();
  const enter = useEntry("citizen");
  const [errors, setErrors] = useState<Errors>({});
  const [reveal, setReveal] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nin = String(data.get("nin") ?? "").trim();
    const password = String(data.get("password") ?? "");

    const next: Errors = {};
    if (!nin) next.nin = t("Enter your NIN.");
    else if (!NIN.test(nin.replace(/\s+/g, "")))
      next.nin = t("A NIN is eleven digits, like 12345678901.");
    if (!password) next.password = t("Enter your password.");
    else if (password.length < 8)
      next.password = t("Passwords are at least 8 characters.");

    setErrors(next);
    // Straight to the first thing to fix, so its error is what is read out.
    const first = Object.keys(next)[0];
    if (first) return document.getElementById(first)?.focus();
    enter({ ...CITIZEN, nin: nin.replace(/\s+/g, "") });
  }

  return (
    <section className={CARD}>
      <div className="p-6 md:p-10">
        <h2 className="npf-h4 text-npf-blue-deep">{t("Sign in with NINAuth")}</h2>
        <p className="npf-body mt-2 max-w-[52ch] text-npf-body">
          {t(
            "NINAuth is the national digital identity, and the fastest way in — no separate Nigeria Police Force account needed.",
          )}
        </p>
        <button
          type="button"
          onClick={() => enter(CITIZEN)}
          className="npf-btn npf-btn-primary mt-6 w-full"
        >
          {t("Continue with NINAuth")}
          <span className="npf-btn-disc">
            <ArrowRight aria-hidden className="npf-arrow size-4 rtl:-scale-x-100" />
          </span>
        </button>
        <p className="npf-small mt-3 text-center text-npf-steel">
          {t("Opens the sample account for {name}.", { name: t(CITIZEN.name) })}
        </p>

        <div className="my-8 flex items-center gap-4">
          <span className="h-px flex-1 bg-npf-hairline" />
          <h2 className="npf-small text-center font-medium text-npf-body">
            {t("Or use your Nigeria Police Force account")}
          </h2>
          <span className="h-px flex-1 bg-npf-hairline" />
        </div>

        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
          <Field
            id="nin"
            label={t("NIN")}
            autoComplete="username"
            inputMode="numeric"
            error={errors.nin}
          />
          <Field
            id="password"
            label={t("Password")}
            type={reveal ? "text" : "password"}
            autoComplete="current-password"
            error={errors.password}
            aside={
              <Link href="/app/reset" className={`npf-small ${LINK}`}>
                {t("Forgot your password?")}
              </Link>
            }
            trailing={
              <button
                type="button"
                aria-pressed={reveal}
                aria-controls="password"
                onClick={() => setReveal((r) => !r)}
                className="npf-small h-9 rounded-[0.5rem] px-3 font-semibold text-npf-blue transition-colors hover:bg-npf-chip focus-visible:outline-2 focus-visible:outline-npf-blue-mid"
              >
                {reveal ? t("Hide") : t("Show")}
              </button>
            }
          />
          <button type="submit" className="npf-btn npf-btn-secondary mt-1 w-full">
            {t("Sign in")}
          </button>
        </form>
      </div>
      <p className="npf-small border-t border-npf-hairline bg-npf-paper px-6 py-5 text-npf-body md:px-10">
        {t("No account yet? Every Nigeria Police Force service is listed on the")}{" "}
        <Link href="/app/services" className={LINK}>
          {t("services page")}
        </Link>
        {t(", and most can be started with NINAuth alone.")}{" "}
        <Link href="/app/register" className={`whitespace-nowrap ${LINK}`}>
          {t("Create an account")}
        </Link>
      </p>
    </section>
  );
}

/**
 * The console's way in, on its own unlisted page so the public sign-in never
 * offers it. Each post opens the boards its work needs, at the level it
 * answers for. ponytail: a demo desk picker, not a lock; the real sign-in
 * takes a service number and password and is checked by the API.
 */
export function OfficerSignInForm() {
  const t = useT();
  const enter = useEntry("officer");
  const [post, setPost] = useState<Post>("control");
  const [desk, setDesk] = useState("Lagos");
  const [division, setDivision] = useState("Ikeja");
  const [zone, setZone] = useState(ZONAL_COMMANDS[0].id);
  const def = postOf(post);
  const lgas = STATES.find((s) => s.name === desk)?.lgas ?? [];

  return (
    <section className={CARD}>
      <div className="p-6 md:p-10">
        <fieldset>
          <legend className="npf-field-label">{t("Your post")}</legend>
          <div className="divide-y divide-npf-hairline overflow-hidden rounded-card ring-1 ring-npf-line ring-inset">
            {POSTS.map((p) => (
              <label
                key={p.post}
                className="relative flex cursor-pointer items-start gap-3.5 px-4 py-3.5 transition-colors hover:bg-npf-cloud has-checked:bg-npf-mist has-focus-visible:z-10 has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-npf-blue-mid"
              >
                <input
                  type="radio"
                  name="post"
                  value={p.post}
                  checked={post === p.post}
                  onChange={() => setPost(p.post)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white ring-2 ring-npf-line ring-inset transition-shadow peer-checked:ring-[6px] peer-checked:ring-npf-blue"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-npf-ink">{t(p.label)}</span>
                  <span className="npf-small mt-0.5 block text-npf-body">{t(p.hint)}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {def.scope !== "national" ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {def.scope === "zone" ? (
              <Select id="zone" label={t("Zonal command")} value={zone} onChange={setZone}>
                {ZONAL_COMMANDS.map((z) => (
                  <option key={z.id} value={z.id}>
                    {t(z.name)}
                  </option>
                ))}
              </Select>
            ) : (
              <Select
                id="desk"
                label={t("Command")}
                value={desk}
                onChange={(v) => {
                  setDesk(v);
                  setDivision(STATES.find((s) => s.name === v)?.lgas[0] ?? "");
                }}
              >
                {STATES.map((s) => (
                  <option key={s.name} value={s.name}>
                    {commandLabel(t, s.name)}
                  </option>
                ))}
              </Select>
            )}
            {def.scope === "division" ? (
              <Select id="division" label={t("Division")} value={division} onChange={setDivision}>
                {lgas.map((l) => (
                  <option key={l} value={l}>
                    {divisionLabel(t, l)}
                  </option>
                ))}
              </Select>
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => enter(deskSession(post, desk, division, zone))}
          className="npf-btn npf-btn-primary mt-8 w-full"
        >
          {t("Open the operations console")}
          <span className="npf-btn-disc">
            <ArrowRight aria-hidden className="npf-arrow size-4 rtl:-scale-x-100" />
          </span>
        </button>
        <p className="npf-small mt-3 text-center text-npf-steel">
          {t("Signs in as {name}, {rank}, a sample officer for this post.", {
            name: t(def.officer.name),
            rank: t(def.officer.rank),
          })}
        </p>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  aside,
  trailing,
  ...rest
}: {
  id: string;
  label: string;
  error?: string;
  /** Beside the label, at the end of its row (the reset link). */
  aside?: React.ReactNode;
  /** Inside the field, at its end (show the password). */
  trailing?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="npf-field-label">
          {label}
        </label>
        {aside}
      </div>
      <div className="relative">
        <input
          id={id}
          name={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`npf-field ${trailing ? "pe-20" : ""}`}
          {...rest}
        />
        {trailing ? (
          <span className="absolute inset-y-0 end-1.5 flex items-center">{trailing}</span>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-error`} className="npf-small mt-2 flex items-start gap-1.5 text-npf-error">
          <AlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Select({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="npf-field-label">
        {label}
      </label>
      <span className="npf-select-wrap w-full">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="npf-select h-12 w-full min-w-0 bg-white"
        >
          {children}
        </select>
        <ChevronDown aria-hidden className="npf-select-arrow" />
      </span>
    </div>
  );
}
