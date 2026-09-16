import type { Metadata } from "next";
import OpsUnits from "../../../components/OpsUnits";
import { getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Units | Dubai Police") };
}

export default function UnitsPage() {
  return <OpsUnits />;
}
