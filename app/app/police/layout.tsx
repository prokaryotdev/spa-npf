import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { requireBackend } from "../../backend";
import OpsShell from "../../components/OpsShell";
import { getT } from "../../i18n/server";

/** The console's data face, self-hosted by next/font: refs, clocks, counts. */
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono-face",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Operations Console | Nigeria Police Force"),
    description: t("Incident queue, deployment and service requests."),
    robots: { index: false, follow: false },
  };
}

export default function PoliceLayout({ children }: LayoutProps<"/app/police">) {
  requireBackend();
  return (
    <div className={`${mono.variable} contents`}>
      <OpsShell>{children}</OpsShell>
    </div>
  );
}
