import type { IncidentStatus, RequestStatus } from "./store";

/**
 * Formatting is pinned to en-GB and Dubai time on purpose: left to the
 * runtime's locale the server renders "9/14/2026" and the browser renders
 * "14/09/2026", which React reports as a hydration mismatch.
 */
const date = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Dubai",
});

const dateTime = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Dubai",
});

const time = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Dubai",
});

export const formatDate = (iso: string) => date.format(new Date(iso));
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));
export const formatTime = (iso: string) => time.format(new Date(iso));
export const aed = (amount: number) => `AED ${amount.toLocaleString("en-GB")}`;

/**
 * Status colours carry meaning, so they are not the brand green: needing
 * something from you is amber, a refusal is red, done is green, and the two
 * "we are working on it" states stay neutral so the ones that need attention
 * are the only colour on the screen.
 */
const REQUEST_TONE: Record<RequestStatus, string> = {
  Submitted: "bg-black/[0.05] text-dp-body",
  "In Review": "bg-[#E8F1FB] text-[#1c4f86]",
  "Action Needed": "bg-[#FFF2D9] text-[#8a5a00]",
  Completed: "bg-[#e7f6f1] text-dp-green-ink",
  Rejected: "bg-[#FDECEC] text-[#9b1c1c]",
};

const INCIDENT_TONE: Record<IncidentStatus, string> = {
  New: "bg-[#FFF2D9] text-[#8a5a00]",
  Dispatched: "bg-[#E8F1FB] text-[#1c4f86]",
  "On Scene": "bg-[#e7f6f1] text-dp-green-ink",
  Closed: "bg-black/[0.05] text-dp-body",
};

export function StatusPill({
  status,
  kind = "request",
}: {
  status: RequestStatus | IncidentStatus;
  kind?: "request" | "incident";
}) {
  const tone =
    kind === "incident"
      ? INCIDENT_TONE[status as IncidentStatus]
      : REQUEST_TONE[status as RequestStatus];
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${tone}`}
    >
      {status}
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
  return (
    <section className="rounded-3xl p-6 ring-1 ring-black/[0.07]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-secondary text-lg font-bold text-dp-green-deep">
          {title}
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
  return (
    <div className="rounded-2xl bg-[#F9F9F9] px-6 py-12 text-center">
      <p className="font-secondary text-base font-bold text-dp-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-[46ch] text-sm leading-relaxed text-dp-body">
        {body}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
