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
  CheckIcon,
  ShieldIcon,
  UserCircle,
} from "./icons";
import { useT } from "../i18n/client";
import { STATES } from "../geo";
import { commandLabel, divisionLabel } from "./Where";

const SELECT =
  "h-10 max-w-full min-w-0 rounded-full bg-white/10 px-4 text-sm font-medium text-white ring-1 ring-white/25 ring-inset outline-none focus-visible:ring-2 focus-visible:ring-white [&>option]:text-npf-ink";

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

export default function SignInForm() {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const { session, loaded } = useStore();
  const [errors, setErrors] = useState<Errors>({});
  const [post, setPost] = useState<Post>("control");
  const [desk, setDesk] = useState("Lagos");
  const [division, setDivision] = useState("Ikeja");
  const [zone, setZone] = useState(ZONAL_COMMANDS[0].id);
  const def = postOf(post);
  const lgas = STATES.find((s) => s.name === desk)?.lgas ?? [];

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
    if (!nin) next.nin = t("Enter your NIN.");
    else if (!NIN.test(nin.replace(/\s+/g, "")))
      next.nin = t("A NIN is eleven digits, like 12345678901.");
    if (!password) next.password = t("Enter your password.");
    else if (password.length < 8)
      next.password = t("Passwords are at least 8 characters.");

    setErrors(next);
    if (Object.keys(next).length) return;
    enter({ ...CITIZEN, nin: nin.replace(/\s+/g, "") });
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
            <p className="npf-small flex flex-wrap justify-between gap-x-4 gap-y-1">
              <Link href="/app/register" className="font-medium text-npf-blue underline underline-offset-2">
                {t("Create an account")}
              </Link>
              <Link href="/app/reset" className="font-medium text-npf-blue underline underline-offset-2">
                {t("Forgot your password?")}
              </Link>
            </p>
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

      {/* Officers: the console, in the Force's own navy. Each post opens the
          boards its work needs, at the level it answers for. */}
      <section className="npf-on-night mt-6 rounded-card bg-npf-blue-deep px-6 py-6 text-white md:px-8">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
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
        </div>

        <fieldset className="mt-6">
          <legend className="npf-small mb-3 font-semibold text-white/85">
            {t("Your post")}
          </legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {POSTS.map((p) => (
              <label
                key={p.post}
                className={`flex cursor-pointer items-start gap-3 rounded-chip px-4 py-3 ring-1 ring-inset transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-white ${
                  post === p.post
                    ? "bg-white text-npf-ink ring-white"
                    : "bg-white/5 text-white ring-white/20 hover:bg-white/10"
                }`}
              >
                <input
                  type="radio"
                  name="post"
                  value={p.post}
                  checked={post === p.post}
                  onChange={() => setPost(p.post)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={`mt-1 grid size-4 shrink-0 place-items-center rounded-full ring-2 ring-inset ${
                    post === p.post ? "ring-npf-blue" : "ring-white/45"
                  }`}
                >
                  {post === p.post ? (
                    <span className="size-2 rounded-full bg-npf-blue" />
                  ) : null}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{t(p.label)}</span>
                  <span
                    className={`mt-0.5 block text-xs ${post === p.post ? "text-npf-body" : "text-white/70"}`}
                  >
                    {t(p.hint)}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 flex flex-wrap items-end gap-3">
          {def.scope === "zone" ? (
            <div className="grid gap-1.5">
              <label htmlFor="zone" className="npf-small font-semibold text-white/85">
                {t("Zonal command")}
              </label>
              <select id="zone" value={zone} onChange={(e) => setZone(e.target.value)} className={SELECT}>
                {ZONAL_COMMANDS.map((z) => (
                  <option key={z.id} value={z.id}>
                    {t(z.name)}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          {def.scope === "command" || def.scope === "division" ? (
            <div className="grid gap-1.5">
              <label htmlFor="desk" className="npf-small font-semibold text-white/85">
                {t("Command")}
              </label>
              <select
                id="desk"
                value={desk}
                onChange={(e) => {
                  setDesk(e.target.value);
                  setDivision(
                    STATES.find((s) => s.name === e.target.value)?.lgas[0] ?? "",
                  );
                }}
                className={SELECT}
              >
                {STATES.map((s) => (
                  <option key={s.name} value={s.name}>
                    {commandLabel(t, s.name)}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          {def.scope === "division" ? (
            <div className="grid gap-1.5">
              <label htmlFor="division" className="npf-small font-semibold text-white/85">
                {t("Division")}
              </label>
              <select
                id="division"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className={SELECT}
              >
                {lgas.map((l) => (
                  <option key={l} value={l}>
                    {divisionLabel(t, l)}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => enter(deskSession(post, desk, division, zone))}
            className="npf-btn npf-btn-secondary npf-btn-sm ms-auto"
          >
            {t("Open the operations console")}
            <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
          </button>
        </div>
        <p className="npf-small mt-4 text-white/65">
          {t("Signs in as {name}, {rank}, a sample officer for this post.", {
            name: t(def.officer.name),
            rank: t(def.officer.rank),
          })}
        </p>
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
