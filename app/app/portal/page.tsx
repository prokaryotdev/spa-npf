import type { Metadata } from "next";
import PortalOverview from "../../components/PortalOverview";

export const metadata: Metadata = { title: "Overview | My Dubai Police" };

export default function PortalPage() {
  return <PortalOverview />;
}
