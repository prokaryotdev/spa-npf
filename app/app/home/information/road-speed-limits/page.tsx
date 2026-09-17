import type { Metadata } from "next";
import DataTable from "../../../../components/DataTable";
import { PageShell } from "../../../../components/PageShell";
import { speedLimits as dataSource } from "../../../../content-sub";
import { getT, getLocalized } from "../../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Road Speed Limits | Nigeria Police Force"),
    description: t(
      "Speed limits and enforcement thresholds on the roads of the Federal Capital Territory.",
    ),
  };
}

export default async function SpeedLimitsPage() {
  const data = await getLocalized(dataSource);
  const t = await getT();
  return (
    <PageShell
      title={data.title}
      intro={t(
        "Abuja applies specific speed limits across its roads to ensure safety and smooth traffic flow. These limits vary depending on the type of road and location.",
      )}
      trail={[{ label: "Information", href: "/app/home/information" }]}
    >
      <section className="bg-white pb-24">
        <div className="npf-container">
          <p className="mb-6 text-sm text-npf-muted">
            {t("Page last updated: {date}", { date: t(data.updatedAt) })}
          </p>
          <DataTable
            caption="Road speed limits"
            minWidth="340px"
            rows={data.rows}
            columns={[
              { key: "roadName", label: "Road" },
              {
                key: "speed",
                label: "Limit km/h",
                numeric: true,
                width: "110px",
              },
              {
                key: "radarControl",
                label: "Enforced at km/h",
                numeric: true,
                width: "110px",
              },
            ]}
          />
        </div>
      </section>
    </PageShell>
  );
}
