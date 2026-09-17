import type { Metadata } from "next";
import PortalProfile from "../../../components/PortalProfile";
import { getT } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Profile | My Nigeria Police Force") };
}

export default function ProfilePage() {
  return <PortalProfile />;
}
