"use client";

import { useEffect, useState } from "react";
import { useT } from "../i18n/client";
import { CheckIcon, FileIcon } from "./icons";
import type { IncidentStatus, RequestStatus } from "./store";

/**
 * Status colours carry meaning, so they are not the brand navy: needing
 * something from you is amber, a refusal is red, done is green, and the two
 * "we are working on it" states stay neutral so the ones that need attention
 * are the only colour on the screen.
 */
const REQUEST_TONE: Record<RequestStatus, string> = {
  Submitted: "bg-npf-cloud text-npf-body",
  "In Review": "bg-npf-review-wash text-npf-review",
  "Action Needed": "bg-npf-gold-wash text-npf-warn",
  Completed: "bg-npf-ok-soft text-npf-ok",
  Rejected: "bg-npf-error-wash text-npf-error",
};

const INCIDENT_TONE: Record<IncidentStatus, string> = {
  New: "bg-npf-gold-wash text-npf-warn",
  Dispatched: "bg-npf-review-wash text-npf-review",
  "On Scene": "bg-npf-ok-soft text-npf-ok",
  Closed: "bg-npf-cloud text-npf-body",
};

export function StatusPill({
  status,
  kind = "request",
}: {
  status: RequestStatus | IncidentStatus;
  kind?: "request" | "incident";
}) {
  const t = useT();
  const tone =
    kind === "incident"
      ? INCIDENT_TONE[status as IncidentStatus]
      : REQUEST_TONE[status as RequestStatus];
  return (
    <span className={`npf-pill ${tone}`}>
      <span aria-hidden className="npf-pill-dot" />
      {t(status)}
    </span>
  );
}

/**
 * A headed block inside a portal screen, in the service page's grammar: a
 * white panel ruled by a hairline with its title on the mist. `flush` hands
 * the body to rows that draw their own padding and dividers.
 */
export function Card({
  title,
  icon,
  action,
  flush = false,
  id,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  flush?: boolean;
  id?: string;
  children: React.ReactNode;
}) {
  const t = useT();
  return (
    <section id={id} className="npf-panel scroll-mt-32">
      <div className="npf-panel-head">
        <h2 className="flex items-center gap-2.5">
          {icon}
          {t(title)}
        </h2>
        {action}
      </div>
      <div className={flush ? "" : "p-5"}>{children}</div>
    </section>
  );
}

/** A quiet text link for a panel's head: "See all", "Mark all read". */
export function HeadLink({
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...props}
      className="npf-small -my-2 inline-flex min-h-10 items-center gap-1.5 font-medium text-npf-blue transition-colors hover:text-npf-blue-deep"
    >
      {children}
    </button>
  );
}

/** What a list says when it has nothing in it. */
export function Empty({
  title,
  body,
  action,
  icon,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const t = useT();
  return (
    <div className="flex flex-col items-center rounded-card bg-npf-paper px-6 py-12 text-center">
      {icon ? (
        <span className="grid size-14 place-items-center rounded-full bg-white text-npf-blue shadow-card">
          {icon}
        </span>
      ) : null}
      <p className={`npf-h5 text-npf-ink ${icon ? "mt-5" : ""}`}>{t(title)}</p>
      <p className="npf-small mt-2 max-w-[46ch] text-npf-body">{t(body)}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

/** One press puts the reference on the clipboard, for a message or a note. */
export function CopyRef({ value, className = "" }: { value: string; className?: string }) {
  const t = useT();
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => setDone(false), 2400);
    return () => clearTimeout(id);
  }, [done]);
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard?.writeText(value).then(
          () => setDone(true),
          () => {},
        )
      }
      className={`npf-btn npf-btn-ghost npf-btn-sm shrink-0 text-npf-blue print:hidden ${className}`}
    >
      {done ? (
        <CheckIcon aria-hidden className="size-4" />
      ) : (
        <FileIcon aria-hidden className="size-4" />
      )}
      <span aria-live="polite">{done ? t("Copied") : t("Copy")}</span>
    </button>
  );
}

/**
 * The tick a checklist row leads with, on every page that has one: small
 * and solid, so a list of twelve things reads as twelve things, not twelve
 * headings.
 */
export function Tick() {
  return (
    <span
      aria-hidden
      className="mt-[0.15em] grid size-5.5 shrink-0 place-items-center rounded-full bg-npf-blue text-white"
    >
      <CheckIcon className="size-3 [stroke-width:2.5]" />
    </span>
  );
}

