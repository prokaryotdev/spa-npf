import type { Metadata } from "next";
import PortalShell from "../../components/PortalShell";
import { getT } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("My Dubai Police"),
    description: t(
      "Track your requests, settle fines, download documents and manage your details.",
    ),
    robots: { index: false, follow: false },
  };
}

export default function PortalLayout({ children }: LayoutProps<"/app/portal">) {
  return <PortalShell>{children}</PortalShell>;
}
