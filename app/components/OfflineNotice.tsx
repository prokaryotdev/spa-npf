"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useT } from "../i18n/client";
import { CheckIcon, WifiOffIcon } from "./icons";

const subscribe = (fn: () => void) => {
  window.addEventListener("online", fn);
  window.addEventListener("offline", fn);
  return () => {
    window.removeEventListener("online", fn);
    window.removeEventListener("offline", fn);
  };
};

/** The browser's word on the connection; the server always assumes online. */
export function useOnline() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}

/**
 * Said the moment the connection drops, on every page, public or console.
 * Much of Nigeria reaches this site over mobile data that comes and goes;
 * someone halfway through a report should know their words are kept and
 * that sending waits for the signal, not wonder whether the button worked.
 * When the signal returns it says so for a few seconds, then gets out of
 * the way.
 *
 * The report and application forms already keep a draft in the tab
 * (sessionStorage), so this only has to say so. A real backend adds a send
 * queue that retries on "online" (docs/API-CONTRACT.md).
 */
export default function OfflineNotice() {
  const t = useT();
  const online = useOnline();
  const [back, setBack] = useState(false);

  // "Back online" comes from the event itself, so a page that was never
  // offline never says it.
  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const onOnline = () => {
      setBack(true);
      clearTimeout(id);
      id = setTimeout(() => setBack(false), 4000);
    };
    const onOffline = () => setBack(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      clearTimeout(id);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (online && !back) return null;
  return (
    <div
      role="status"
      className="npf-offline-toast npf-toast-in fixed inset-x-3 bottom-3 z-[70] mx-auto flex max-w-xl items-start gap-3 rounded-card bg-npf-night px-4 py-3.5 text-sm text-white shadow-raised print:hidden"
    >
      {online ? (
        <>
          <CheckIcon className="mt-0.5 size-4.5 shrink-0 text-npf-ok-soft" />
          <p className="font-semibold">{t("You are back online.")}</p>
        </>
      ) : (
        <>
          <WifiOffIcon className="mt-0.5 size-4.5 shrink-0 text-npf-gold-soft" />
          <p>
            <span className="font-semibold">{t("You are offline.")}</span>{" "}
            {t("What you have typed stays on this page. Send it when the signal comes back. In an emergency, call 112.")}
          </p>
        </>
      )}
    </div>
  );
}
