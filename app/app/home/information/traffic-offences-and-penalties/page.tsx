import type { Metadata } from "next";
import DataTable from "../../../../components/DataTable";
import { Facts, PageShell } from "../../../../components/PageShell";
import { InfoMore, trafficFacts } from "../../../../components/Information";
import { penaltyPoints as dataSource } from "../../../../content-sub";
import { getLocalized, getT } from "../../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Traffic Offences and Penalties | Nigeria Police Force"),
    description: t(
      "Fines, penalty points and vehicle confiscation periods for traffic violations in Nigeria.",
    ),
  };
}

export default async function BlackPointsPage() {
  const data = await getLocalized(dataSource);
  const t = await getT();
  const facts = await trafficFacts();
  return (
    <PageShell
      compact
      title={data.title}
      intro={t("Learn how penalty points and fines impact your traffic record.")}
      trail={[{ label: "Information", href: "/app/home/information" }]}
      lead={<Facts facts={facts} />}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          <DataTable
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
                scale: 10,
                width: "150px",
              },
              {
                key: "confiscationPeriod",
                label: "Confiscation",
                width: "140px",
              },
            ]}
          />
          <InfoMore current="/app/home/information/traffic-offences-and-penalties" />
        </div>
      </section>
    </PageShell>
  );
}
