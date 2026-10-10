"use client";

import Link from "../i18n/Link";
import type { Service } from "../content-services";
import { useStore } from "./store";
import { AlertIcon, ArrowRight, ArrowUpRight, UserCircle } from "./icons";
import { useT } from "../i18n/client";
import {
  externalPortals,
  openEndedTurnaround,
  reportSlug,
} from "../content-report";


/**
 * The button at the top of a service page. Signed out it hands over to
 * sign-in and comes back; signed in it opens the request and shows the
 * reference number, because a reference number is the only thing anyone
 * wanted from the page.
 */
export default function ServiceAction({ service }: { service: Service }) {
  const t = useT();
  const { session, requests, loaded } = useStore();
  const report = reportSlug(service.slug);
  const apply = `/app/services/${service.slug}/apply`;

  const existing = requests.find(
    (r) =>
      r.slug === service.slug &&
      r.status !== "Completed" &&
      r.status !== "Rejected",
  );

  // Run by another body on its own site: say whose, and go there.
  const portal = externalPortals[service.slug];
  if (portal)
    return (
      <>
        <a
          href={portal.href}
          target="_blank"
          rel="noopener noreferrer"
          className="npf-btn npf-btn-primary h-auto min-h-12 w-full py-1.5 ps-6 text-start leading-tight whitespace-normal hover:bg-npf-blue-mid"
        >
          {t("Go to the recruitment portal")}
          <span className="npf-btn-disc ms-auto">
            <ArrowUpRight className="size-4 rtl:-scale-x-100" />
          </span>
        </a>
        <p className="npf-small mt-3 text-center text-npf-steel">
          {t("Run by the {name}. Opens in a new window.", {
            name: t(portal.name),
          })}
        </p>
      </>
    );

  // Tracking a reference needs no account either.
  if (report === "/app/track")
    return (
      <Link
        href={report}
        className="npf-btn npf-btn-primary h-auto min-h-12 w-full py-1.5 ps-6 text-start leading-tight whitespace-normal hover:bg-npf-blue-mid"
      >
        {t("Track a reference")}
        <span className="npf-btn-disc ms-auto">
          <ArrowRight className="size-4 rtl:-scale-x-100" />
        </span>
      </Link>
    );

  // Reporting a crime is open to everyone, signed in or not.
  if (report)
    return (
      <>
        <Link
          href={report}
          className="npf-btn npf-btn-primary h-auto min-h-12 w-full py-1.5 ps-6 text-start leading-tight whitespace-normal hover:bg-npf-blue-mid"
        >
          {t("Report it now")}
          <span className="npf-btn-disc ms-auto">
            <ArrowRight className="size-4 rtl:-scale-x-100" />
          </span>
        </Link>
        <p className="npf-small mt-3 flex items-start justify-center gap-1.5 text-center text-npf-steel">
          <AlertIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-npf-alert" />
          {t("In an emergency, call 112.")}
        </p>
      </>
    );

  if (!loaded)
    return (
      <span
        aria-hidden
        className="block h-12 w-full animate-pulse rounded-full bg-npf-cloud-deep"
      />
    );

  if (!session)
    return (
      <>
        <Link
          href={`/app/signin?next=${encodeURIComponent(apply)}`}
          className="npf-btn npf-btn-primary h-auto min-h-12 w-full py-1.5 ps-6 text-start leading-tight whitespace-normal hover:bg-npf-blue-mid"
        >
          <UserCircle className="size-5 shrink-0" />
          {/* Not "Sign in to start service": the card already names the
              service, and the long form wrapped onto two lines. */}
          {t("Sign in to continue")}
          <span className="npf-btn-disc ms-auto">
            <ArrowRight className="size-4 rtl:-scale-x-100" />
          </span>
        </Link>
        <p className="npf-small mt-3 text-center text-npf-steel">
          {t(service.turnaround) === t("Instant")
            ? t("Done as soon as you submit")
            : openEndedTurnaround.has(service.turnaround)
              ? t(service.turnaround)
              : t("Takes about {turnaround} once submitted", {
                turnaround: t(service.turnaround).toLowerCase(),
              })}
        </p>
      </>
    );

  if (existing)
    return (
      <>
        <Link
          href="/app/portal/requests"
          className="npf-btn npf-btn-primary h-auto min-h-12 w-full py-1.5 ps-6 text-start leading-tight whitespace-normal hover:bg-npf-blue-mid"
        >
          {/* The reference sits in the note below: inside the label it
              wrapped the button onto two lines. */}
          {t("Track request")}
          <span className="npf-btn-disc ms-auto">
            <ArrowRight className="size-4 rtl:-scale-x-100" />
          </span>
        </Link>
        {/* Two short lines, and the reference kept whole: in one sentence
            it broke at its hyphens and left a ragged second line. */}
        <p className="npf-small mt-3 text-center text-npf-steel">
          {t("Already open:")}{" "}
          <span className="font-secondary font-bold whitespace-nowrap text-npf-ink">
            {existing.id}
          </span>
          <br />
          {t("Status: {status}", {
            status: t(existing.status).toLowerCase(),
          })}
        </p>
      </>
    );

  return (
    <>
      <Link
        href={apply}
        className="npf-btn npf-btn-primary h-auto min-h-12 w-full py-1.5 ps-6 text-start leading-tight whitespace-normal hover:bg-npf-blue-mid"
      >
        {service.action}
        <span className="npf-btn-disc ms-auto">
          <ArrowRight className="size-4 rtl:-scale-x-100" />
        </span>
      </Link>
      <p className="npf-small mt-3 text-center text-npf-steel">
        {service.feeSummary === t("Free of Charge")
          ? t("No fee")
          : t("{fee} payable on approval", { fee: service.feeSummary })}{" "}
        · {service.turnaround}
      </p>
    </>
  );
}
