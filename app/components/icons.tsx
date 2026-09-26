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

/** Handset with signal arcs — a call being placed, not a phone number. */
export const CallIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4.8 3.4h2.4l1.2 3-1.7 1.2a9.6 9.6 0 0 0 5.7 5.7l1.2-1.7 3 1.2v2.4a1.7 1.7 0 0 1-1.9 1.7A14.1 14.1 0 0 1 3.1 5.3a1.7 1.7 0 0 1 1.7-1.9Z" />
    <path d="M14.6 3.2a6.4 6.4 0 0 1 6.2 6.2" />
    <path d="M14.4 6.9a2.8 2.8 0 0 1 2.7 2.7" />
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
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className={className}
  >
    <rect x="7" y="5" width="3.5" height="14" rx="1.5" />
    <rect x="13.5" y="5" width="3.5" height="14" rx="1.5" />
  </svg>
);

export const PlayIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className={className}
  >
    <path d="M8 5.6a1 1 0 0 1 1.5-.9l8 6.4a1 1 0 0 1 0 1.8l-8 6.4a1 1 0 0 1-1.5-.9Z" />
  </svg>
);

export const PhoneIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M6.2 3.5h3l1.4 3.6-2 1.4a11.4 11.4 0 0 0 6.9 6.9l1.4-2 3.6 1.4v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.2 5.7a2 2 0 0 1 2-2.2Z" />
  </svg>
);

/** A solid handset with two ringing waves, for buttons that dial. */
export const PhoneCallIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path
      fill="currentColor"
      stroke="none"
      d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
    />
    <path
      d="M14.5 2.5a7 7 0 0 1 7 7M14.5 6a3.5 3.5 0 0 1 3.5 3.5"
      strokeWidth={2}
    />
  </svg>
);

/** Grid of nine dots — the site's "services" glyph. */
export const ServicesIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className={className}
  >
    {[5, 12, 19].map((y) =>
      [5, 12, 19].map((x) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.9" />
      )),
    )}
  </svg>
);

export const PinIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

/*
 * The three feedback kinds. Drawn here with the rest of the set rather
 * than shipped as image files.
 */
export const IdeaIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M9.5 17.5h5" />
    <path d="M10 20.5h4" />
    <path d="M12 3.5a5.5 5.5 0 0 0-3.2 10 2.6 2.6 0 0 1 .9 1.7v.3h4.6v-.3a2.6 2.6 0 0 1 .9-1.7A5.5 5.5 0 0 0 12 3.5Z" />
  </svg>
);

export const HeartIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 20s-7.2-4.4-7.2-9.2A3.8 3.8 0 0 1 12 8.3a3.8 3.8 0 0 1 7.2 2.5C19.2 15.6 12 20 12 20Z" />
  </svg>
);

export const AlertIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M10.6 4.3 2.9 17.5a1.6 1.6 0 0 0 1.4 2.4h15.4a1.6 1.6 0 0 0 1.4-2.4L13.4 4.3a1.6 1.6 0 0 0-2.8 0Z" />
    <path d="M12 9.5v4" />
    <path d="M12 17h.01" />
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
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className={className}
  >
    {socialIcons[name]}
  </svg>
);

export const ClockIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.3V12l3.2 2" />
  </svg>
);

export const FileIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M13.5 2.8H7a2 2 0 0 0-2 2v14.4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.3Z" />
    <path d="M13.5 2.8v4.2a1.3 1.3 0 0 0 1.3 1.3H19" />
  </svg>
);

export const InboxIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M3.2 13.6h4.2l1.5 2.6h6.2l1.5-2.6h4.2" />
    <path d="M5.6 4.4h12.8l2.4 9.2v4.4a2 2 0 0 1-2 2H5.2a2 2 0 0 1-2-2v-4.4Z" />
  </svg>
);

export const BellIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M18 8.8a6 6 0 1 0-12 0c0 5.2-2 6.7-2 6.7h16s-2-1.5-2-6.7" />
    <path d="M13.7 19.2a2 2 0 0 1-3.4 0" />
  </svg>
);

export const CardIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="2.8" y="5.2" width="18.4" height="13.6" rx="2.2" />
    <path d="M2.8 10h18.4" />
  </svg>
);

export const ShieldIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 2.9 4.6 6v5.6c0 4.5 3.1 8.7 7.4 9.7 4.3-1 7.4-5.2 7.4-9.7V6Z" />
  </svg>
);

export const CheckIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="m4.8 12.6 4.6 4.6 9.8-10.4" />
  </svg>
);

export const CheckCircle = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.3 12.2 2.6 2.6 4.8-5.2" />
  </svg>
);

export const DownloadIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 3.6v11" />
    <path d="m7.6 10.2 4.4 4.4 4.4-4.4" />
    <path d="M4.4 18.2v1.2a1.4 1.4 0 0 0 1.4 1.4h12.4a1.4 1.4 0 0 0 1.4-1.4v-1.2" />
  </svg>
);

export const PlusIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 5.2v13.6M5.2 12h13.6" />
  </svg>
);

export const SignOutIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M9.6 20.4H5.8a1.8 1.8 0 0 1-1.8-1.8V5.4a1.8 1.8 0 0 1 1.8-1.8h3.8" />
    <path d="m15.4 16.4 4.4-4.4-4.4-4.4" />
    <path d="M19.8 12H9.2" />
  </svg>
);

export const RadioIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="2.4" />
    <path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 16.2a6 6 0 0 0 0-8.4" />
    <path d="M4.9 4.9a10 10 0 0 0 0 14.2M19.1 19.1a10 10 0 0 0 0-14.2" />
  </svg>
);

export const EnterKeyIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M20 5.6v6a2 2 0 0 1-2 2H4.6" />
    <path d="m8.4 9.8-3.8 3.8 3.8 3.8" />
  </svg>
);

export const LayersIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="m12 3.2 8.6 4.4-8.6 4.4-8.6-4.4Z" />
    <path d="m3.4 12.4 8.6 4.4 8.6-4.4" />
    <path d="m3.4 16.8 8.6 4.4 8.6-4.4" />
  </svg>
);

export const GlobeIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17" />
    <path d="M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.3-5.1-3.3-8.5S9.8 5.8 12 3.5Z" />
  </svg>
);
