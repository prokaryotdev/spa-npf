import Link from "../i18n/Link";
import { makeFormatters } from "../i18n/format";
import { getLang, getT } from "../i18n/server";
import { information } from "../content-pages";
import { penaltyPoints } from "../content-sub";
import { AlertIcon, ArrowRight, ClockIcon, FileIcon } from "./icons";

/**
 * The roadside limit sign: a red ring round the number. Drawn, not
 * photographed, so the hub and the speed page show the sign a driver sees.
 */
export function SpeedSign({
  speed,
  size = "lg",
}: {
  speed: string;
  size?: "sm" | "lg";
}) {
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-full border-npf-alert bg-white font-secondary leading-none font-bold tracking-tight text-npf-ink tabular-nums shadow-[0_1px_3px_rgb(26_35_56/0.12)] ${
        size === "lg"
          ? "size-20 border-[8px] text-[1.75rem] lg:size-24 lg:border-[9px] lg:text-[2rem]"
          : "size-14 border-[6px] text-lg"
      }`}
    >
      {speed}
    </span>
  );
}

/**
 * The three answers the offence schedule gives at a glance, worked out from
 * the schedule itself so they cannot drift from it.
 */
export async function trafficFacts() {
  const t = await getT();
  const fmt = makeFormatters(await getLang());
  const rows = penaltyPoints.rows;
  const fines = rows.map((r) => Number(r.fineAmount)).filter((n) => n > 0);
  const longest = rows
    .map((r) => r.confiscationPeriod)
    .filter(Boolean)
    .sort((a, b) => parseInt(b) - parseInt(a))[0];
  return [
    {
      label: t("Fines"),
      value: `${fmt.naira(Math.min(...fines))}–${fmt.num(Math.max(...fines))}`,
    },
    {
      label: t("Most penalty points"),
      value: fmt.num(Math.max(...rows.map((r) => r.penaltyPoints))),
    },
    { label: t("Vehicle held for up to"), value: t(longest) },
  ];
}

const glyph = {
  "/app/home/information/traffic-offences-and-penalties": AlertIcon,
  "/app/home/information/road-speed-limits": ClockIcon,
  "/app/home/information/laws-legislation": FileIcon,
} as Record<string, typeof FileIcon>;

/**
 * The foot of each Information page: the other two, one row each, so a
 * reader who came for the fine can go on to the limit without the hub.
 */
export async function InfoMore({ current }: { current: string }) {
  const t = await getT();
  const others = information.cards.filter((c) => c.href !== current);
  return (
    <nav
      aria-labelledby="info-more"
      className="mt-(--npf-section-y) border-t border-npf-hairline pt-10"
    >
      <h2 id="info-more" className="npf-h5 text-npf-blue-deep">
        {t("Also in Information")}
      </h2>
      <ul className="mt-5 grid gap-(--npf-gap) md:grid-cols-2">
        {others.map((card) => {
          const Icon = glyph[card.href] ?? FileIcon;
          return (
            <li key={card.href}>
              <Link
                href={card.href}
                className="npf-link-card group flex h-full items-center gap-4 p-5"
              >
                <span className="npf-disc">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="npf-body block font-semibold text-npf-ink transition-colors group-hover:text-npf-blue">
                    {t(card.title)}
                  </span>
                  <span className="npf-small block text-npf-steel">
                    {t(card.body)}
                  </span>
                </span>
                <ArrowRight className="npf-go" />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
