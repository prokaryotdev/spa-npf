import type { Metadata } from "next";
import DataTable from "../../../../components/DataTable";
import { PageShell } from "../../../../components/PageShell";
import { lawsLegislation as dataSource } from "../../../../content-sub";
import { getLocalized } from "../../../../i18n/server";
import { getT } from "../../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Laws & Legislation | Dubai Police"),
    description: t(dataSource.description),
  };
}

export default async function LawsPage() {
  const t = await getT();
  const data = await getLocalized(dataSource);
  return (
    <PageShell
      title={data.title}
      intro={data.description}
      trail={[{ label: "Information", href: "/app/home/information" }]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container">
          <p className="mb-6 text-sm text-dp-muted">
            {t("Page last updated: {date}", { date: t(data.updatedAt) })}
          </p>
          <DataTable
            caption="Laws and legislation"
            rows={data.rows}
            columns={[
              { key: "legislationName", label: "Legislation", linkKey: "file" },
              { key: "issueDate", label: "Issue date", width: "150px" },
              {
                key: "size",
                label: "File size",
                numeric: true,
                width: "120px",
              },
            ]}
          />
        </div>
      </section>
    </PageShell>
  );
}
