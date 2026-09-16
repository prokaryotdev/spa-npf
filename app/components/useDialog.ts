"use client";

import { useEffect, useRef } from "react";

/**
 * Keeps a <dialog> in step with React state, and reports when the browser
 * closes it on its own.
 *
 * The `close` event does not bubble, so React's delegated `onClose` prop never
 * fires for it. Escape then closed the dialog while state still said "open",
 * and because re-opening set the same value the effect never ran again — the
 * dialog could not be reopened at all. Listening natively is the fix.
 */
export function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  const latest = useRef(onClose);

  useEffect(() => {
    latest.current = onClose;
  });

  // Subscribed once: Escape and any el.close() both land here.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = () => latest.current();
    el.addEventListener("close", handle);
    return () => el.removeEventListener("close", handle);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return ref;
}
