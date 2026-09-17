/**
 * The two institutional marks in the header, and the police mark again in the
 * footer and the operations console.
 *
 * They used to be two SVG files painted as CSS masks, which is what you do
 * when the artwork is lettering you cannot set. These are drawn here instead,
 * so the lettering is the site's own display face and one `currentColor`
 * carries every state: white over the hero, ink or deep navy on a page.
 *
 * `textLength` with `lengthAdjust="spacingAndGlyphs"` is load-bearing. It
 * pins each line to an exact measure, so a fallback face with different
 * metrics still lands inside the viewBox instead of spilling out of it, and
 * the two lines of a lockup stay flush to the same left and right edges
 * whatever face resolves.
 *
 * The emblem is the confluence shield of the national arms — the Niger and
 * the Benue meeting as a Y — drawn as geometry, not traced from the crest.
 */

type Props = { className?: string };

/** Shield silhouette with the Y knocked out of it, on a 40 × 40 grid. */
function Shield({ id }: { id: string }) {
  return (
    <>
      <mask id={id}>
        <path
          d="M4 3.5h32v15.6c0 9.1-6.5 14.3-16 18.6-9.5-4.3-16-9.5-16-18.6Z"
          fill="#fff"
        />
        <g stroke="#000" strokeWidth="3.6" strokeLinecap="round" fill="none">
          <path d="M10 10.5 20 20.5 30 10.5" />
          <path d="M20 20.5v11.5" />
        </g>
      </mask>
      <rect width="40" height="40" fill="currentColor" mask={`url(#${id})`} />
    </>
  );
}

const line = {
  fill: "currentColor",
  fontFamily: "var(--font-secondary)",
  lengthAdjust: "spacingAndGlyphs" as const,
};

/** Federal Republic of Nigeria — the government mark, 130 × 58. */
export function GovernmentWordmark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 130 58"
      className={className}
      aria-hidden
      focusable="false"
      role="presentation"
    >
      <g transform="translate(0 9)">
        <Shield id="npf-arms-gov" />
      </g>
      <text {...line} x="50" y="27" fontSize="12" fontWeight="700" textLength="80">
        FEDERAL REPUBLIC
      </text>
      <text {...line} x="50" y="40" fontSize="12" fontWeight="700" textLength="52">
        OF NIGERIA
      </text>
    </svg>
  );
}

/** Nigeria Police Force, FCT Command — the police mark, 150 × 44. */
export function PoliceWordmark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 150 44"
      className={className}
      aria-hidden
      focusable="false"
      role="presentation"
    >
      <g transform="translate(0 2)">
        <Shield id="npf-arms-police" />
      </g>
      <text {...line} x="48" y="22" fontSize="10.5" fontWeight="700" textLength="102">
        NIGERIA POLICE FORCE
      </text>
      <text {...line} x="48" y="33" fontSize="6.8" fontWeight="500" textLength="102">
        FCT COMMAND
      </text>
    </svg>
  );
}
