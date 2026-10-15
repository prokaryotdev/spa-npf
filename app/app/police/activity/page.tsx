import type { Metadata } from "next";
import OpsActivity from "../../../components/OpsActivity";
import { getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Activity | Nigeria Police Force") };
}

export default function Page() {
  return <OpsActivity />;
}
