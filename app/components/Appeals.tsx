"use client";

import { useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Link from "../i18n/Link";
import { useFormat, useT } from "../i18n/client";
import { sendTip, useStore, type Alert } from "./store";
import { CarIcon, CheckIcon, PersonIcon, PhoneCallIcon } from "./icons";
import { Thumb } from "./media";
import { FieldNote, commandLabel } from "./Where";
import { PHONE, cleanPhone } from "./Wizard";
import { Honeypot } from "./Honeypot";

const KIND_TONE: Record<string, string> = {
  "Wanted person": "bg-npf-error-wash text-npf-error",
  "Missing person": "bg-npf-gold-wash text-npf-warn",
  "Stolen vehicle": "bg-npf-review-wash text-npf-review",
};

/** The order a reader looks for them in: the person who may be in danger first. */
const KIND_ORDER = ["Missing person", "Wanted person", "Stolen vehicle"];

/**
 * Appeals the Force has chosen to make public: missing people, wanted
 * people, stolen vehicles. Each takes information back, anonymously unless
 * the person leaves a number, and it lands on the alert in the console.
 *
 * Nothing shows here that an officer did not publish from the Alerts board,
 * so the page can be empty, and says so with somewhere else to go.
 */
export default function Appeals() {
  const t = useT();
  const { loaded, alerts } = useStore();
  const [kind, setKind] = useState("");
  const shown = alerts
    .filter((a) => a.active && a.public)
    .sort((a, b) => b.issued.localeCompare(a.issued));
  const kinds = KIND_ORDER.map((k) => ({
    value: k,
    count: shown.filter((a) => a.kind === k).length,
  })).filter((k) => k.count);
  const listed = kind ? shown.filter((a) => a.kind === kind) : shown;

  return (
    <div className="space-y-10 md:space-y-14">
      <Urgent />

      {!loaded ? (
        <div aria-hidden className="space-y-5">
          {[0, 1].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-card bg-npf-cloud" />
          ))}
        </div>
      ) : shown.length ? (
        <section aria-labelledby="appeals-open" className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="appeals-open" className="npf-h4 text-npf-blue-deep">
              {t("Open appeals")}{" "}
              <span className="font-primary font-semibold text-npf-steel tabular-nums">{shown.length}</span>
            </h2>
            {kinds.length > 1 ? (
              <div role="group" aria-label={t("Show appeals")} className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
                {[{ value: "", count: shown.length }, ...kinds].map((k) => {
                  const on = kind === k.value;
                  return (
                    <button
                      key={k.value || "all"}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setKind(k.value)}
                      className={`flex min-h-11 shrink-0 items-center gap-2.5 rounded-full ps-4 pe-2 text-sm font-medium whitespace-nowrap ring-1 ring-inset transition-[background-color,color,box-shadow,scale] duration-(--dur-hover) ease-(--ease-out) active:scale-[0.97] active:duration-(--dur-press) ${
                        on
                          ? "bg-npf-blue-deep text-white ring-npf-blue-deep"
                          : "bg-white text-npf-body ring-npf-hairline hover:text-npf-ink hover:ring-npf-ink/25"
                      }`}
                    >
                      {k.value ? t(k.value) : t("All appeals")}
                      <span className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-xs font-semibold tabular-nums ${on ? "bg-white/15 text-white" : "bg-npf-cloud text-npf-steel"}`}>
                        {k.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
          <ul className="space-y-5">
            {listed.map((a) => (
              <AppealCard key={a.id} alert={a} />
            ))}
          </ul>
        </section>
      ) : (
        <Empty />
      )}

      <Handled />
    </div>
  );
}

/** The one thing to do if the person is in front of you now: not the form. */
function Urgent() {
  const t = useT();
  return (
    <div className="flex flex-col gap-4 rounded-card border border-npf-error/20 bg-npf-error-wash p-5 sm:flex-row sm:items-center sm:gap-5 md:px-6">
      <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-npf-error text-white">
        <PhoneCallIcon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="npf-h5 text-npf-ink">{t("Seen someone or something from an appeal right now?")}</p>
        <p className="npf-small mt-1 text-npf-body">{t("Do not approach. Call 112 and say which appeal it is.")}</p>
      </div>
      <a href="tel:112" className="npf-btn npf-btn-sm shrink-0 self-start bg-npf-error text-white hover:bg-npf-error/90 sm:self-center">
        {t("Call 112")}
      </a>
    </div>
  );
}

function Empty() {
  const t = useT();
  return (
    <div role="status" className="npf-panel flex flex-col gap-5 p-6 sm:flex-row sm:items-start md:p-8">
      <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-npf-mist text-npf-blue">
        <CheckIcon className="size-5" />
      </span>
      <div className="min-w-0">
        <h2 className="npf-h5 text-npf-blue-deep">{t("No public appeals at the moment")}</h2>
        <p className="npf-small mt-2 max-w-[60ch] text-npf-body">
          {t("When the Force asks the public for help finding a missing person, a wanted person or a stolen vehicle, the appeal appears here.")}
        </p>
        <Link href="/app/report" className="npf-btn npf-btn-secondary npf-btn-sm mt-5">
          {t("Report a Crime")}
        </Link>
      </div>
    </div>
  );
}

/** What happens to a tip, said once for the page rather than on every card. */
function Handled() {
  const t = useT();
  const lines = [
    "It goes straight to the officers working the appeal, not to a public page.",
    "You stay anonymous unless you leave your number.",
    "An appeal comes off this page as soon as officers close it.",
  ];
  return (
    <section aria-labelledby="appeals-handled" className="border-t border-npf-hairline pt-8 md:pt-10">
      <h2 id="appeals-handled" className="npf-h5 text-npf-blue-deep">
        {t("How your information is handled")}
      </h2>
      <ul className="mt-5 grid gap-4 md:grid-cols-3 md:gap-8">
        {lines.map((line) => (
          <li key={line} className="npf-small flex gap-3 text-npf-body">
            <span aria-hidden className="mt-[0.15em] grid size-5.5 shrink-0 place-items-center rounded-full bg-npf-blue text-white">
              <CheckIcon className="size-3 [stroke-width:2.5]" />
            </span>
            <span className="max-w-[40ch]">{t(line)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AppealCard({ alert }: { alert: Alert }) {
  const t = useT();
  const format = useFormat();
  const id = useId();
  const opener = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [trap, setTrap] = useState("");
  const Glyph = alert.kind === "Stolen vehicle" ? CarIcon : PersonIcon;

  return (
    <li>
      <article
        aria-labelledby={`${id}-title`}
        className="npf-panel grid lg:grid-cols-[minmax(0,1fr)_24rem]"
      >
        <div className="grid grid-cols-[5rem_minmax(0,1fr)] content-start gap-x-4 p-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-x-6 md:p-6">
          <div className="sm:row-span-2">
            {alert.photo ? (
              <span className="block overflow-clip rounded-chip">
                <Thumb media={alert.photo} className="aspect-[4/5]" />
              </span>
            ) : (
              <span className="grid aspect-[4/5] place-content-center justify-items-center gap-2 rounded-chip bg-npf-mist px-2 text-center text-npf-blue/50">
                <Glyph className="size-8 [stroke-width:1.25] sm:size-10" />
                <span className="text-2xs font-medium text-npf-steel max-sm:sr-only">{t("No photo published")}</span>
              </span>
            )}
          </div>

          <div className="min-w-0 self-center sm:self-start">
            <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${KIND_TONE[alert.kind] ?? "bg-npf-cloud text-npf-ink"}`}>
              {t(alert.kind)}
            </span>
            <h2 id={`${id}-title`} className="npf-h5 mt-2.5 text-balance text-npf-blue-deep">
              {t(alert.title)}
            </h2>
            {alert.plate ? (
              <p className="mt-3">
                <span className="sr-only">{t("Plate number")}: </span>
                <span className="inline-flex items-center rounded-[5px] border-2 border-npf-ink bg-white px-2.5 py-1 font-secondary text-base font-bold tracking-wider text-npf-ink">
                  {alert.plate}
                </span>
              </p>
            ) : null}
          </div>

          <div className="col-span-2 min-w-0 sm:col-span-1 sm:col-start-2">
            <p className="npf-small mt-4 max-w-[62ch] sm:mt-3 text-npf-body">{t(alert.details)}</p>

            <dl className="mt-5 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2 border-t border-npf-hairline pt-4 text-sm">
              {alert.names?.length ? (
                <>
                  <dt className="text-npf-steel">{t("Known as")}</dt>
                  <dd className="font-semibold text-npf-ink">{alert.names.join(", ")}</dd>
                </>
              ) : null}
              <dt className="text-npf-steel">{t("Where")}</dt>
              <dd className="text-npf-ink">{alert.scope ? commandLabel(t, alert.scope) : t("Nationwide")}</dd>
              <dt className="text-npf-steel">{t("Issued")}</dt>
              <dd className="text-npf-ink tabular-nums">
                <time dateTime={alert.issued}>{format.dateTime(alert.issued)}</time>
              </dd>
              <dt className="text-npf-steel">{t("Reference")}</dt>
              <dd className="text-npf-ink tabular-nums">{alert.id}</dd>
            </dl>
          </div>
        </div>

        <div className="border-t border-npf-hairline bg-npf-cloud p-5 md:p-6 lg:border-t-0 lg:border-s">
          {sent ? (
            <div role="status" className="flex gap-3">
              <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-npf-ok text-white">
                <CheckIcon className="size-4 [stroke-width:2.5]" />
              </span>
              <p className="npf-small pt-1 font-medium text-npf-ink">
                {t("Thank you. Your information has gone to the officers on this appeal.")}
              </p>
            </div>
          ) : open ? (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (trap) return setSent(true);
                if (text.trim().length < 10) return setError(t("Tell us a little more: what you saw, where and when."));
                if (phone && !PHONE.test(cleanPhone(phone))) return setError(t("Enter a Nigerian mobile number, like 0803 123 4567."));
                // ponytail: one tip per appeal per ten minutes from this browser.
                // The server rate-limits for real (docs/API-CONTRACT.md).
                const key = `dp:tip:${alert.id}`;
                let last = 0;
                try {
                  last = Number(localStorage.getItem(key) ?? 0);
                } catch {}
                if (Date.now() - last < 10 * 60_000)
                  return setError(t("You sent information on this appeal a few minutes ago. Thank you; officers will read it."));
                sendTip(alert.id, text.trim(), phone ? cleanPhone(phone) : undefined);
                try {
                  localStorage.setItem(key, String(Date.now()));
                } catch {}
                setSent(true);
              }}
              className="relative grid gap-4"
            >
              <Honeypot value={trap} onChange={setTrap} />
              <div>
                <label htmlFor={`${id}-tip`} className="npf-field-label">{t("What do you know?")}</label>
                <textarea
                  id={`${id}-tip`}
                  rows={4}
                  maxLength={2000}
                  autoFocus
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setError("");
                  }}
                  className="npf-field bg-white"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${id}-tip-error` : undefined}
                />
                <FieldNote id={`${id}-tip`} error={error} />
              </div>
              <div>
                <label htmlFor={`${id}-ph`} className="npf-field-label">
                  {t("Your number")} <span className="font-normal text-npf-steel">{t("(optional)")}</span>
                </label>
                <input id={`${id}-ph`} type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="npf-field bg-white" aria-describedby={`${id}-ph-hint`} />
                <p id={`${id}-ph-hint`} className="npf-hint">{t("Leave it empty to stay anonymous.")}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="npf-btn npf-btn-primary npf-btn-sm">{t("Send information")}</button>
                <button
                  type="button"
                  onClick={() => {
                    flushSync(() => {
                      setOpen(false);
                      setError("");
                    });
                    opener.current?.focus();
                  }}
                  className="npf-btn npf-btn-secondary npf-btn-sm"
                >
                  {t("Cancel")}
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3 className="npf-h5 text-npf-ink">{t("Seen this?")}</h3>
              <p className="npf-small mt-1.5 text-npf-body">
                {t("Tell the officers on this appeal what you saw, where and when. You do not have to give your name.")}
              </p>
              <button ref={opener} type="button" onClick={() => setOpen(true)} className="npf-btn npf-btn-primary npf-btn-sm mt-5">
                {t("I have information")}
              </button>
            </>
          )}
        </div>
      </article>
    </li>
  );
}
