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
        className="block h-[52px] w-full animate-pulse rounded-full bg-black/[0.06]"
      />
    );

  if (!session)
    return (
      <>
        <Link
          href={`/app/signin?next=${encodeURIComponent(`/app/services/${service.slug}`)}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-dp-green px-6 py-3.5 font-medium text-white transition-colors hover:bg-dp-green-mid"
        >
          <UserCircle className="size-5" />
          {t("Sign in to {action}", {
            action: t(service.action).toLowerCase(),
          })}
          <ArrowRight className="size-4" />
        </Link>
        <p className="mt-3 text-center text-xs text-dp-muted">
          {t("Takes about {turnaround} once submitted", {
            turnaround: t(service.turnaround).toLowerCase(),
          })}
        </p>
      </>
    );

  if (justFiled)
    return (
      <div className="rounded-2xl bg-white p-5 text-center ring-1 ring-dp-green/25">
        <CheckCircle aria-hidden className="mx-auto size-8 text-dp-green" />
        <p className="mt-2 font-secondary text-base font-bold text-dp-green-deep">
          {t("Request opened")}
        </p>
        <p className="mt-1 text-sm text-dp-body">
          {t("Quote reference")}{" "}
          <span className="font-secondary font-bold text-dp-ink">
            {justFiled}
          </span>
          .
        </p>
        <Link
          href="/app/portal/requests"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-dp-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dp-green-mid"
        >
          {t("Track it")}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );

  if (existing)
    return (
      <>
        <Link
          href="/app/portal/requests"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-dp-green px-6 py-3.5 font-medium text-white transition-colors hover:bg-dp-green-mid"
        >
          {t("Open request {ref}", { ref: existing.id })}
          <ArrowRight className="size-4" />
        </Link>
        <p className="mt-3 text-center text-xs text-dp-muted">
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
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-dp-green px-6 py-3.5 font-medium text-white transition-colors hover:bg-dp-green-mid"
      >
        {service.action}
        <ArrowRight className="size-4" />
      </button>
      <p className="mt-3 text-center text-xs text-dp-muted">
        {service.feeSummary === t("Free of Charge")
          ? t("No fee")
          : t("{fee} payable on approval", { fee: service.feeSummary })}{" "}
        · {service.turnaround}
      </p>
    </>
  );
}
