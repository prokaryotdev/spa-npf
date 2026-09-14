import type { Metadata } from "next";
import OpsShell from "../../components/OpsShell";

export const metadata: Metadata = {
  title: "Operations Console | Dubai Police",
  description: "Incident queue, deployment and service requests.",
  robots: { index: false, follow: false },
};

export default function PoliceLayout({ children }: LayoutProps<"/app/police">) {
  return <OpsShell>{children}</OpsShell>;
}
