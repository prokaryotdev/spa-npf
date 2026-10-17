"use client";

import { emergencyNumbers as emergencyNumbersSource } from "../content";
import { PhoneCallIcon } from "./icons";
import { useT, useLocalized } from "../i18n/client";

/**
 * The emergency lines as one block: 112 as the red card, the rest stacked
 * beside it. The footer closes every page with it; Contact Us opens with it.
 */
export default function EmergencyLines({
  className = "",
}: {
  className?: string;
}) {
  const [lead, ...others] = useLocalized(emergencyNumbersSource);
  const t = useT();
  return (
    <div className={`grid gap-(--npf-gap) lg:grid-cols-12 ${className}`}>
      {/* 112 is the one line someone may need in a hurry, so it gets the
          alarm red as a whole surface and the whole surface dials. A warm
          light in the top corner deepens to dark red at the foot. */}
      <a
        href={`tel:${lead.number}`}
        className="group flex flex-col justify-between gap-8 rounded-tile bg-npf-alert bg-[radial-gradient(90%_80%_at_100%_0%,rgb(255_120_90/0.35),transparent_60%),linear-gradient(135deg,var(--color-npf-alert)_40%,var(--color-npf-alert-deep)_100%)] p-(--npf-pad) text-white shadow-card transition-[translate] hover:-translate-y-1 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-npf-alert lg:col-span-7"
      >
        <span className="flex flex-wrap items-center justify-between gap-3">
          <span className="npf-h4">{lead.label}</span>
          {lead.note ? (
            <span className="npf-caption rounded-full bg-white/12 px-3 py-1.5 ring-1 ring-white/20 ring-inset">
              {lead.note}
            </span>
          ) : null}
        </span>
        <span className="flex flex-wrap items-end justify-between gap-x-6 gap-y-5">
          <span className="npf-display-xl tabular-nums">{lead.number}</span>
          {/* A real button shape, so nobody wonders whether the card
              dials. The ring ripples out like a line ringing. */}
          <span className="npf-btn bg-white text-npf-alert">
            {t("Call")} {lead.number}
            <span className="npf-btn-disc relative bg-npf-alert text-white">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full ring-2 ring-npf-alert/50 motion-safe:animate-[npf-ring_2.4s_var(--ease-out)_infinite]"
              />
              <PhoneCallIcon className="size-4.5 transition-[rotate] group-hover:-rotate-12" />
            </span>
          </span>
        </span>
      </a>

      {/* The other lines are white cards with the newsletter's edge and
          a hint of its mist, stacked to the red card's height, with the call
          button pinned to the end so they line up however long a translated
          label runs. */}
      <ul className="flex flex-col gap-3 lg:col-span-5">
        {others.map((item) => (
          <li key={item.number} className="flex flex-1">
            <a
              href={`tel:${item.number}`}
              className="group flex flex-1 items-center justify-between gap-4 rounded-tile bg-white bg-[radial-gradient(60%_140%_at_100%_0%,var(--color-npf-mist),transparent_70%)] px-5 py-4 text-npf-ink ring-1 ring-npf-blue/8 transition-[translate,box-shadow] ring-inset hover:-translate-y-0.5 hover:shadow-card md:px-6"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className="npf-h5 text-npf-ink">{item.label}</span>
                  {item.note ? (
                    <span className="npf-small text-npf-muted">
                      {item.note}
                    </span>
                  ) : null}
                </span>
                <span className="npf-h3 leading-none text-npf-ink tabular-nums transition-colors group-hover:text-npf-blue">
                  {item.number}
                </span>
              </span>
              <span className="npf-btn npf-btn-primary">
                {t("Call")}
                <span className="npf-btn-disc">
                  <PhoneCallIcon className="size-4.5 transition-[rotate] group-hover:-rotate-12" />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
