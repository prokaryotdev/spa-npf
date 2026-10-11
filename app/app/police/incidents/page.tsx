import type { Metadata } from "next";
import { Suspense } from "react";
import OpsIncidents from "../../../components/OpsIncidents";
import { getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Incidents | Nigeria Police Force") };
}

// The board reads ?call= to open a call; Suspense keeps the rest of the
// route prerenderable around it.
export default function IncidentsPage() {
  return (
    <Suspense>
      <OpsIncidents />
    </Suspense>
  );
}
