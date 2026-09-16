import type { Metadata } from "next";
import DataTable from "../../../../components/DataTable";
import { PageShell } from "../../../../components/PageShell";
import { blackPoints as data } from "../../../../content-sub";

export const metadata: Metadata = {
  title: "Black Points of Traffic Violations | Dubai Police",
  description: "Fines, black points and vehicle confiscation periods for traffic violations in Dubai.",
};

export default function BlackPointsPage() {
  return (
    <PageShell
      title={data.title}
      intro="Learn how black points and fines impact your traffic record."
      trail={[{ label: "Information", href: "/app/home/information" }]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container">
          <p className="mb-6 text-sm text-dp-muted">
            Page last updated: {data.updatedAt}
          </p>
          <DataTable
            caption="Traffic violations, fines and black points"
            rows={data.rows}
            filterKey="category"
            columns={[
              { key: "description", label: "Violation" },
              { key: "fineAmount", label: "Fine (AED)", numeric: true, width: "120px" },
              { key: "blackPoints", label: "Black points", numeric: true, width: "120px" },
              { key: "confiscationPeriod", label: "Confiscation", width: "140px" },
            ]}
          />
        </div>
      </section>
    </PageShell>
  );
}
