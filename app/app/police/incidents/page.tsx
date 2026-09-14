import type { Metadata } from "next";
import OpsIncidents from "../../../components/OpsIncidents";

export const metadata: Metadata = { title: "Incidents | Dubai Police" };

export default function IncidentsPage() {
  return <OpsIncidents />;
}
