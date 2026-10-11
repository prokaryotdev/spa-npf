import type { Metadata } from "next";
import OpsReport from "../../../components/OpsReport";
import { getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Shift report | Nigeria Police Force") };
}

export default function ReportPage() {
  return <OpsReport />;
}
