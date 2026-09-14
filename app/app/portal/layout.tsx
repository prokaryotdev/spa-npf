import type { Metadata } from "next";
import PortalShell from "../../components/PortalShell";

export const metadata: Metadata = {
  title: "My Dubai Police",
  description:
    "Track your requests, settle fines, download documents and manage your details.",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: LayoutProps<"/app/portal">) {
  return <PortalShell>{children}</PortalShell>;
}
