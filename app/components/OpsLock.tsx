"use client";

import { useEffect, useId, useState } from "react";
import { useT } from "../i18n/client";
import type { Session } from "./store";
import { ShieldIcon } from "./icons";
import { PoliceWordmark } from "./Wordmark";

/** Minutes without a key or a click before an unattended console locks. */
const IDLE_MINUTES = 10;
const LOCK_EVENT = "npf:lock";

/** Lock this console now: the sidebar's padlock calls it. */
export const lockNow = () => window.dispatchEvent(new Event(LOCK_EVENT));

/**
 * The screen an unattended console falls back to. A control room desk is
 * shared and walked past; call details, reporters' numbers and custody
 * records should not sit open to whoever passes. US forces lock after 30
 * minutes under the FBI's CJIS policy; a busier room locks sooner.
 *
 * The board keeps running underneath, so nothing is missed while it is
 * locked: the tab title still counts waiting calls and new calls still chime.
 *
 * ponytail: any four or more digits unlock it here. The real one checks the
 * officer's PIN with the server (docs/API-CONTRACT.md, POST /auth/unlock).
 */
export function LockScreen({ officer }: { officer: Session }) {
  const t = useT();
  const id = useId();
  const [locked, setLocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setLocked(true), IDLE_MINUTES * 60_000);
    };
    const lock = () => setLocked(true);
    const events = ["keydown", "pointerdown", "wheel", "touchstart"] as const;
    for (const e of events) window.addEventListener(e, arm, { passive: true });
    window.addEventListener(LOCK_EVENT, lock);
    arm();
    return () => {
      clearTimeout(timer);
      for (const e of events) window.removeEventListener(e, arm);
      window.removeEventListener(LOCK_EVENT, lock);
    };
  }, []);

  // The page underneath goes inert, so Tab cannot walk into a call.
  useEffect(() => {
    const frame = [...document.querySelectorAll<HTMLElement>(".npf-ops-frame")];
    for (const el of frame) el.inert = locked;
    return () => {
      for (const el of frame) el.inert = false;
    };
  }, [locked]);

  if (!locked) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      className="fixed inset-0 z-[60] grid place-items-center bg-npf-blue-deep/95 px-6 backdrop-blur-md"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!/^\d{4,}$/.test(pin)) {
            setError(t("Enter your PIN: four or more digits."));
            return;
          }
          setPin("");
          setError("");
          setLocked(false);
        }}
        className="w-full max-w-sm rounded-card bg-white p-7 text-center shadow-raised"
      >
        <span className="mx-auto block h-12 w-fit text-npf-blue-deep">
          <PoliceWordmark className="h-full w-auto" />
        </span>
        <h2 id={`${id}-title`} className="npf-h5 mt-6 flex items-center justify-center gap-2 text-npf-ink">
          <ShieldIcon aria-hidden className="size-5 text-npf-blue" />
          {t("Console locked")}
        </h2>
        <p className="npf-small mt-2 text-npf-body">
          {t("{name} · {no}", { name: t(officer.name), no: officer.serviceNo ?? "" })}
        </p>
        <label htmlFor={`${id}-pin`} className="sr-only">
          {t("PIN")}
        </label>
        <input
          id={`${id}-pin`}
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          autoFocus
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          placeholder={t("PIN")}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className="npf-field mt-6 text-center font-mono tracking-[0.3em]"
        />
        {error ? (
          <p id={`${id}-err`} className="npf-small mt-2 text-npf-error">
            {error}
          </p>
        ) : null}
        <button type="submit" className="npf-btn npf-btn-primary mt-4 w-full">
          {t("Unlock")}
        </button>
        <p className="npf-small mt-4 text-npf-steel">
          {t("Locked after {n} minutes without use. The board keeps running.", {
            n: IDLE_MINUTES,
          })}
        </p>
      </form>
    </div>
  );
}
