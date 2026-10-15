import type { Metadata } from "next";
import { PageShell } from "../../../../components/PageShell";
import { InfoMore, SpeedSign } from "../../../../components/Information";
import { reveal } from "../../../../components/reveal";
import { speedLimits as dataSource } from "../../../../content-sub";
import { getLocalized, getT } from "../../../../i18n/server";

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
 * Seventeen roads share three limits, so the page is the three limits: each
 * one drawn as the sign a driver sees on the road, with the roads it covers
 * under it. A driver who knows the road finds its group; one who knows the
 * sign learns where it applies. A limit that covers a kind of road rather
 * than named roads ("roads in towns") is said as a sentence, not a list of one.
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
      compact
      title={data.title}
      intro={data.description}
      trail={[{ label: "Information", href: "/app/home/information" }]}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          <ol className="grid gap-(--npf-gap)">
            {tiers.map((tier, i) => {
              const general = tier.rows.length === 1;
              return (
                <li
                  key={tier.speed}
                  {...reveal(i)}
                  className="rounded-card border border-npf-hairline bg-white"
                >
                  <div className="flex items-center gap-5 p-6 lg:gap-7 lg:px-8">
                    <SpeedSign speed={tier.speed} />
                    <div className="min-w-0">
                      <h2 className="npf-h4 text-npf-blue-deep">
                        {general
                          ? tier.rows[0].roadName
                          : `${tier.speed} km/h`}
                      </h2>
                      <p className="npf-body mt-1 text-npf-steel">
                        {general ? (
                          <span className="font-semibold text-npf-ink tabular-nums">
                            {tier.speed} km/h ·{" "}
                          </span>
                        ) : (
                          <span className="tabular-nums">
                            {t("{count} roads", { count: tier.rows.length })} ·{" "}
                          </span>
                        )}
                        {t("Enforced at {speed} km/h", {
                          speed: tier.enforced,
                        })}
                      </p>
                    </div>
                  </div>

                  {general ? null : (
                    <ul className="grid px-6 pb-3 sm:grid-cols-2 sm:gap-x-10 lg:px-8 lg:pb-4 xl:grid-cols-3">
                      {tier.rows.map((row) => {
                        // "Gimbiya Street, Area 11": the street leads, the
                        // district after it is the quieter half.
                        const [name, ...place] = row.roadName.split(", ");
                        return (
                          <li
                            key={row.roadName}
                            className="npf-body border-t border-npf-hairline py-3 text-npf-ink"
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
                  )}
                </li>
              );
            })}
          </ol>

          <InfoMore current="/app/home/information/road-speed-limits" />
        </div>
      </section>
    </PageShell>
  );
}
