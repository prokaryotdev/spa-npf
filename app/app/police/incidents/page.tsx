import type { Metadata } from "next";
import OpsIncidents from "../../../components/OpsIncidents";
import { getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Incidents | Dubai Police") };
}

export default function IncidentsPage() {
  return <OpsIncidents />;
}
