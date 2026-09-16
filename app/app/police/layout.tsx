import type { Metadata } from "next";
import OpsShell from "../../components/OpsShell";
import { getT } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Operations Console | Dubai Police"),
    description: t("Incident queue, deployment and service requests."),
    robots: { index: false, follow: false },
  };
}

export default function PoliceLayout({ children }: LayoutProps<"/app/police">) {
  return <OpsShell>{children}</OpsShell>;
}
