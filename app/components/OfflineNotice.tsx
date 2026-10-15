"use client";

import { useSyncExternalStore } from "react";
import { useT } from "../i18n/client";
import { AlertIcon } from "./icons";

const subscribe = (fn: () => void) => {
  window.addEventListener("online", fn);
  window.addEventListener("offline", fn);
  return () => {
    window.removeEventListener("online", fn);
    window.removeEventListener("offline", fn);
  };
};

/**
 * Said the moment the connection drops, on every page, public or console.
 * Much of Nigeria reaches this site over mobile data that comes and goes;
 * someone halfway through a report should know their words are kept and
 * that sending waits for the signal, not wonder whether the button worked.
 *
 * The report and application forms already keep a draft in the tab
 * (sessionStorage), so this only has to say so. A real backend adds a send
 * queue that retries on "online" (docs/API-CONTRACT.md).
 */
export default function OfflineNotice() {
  const t = useT();
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
  if (online) return null;
  return (
    <div
      role="status"
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto flex max-w-xl items-start gap-3 rounded-card bg-npf-night px-4 py-3 text-sm text-white shadow-raised print:hidden"
    >
      <AlertIcon aria-hidden className="mt-0.5 size-4.5 shrink-0 text-npf-gold-soft" />
      <p>
        <span className="font-semibold">{t("You are offline.")}</span>{" "}
        {t("What you have typed stays on this page. Send it when the signal comes back. In an emergency, call 112.")}
      </p>
    </div>
  );
}
