import type { Metadata } from "next";
import PortalDocuments from "../../../components/PortalDocuments";
import { getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Documents | My Nigeria Police Force") };
}

export default function DocumentsPage() {
  return <PortalDocuments />;
}
