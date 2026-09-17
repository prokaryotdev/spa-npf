import type { Metadata } from "next";
import { requireBackend } from "../../backend";
import PortalShell from "../../components/PortalShell";
import { getT } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("My Nigeria Police Force"),
    description: t(
      "Track your requests, settle fines, download documents and manage your details.",
    ),
    robots: { index: false, follow: false },
  };
}

export default function PortalLayout({ children }: LayoutProps<"/app/portal">) {
  requireBackend();
  return <PortalShell>{children}</PortalShell>;
}
