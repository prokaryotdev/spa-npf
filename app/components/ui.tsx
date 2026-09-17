"use client";

import { useT } from "../i18n/client";
import type { IncidentStatus, RequestStatus } from "./store";

/**
 * Status colours carry meaning, so they are not the brand navy: needing
 * something from you is amber, a refusal is red, done is green, and the two
 * "we are working on it" states stay neutral so the ones that need attention
 * are the only colour on the screen.
 */
const REQUEST_TONE: Record<RequestStatus, string> = {
  Submitted: "bg-black/[0.05] text-npf-body",
  "In Review": "bg-[#EDE9FB] text-[#4A3B94]",
  "Action Needed": "bg-[#FFF2D9] text-[#8a5a00]",
  Completed: "bg-npf-ok-soft text-npf-ok",
  Rejected: "bg-[#FDECEC] text-[#9b1c1c]",
};

const INCIDENT_TONE: Record<IncidentStatus, string> = {
  New: "bg-[#FFF2D9] text-[#8a5a00]",
  Dispatched: "bg-[#EDE9FB] text-[#4A3B94]",
  "On Scene": "bg-npf-ok-soft text-npf-ok",
  Closed: "bg-black/[0.05] text-npf-body",
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
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${tone}`}
    >
      {t(status)}
    </span>
  );
}

/** A headed block inside a portal screen. */
export function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const t = useT();
  return (
    <section className="rounded-3xl p-6 ring-1 ring-black/[0.07]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-secondary text-lg font-bold text-npf-blue-deep">
          {t(title)}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** What a list says when it has nothing in it. */
export function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  const t = useT();
  return (
    <div className="rounded-2xl bg-[#F9F9F9] px-6 py-12 text-center">
      <p className="font-secondary text-base font-bold text-npf-ink">
        {t(title)}
      </p>
      <p className="mx-auto mt-2 max-w-[46ch] text-sm leading-relaxed text-npf-body">
        {t(body)}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
