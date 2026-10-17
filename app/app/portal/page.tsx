import type { Metadata } from "next";
import PortalOverview from "../../components/PortalOverview";
import { services as servicesSource } from "../../content-services";
import { getLocalized } from "../../i18n/server";
import { getT } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Overview | My Nigeria Police Force") };
}

/**
 * The catalogue is read here, on the server, and only the rows the shortcut
 * list draws are handed down. Importing it inside the client component
 * instead shipped the whole catalogue to the browser. The dashboard picks
 * lead, then the most-used services fill in behind them.
 */
export default async function PortalPage() {
  const services = await getLocalized(servicesSource);
  const shortcuts = services
    .filter((s) => s.dashboardOrder || s.mostUsed)
    .sort((a, b) => (a.dashboardOrder ?? 99) - (b.dashboardOrder ?? 99))
    .slice(0, 6)
    .map(({ slug, name, icon }) => ({ slug, name, icon }));

  return (
    <PortalOverview shortcuts={shortcuts} serviceCount={services.length} />
  );
}
