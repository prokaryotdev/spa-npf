"use client";

import { useState } from "react";
import { payFine, useStore } from "./store";
import { Empty } from "./ui";
import { AlertIcon, CardIcon, CheckCircle } from "./icons";
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
      <h2 className="font-secondary text-2xl font-bold text-npf-blue-deep">
        {t("Fines")}
      </h2>

      {unpaid.length ? (
        <div className="rounded-3xl bg-[#F4F6FA] p-6">
          <dl className="flex flex-wrap gap-x-12 gap-y-4">
            <div>
              <dt className="text-sm text-npf-body">{t("Payable today")}</dt>
              <dd className="mt-1 font-secondary text-3xl font-bold text-npf-blue-deep tabular-nums">
                {format.naira(owed)}
              </dd>
              {face > owed ? (
                <dd className="mt-0.5 text-sm text-npf-muted tabular-nums">
                  <s>{format.naira(face)}</s>{" "}
                  {t("before the early-payment discount")}
                </dd>
              ) : null}
            </div>
            <div>
              <dt className="text-sm text-npf-body">
                {t("Penalty points at risk")}
              </dt>
              <dd className="mt-1 font-secondary text-3xl font-bold text-npf-blue-deep tabular-nums">
                {points}
              </dd>
            </div>
          </dl>
          <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-npf-body">
            <AlertIcon
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-[#8a5a00]"
            />
            {t("Paying within {days} days of the issue date takes 25% off.", {
              days: DISCOUNT_DAYS,
            })}
          </p>
        </div>
      ) : null}

      <section>
        <h3 className="mb-4 font-secondary text-lg font-bold text-npf-ink">
          {t("Unpaid")}
        </h3>
        {unpaid.length ? (
          <ul className="space-y-3">
            {unpaid.map((fine) => {
              const due = payable(fine);
              const discounted = due < fine.amount;
              return (
                <li
                  key={fine.id}
                  className="rounded-2xl px-5 py-4 ring-1 ring-black/[0.07]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-secondary text-base font-bold text-npf-ink">
                        {t(fine.reason)}
                      </p>
                      <p className="mt-1 text-sm text-npf-body">
                        {t(fine.location)}
                      </p>
                      <p className="mt-1 text-sm text-npf-muted tabular-nums">
                        {fine.id} · {format.date(fine.issued)}
                        {fine.points
                          ? ` · ${t("{n} penalty points", { n: fine.points })}`
                          : ""}
                      </p>
                    </div>

                    <div className="text-end">
                      <p className="font-secondary text-xl font-bold text-npf-ink tabular-nums">
                        {format.naira(due)}
                      </p>
                      {discounted ? (
                        <p className="mt-0.5 text-xs text-npf-blue-ink tabular-nums">
                          <s className="text-npf-muted">
                            {format.naira(fine.amount)}
                          </s>{" "}
                          {t("25% off")}
                        </p>
                      ) : null}
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
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-npf-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-npf-blue-mid disabled:cursor-wait disabled:opacity-70"
                      >
                        <CardIcon aria-hidden className="size-4" />
                        {paying === fine.id ? t("Paying…") : t("Pay now")}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <Empty
            title={t("Nothing outstanding")}
            body={t("No unpaid fines are recorded against this NIN.")}
          />
        )}
      </section>

      {paid.length ? (
        <section>
          <h3 className="mb-4 font-secondary text-lg font-bold text-npf-ink">
            {t("Paid")}
          </h3>
          <ul className="divide-y divide-black/[0.07] rounded-2xl bg-[#F9F9F9] px-5">
            {paid.map((fine) => (
              <li
                key={fine.id}
                className="flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-npf-ink">
                    {t(fine.reason)}
                  </p>
                  <p className="mt-0.5 text-sm text-npf-muted tabular-nums">
                    {fine.id} · {format.date(fine.issued)}
                  </p>
                </div>
                <p className="flex items-center gap-2 text-sm font-medium text-npf-blue-ink tabular-nums">
                  <CheckCircle aria-hidden className="size-4" />
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
