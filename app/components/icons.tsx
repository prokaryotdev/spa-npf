/** One drawn icon set: 24px box, 1.75 stroke, round caps, currentColor. */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const SearchIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
);

export const ChevronDown = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="m6 9.5 6 5.5 6-5.5" />
  </svg>
);

export const ChevronLeft = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M15 5 8 12l7 7" />
  </svg>
);

export const ChevronRight = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const ArrowRight = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4.5 12h14" />
    <path d="m13 6.5 5.5 5.5L13 17.5" />
  </svg>
);

export const ArrowUpRight = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M7.5 16.5 16.5 7.5" />
    <path d="M9 7.5h7.5V15" />
  </svg>
);

export const UserCircle = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="10" r="3" />
    <path d="M5.9 18.6a7.4 7.4 0 0 1 12.2 0" />
  </svg>
);

export const MenuIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </svg>
);

export const CloseIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="m6 6 12 12" />
    <path d="m18 6-12 12" />
  </svg>
);

export const PauseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <rect x="7" y="5" width="3.5" height="14" rx="1.5" />
    <rect x="13.5" y="5" width="3.5" height="14" rx="1.5" />
  </svg>
);

export const PlayIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M8 5.6a1 1 0 0 1 1.5-.9l8 6.4a1 1 0 0 1 0 1.8l-8 6.4a1 1 0 0 1-1.5-.9Z" />
  </svg>
);

export const PhoneIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M6.2 3.5h3l1.4 3.6-2 1.4a11.4 11.4 0 0 0 6.9 6.9l1.4-2 3.6 1.4v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.2 5.7a2 2 0 0 1 2-2.2Z" />
  </svg>
);

/** Grid of nine dots — the site's "services" glyph. */
export const ServicesIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    {[5, 12, 19].map((y) =>
      [5, 12, 19].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.9" />),
    )}
  </svg>
);

export const CalendarIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
    <path d="M3.5 9.5h17" />
    <path d="M8 3v4M16 3v4" />
  </svg>
);

export const PinIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const SmileIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 14a4.4 4.4 0 0 0 7 0" />
    <path d="M9 9.5h.01M15 9.5h.01" />
  </svg>
);

export const AccessibilityIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="4.4" r="1.7" />
    <path d="M4.8 8.2a22 22 0 0 0 14.4 0" />
    <path d="M12 8.6v5.2" />
    <path d="m12 13.8-2.6 6.4M12 13.8l2.6 6.4" />
  </svg>
);

export const socialIcons = {
  Facebook: (
    <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.25-1.5 1.5-1.5h1.6V4.4a21 21 0 0 0-2.3-.12c-2.3 0-3.9 1.4-3.9 4v2.22H7.9v3h2.5V21Z" />
  ),
  Youtube: (
    <path d="M21.6 8.1a2.5 2.5 0 0 0-1.76-1.77C18.28 5.9 12 5.9 12 5.9s-6.28 0-7.84.43A2.5 2.5 0 0 0 2.4 8.1 26 26 0 0 0 2 12a26 26 0 0 0 .4 3.9 2.5 2.5 0 0 0 1.76 1.77c1.56.43 7.84.43 7.84.43s6.28 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-3.9ZM10 15.1V8.9l5.2 3.1Z" />
  ),
  Twitter: (
    <path d="M17.3 3.8h3l-6.6 7.5L21.5 21h-6l-4.7-6.1L5.4 21h-3l7-8-6.8-9.2h6.2l4.3 5.6Zm-1 15.3h1.7L7.8 5.6H6Z" />
  ),
  Instagram: (
    <path d="M12 2.2c-2.7 0-3 .01-4.05.06-1.05.05-1.77.22-2.4.46a4.8 4.8 0 0 0-1.75 1.14A4.8 4.8 0 0 0 2.66 5.6c-.24.63-.4 1.35-.46 2.4C2.16 9.04 2.15 9.37 2.15 12s.01 2.96.06 4.01c.05 1.05.22 1.77.46 2.4a4.8 4.8 0 0 0 1.14 1.75 4.8 4.8 0 0 0 1.74 1.14c.63.24 1.35.4 2.4.46 1.06.05 1.39.06 4.05.06s3-.01 4.05-.06c1.05-.05 1.77-.22 2.4-.46a5 5 0 0 0 2.89-2.89c.24-.63.4-1.35.46-2.4.05-1.05.06-1.38.06-4.01s-.01-2.96-.06-4.01c-.05-1.05-.22-1.77-.46-2.4a4.8 4.8 0 0 0-1.14-1.75 4.8 4.8 0 0 0-1.75-1.14c-.63-.24-1.35-.4-2.4-.46C15 2.21 14.67 2.2 12 2.2Zm0 1.77c2.62 0 2.93.01 3.97.06.96.04 1.48.2 1.82.34.46.17.79.38 1.13.72.34.34.55.67.73 1.13.13.34.3.86.34 1.82.05 1.04.06 1.35.06 3.96s-.01 2.92-.06 3.96c-.04.96-.2 1.48-.34 1.82a3 3 0 0 1-.73 1.13c-.34.34-.67.55-1.13.72-.34.14-.86.3-1.82.34-1.04.05-1.35.06-3.97.06s-2.93-.01-3.97-.06c-.96-.04-1.48-.2-1.82-.34a3 3 0 0 1-1.13-.72 3 3 0 0 1-.73-1.13c-.13-.34-.3-.86-.34-1.82-.05-1.04-.06-1.35-.06-3.96s.01-2.92.06-3.96c.04-.96.21-1.48.34-1.82.18-.46.39-.79.73-1.13.34-.34.67-.55 1.13-.72.34-.14.86-.3 1.82-.34 1.04-.05 1.35-.06 3.97-.06Zm0 3.01a5.02 5.02 0 1 0 0 10.04 5.02 5.02 0 0 0 0-10.04Zm0 8.28a3.26 3.26 0 1 1 0-6.52 3.26 3.26 0 0 1 0 6.52Zm6.4-8.48a1.17 1.17 0 1 1-2.35 0 1.17 1.17 0 0 1 2.34 0Z" />
  ),
};

export const SocialIcon = ({
  name,
  className,
}: {
  name: keyof typeof socialIcons;
  className?: string;
}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    {socialIcons[name]}
  </svg>
);
