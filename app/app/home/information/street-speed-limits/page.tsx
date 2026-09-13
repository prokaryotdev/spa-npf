import type { Metadata } from "next";
import DataTable from "../../../../components/DataTable";
import { PageShell } from "../../../../components/PageShell";
import { speedLimits as data } from "../../../../content-sub";

export const metadata: Metadata = {
  title: "Street Speed Limits | Dubai Police",
  description:
    "Speed limits and radar control thresholds across Dubai's roads.",
};

export default function SpeedLimitsPage() {
  return (
    <PageShell
      title={data.title}
      intro="Dubai applies specific speed limits across its roads to ensure safety and smooth traffic flow. These limits vary depending on the type of road and location."
      trail={[{ label: "Information", href: "/app/home/information" }]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container">
          <p className="mb-6 text-sm text-dp-muted">
            Page last updated: {data.updatedAt}
          </p>
          <DataTable
            caption="Street speed limits"
            rows={data.rows}
            columns={[
              { key: "roadName", label: "Road" },
              { key: "speed", label: "Speed limit (km/h)", numeric: true, width: "180px" },
              { key: "radarControl", label: "Radar control (km/h)", numeric: true, width: "190px" },
            ]}
          />
        </div>
      </section>
    </PageShell>
  );
}
