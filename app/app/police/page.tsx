import type { Metadata } from "next";
import OpsOverview from "../../components/OpsOverview";

export const metadata: Metadata = { title: "Operations | Dubai Police" };

export default function PolicePage() {
  return <OpsOverview />;
}
