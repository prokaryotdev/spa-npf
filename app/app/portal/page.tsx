import type { Metadata } from "next";
import PortalOverview from "../../components/PortalOverview";
import { services } from "../../content-services";

export const metadata: Metadata = { title: "Overview | My Dubai Police" };

/**
 * The catalogue is read here, on the server, and only the seven rows the
 * shortcut grid draws are handed down. Importing it inside the client
 * component instead shipped the whole catalogue to the browser.
 */
export default function PortalPage() {
  const shortcuts = services
    .filter((s) => s.dashboardOrder)
    .sort((a, b) => (a.dashboardOrder ?? 0) - (b.dashboardOrder ?? 0))
    .map(({ slug, name, icon }) => ({ slug, name, icon }));

  return (
    <PortalOverview shortcuts={shortcuts} serviceCount={services.length} />
  );
}
