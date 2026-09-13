import type { Metadata } from "next";
import DataTable from "../../../../components/DataTable";
import { PageShell } from "../../../../components/PageShell";
import { lawsLegislation as data } from "../../../../content-sub";

export const metadata: Metadata = {
  title: "Laws & Legislation | Dubai Police",
  description: data.description,
};

export default function LawsPage() {
  return (
    <PageShell
      title={data.title}
      intro={data.description}
      trail={[{ label: "Information", href: "/app/home/information" }]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container">
          <p className="mb-6 text-sm text-dp-muted">
            Page last updated: {data.updatedAt}
          </p>
          <DataTable
            caption="Laws and legislation"
            rows={data.rows}
            columns={[
              { key: "legislationName", label: "Legislation", linkKey: "file" },
              { key: "issueDate", label: "Issue date", width: "150px" },
              { key: "size", label: "File size", numeric: true, width: "120px" },
            ]}
          />
        </div>
      </section>
    </PageShell>
  );
}
