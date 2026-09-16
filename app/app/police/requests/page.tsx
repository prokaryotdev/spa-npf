import type { Metadata } from "next";
import OpsRequests from "../../../components/OpsRequests";
import { getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Service requests | Dubai Police") };
}

export default function OpsRequestsPage() {
  return <OpsRequests />;
}
