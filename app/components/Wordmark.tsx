/**
 * The two institutional marks in the header, and the police mark again in the
 * footer and the operations console.
 *
 * Both emblems are the real artwork: the issued force crest for the police
 * mark, the national coat of arms for the government one. They stood in as
 * shapes drawn in code until the files existed, which read as approximately
 * right and exactly wrong — a state badge is either the badge or it is not.
 *
 * Only the lettering is set here, so it stays the site's own display face and
 * one `currentColor` carries every state: white over the hero, ink or deep
 * navy on a page. The emblems are full colour and do not follow it; a badge
 * is not meant to.
 *
 * `textLength` with `lengthAdjust="spacingAndGlyphs"` is load-bearing. It
 * pins each line to an exact measure, so a fallback face with different
 * metrics still lands inside the viewBox instead of spilling out of it, and
 * the two lines of a lockup stay flush to the same left and right edges
 * whatever face resolves.
 *
 * Every proportion below is a percentage of the mark's own height, because
 * the caller sets only that — h-11 in the header, h-16 in the footer, h-7 in
 * the console — and a lockup that changed shape between the three would read
 * as three different marks. The gap lives inside the text viewBox as negative
 * x rather than as a flex `gap`, for the same reason: a fixed pixel gap is
 * right at one size and wrong at the other two.
 */

import Image from "next/image";

type Props = { className?: string };

const line = {
  fill: "currentColor",
  fontFamily: "var(--font-secondary)",
  lengthAdjust: "spacingAndGlyphs" as const,
};

/** Federal Republic of Nigeria — the national arms plus the lettering. */
export function GovernmentWordmark({ className }: Props) {
  return (
    <span className={`inline-flex items-center ${className ?? ""}`}>
      <Image
        src="/coat-of-arms.png"
        alt=""
        width={604}
        height={512}
        sizes="64px"
        aria-hidden
        className="h-[69%] w-auto"
      />
      <svg
        viewBox="-10 -3 90 26"
        className="h-[45%] w-auto"
        aria-hidden
        focusable="false"
        role="presentation"
      >
        <text
          {...line}
          x="0"
          y="8.4"
          fontSize="12"
          fontWeight="700"
          textLength="80"
        >
          FEDERAL REPUBLIC
        </text>
        <text
          {...line}
          x="0"
          y="21.4"
          fontSize="12"
          fontWeight="700"
          textLength="52"
        >
          OF NIGERIA
        </text>
      </svg>
    </span>
  );
}

/** Nigeria Police Force, FCT Command — the issued crest plus the lettering. */
export function PoliceWordmark({ className }: Props) {
  return (
    <span className={`inline-flex items-center ${className ?? ""}`}>
      <Image
        src="/logo.png"
        alt=""
        width={1179}
        height={1334}
        sizes="64px"
        aria-hidden
        className="h-[91%] w-auto"
      />
      <svg
        viewBox="-8 -3 110 22"
        className="h-[50%] w-auto"
        aria-hidden
        focusable="false"
        role="presentation"
      >
        <text
          {...line}
          x="0"
          y="7.4"
          fontSize="10.5"
          fontWeight="800"
          textLength="102"
        >
          NIGERIA POLICE FORCE
        </text>
        <text
          {...line}
          x="0"
          y="18.4"
          fontSize="6.8"
          fontWeight="700"
          textLength="102"
        >
          FCT COMMAND
        </text>
      </svg>
    </span>
  );
}
