import type { Metadata } from "next";
import DataTable from "../../../../components/DataTable";
import { PageShell } from "../../../../components/PageShell";
import { InfoMore } from "../../../../components/Information";
import { lawsLegislation as dataSource } from "../../../../content-sub";
import { getLocalized, getT } from "../../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Laws & Legislation | Nigeria Police Force"),
    description: t(dataSource.description),
  };
}

export default async function LawsPage() {
  const data = await getLocalized(dataSource);
  return (
    <PageShell
      compact
      title={data.title}
      intro={data.description}
      trail={[{ label: "Information", href: "/app/home/information" }]}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          <DataTable
            caption="Laws and legislation"
            rows={data.rows}
            columns={[
              { key: "legislationName", label: "Legislation", linkKey: "file" },
              { key: "issueDate", label: "Issue date", width: "150px", date: true },
              {
                key: "size",
                label: "File size",
                numeric: true,
                width: "120px",
              },
            ]}
          />
          <InfoMore current="/app/home/information/laws-legislation" />
        </div>
      </section>
    </PageShell>
  );
}
