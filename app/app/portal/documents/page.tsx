import type { Metadata } from "next";
import PortalDocuments from "../../../components/PortalDocuments";
import { getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Documents | My Dubai Police") };
}

export default function DocumentsPage() {
  return <PortalDocuments />;
}
