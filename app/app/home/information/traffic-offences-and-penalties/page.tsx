import type { Metadata } from "next";
import DataTable from "../../../../components/DataTable";
import { PageShell } from "../../../../components/PageShell";
import { penaltyPoints as dataSource } from "../../../../content-sub";
import { getT, getLocalized } from "../../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Traffic Offences and Penalties | Nigeria Police Force"),
    description: t(
      "Fines, penalty points and vehicle confiscation periods for traffic violations in Abuja.",
    ),
  };
}

export default async function BlackPointsPage() {
  const data = await getLocalized(dataSource);
  const t = await getT();
  return (
    <PageShell
      title={data.title}
      intro={t("Learn how penalty points and fines impact your traffic record.")}
      trail={[{ label: "Information", href: "/app/home/information" }]}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          <DataTable
            updated={t("Page last updated: {date}", { date: t(data.updatedAt) })}
            caption="Traffic offences, fines and penalty points"
            rows={data.rows}
            filterKey="category"
            columns={[
              { key: "description", label: "Offence" },
              {
                key: "fineAmount",
                label: "Fine (₦)",
                numeric: true,
                width: "120px",
              },
              {
                key: "penaltyPoints",
                label: "Penalty points",
                numeric: true,
                width: "120px",
              },
              {
                key: "confiscationPeriod",
                label: "Confiscation",
                width: "140px",
              },
            ]}
          />
        </div>
      </section>
    </PageShell>
  );
}
