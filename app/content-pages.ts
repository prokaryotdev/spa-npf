/**
 * Copy and assets for the Information hub, captured from the live
 * site the same way the homepage was. The offence schedule leads: it is the
 * one a driver comes looking for. Each card counts what is behind it, from
 * the rows themselves, so the number can never drift from the page.
 */
import { lawsLegislation, penaltyPoints, speedLimits } from "./content-sub";

/**
 * The tasks most people come to the site for, led by the sitemap and the
 * 404. Each note is the page's own intro, so it says what the page says.
 */
export const startHere = [
  {
    icon: "report",
    label: "Report a Crime",
    href: "/app/report",
    note: "Report a crime to the State Command where it happened. Free, open all day, and you can report anonymously.",
  },
  {
    icon: "track",
    label: "Track a Reference",
    href: "/app/track",
    note: "Follow a crime report or an application with its reference number. No account needed.",
  },
  {
    icon: "services",
    label: "Services",
    href: "/app/services",
    note: "Every Nigeria Police Force service, with its fee, turnaround and who it is for.",
  },
  {
    icon: "verify",
    label: "Verify a Police Document",
    href: "/app/verify",
    note: "Check that a police clearance certificate, report or permit you were given was issued by the Nigeria Police Force.",
  },
  {
    icon: "appeals",
    label: "Appeals",
    href: "/app/appeals",
    note: "Missing people, wanted people and stolen vehicles the Force is asking about. Send what you know, anonymously if you prefer.",
  },
  {
    icon: "centers",
    label: "Customer Centers",
    href: "/app/home/customer-centers",
    note: "Force Headquarters and the Police Command of every state and the FCT, with where to find each one.",
  },
] as const;

export const information = {
  title: "Information",
  cards: [
    {
      title: "Traffic Offences and Penalties",
      body: "Learn how penalty points and fines impact your traffic record.",
      count: "{count} offences",
      total: penaltyPoints.rows.length,
      href: "/app/home/information/traffic-offences-and-penalties",
    },
    {
      title: "Road Speed Limits",
      body: "Speed limits and enforcement thresholds on Nigerian roads.",
      count: "{count} roads",
      total: speedLimits.rows.length,
      href: "/app/home/information/road-speed-limits",
    },
    {
      title: "Laws & Legislation",
      body: "The statutes the Nigeria Police Force works under",
      count: "{count} statutes",
      total: lawsLegislation.rows.length,
      href: "/app/home/information/laws-legislation",
    },
  ],
};
