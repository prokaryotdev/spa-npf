import type { Metadata } from "next";
import Link from "../../../i18n/Link";
import { PageShell } from "../../../components/PageShell";
import { SpeedSign, trafficFacts } from "../../../components/Information";
import { ArrowRight } from "../../../components/icons";
import { reveal } from "../../../components/reveal";
import { information as informationSource } from "../../../content-pages";
import {
  lawsLegislation,
  penaltyPoints,
  speedLimits,
} from "../../../content-sub";
import { getLocalized, getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Information | Nigeria Police Force"),
    description: t(
      "Laws and legislation, traffic penalty points, street speed limits, and sustainable development practices.",
    ),
  };
}

/**
 * The hub shows a first answer from each page rather than a photograph of
 * it: the fine range, the three signs, the newest statutes. A reader who
 * only needed "how fast on an expressway" is done before they click.
 */
export default async function InformationPage() {
  const information = await getLocalized(informationSource);
  const t = await getT();
  const facts = await trafficFacts();
  const [traffic, speed, laws] = information.cards;
  const categories = [...new Set(penaltyPoints.rows.map((r) => r.category))];

  const tiers = [...new Set(speedLimits.rows.map((r) => r.speed))]
    .sort((a, b) => Number(b) - Number(a))
    .map((s) => ({
      speed: s,
      count: speedLimits.rows.filter((r) => r.speed === s).length,
    }));

  const newest = [...lawsLegislation.rows]
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate))
    .slice(0, 3);

  const foot = (card: (typeof information.cards)[number]) => (
    <span className="npf-small mt-auto flex items-center justify-between gap-3 border-t border-npf-hairline pt-4 font-semibold text-npf-blue">
      <span className="tabular-nums">
        {t(card.count, { count: card.total })}
      </span>
      <ArrowRight className="npf-go" />
    </span>
  );
  const card =
    "npf-link-card group flex h-full flex-col p-6 md:p-8";

  return (
    <PageShell
      compact
      title={information.title}
      intro={t(
        "The laws the Force works under, what each traffic offence costs, and the speed limit on Nigerian roads.",
      )}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container grid gap-(--npf-gap) lg:grid-cols-[1.35fr_1fr] lg:grid-rows-[auto_auto]">
          {/* The schedule is what most readers come for, so it stands tall. */}
          <div {...reveal(0)} className="min-w-0 lg:row-span-2">
            <Link href={traffic.href} className={card}>
              <h2 className="npf-h3 text-npf-blue-deep transition-colors group-hover:text-npf-blue">{t(traffic.title)}</h2>
              <p className="npf-body mt-2 max-w-[52ch] text-npf-body">
                {t(traffic.body)}
              </p>
              <dl className="mt-7 grid gap-px sm:grid-cols-3 overflow-hidden rounded-chip border border-npf-line bg-npf-line">
                {facts.map((f) => (
                  <div key={f.label} className="flex min-w-0 items-baseline justify-between gap-4 bg-npf-mist px-4 py-3 sm:block sm:py-3.5 md:px-5">
                    <dt className="npf-caption text-npf-steel">{f.label}</dt>
                    <dd className="npf-h5 text-npf-blue-deep tabular-nums sm:mt-1">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
              {/* On a wide screen the rows share the height the two cards beside
                  set, so the list fills the card instead of leaving a gap. */}
              <ul className="mt-6 mb-7 flex flex-col divide-y divide-npf-hairline lg:flex-1">
                {categories.map((c) => (
                  <li
                    key={c}
                    className="npf-body flex items-baseline justify-between gap-4 py-3 text-npf-ink lg:flex-1 lg:items-center"
                  >
                    {t(c)}
                    <span className="npf-small text-npf-steel tabular-nums">
                      {penaltyPoints.rows.filter((r) => r.category === c).length}
                    </span>
                  </li>
                ))}
              </ul>
              {foot(traffic)}
            </Link>
          </div>

          <div {...reveal(1)} className="min-w-0">
            <Link href={speed.href} className={card}>
              <h2 className="npf-h4 text-npf-blue-deep transition-colors group-hover:text-npf-blue">{t(speed.title)}</h2>
              <p className="npf-body mt-2 text-npf-body">{t(speed.body)}</p>
              <ul className="mt-6 mb-7 flex flex-wrap gap-x-8 gap-y-4">
                {tiers.map((tier) => (
                  <li key={tier.speed} className="flex items-center gap-3">
                    <SpeedSign speed={tier.speed} size="sm" />
                    <span className="npf-small text-npf-steel">
                      <span className="sr-only">{tier.speed} km/h, </span>
                      {tier.count === 1
                        ? t("1 road")
                        : t("{count} roads", { count: tier.count })}
                    </span>
                  </li>
                ))}
              </ul>
              {foot(speed)}
            </Link>
          </div>

          <div {...reveal(2)} className="min-w-0">
            <Link href={laws.href} className={card}>
              <h2 className="npf-h4 text-npf-blue-deep transition-colors group-hover:text-npf-blue">{t(laws.title)}</h2>
              <p className="npf-body mt-2 text-npf-body">{t(laws.body)}</p>
              <p className="npf-caption mt-6 text-npf-steel">{t("Most recent")}</p>
              <ul className="mt-1 mb-7 divide-y divide-npf-hairline">
                {newest.map((law) => (
                  <li
                    key={law.file}
                    className="npf-small flex items-baseline justify-between gap-4 py-2.5 text-npf-ink"
                  >
                    <span className="min-w-0 truncate">{law.legislationName}</span>
                    <span className="shrink-0 text-npf-steel tabular-nums">
                      {law.issueDate.slice(0, 4)}
                    </span>
                  </li>
                ))}
              </ul>
              {foot(laws)}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
