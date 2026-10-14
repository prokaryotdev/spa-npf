"use client";

import { useId, useState } from "react";
import { useFormat, useT } from "../i18n/client";
import { sendTip, useStore, type Alert } from "./store";
import { CheckIcon, PhoneCallIcon } from "./icons";
import { Thumb } from "./media";
import { FieldNote, commandLabel } from "./Where";
import { PHONE, cleanPhone } from "./Wizard";
import { Honeypot } from "./Honeypot";

const KIND_TONE: Record<string, string> = {
  "Wanted person": "bg-npf-error-wash text-npf-error",
  "Missing person": "bg-npf-gold-wash text-npf-warn",
  "Stolen vehicle": "bg-npf-review-wash text-npf-review",
};

/**
 * Appeals the Force has chosen to make public: missing people, wanted
 * people, stolen vehicles. Each takes information back, anonymously unless
 * the person leaves a number, and it lands on the alert in the console.
 *
 * Nothing shows here that an officer did not publish from the Alerts board,
 * so the page is empty more often than not, and says so.
 */
export default function Appeals() {
  const t = useT();
  const { loaded, alerts } = useStore();
  const shown = alerts
    .filter((a) => a.active && a.public)
    .sort((a, b) => b.issued.localeCompare(a.issued));

  if (!loaded)
    return <div aria-hidden className="h-48 animate-pulse rounded-card bg-npf-cloud" />;

  return (
    <div className="space-y-6">
      <p className="npf-small flex flex-wrap items-center gap-x-3 gap-y-2 rounded-card bg-npf-error-wash p-4 text-npf-ink">
        <PhoneCallIcon aria-hidden className="size-5 shrink-0 text-npf-error" />
        {t("If you see someone from these appeals right now, do not approach them. Call 112.")}
      </p>
      {shown.length ? (
        <ul className="grid gap-5 md:grid-cols-2">
          {shown.map((a) => (
            <AppealCard key={a.id} alert={a} />
          ))}
        </ul>
      ) : (
        <div className="rounded-card bg-npf-paper p-8 text-center">
          <p className="npf-h5 text-npf-ink">{t("No public appeals at the moment")}</p>
          <p className="npf-small mx-auto mt-2 max-w-[52ch] text-npf-body">
            {t("When the Force asks the public for help finding a missing person, a wanted person or a stolen vehicle, the appeal appears here.")}
          </p>
        </div>
      )}
    </div>
  );
}

function AppealCard({ alert }: { alert: Alert }) {
  const t = useT();
  const format = useFormat();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [trap, setTrap] = useState("");
  return (
    <li className="npf-panel flex flex-col">
      <div className="flex gap-4 p-5">
        {alert.photo ? (
          <span className="w-24 shrink-0 overflow-clip rounded-chip">
            <Thumb media={alert.photo} className="aspect-[4/5]" />
          </span>
        ) : null}
        <div className="min-w-0">
          <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${KIND_TONE[alert.kind] ?? "bg-npf-cloud text-npf-ink"}`}>
            {t(alert.kind)}
          </span>
          <h2 className="npf-h5 mt-2 text-npf-ink">{t(alert.title)}</h2>
          {alert.plate ? <p className="mt-1 font-mono text-sm font-semibold text-npf-ink">{alert.plate}</p> : null}
          {alert.names?.length ? <p className="npf-small mt-1 font-medium text-npf-ink">{alert.names.join(", ")}</p> : null}
          <p className="npf-small mt-2 text-npf-body">{t(alert.details)}</p>
          <p className="npf-small mt-2 text-npf-steel">
            {alert.scope ? commandLabel(t, alert.scope) : t("All commands")} · {format.date(alert.issued)}
          </p>
        </div>
      </div>
      <div className="mt-auto border-t border-npf-hairline p-5">
        {sent ? (
          <p role="status" className="npf-small flex items-center gap-2 font-medium text-npf-ok">
            <CheckIcon aria-hidden className="size-4.5" />
            {t("Thank you. Your information has gone to the officers on this appeal.")}
          </p>
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
              const last = Number(localStorage.getItem(key) ?? 0);
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
              <textarea id={`${id}-tip`} rows={3} maxLength={2000} value={text} onChange={(e) => { setText(e.target.value); setError(""); }} className="npf-field" aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-tip-error` : undefined} />
              <FieldNote id={`${id}-tip`} error={error} />
            </div>
            <div>
              <label htmlFor={`${id}-ph`} className="npf-field-label">
                {t("Your number")} <span className="font-normal text-npf-steel">{t("(optional)")}</span>
              </label>
              <input id={`${id}-ph`} type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="npf-field" />
              <p className="npf-hint">{t("Leave it empty to stay anonymous.")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="npf-btn npf-btn-primary npf-btn-sm">{t("Send information")}</button>
              <button type="button" onClick={() => setOpen(false)} className="npf-btn npf-btn-secondary npf-btn-sm">{t("Cancel")}</button>
            </div>
          </form>
        ) : (
          <button type="button" onClick={() => setOpen(true)} className="npf-btn npf-btn-secondary npf-btn-sm">
            {t("I have information")}
          </button>
        )}
      </div>
    </li>
  );
}
