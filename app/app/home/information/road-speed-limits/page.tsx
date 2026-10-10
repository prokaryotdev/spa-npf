import type { Metadata } from "next";
import { PageShell } from "../../../../components/PageShell";
import { ClockIcon } from "../../../../components/icons";
import { reveal } from "../../../../components/reveal";
import { speedLimits as dataSource } from "../../../../content-sub";
import { getT, getLocalized } from "../../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Road Speed Limits | Nigeria Police Force"),
    description: t(
      "Speed limits and enforcement thresholds on Nigerian roads.",
    ),
  };
}

/**
 * Forty-four roads share four limits, so the page is the four limits: each
 * one drawn as the sign a driver sees on the road, with the roads it covers
 * beside it. A driver who knows the road finds its group; one who knows the
 * sign learns where it applies.
 */
export default async function SpeedLimitsPage() {
  const data = await getLocalized(dataSource);
  const t = await getT();
  const tiers = [...new Set(data.rows.map((r) => r.speed))]
    .sort((a, b) => Number(b) - Number(a))
    .map((speed) => {
      const rows = data.rows.filter((r) => r.speed === speed);
      return { speed, enforced: rows[0].radarControl, rows };
    });

  return (
    <PageShell
      title={data.title}
      intro={data.description}
      trail={[{ label: "Information", href: "/app/home/information" }]}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          <ol className="grid gap-(--npf-gap)">
            {tiers.map((tier, i) => (
              <li
                key={tier.speed}
                {...reveal(i)}
                className="grid gap-6 rounded-card border border-npf-hairline bg-white p-6 md:grid-cols-[13rem_1fr] md:gap-10 lg:p-8"
              >
                <div className="flex items-center gap-5 md:flex-col md:items-start">
                  {/* The roadside sign: a red ring round the number. */}
                  <div
                    aria-hidden
                    className="grid size-24 shrink-0 place-items-center rounded-full border-[9px] border-npf-alert bg-white shadow-[0_1px_3px_rgb(26_35_56/0.12)] lg:size-28 lg:border-[10px]"
                  >
                    <span className="text-[2rem] leading-none font-bold tracking-tight text-npf-ink tabular-nums lg:text-[2.375rem]">
                      {tier.speed}
                    </span>
                  </div>
                  <div>
                    <h2 className="npf-h5 text-npf-blue-deep">
                      <span className="sr-only">{t("Limit km/h")}: </span>
                      <span aria-hidden>{tier.speed} km/h</span>
                    </h2>
                    <p className="npf-small mt-1 text-npf-steel">
                      {t("Enforced at km/h")}{" "}
                      <span className="font-semibold text-npf-ink tabular-nums">
                        {tier.enforced}
                      </span>
                    </p>
                    <p className="npf-small mt-0.5 text-npf-steel tabular-nums">
                      {t("{count} roads", { count: tier.rows.length })}
                    </p>
                  </div>
                </div>

                <ul className="columns-1 gap-x-10 sm:columns-2 xl:columns-3 md:border-s md:border-npf-hairline md:ps-10">
                  {tier.rows.map((row) => {
                    // "Gimbiya Street, Area 11": the street leads, the
                    // district after it is the quieter half.
                    const [name, ...place] = row.roadName.split(", ");
                    return (
                      <li
                        key={row.roadName}
                        className="npf-body break-inside-avoid py-1.5 text-npf-ink"
                      >
                        {name}
                        {place.length ? (
                          <span className="text-npf-steel">
                            , {place.join(", ")}
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>

          <p className="npf-small mt-5 inline-flex items-center gap-2 text-npf-steel">
            <ClockIcon aria-hidden className="size-4" />
            {t("Page last updated: {date}", { date: t(data.updatedAt) })}
          </p>
        </div>
      </section>
    </PageShell>
  );
}
