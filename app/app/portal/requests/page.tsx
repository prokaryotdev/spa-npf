import type { Metadata } from "next";
import PortalRequests from "../../../components/PortalRequests";
import { getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("My Requests | My Nigeria Police Force") };
}

export default function RequestsPage() {
  return <PortalRequests />;
}
