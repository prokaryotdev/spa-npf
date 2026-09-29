"use client";

import Link from "../i18n/Link";
import { useState } from "react";
import type { Service } from "../content-services";
import { submitRequest, useStore } from "./store";
import { ArrowRight, CheckCircle, UserCircle } from "./icons";
import { useT } from "../i18n/client";

/**
 * The button at the top of a service page. Signed out it hands over to
 * sign-in and comes back; signed in it opens the request and shows the
 * reference number, because a reference number is the only thing anyone
 * wanted from the page.
 */
export default function ServiceAction({ service }: { service: Service }) {
  const t = useT();
  const { session, requests, loaded } = useStore();
  const [justFiled, setJustFiled] = useState<string | null>(null);

  const existing = requests.find(
    (r) => r.slug === service.slug && r.status !== "Completed",
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
          href={`/app/signin?next=${encodeURIComponent(`/app/services/${service.slug}`)}`}
          className="npf-btn npf-btn-primary w-full ps-6 hover:bg-npf-blue-mid"
        >
          <UserCircle className="size-5 shrink-0" />
          {t("Sign in to {action}", {
            action: t(service.action).toLowerCase(),
          })}
          <span className="npf-btn-disc ms-auto">
            <ArrowRight className="size-4 rtl:-scale-x-100" />
          </span>
        </Link>
        <p className="npf-small mt-3 text-center text-npf-steel">
          {t(service.turnaround) === t("Instant")
            ? t("Done as soon as you submit")
            : t("Takes about {turnaround} once submitted", {
                turnaround: t(service.turnaround).toLowerCase(),
              })}
        </p>
      </>
    );

  if (justFiled)
    return (
      <div className="rounded-card bg-npf-mist p-5 text-center transition-[opacity,scale] duration-(--dur-media) ease-(--ease-out) starting:scale-[0.97] starting:opacity-0">
        <CheckCircle aria-hidden className="mx-auto size-8 text-npf-blue" />
        <p className="mt-2 font-secondary text-base font-bold text-npf-blue-deep">
          {t("Request opened")}
        </p>
        <p className="mt-1 text-sm text-npf-body">
          {t("Quote reference")}{" "}
          <span className="font-secondary font-bold text-npf-ink">
            {justFiled}
          </span>
          .
        </p>
        <Link
          href="/app/portal/requests"
          className="npf-btn npf-btn-primary mt-4 hover:bg-npf-blue-mid"
        >
          {t("Track it")}
          <span className="npf-btn-disc">
            <ArrowRight className="size-4 rtl:-scale-x-100" />
          </span>
        </Link>
      </div>
    );

  if (existing)
    return (
      <>
        <Link
          href="/app/portal/requests"
          className="npf-btn npf-btn-primary w-full ps-6 hover:bg-npf-blue-mid"
        >
          {t("Open request {ref}", { ref: existing.id })}
          <span className="npf-btn-disc ms-auto">
            <ArrowRight className="size-4 rtl:-scale-x-100" />
          </span>
        </Link>
        <p className="npf-small mt-3 text-center text-npf-steel">
          {t("You already have this open — status: {status}", {
            status: t(existing.status).toLowerCase(),
          })}
        </p>
      </>
    );

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setJustFiled(
            submitRequest({
              slug: service.slug,
              service: service.name,
              fee: service.feeSummary,
            }).id,
          )
        }
        className="npf-btn npf-btn-primary w-full ps-6 hover:bg-npf-blue-mid"
      >
        {service.action}
        <span className="npf-btn-disc ms-auto">
          <ArrowRight className="size-4 rtl:-scale-x-100" />
        </span>
      </button>
      <p className="npf-small mt-3 text-center text-npf-steel">
        {service.feeSummary === t("Free of Charge")
          ? t("No fee")
          : t("{fee} payable on approval", { fee: service.feeSummary })}{" "}
        · {service.turnaround}
      </p>
    </>
  );
}
