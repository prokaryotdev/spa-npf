"use client";

import { useState } from "react";
import { responseTrend } from "../content-ops";

const peak = Math.max(...responseTrend.map((d) => d.minutes));
const target = 5;

/**
 * Median response time by hour. One series, so one hue and no legend — the
 * heading names it. Bars start at zero because minutes are a magnitude; the
 * only labelled values are the peak and anything over target, since a number
 * on all twelve bars is noise.
 */
export default function OpsResponseChart() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <figure className="m-0">
      <figcaption className="mb-1 font-secondary text-base font-bold">
        Median response time
      </figcaption>
      <p className="mb-5 text-xs text-[var(--ops-dim)]">
        Last 12 hours, in minutes. Target {target} minutes.
      </p>

      <div className="relative h-40">
        {/* Target line, drawn behind the bars and labelled at the end. */}
        <div
          aria-hidden
          className="absolute right-0 left-0 border-t border-dashed border-[var(--ops-line)]"
          style={{ bottom: `${(target / peak) * 100}%` }}
        >
          <span className="absolute -top-2 right-0 bg-[var(--ops-panel)] pl-2 text-[10px] text-[var(--ops-dim)] tabular-nums">
            {target}m
          </span>
        </div>

        <ul className="flex h-full items-end gap-[2px]">
          {responseTrend.map((point, i) => {
            const over = point.minutes > target;
            const show = hover === i || point.minutes === peak;
            return (
              <li key={point.hour} className="relative flex h-full flex-1 items-end">
                <button
                  type="button"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover((h) => (h === i ? null : h))}
                  aria-label={`${point.hour}:00 — ${point.minutes} minutes`}
                  className="w-full rounded-t transition-opacity"
                  style={{
                    height: `${(point.minutes / peak) * 100}%`,
                    background: over ? "#f0b354" : "var(--ops-accent)",
                    opacity: hover === null || hover === i ? 1 : 0.45,
                  }}
                />
                {show ? (
                  <span className="pointer-events-none absolute inset-x-0 -top-5 text-center text-[11px] font-medium tabular-nums">
                    {point.minutes}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      <ul
        aria-hidden
        className="mt-2 flex gap-[2px] text-[10px] text-[var(--ops-dim)] tabular-nums"
      >
        {responseTrend.map((point) => (
          <li key={point.hour} className="flex-1 text-center">
            {point.hour}
          </li>
        ))}
      </ul>

      <details className="mt-4">
        <summary className="cursor-pointer text-xs text-[var(--ops-dim)] transition-colors hover:text-[var(--ops-text)]">
          Show the numbers
        </summary>
        <table className="mt-3 w-full text-left text-xs">
          <caption className="sr-only">
            Median response time in minutes, by hour, over the last 12 hours
          </caption>
          <thead className="text-[var(--ops-dim)]">
            <tr>
              <th scope="col" className="py-1 font-medium">
                Hour
              </th>
              <th scope="col" className="py-1 text-right font-medium">
                Minutes
              </th>
            </tr>
          </thead>
          <tbody>
            {responseTrend.map((point) => (
              <tr key={point.hour} className="border-t border-[var(--ops-line)]">
                <th scope="row" className="py-1.5 font-normal tabular-nums">
                  {point.hour}:00
                </th>
                <td className="py-1.5 text-right tabular-nums">
                  {point.minutes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
