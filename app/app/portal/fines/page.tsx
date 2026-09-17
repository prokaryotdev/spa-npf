import type { Metadata } from "next";
import PortalFines from "../../../components/PortalFines";
import { getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Fines | My Nigeria Police Force") };
}

export default function FinesPage() {
  return <PortalFines />;
}
