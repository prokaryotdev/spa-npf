/**
 * Copy and assets for the Information hub, captured from the live
 * site the same way the homepage was. The offence schedule leads: it is the
 * one a driver comes looking for. Each card counts what is behind it, from
 * the rows themselves, so the number can never drift from the page.
 */
import { lawsLegislation, penaltyPoints, speedLimits } from "./content-sub";

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
