import type { Metadata } from "next";
import OpsOverview from "../../components/OpsOverview";
import { getT } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Operations | Dubai Police") };
}

export default function PolicePage() {
  return <OpsOverview />;
}
