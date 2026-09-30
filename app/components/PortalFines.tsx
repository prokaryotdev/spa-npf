"use client";

import { useState } from "react";
import { payFine, useStore } from "./store";
import { Empty } from "./ui";
import {
  AlertIcon,
  CardIcon,
  CheckCircle,
  CheckIcon,
  ClockIcon,
  PinIcon,
} from "./icons";
import { useFormat, useT } from "../i18n/client";

/** Fines paid within 30 days of being issued are discounted by a quarter. */
const DISCOUNT = 0.25;
const DISCOUNT_DAYS = 30;

const withinDiscount = (issued: string) =>
  (Date.now() - new Date(issued).getTime()) / 86_400_000 < DISCOUNT_DAYS;

/** What a fine actually costs today. */
const payable = (fine: { amount: number; issued: string }) =>
  withinDiscount(fine.issued)
    ? Math.round(fine.amount * (1 - DISCOUNT))
    : fine.amount;

export default function PortalFines() {
  const t = useT();
  const format = useFormat();
  const { fines } = useStore();
  const [paying, setPaying] = useState<string | null>(null);

  const unpaid = fines.filter((f) => !f.paid);
  const paid = fines.filter((f) => f.paid);
  // The headline is what is payable today, not the ticket face value — the
  // rows below already apply the discount, and two different totals on one
  // screen is the kind of thing people phone the call centre about.
  const owed = unpaid.reduce((sum, f) => sum + payable(f), 0);
  const face = unpaid.reduce((sum, f) => sum + f.amount, 0);
  const points = unpaid.reduce((sum, f) => sum + f.points, 0);

  return (
    <div className="space-y-8">
      <h2 className="npf-h3 text-npf-blue-deep">{t("Fines")}</h2>

      {unpaid.length ? (
        <div className="overflow-hidden rounded-card border border-npf-hairline bg-white">
          <dl className="grid divide-y divide-npf-hairline sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="relative min-w-0 py-5 ps-[5.25rem] pe-5">
              <dt className="npf-small text-npf-steel">
                <span
                  aria-hidden
                  className="npf-disc absolute start-5 top-1/2 size-12 -translate-y-1/2"
                >
                  <CardIcon className="size-5.5" />
                </span>
                {t("Payable today")}
              </dt>
                <dd className="npf-h3 text-npf-blue-deep tabular-nums">
                  {format.naira(owed)}
                </dd>
                {face > owed ? (
                  <dd className="npf-small text-npf-steel tabular-nums">
                    <s>{format.naira(face)}</s>{" "}
                    {t("before the early-payment discount")}
                  </dd>
                ) : null}
            </div>
            <div className="relative min-w-0 py-5 ps-[5.25rem] pe-5">
              <dt className="npf-small text-npf-steel">
                <span
                  aria-hidden
                  className="npf-disc absolute start-5 top-1/2 size-12 -translate-y-1/2"
                >
                  <AlertIcon className="size-5.5" />
                </span>
                {t("Penalty points at risk")}
              </dt>
              <dd className="npf-h3 text-npf-blue-deep tabular-nums">
                {points}
              </dd>
            </div>
          </dl>
          <p className="npf-small flex items-start gap-2.5 border-t border-npf-hairline bg-npf-gold-wash px-5 py-3 text-npf-warn">
            <ClockIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
            {t("Paying within {days} days of the issue date takes 25% off.", {
              days: DISCOUNT_DAYS,
            })}
          </p>
        </div>
      ) : null}

      <section>
        <h3 className="npf-h4 mb-4 text-npf-blue-deep">{t("Unpaid")}</h3>
        {unpaid.length ? (
          <ul className="divide-y divide-npf-hairline overflow-hidden rounded-card border border-npf-hairline bg-white">
            {unpaid.map((fine) => {
              const due = payable(fine);
              const discounted = due < fine.amount;
              return (
                <li
                  key={fine.id}
                  className="flex flex-wrap items-center gap-x-6 gap-y-4 px-5 py-5"
                >
                  <div className="min-w-0 flex-1 basis-72">
                    <p className="npf-h5 text-npf-ink">{t(fine.reason)}</p>
                    <p className="npf-small mt-1.5 flex items-start gap-1.5 text-npf-body">
                      <PinIcon
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-npf-steel"
                      />
                      {t(fine.location)}
                    </p>
                    <p className="npf-small mt-1 text-npf-steel tabular-nums">
                      {fine.id} · {format.date(fine.issued)}
                      {fine.points
                        ? ` · ${t("{n} penalty points", { n: fine.points })}`
                        : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-5 max-sm:w-full max-sm:justify-between">
                    <div className="text-end max-sm:text-start">
                      <p className="npf-h4 text-npf-ink tabular-nums">
                        {format.naira(due)}
                      </p>
                      {discounted ? (
                        <p className="npf-small text-npf-steel tabular-nums">
                          <s>{format.naira(fine.amount)}</s>{" "}
                          <span className="font-semibold text-npf-ok">
                            {t("25% off")}
                          </span>
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      disabled={paying === fine.id}
                      onClick={() => {
                        setPaying(fine.id);
                        // A beat of latency, so paying reads as something
                        // that happened rather than a row blinking out.
                        window.setTimeout(() => {
                          payFine(fine.id);
                          setPaying(null);
                        }, 600);
                      }}
                      className="npf-btn npf-btn-primary npf-btn-sm disabled:cursor-wait"
                    >
                      <CardIcon aria-hidden className="size-4" />
                      {paying === fine.id ? t("Paying…") : t("Pay now")}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <Empty
            icon={<CheckCircle className="size-6" />}
            title={t("Nothing outstanding")}
            body={t("No unpaid fines are recorded against this NIN.")}
          />
        )}
      </section>

      {paid.length ? (
        <section>
          <h3 className="npf-h4 mb-4 text-npf-blue-deep">{t("Paid")}</h3>
          <ul className="divide-y divide-npf-hairline overflow-hidden rounded-card border border-npf-hairline bg-white">
            {paid.map((fine) => (
              <li
                key={fine.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-npf-ok-soft text-npf-ok">
                  <CheckIcon aria-hidden className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="npf-body truncate font-medium text-npf-ink">
                    {t(fine.reason)}
                  </p>
                  <p className="npf-small mt-0.5 text-npf-steel tabular-nums">
                    {fine.id} · {format.date(fine.issued)}
                  </p>
                </div>
                <p className="npf-body font-semibold text-npf-ink tabular-nums">
                  {format.naira(fine.amount)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
